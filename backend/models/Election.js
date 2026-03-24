const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an election title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an election description'],
      trim: true,
    },
    candidates: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: '',
        },
        voteCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    startTime: {
      type: Date,
      required: [true, 'Please provide a start time'],
    },
    endTime: {
      type: Date,
      required: [true, 'Please provide an end time'],
      validate: {
        validator: function (value) {
          return value > this.startTime;
        },
        message: 'End time must be after start time',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'ended', 'archived'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    voterCount: {
      type: Number,
      default: 0,
    },
    contractAddress: {
      type: String,
      default: null, // Blockchain contract address if deployed on-chain
    },
    metadata: {
      location: String,
      category: String,
      tags: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for queries
electionSchema.index({ status: 1, createdAt: -1 });
electionSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Election', electionSchema);
