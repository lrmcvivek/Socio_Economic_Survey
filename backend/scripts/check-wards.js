require('dotenv').config();
const mongoose = require('mongoose');
const Ward = require('../src/models/Ward');

async function checkWards() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const wards = await Ward.find({}, 'wardNumber wardName').sort({ wardNumber: 1 });
    console.log('Available wards:');
    wards.forEach(w => {
      console.log(`  ${w.wardNumber}: ${w.wardName || 'N/A'}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkWards();