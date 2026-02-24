require('dotenv').config();
const mongoose = require('mongoose');
const Slum = require('../src/models/Slum');
const HouseholdSurvey = require('../src/models/HouseholdSurvey');

async function checkSlumHouseholdCount() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find the GANJ slum
    const slum = await Slum.findOne({ slumId: 250 });
    console.log(`GANJ slum (slumId: 250):`);
    console.log(`  totalHouseholds: ${slum.totalHouseholds}`);
    console.log(`  _id: ${slum._id}`);
    
    // Count actual household surveys for this slum
    const householdCount = await HouseholdSurvey.countDocuments({ 
      slum: slum._id,
      surveyStatus: { $in: ['DRAFT', 'SUBMITTED'] }
    });
    console.log(`  Actual household surveys: ${householdCount}`);
    
    // Count by status
    const draftCount = await HouseholdSurvey.countDocuments({ 
      slum: slum._id,
      surveyStatus: 'DRAFT'
    });
    const submittedCount = await HouseholdSurvey.countDocuments({ 
      slum: slum._id,
      surveyStatus: 'SUBMITTED'
    });
    
    console.log(`  DRAFT: ${draftCount}`);
    console.log(`  SUBMITTED: ${submittedCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkSlumHouseholdCount();