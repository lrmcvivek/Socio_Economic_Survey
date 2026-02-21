const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import models
const HouseholdSurvey = require('../src/models/HouseholdSurvey');
const Slum = require('../src/models/Slum');

const verifyImport = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socio_economic_survey');
    console.log('MongoDB connected successfully');
    
    // Find the slum
    const slum = await Slum.findOne({ slumId: 250 });
    console.log('\n=== SLUM INFORMATION ===');
    console.log('Slum Name:', slum?.slumName);
    console.log('Slum ID:', slum?.slumId);
    console.log('Total Households:', slum?.totalHouseholds);
    console.log('Ward:', slum?.ward);
    
    // Find all household surveys for this slum
    const surveys = await HouseholdSurvey.find({ slum: slum?._id })
      .select('houseDoorNo parcelId propertyNo headName fatherName landTenureStatus houseStructure surveyStatus source')
      .sort('parcelId propertyNo');
    
    console.log('\n=== IMPORTED HOUSEHOLD SURVEYS ===');
    console.log(`Found ${surveys.length} household surveys:`);
    
    surveys.forEach((survey, index) => {
      console.log(`\n${index + 1}. House ${survey.houseDoorNo} (Parcel: ${survey.parcelId}, Property: ${survey.propertyNo})`);
      console.log(`   Head Name: ${survey.headName}`);
      console.log(`   Father Name: ${survey.fatherName || 'N/A'}`);
      console.log(`   Land Tenure: ${survey.landTenureStatus || 'N/A'}`);
      console.log(`   House Structure: ${survey.houseStructure || 'N/A'}`);
      console.log(`   Status: ${survey.surveyStatus} (${survey.source})`);
    });
    
    // Show statistics
    const draftCount = surveys.filter(s => s.surveyStatus === 'DRAFT').length;
    const inProgressCount = surveys.filter(s => s.surveyStatus === 'IN PROGRESS').length;
    const submittedCount = surveys.filter(s => s.surveyStatus === 'SUBMITTED').length;
    const completedCount = surveys.filter(s => s.surveyStatus === 'COMPLETED').length;
    
    console.log('\n=== STATISTICS ===');
    console.log(`Total Households: ${surveys.length}`);
    console.log(`Draft (Prefilled): ${draftCount}`);
    console.log(`In Progress: ${inProgressCount}`);
    console.log(`Submitted: ${submittedCount}`);
    console.log(`Completed: ${completedCount}`);
    console.log(`Completion Rate: ${((submittedCount + completedCount) / surveys.length * 100).toFixed(1)}%`);
    
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Verification failed:', error);
    await mongoose.connection.close();
  }
};

verifyImport();