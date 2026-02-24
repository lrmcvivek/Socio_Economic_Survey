require('dotenv').config();
const mongoose = require('mongoose');
const Ward = require('../src/models/Ward');

async function checkWardNumbers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const wards = await Ward.find({}, 'number name').sort({ number: 1 });
    console.log('Available wards:');
    wards.forEach(w => {
      console.log(`  ${w.number}: ${w.name}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkWardNumbers();