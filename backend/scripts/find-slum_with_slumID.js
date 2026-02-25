const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Slum = require('../src/models/Slum');

async function findSlum() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const slum = await Slum.findOne({ slumId: 89 });
    if (slum) {
      console.log(`Found slum with slumId 89: ${slum.slumName}`);
      console.log(`MongoDB _id: ${slum._id}`);
    } else {
      console.log('No slum found with slumId 89');

      // Let's check what slumIds exist
      const slums = await Slum.find({}, 'slumId slumName').sort({ slumId: 1 });
      console.log('\nAvailable slumIds:');
      slums.forEach(s => {
        console.log(`  ${s.slumId}: ${s.slumName}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

findSlum();