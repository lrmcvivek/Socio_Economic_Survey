require('dotenv').config();
const mongoose = require('mongoose');
const Slum = require('../src/models/Slum');

async function checkSlums() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const slums = await Slum.find({}, 'slumName');
    console.log('Available slums:');
    slums.forEach(s => {
      console.log(`  ${s._id}: ${s.slumName}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkSlums();