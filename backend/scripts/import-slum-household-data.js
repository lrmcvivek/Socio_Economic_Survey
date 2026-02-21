const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import models
const HouseholdSurvey = require('../src/models/HouseholdSurvey');
const Slum = require('../src/models/Slum');
const { v4: uuidv4 } = require('uuid');

// Import the dummy data directly
const fs = require('fs');

// Read and parse the dummy data file
const dummyDataPath = path.resolve(__dirname, '../../APIS/Slum\'s_HH_Data/dummy.js');
const dummyFileContent = fs.readFileSync(dummyDataPath, 'utf8');

// Extract the ward80 array from the file content
let dummyData = [];
try {
  // Extract the array content between the brackets
  const match = dummyFileContent.match(/const ward80\s*=\s*\[([\s\S]*?)\s*\]/);
  if (match && match[1]) {
    // Convert the array content to valid JSON
    const arrayContent = match[1]
      .replace(/(\w+):/g, '"$1":') // Add quotes to keys
      .replace(/'/g, '"') // Convert single quotes to double quotes
      .replace(/,\s*}/g, '}') // Remove trailing commas
      .replace(/,\s*\]/g, ']'); // Remove trailing commas
    
    dummyData = JSON.parse(`[${arrayContent}]`);
  }
} catch (parseError) {
  console.error('Error parsing dummy data:', parseError);
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socio_economic_survey');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Mapping functions for enum values
const mapLandTenureStatus = (status) => {
  const mapping = {
    'PUBLIC_LAND_ENCROACHED': 'PUBLIC_LAND_ENCROACHED',
    'PRIVATE_LAND_ENCROACHED': 'PRIVATE_LAND_ENCROACHED',
    'PATTA': 'PATTA',
    'POSSESSION_CERTIFICATE': 'POSSESSION_CERTIFICATE',
    'RENTED': 'RENTED',
    'OTHER': 'OTHER'
  };
  return mapping[status] || 'PUBLIC_LAND_ENCROACHED'; // Default fallback
};

const mapHouseStructure = (structure) => {
  const mapping = {
    'PUCCA': 'PUCCA',
    'SEMI_PUCCA': 'SEMI_PUCCA',
    'KATCHA': 'KATCHA'
  };
  return mapping[structure] || 'KATCHA'; // Default fallback
};

// Main import function
const importSlumHouseholdData = async () => {
  try {
    await connectDB();
    
    console.log('Starting import of household data for slum with code 250...');
    
    // Step 1: Find the slum with slumId = 250 in zone0, ward 80
    const slum = await Slum.findOne({ 
      slumId: 250,
      // Note: You might need to adjust this query based on your actual ward/zone structure
    });
    
    if (!slum) {
      console.error('❌ Slum with code 250 not found! Please verify the slum exists.');
      console.log('Available slums:');
      const allSlums = await Slum.find({}, 'slumId slumName ward');
      allSlums.forEach(s => {
        console.log(`  - ID: ${s.slumId}, Name: ${s.slumName}, Ward: ${s.ward}`);
      });
      process.exit(1);
    }
    
    console.log(`✅ Found slum: ${slum.slumName} (ID: ${slum.slumId})`);
    console.log(`📍 Location: Ward ${slum.ward?.number || slum.ward}, Zone: ${slum.ward?.zone || 'Unknown'}`);
    
    // Step 2: Count existing household surveys for this slum
    const existingSurveys = await HouseholdSurvey.countDocuments({ slum: slum._id });
    console.log(`📊 Currently ${existingSurveys} household surveys exist for this slum`);
    
    // Step 3: Process the dummy data
    console.log(`📥 Processing ${dummyData.length} household records...`);
    
    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const record of dummyData) {
      try {
        // Validate required fields
        if (!record.parcelId || !record.propertyNo) {
          console.warn(`⚠️ Skipping record with missing parcelId or propertyNo:`, record);
          skippedCount++;
          continue;
        }
        
        // Check if household survey already exists
        const existingSurvey = await HouseholdSurvey.findOne({
          slum: slum._id,
          parcelId: record.parcelId,
          propertyNo: record.propertyNo
        });
        
        // For imported data, we'll set surveyor to null and handle this in the model
        // First, let's check if we can find an admin user to use as the surveyor
        const User = require('../src/models/User');
        let adminUser = await User.findOne({ role: 'ADMIN' });
        
        // If no admin user exists, we'll need to handle this differently
        // For now, let's make surveyor optional in our data creation
        
        const householdData = {
          slum: slum._id,
          householdId: uuidv4(),
          houseDoorNo: `${record.parcelId}-${record.propertyNo}`,
          parcelId: record.parcelId,
          propertyNo: record.propertyNo,
          source: 'IMPORTED',
          surveyor: adminUser?._id || null, // Use admin user if available, otherwise null
          surveyStatus: 'DRAFT',
          // Map the fields from dummy data
          headName: record.headName || '',
          fatherName: record.fatherName || '',
          landTenureStatus: record.landTenureStatus ? mapLandTenureStatus(record.landTenureStatus) : undefined,
          houseStructure: record.houseStructure ? mapHouseStructure(record.houseStructure) : undefined
        };
        
        if (existingSurvey) {
          // Update existing survey
          await HouseholdSurvey.findByIdAndUpdate(existingSurvey._id, householdData);
          updatedCount++;
          console.log(`  🔄 Updated existing household: ${record.parcelId}-${record.propertyNo}`);
        } else {
          // Create new survey
          await HouseholdSurvey.create(householdData);
          importedCount++;
          console.log(`  ✅ Created new household: ${record.parcelId}-${record.propertyNo}`);
        }
      } catch (error) {
        console.error(`  ❌ Error processing record ${record.parcelId}-${record.propertyNo}:`, error.message);
        skippedCount++;
      }
    }
    
    // Step 4: Update the slum's totalHouseholds count
    const totalRecords = dummyData.length;
    slum.totalHouseholds = totalRecords;
    await slum.save();
    
    console.log(`\n📊 IMPORT SUMMARY:`);
    console.log(`  ✅ Imported new records: ${importedCount}`);
    console.log(`  🔄 Updated existing records: ${updatedCount}`);
    console.log(`  ⚠️ Skipped records: ${skippedCount}`);
    console.log(`  📈 Total processed: ${importedCount + updatedCount}`);
    
    // Step 5: Show final statistics
    const finalSurveyCount = await HouseholdSurvey.countDocuments({ slum: slum._id });
    const draftSurveys = await HouseholdSurvey.countDocuments({ slum: slum._id, surveyStatus: 'DRAFT' });
    const inProgressSurveys = await HouseholdSurvey.countDocuments({ slum: slum._id, surveyStatus: 'IN PROGRESS' });
    const submittedSurveys = await HouseholdSurvey.countDocuments({ slum: slum._id, surveyStatus: 'SUBMITTED' });
    const completedSurveys = await HouseholdSurvey.countDocuments({ slum: slum._id, surveyStatus: 'COMPLETED' });
    
    console.log(`\n📈 FINAL SLUM STATISTICS:`);
    console.log(`  🏠 Total Households in Slum: ${finalSurveyCount}`);
    console.log(`  📝 Draft (Prefilled): ${draftSurveys}`);
    console.log(`  🔄 In Progress: ${inProgressSurveys}`);
    console.log(`  ✅ Submitted: ${submittedSurveys}`);
    console.log(`  🎉 Completed: ${completedSurveys}`);
    console.log(`  📊 Completion Rate: ${((submittedSurveys + completedSurveys) / finalSurveyCount * 100).toFixed(1)}%`);
    
    console.log(`\n✅ Import completed successfully!`);
    console.log(`The slum's totalHouseholds count has been updated to: ${totalRecords}`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the import
if (require.main === module) {
  importSlumHouseholdData();
}

module.exports = { importSlumHouseholdData };