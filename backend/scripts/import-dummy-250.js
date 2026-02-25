require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const HouseholdSurvey = require('../src/models/HouseholdSurvey');
const Slum = require('../src/models/Slum');

async function importDummyData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socio_economic_survey', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Find the slum with slumId = 250
        const slum = await Slum.findOne({ slumId: 250 });
        if (!slum) {
            console.log('Slum with slumId 250 not found.');
            process.exit(1);
        }

        console.log(`Found slum: ${slum.slumName.trim()} with _id: ${slum._id}`);

        // Read dummy.js
        const filePath = 'e:\\Projects\\Socio_Economic_Survey\\APIS\\Slum\'s_HH_Data\\dummy.js';
        const content = fs.readFileSync(filePath, 'utf8');

        // Super simple parsing of the array since dummy.js is just `const HH_Data = [...]`
        // Convert JS object to JSON by safely evaluating it 
        let HH_Data = [];
        const script = `
      ${content}
      return HH_Data;
    `;
        HH_Data = new Function(script)();

        console.log(`Read ${HH_Data.length} households from dummy.js`);

        const validatedData = [];
        for (const item of HH_Data) {
            if (item.parcelId !== undefined && item.propertyNo !== undefined && item.headName !== undefined) {
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

        // Auto-sync household counts after import
        const { autoSyncHouseholdCounts } = require('../src/utils/statusSyncHelper');
        await autoSyncHouseholdCounts(slum._id.toString());

        console.log(`Import completed!`);
        console.log(`- Total records processed: ${validatedData.length}`);
        console.log(`- New records imported: ${result.upsertedCount || 0}`);
        console.log(`- Existing records updated: ${result.modifiedCount || 0}`);

    } catch (error) {
        console.error('Error during import:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

importDummyData();
