const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election',
      required: [true, 'Please provide an election ID'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    candidateName: {
      type: String,
      required: [true, 'Please provide the candidate name'],
    },
    transactionHash: {
      type: String,
      required: [true, 'Please provide a transaction hash'],
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
    },
    walletAddress: {
      type: String,
      lowercase: true,
      required: false, // Optional for non-wallet users
    },
    blockNumber: {
      type: Number,
      default: null,
    },
    gasUsed: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to prevent double voting
voteSchema.index({ electionId: 1, userId: 1 }, { unique: true });
// Index for fast election vote lookups
voteSchema.index({ electionId: 1, status: 1 });
// Index for transaction lookup
voteSchema.index({ transactionHash: 1 });

module.exports = mongoose.model('Vote', voteSchema);
