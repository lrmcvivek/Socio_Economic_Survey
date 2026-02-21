const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const HouseholdSurvey = require('../src/models/HouseholdSurvey');
const Slum = require('../src/models/Slum');

async function importHouseholdsFromFile(slumId, filePath) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socio_economic_survey', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Validate slum exists
    const slum = await Slum.findById(slumId);
    if (!slum) {
      console.log(`Slum with ID ${slumId} not found.`);
      process.exit(1);
    }

    console.log(`Importing data for slum: ${slum.slumName} (${slum._id})`);

    // Read and parse the data file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the HH_Data array from the file
    let HH_Data = [];
    try {
      // Find the array portion and convert to valid JSON
      const arrayStart = fileContent.indexOf('[');
      const arrayEnd = fileContent.lastIndexOf(']');
      if (arrayStart !== -1 && arrayEnd !== -1) {
        let arrayStr = fileContent.substring(arrayStart, arrayEnd + 1);
        // Replace single quotes with double quotes and fix unquoted keys
        arrayStr = arrayStr
          .replace(/'/g, '"')
          .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'); // Quote unquoted keys
        
        HH_Data = JSON.parse(arrayStr);
      } else {
        console.error('Could not find data array in file');
        return;
      }
    } catch (parseError) {
      console.error('Error parsing data file:', parseError.message);
      return;
    }

    console.log(`Found ${HH_Data.length} records to import`);

    // Process and import the data
    const validatedData = [];
    for (const item of HH_Data) {
      if (
        item.parcelId !== undefined && 
        item.propertyNo !== undefined &&
        item.headName !== undefined
      ) {
        validatedData.push({
          slumId: slum._id.toString(),
          parcelId: parseInt(item.parcelId),
          propertyNo: parseInt(item.propertyNo),
          headName: item.headName || '',
          fatherName: item.fatherName || '',
          landTenureStatus: item.landTenureStatus || '',
          houseStructure: item.houseStructure || ''
        });
      }
    }

    if (validatedData.length === 0) {
      console.log('No valid records to import');
      return;
    }

    console.log(`Validated ${validatedData.length} records for import`);

    // Use bulkWrite for efficient insertion with upsert to avoid duplicates
    const bulkOps = validatedData.map(record => ({
      updateOne: {
        filter: {
          slum: record.slumId,
          parcelId: record.parcelId,
          propertyNo: record.propertyNo
        },
        update: {
          slum: record.slumId,
          householdId: require('uuid').v4(),
          houseDoorNo: `${record.parcelId}-${record.propertyNo}`,
          parcelId: record.parcelId,
          propertyNo: record.propertyNo,
          source: 'IMPORTED',
          surveyStatus: 'DRAFT',
          headName: record.headName,
          fatherName: record.fatherName,
          landTenureStatus: record.landTenureStatus,
          houseStructure: record.houseStructure
        },
        upsert: true
      }
    }));

    const result = await HouseholdSurvey.bulkWrite(bulkOps);

    console.log(`Import completed!`);
    console.log(`- Total records processed: ${validatedData.length}`);
    console.log(`- New records imported: ${result.upsertedCount || 0}`);
    console.log(`- Existing records updated: ${result.modifiedCount || 0}`);

    // Verify some records were created
    const sampleRecords = await HouseholdSurvey.find({
      slum: slum._id,
      source: 'IMPORTED'
    }).limit(5);

    console.log('\nSample imported records:');
    sampleRecords.forEach(record => {
      console.log(`- Parcel: ${record.parcelId}, Property: ${record.propertyNo}, Head: ${record.headName}, Status: ${record.surveyStatus}`);
    });

  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Main execution
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node import-households-from-file.js <slumId> <filePath>');
    console.log('Example: node import-households-from-file.js 69 "../APIS/Slum\'s_HH_Data/Slum_69.js"');
    process.exit(1);
  }
  
  const slumId = args[0];
  const filePath = args[1];
  
  importHouseholdsFromFile(slumId, filePath).catch(console.error);
}

module.exports = importHouseholdsFromFile;