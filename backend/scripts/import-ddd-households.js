require('dotenv').config();
const mongoose = require('mongoose');
const HouseholdSurvey = require('../src/models/HouseholdSurvey');
const Slum = require('../src/models/Slum');
const Ward = require('../src/models/Ward');
const User = require('../src/models/User');

const householdData = [
  {
    "wardNumber": 80,
    "slumId": 250,
    "parcelId": 433,
    "propertyNo": 1,
    "headName": "John",
    "fatherName": "Doe",
    "landTenureStatus": "",
    "houseStructure": "SEMI_PUCCA"
  },
  {
    "wardNumber": 80,
    "slumId": 250,
    "parcelId": 434,
    "propertyNo": 1,
    "headName": "Velverde",
    "fatherName": "Tony",
    "landTenureStatus": "PUBLIC_LAND_ENCROACHED",
    "houseStructure": "PUCCA"
  }
];

async function importHouseholds() {
  try {
    console.log('🚀 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find a surveyor user to assign these households
    const surveyor = await User.findOne({ role: 'SURVEYOR', isActive: true });
    if (!surveyor) {
      console.error('❌ No active surveyor found in database');
      return;
    }
    console.log(`✅ Found surveyor: ${surveyor.name} (${surveyor.email})`);

    // Find the slum by slumId (government ID)
    const slum = await Slum.findOne({ slumId: householdData[0].slumId });
    if (!slum) {
      console.error(`❌ Slum with slumId ${householdData[0].slumId} not found`);
      return;
    }
    console.log(`✅ Found slum: ${slum.slumName} (slumId: ${slum.slumId}, _id: ${slum._id})`);

    // Find the ward
    const ward = await Ward.findOne({ number: householdData[0].wardNumber });
    if (!ward) {
      console.error(`❌ Ward ${householdData[0].wardNumber} not found`);
      return;
    }
    console.log(`✅ Found ward: ${ward.wardName || ward._id}`);

    let importedCount = 0;
    
    for (const household of householdData) {
      try {
        // Check if household already exists
        const existing = await HouseholdSurvey.findOne({
          slum: slum._id,
          parcelId: household.parcelId,
          propertyNo: household.propertyNo
        });

        if (existing) {
          console.log(`⚠️  Household ${household.parcelId}-${household.propertyNo} already exists, skipping...`);
          continue;
        }

        // Create new household survey
        const newHousehold = new HouseholdSurvey({
          slum: slum._id,
          ward: ward._id.toString(),
          slumName: slum.slumName,
          surveyor: surveyor._id,
          parcelId: household.parcelId,
          propertyNo: household.propertyNo,
          houseDoorNo: `${household.parcelId}-${household.propertyNo}`,
          householdId: `HH-${household.parcelId}-${household.propertyNo}-${Date.now()}`,
          headName: household.headName,
          fatherName: household.fatherName,
          landTenureStatus: household.landTenureStatus || undefined, // Handle empty string
          houseStructure: household.houseStructure,
          surveyStatus: 'DRAFT', // Start as draft for testing
          source: 'IMPORTED',
          createdAt: new Date(),
          updatedAt: new Date()
        });

        await newHousehold.save();
        console.log(`✅ Imported household: ${household.headName} (${household.parcelId}-${household.propertyNo})`);
        importedCount++;

      } catch (error) {
        console.error(`❌ Failed to import household ${household.parcelId}-${household.propertyNo}:`, error.message);
      }
    }

    console.log(`\n🎉 Import completed! Successfully imported ${importedCount} households.`);
    console.log(`📝 Added to slum: ${slum.slumName} (slumId: ${slum.slumId})`);
    console.log(`📍 Ward: ${ward.wardName || ward._id}`);
    console.log(`👤 Assigned to surveyor: ${surveyor.name}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

importHouseholds();