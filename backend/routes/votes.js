const express = require('express');
const router = express.Router();
const {
  castVote,
  getElectionVotes,
  confirmVote,
  getVoteStatus,
} = require('../controllers/voteController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route
router.get('/status/:transactionHash', getVoteStatus);

// Protected routes
router.post('/', protect, castVote);
router.get('/election/:electionId', protect, getElectionVotes);

// Admin routes
router.put('/:voteId/confirm', protect, adminOnly, confirmVote);

module.exports = router;
