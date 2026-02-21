const mongoose = require('mongoose');
const HouseholdSurvey = require('../src/models/HouseholdSurvey');
const Slum = require('../src/models/Slum');

// Load the sample data
const path = require('path');
const fs = require('fs');

// Read and parse the Slum_69.js file
const slum69FilePath = path.join(__dirname, '../APIS/Slum\'s_HH_Data/Slum_69.js');
const slum69FileContent = fs.readFileSync(slum69FilePath, 'utf8');

// Extract the HH_Data array from the file
let HH_Data = [];
try {
  // Execute the file content to extract HH_Data
  const vm = require('vm');
  const context = { module: {}, exports: {} };
  vm.createContext(context);
  vm.runInContext(slum69FileContent, context);
  HH_Data = context.module.exports.HH_Data || context.HH_Data || global.HH_Data;
  
  // If the above didn't work, try alternative approach
  if (!HH_Data || HH_Data.length === 0) {
    // Extract the array part manually
    const arrayStart = slum69FileContent.indexOf('[');
    const arrayEnd = slum69FileContent.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1) {
      let arrayStr = slum69FileContent.substring(arrayStart, arrayEnd + 1);
      // Replace single quotes with double quotes for JSON parsing
      arrayStr = arrayStr.replace(/'/g, '"').replace(/(\w+)(?=:)/g, '"$1"');
      try {
        HH_Data = JSON.parse(arrayStr);
      } catch (parseErr) {
        console.error('Could not parse HH_Data from Slum_69.js:', parseErr.message);
        HH_Data = [];
      }
    }
  }
} catch (err) {
  console.error('Error processing Slum_69.js file:', err.message);
  HH_Data = [];
}

async function testImport() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socio_economic_survey', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find a sample slum (using slumId from the sample data)
    const slumId = '69'; // Using the slumId from the sample data
    let slum = await Slum.findOne({ slumName: { $regex: new RegExp(slumId, 'i') } });
    
    // If not found by name, try to find any existing slum
    if (!slum) {
      slum = await Slum.findOne();
      if (!slum) {
        console.log('No slums found in database. Please seed the database first.');
        process.exit(1);
      }
      console.log(`Using slum: ${slum.slumName} (${slum._id})`);
    } else {
      console.log(`Using slum: ${slum.slumName} (${slum._id})`);
    }

    // Prepare the data for import
    const importData = HH_Data.map(item => ({
      ...item,
      slumId: slum._id.toString() // Use the actual slum ID from DB
    }));

    console.log(`Preparing to import ${importData.length} records...`);

    // Test the import functionality by directly calling the model operations
    let importedCount = 0;
    let updatedCount = 0;

    for (const item of importData) {
      const result = await HouseholdSurvey.findOneAndUpdate(
        {
          slum: slum._id,
          parcelId: parseInt(item.parcelId),
          propertyNo: parseInt(item.propertyNo)
        },
        {
          slum: slum._id,
          householdId: require('uuid').v4(),
          houseDoorNo: `${item.parcelId}-${item.propertyNo}`,
          parcelId: parseInt(item.parcelId),
          propertyNo: parseInt(item.propertyNo),
          source: 'IMPORTED',
          surveyStatus: 'DRAFT',
          headName: item.headName || '',
          fatherName: item.fatherName || '',
          landTenureStatus: item.landTenureStatus || '',
          houseStructure: item.houseStructure || ''
        },
        {
          upsert: true,
          new: true,
          runValidators: true
        }
      );

      // If the document was created (not updated), increment imported count
      // We can infer this by checking if it existed before
      const exists = await HouseholdSurvey.findOne({
        slum: slum._id,
        parcelId: parseInt(item.parcelId),
        propertyNo: parseInt(item.propertyNo)
      }).limit(1);

      if (exists && exists.source === 'IMPORTED' && exists.createdAt.getTime() === exists.updatedAt.getTime()) {
        importedCount++;
      } else {
        updatedCount++;
      }
    }

    console.log(`Import completed!`);
    console.log(`- Total records processed: ${importData.length}`);
    console.log(`- New records imported: ${importedCount}`);
    console.log(`- Existing records updated: ${updatedCount}`);

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
    console.error('Error during import test:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

if (require.main === module) {
  testImport().catch(console.error);
}

module.exports = testImport;