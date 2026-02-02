const mongoose = require('mongoose');

const slumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Slum name is required'],
    trim: true
  },
  slumId: {
    type: Number,
    required: [true, 'Slum ID is required'],
    unique: true
  },
  stateCode: {
    type: String,
    required: [true, 'State code is required'],
    trim: true
  },
  distCode: {
    type: String,
    required: [true, 'District code is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  ward: {
    type: Number,
    required: [true, 'Ward number is required']
  },
  slumType: {
    type: String,
    enum: ['NOTIFIED', 'NON-NOTIFIED'],
    required: true
  },
  village: {
    type: String,
    trim: true,
    default: ''
  },
  landOwnership: {
    type: String,
    trim: true,
    default: ''
  },
  totalHouseholds: {
    type: Number,
    min: 0,
    default: 0
  },
  area: {
    type: Number,
    min: 0,
    default: 0
  },
  surveyStatus: {
    type: String,
    enum: ['DRAFT', 'SUBMITTED'],
    default: 'DRAFT'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Slum', slumSchema);