const Election = require('../models/Election');
const Vote = require('../models/Vote');

// @desc    Create election (Admin only)
// @route   POST /api/elections/create
// @access  Private/Admin
exports.createElection = async (req, res) => {
  try {
    const { title, description, candidates, startTime, endTime, metadata } =
      req.body;

    // Validate input
    if (!title || !description || !candidates || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!Array.isArray(candidates) || candidates.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 candidates',
      });
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time',
      });
    }

    // Create election
    const election = await Election.create({
      title,
      description,
      candidates: candidates.map((c) => ({
        name: c.name,
        description: c.description || '',
        voteCount: 0,
      })),
      startTime: start,
      endTime: end,
      status: 'pending',
      createdBy: req.user.id,
      metadata: metadata || {},
    });

    res.status(201).json({
      success: true,
      message: 'Election created successfully',
      data: election,
    });
  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating election',
    });
  }
};

// @desc    Get all elections with pagination
// @route   GET /api/elections
// @access  Public
exports.getAllElections = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const elections = await Election.find(query)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Election.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Elections retrieved successfully',
      data: elections,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching elections',
    });
  }
};

// @desc    Get single election by ID
// @route   GET /api/elections/:id
// @access  Public
exports.getElectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id).populate(
      'createdBy',
      'username email'
    );

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    // Get vote counts for each candidate
    const voteCounts = await Vote.aggregate([
      { $match: { electionId: election._id, status: 'confirmed' } },
      { $group: { _id: '$candidateName', count: { $sum: 1 } } },
    ]);

    // Update vote counts in response
    const candidatesWithCounts = election.candidates.map((candidate) => {
      const voteData = voteCounts.find((v) => v._id === candidate.name);
      return {
        name: candidate.name,
        description: candidate.description,
        voteCount: voteData ? voteData.count : 0,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Election retrieved successfully',
      data: {
        ...election.toObject(),
        candidates: candidatesWithCounts,
      },
    });
  } catch (error) {
    console.error('Get election error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching election',
    });
  }
};

// @desc    Start election (Admin only)
// @route   PUT /api/elections/:id/start
// @access  Private/Admin
exports.startElection = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    if (election.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Election can only be started from pending status',
      });
    }

    // Check if it's the creator
    if (election.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the election creator can start it',
      });
    }

    election.status = 'active';
    await election.save();

    res.status(200).json({
      success: true,
      message: 'Election started successfully',
      data: election,
    });
  } catch (error) {
    console.error('Start election error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error starting election',
    });
  }
};

// @desc    End election (Admin only)
// @route   PUT /api/elections/:id/end
// @access  Private/Admin
exports.endElection = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    if (election.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active elections can be ended',
      });
    }

    // Check if it's the creator
    if (election.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the election creator can end it',
      });
    }

    election.status = 'ended';
    await election.save();

    res.status(200).json({
      success: true,
      message: 'Election ended successfully',
      data: election,
    });
  } catch (error) {
    console.error('End election error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error ending election',
    });
  }
};

// @desc    Get election results
// @route   GET /api/elections/:id/results
// @access  Public
exports.getElectionResults = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id).populate(
      'createdBy',
      'username email'
    );

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    // Get confirmed votes
    const voteCounts = await Vote.aggregate([
      { $match: { electionId: election._id, status: 'confirmed' } },
      { $group: { _id: '$candidateName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const totalVotes = voteCounts.reduce((sum, v) => sum + v.count, 0);

    const results = voteCounts.map((v) => ({
      candidate: v._id,
      votes: v.count,
      percentage: totalVotes > 0 ? ((v.count / totalVotes) * 100).toFixed(2) : 0,
    }));

    res.status(200).json({
      success: true,
      message: 'Election results retrieved successfully',
      data: {
        electionId: election._id,
        title: election.title,
        status: election.status,
        totalVotes,
        results,
      },
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching results',
    });
  }
};
