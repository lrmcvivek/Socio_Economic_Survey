const mongoose = require('mongoose');
// Load environment variables from the backend directory
require('dotenv').config();

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');

// Import models
const Slum = require('../src/models/Slum');
const HouseholdSurvey = require('../src/models/HouseholdSurvey');
const SlumSurvey = require('../src/models/SlumSurvey');

async function testWomenHeadedHHCalculation() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable not found');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find the GANJ slum
    const slum = await Slum.findOne({ 
      slumName: 'GANJ'
    });
    
    if (!slum) {
      console.log('GANJ slum not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log('Testing women-headed household calculation for slum:', slum.slumName, 'ID:', slum._id);
    
    // Get all household surveys for this slum to see female head status data
    const householdSurveys = await HouseholdSurvey.find({ slum: slum._id });
    console.log(`Found ${householdSurveys.length} household surveys`);
    
    console.log('Household survey female head status data:');
    householdSurveys.forEach(hs => {
      console.log(`  HH: femaleHeadStatus=${hs.femaleHeadStatus}, caste=${hs.caste}, minorityStatus=${hs.minorityStatus}, familyMembers=${hs.familyMembersTotal}`);
    });
    
    // Count female-headed households manually to verify
    const femaleHeadedHHs = householdSurveys.filter(hs => hs.femaleHeadStatus);
    console.log(`\nTotal female-headed households: ${femaleHeadedHHs.length}`);
    
    if (femaleHeadedHHs.length > 0) {
      console.log('Female-headed households breakdown:');
      femaleHeadedHHs.forEach(hs => {
        console.log(`  HH: caste=${hs.caste}, minorityStatus=${hs.minorityStatus}, familyMembers=${hs.familyMembersTotal}`);
      });
      
      // Count by caste
      const casteCounts = { SC: 0, ST: 0, OBC: 0, Others: 0, Total: 0 };
      const minorityCounts = { Minorities: 0, Others: 0, Total: 0 };
      
      femaleHeadedHHs.forEach(hs => {
        // Count population by caste
        if (hs.caste === 'SC') {
          casteCounts.SC += hs.familyMembersTotal || 0;
          casteCounts.Total += hs.familyMembersTotal || 0;
        } else if (hs.caste === 'ST') {
          casteCounts.ST += hs.familyMembersTotal || 0;
          casteCounts.Total += hs.familyMembersTotal || 0;
        } else if (hs.caste === 'OBC') {
          casteCounts.OBC += hs.familyMembersTotal || 0;
          casteCounts.Total += hs.familyMembersTotal || 0;
        } else {
          casteCounts.Others += hs.familyMembersTotal || 0;
          casteCounts.Total += hs.familyMembersTotal || 0;
        }
        
        // Count minorities
        if (hs.minorityStatus === 'MINORITY') {
          minorityCounts.Minorities += hs.familyMembersTotal || 0;
          minorityCounts.Total += hs.familyMembersTotal || 0;
        } else {
          minorityCounts.Others += hs.familyMembersTotal || 0;
          minorityCounts.Total += hs.familyMembersTotal || 0;
        }
      });
      
      console.log('\nExpected female-headed household population by caste:', casteCounts);
      console.log('Expected female-headed household minorities:', minorityCounts);
    }
    
    // Update the demographic population using our enhanced function
    const { updateSlumDemographicPopulationFromHouseholdSurveys } = require('../src/utils/statusSyncHelper');
    await updateSlumDemographicPopulationFromHouseholdSurveys(slum._id);
    
    // Check the updated data
    const slumSurvey = await SlumSurvey.findOne({ slum: slum._id });
    if (slumSurvey && slumSurvey.demographicProfile) {
      console.log('\nUpdated demographic profile totalPopulation:', slumSurvey.demographicProfile.totalPopulation);
      console.log('Updated demographic profile bplPopulation:', slumSurvey.demographicProfile.bplPopulation);
      console.log('Updated demographic profile women-headed households:', slumSurvey.demographicProfile.womenHeadedHouseholds);
      console.log('Updated demographic profile number of women-headed households:', slumSurvey.demographicProfile.numberOfWomenHeadedHouseholds);
    } else {
      console.log('No slum survey or demographic profile found');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error in test:', error);
    await mongoose.connection.close();
  }
}

testWomenHeadedHHCalculation();