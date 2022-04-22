const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Question = require('../models/question');
const Community = require('../models/Community');
const Tag = require('../models/Tag');
const { findOneAndUpdate } = require('../models/User');

// @route     GET api/questions/:id
// @desc      Get Question by community
// @access    Private
router.get('/:id', [auth], async (req, res) => {
  try {
    const commmunity = await Community.findById(req.params.id);
    const questions = await Question.find({ community: commmunity });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/questions
// @desc      Get my questions
// @access    Private
router.get('/', [auth], async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const questions = await Question.find({
      community: { $in: user.communities },
    });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/question
// @desc      Add Question
// @access    Private
router.post(
  '/',
  [auth],
  check('question', 'question is required').exists(),
  check('tags', 'tags is required').exists(),
  check('communityId', 'community is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question, tags, communityId } = req.body;

    try {
      const community = await Community.findById(communityId);
      const user = await User.findById(req.user._id).select('-password');
      const newQuestion = new Question({
        user,
        question,
        community,
      });
      const quest = await newQuestion.save();
      await Promise.all(
        tags.map(async (value) => {
          let tag = await Tag.find({ name: value });
          if (tag.length !== 0) {
            await Tag.findOneAndUpdate(
              { name: value },
              { $inc: { count: 1 }, $push: { questions: quest } }
            );
          } else {
            let questions = new Array();
            questions.unshift(quest);
            let newTag = new Tag({
              name: value,
              questions,
            });
            await newTag.save();
            console.log(2);
          }
        })
      );
      console.log(3);
      const Qtags = await Tag.find({ name: { $in: tags } });
      console.log('Qtags', Qtags);
      const quested = await Question.findOneAndUpdate(
        { _id: quest._id },
        { $push: { tags: { $each: Qtags } } },
        { new: true }
      );
      res.json(quested);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
