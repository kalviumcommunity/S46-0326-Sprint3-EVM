const Vote = require('../models/Vote');
const Election = require('../models/Election');
const User = require('../models/User');

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Private
exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateName, transactionHash, walletAddress } =
      req.body;

    // Validate input
    if (!electionId || !candidateName || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Please provide electionId, candidateName, and transactionHash',
      });
    }

    // Check if election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    // Check if election is active
    if (election.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Election is not active',
      });
    }

    // Check if candidate exists
    const candidateExists = election.candidates.some(
      (c) => c.name === candidateName
    );
    if (!candidateExists) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found in this election',
      });
    }

    // Check if user has already voted in this election (double-voting prevention)
    const existingVote = await Vote.findOne({
      electionId,
      userId: req.user.id,
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'User has already voted in this election',
      });
    }

    // Check if transaction hash already exists (prevent duplicate submissions)
    const txHashExists = await Vote.findOne({ transactionHash });
    if (txHashExists) {
      return res.status(400).json({
        success: false,
        message: 'Transaction hash already recorded',
      });
    }

    // Create vote with pending status
    const vote = await Vote.create({
      electionId,
      userId: req.user.id,
      candidateName,
      transactionHash,
      status: 'pending',
      walletAddress: walletAddress || null,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    // Mark user as voted
    await User.findByIdAndUpdate(
      req.user.id,
      { hasVoted: true },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Vote submitted successfully and pending confirmation',
      data: {
        voteId: vote._id,
        status: vote.status,
        transactionHash: vote.transactionHash,
      },
    });
  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error casting vote',
    });
  }
};

// @desc    Get votes for an election
// @route   GET /api/votes/election/:electionId
// @access  Private
exports.getElectionVotes = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    // Check authorization - only election creator or admin
    if (
      election.createdBy.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view votes for this election',
      });
    }

    const votes = await Vote.find({
      electionId,
      status: 'confirmed',
    }).populate('userId', 'username email walletAddress');

    res.status(200).json({
      success: true,
      message: 'Votes retrieved successfully',
      data: votes,
    });
  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching votes',
    });
  }
};

// @desc    Verify and confirm vote transaction
// @route   PUT /api/votes/:voteId/confirm
// @access  Private/Admin
exports.confirmVote = async (req, res) => {
  try {
    const { voteId } = req.params;
    const { blockNumber, gasUsed } = req.body;

    const vote = await Vote.findById(voteId);
    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Vote not found',
      });
    }

    // Update vote status to confirmed
    vote.status = 'confirmed';
    if (blockNumber) vote.blockNumber = blockNumber;
    if (gasUsed) vote.gasUsed = gasUsed;

    await vote.save();

    res.status(200).json({
      success: true,
      message: 'Vote confirmed successfully',
      data: vote,
    });
  } catch (error) {
    console.error('Confirm vote error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error confirming vote',
    });
  }
};

// @desc    Get vote status by transaction hash
// @route   GET /api/votes/status/:transactionHash
// @access  Public
exports.getVoteStatus = async (req, res) => {
  try {
    const { transactionHash } = req.params;

    const vote = await Vote.findOne({ transactionHash });
    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'Vote not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vote status retrieved',
      data: {
        transactionHash: vote.transactionHash,
        status: vote.status,
        candidateName: vote.candidateName,
        timestamp: vote.timestamp,
      },
    });
  } catch (error) {
    console.error('Get vote status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching vote status',
    });
  }
};
