const mongoose = require('mongoose');
const Assignment = require('../src/models/Assignment');
require('dotenv').config();

async function checkAssignments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const assignments = await Assignment.find().exec();
    console.log('Total assignments:', assignments.length);

    assignments.forEach(a => {
      console.log(`Assignment: ${a.surveyor?.name || 'Unknown'} (${a.surveyor?._id}) -> ${a.slum?.slumName || 'Unknown'} (${a.slum?._id})`);
      console.log(`  Status: ${a.status}`);
      console.log(`  Created: ${a.createdAt}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAssignments();