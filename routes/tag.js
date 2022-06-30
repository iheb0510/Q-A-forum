const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Question = require('../models/Question');
const Community = require('../models/Community');
const Answer = require('../models/Answer');
const Tag = require('../models/Tag');
const updatePoints = require('../utils/updatePoints');

// @route     GET api/tag
// @desc      Get my tags
// @access    Private
router.get('/', [auth], async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const tags = await Tag.find({});

    res.json(tags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/tag/:id
// @desc      Get my tag questions
// @access    Private
router.get('/:id', [auth], async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const tag = await Tag.findById(req.params.id)
      .populate({
        path: 'questions',
        populate: { path: 'tags', populate: { path: '_id' } },
      })
      .populate({ path: 'questions', populate: { path: 'user' } })
      .populate({ path: 'questions', populate: { path: 'community' } });
console.log('azaza',tag.questions)
    res.json(tag.questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
