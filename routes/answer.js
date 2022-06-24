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

//@route POST api/answer/
//@desc add answer
//@access Private
router.post(
  '/',
  [
    auth,
    [
      check('ansDesc', 'answer is required ').not().isEmpty(),
      check('questionId', 'questionId is required').not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { ansDesc, questionId } = req.body;
    try {
      const user = await User.findById(req.user._id).select('-password');
      const question = await Question.findById(questionId);

      const newAnswer = new Answer({
        user,
        question,
        ansDesc,
      });
      const response = await newAnswer.save();
      await updatePoints(user._id, -2);
      const a = await Answer.findById(response._id)
        .populate('user')
        .populate('question')
        .populate({ path: 'comments', populate: { path: 'user' } });
      console.log('ppp', a);
      res.json(a);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

//@route POST api/answer/:id
//@desc edit answer
//@access Private
router.put(
  '/:id',
  [
    auth,
    [
      check('ansDesc', 'answer is required ').not().isEmpty(),
      check('questionId', 'questionId is required').not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { ansDesc, questionId } = req.body;
    try {
      const user = await User.findById(req.user._id).select('-password');
      const question = await Question.findById(questionId);

      const newAnswer = new Answer({
        _id: req.params.id,
        user,
        question,
        ansDesc,
      });
      const response = await Answer.findOneAndUpdate(
        { _id: req.params.id },
        { $set: newAnswer },
        { new: true }
      )
        .populate('question')
        .populate('user')
        .populate({ path: 'comments', populate: { path: 'user' } });
      res.json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route     Delete api/answer/:id
// @desc      delete answer
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    //Check if the user owns the post
    if (answer.user.toString() !== req.user._id) {
      return res
        .status(404)
        .json({ message: 'You are not authorized to delete this answer ' });
    }
    await answer.remove();
    await updatePoints(answer.user, -2);
    res.json({ message: 'answer Deleted' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not Found ' });
    }
    res.status(500).send('Server error');
  }
});

// @route     GET api/answer/:id
// @desc      Get answers by question
// @access    Private
router.get('/:id', [auth], async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const answers = await Answer.find({ question: question });
    res.json(answers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route     GET api/answer/:id
// @desc      Get answers by question
// @access    Private
router.get('/', [auth], async (req, res) => {
  try {
    const answers = await Answer.find()
      .populate('question')
      .populate('user')
      .populate({ path: 'comments', populate: { path: 'user' } });
    res.json(answers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route PUT api/answer/upvote/:id
//@desc Upvoted a answer
//@access Private
router.put('/upvote/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const answersIds = answer.upvotes.map((upvote) => upvote.user.toString());
    const removeIndex = answersIds.indexOf(req.user._id);

    const answersIds2 = answer.downvotes.map((downvote) =>
      downvote.user.toString()
    );
    const removeIndex2 = answersIds2.indexOf(req.user._id);

    //Check if the question is already upvoted by the user
    if (removeIndex2 !== -1) {
      answer.downvotes.splice(removeIndex2, 1);
      answer.upvotes.unshift({ user: req.user._id });
    } else {
      if (removeIndex !== -1) {
        answer.upvotes.splice(removeIndex, 1);
      } else {
        answer.upvotes.unshift({ user: req.user._id });
      }
    }
    await answer.save();
    res.json(answer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@route PUT api/answer/downvote/:id
//@desc Downvote an answer
//@access Private
router.put('/downvote/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    const answerIds = answer.downvotes.map((downvote) =>
      downvote.user.toString()
    );
    const removeIndex = answerIds.indexOf(req.user._id);

    const answerIds2 = answer.upvotes.map((upvote) => upvote.user.toString());
    const removeIndex2 = answerIds2.indexOf(req.user._id);

    //Check if the question is already downvoted by the user
    if (removeIndex2 !== -1) {
      answer.upvotes.splice(removeIndex2, 1);
      answer.downvotes.unshift({ user: req.user._id });
    } else {
      if (removeIndex !== -1) {
        answer.downvotes.splice(removeIndex, 1);
      } else {
        answer.downvotes.unshift({ user: req.user._id });
      }
    }
    await answer.save();
    res.json(answer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@route PUT api/answer/solved/:id
//@desc correct answer
//@access Private
router.put('/solved/:id', auth, async (req, res) => {
  try {
    const ans = await Answer.findById(req.params.id);
    const quest = await Question.findById(ans.question);
    if (quest.user.toString() !== req.user._id) {
      return res
        .status(404)
        .json({ message: 'You are not authorized to mark this as solved ' });
    }
    const answer = await Answer.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { solution: true } },
      { new: true }
    );
    const question = await Question.findOneAndUpdate(
      { _id: answer.question },
      { $set: { solved: true } },
      { new: true }
    );
    await updatePoints(answer.user, 10);
    await updatePoints(question.user, 5);
    res.json({ question: question, solution: answer.solution });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@author Iheb Laribi
//@route Put api/answer/comment/:id
//@desc comment a job
//@access Private
router.put(
  '/comment/:id',
  [auth, [check('text', 'Text must be required ').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const answer = await Answer.findById(req.params.id);
      const user = await User.findById(req.user._id).select('-password');
      const newComment = {
        user,
        text: req.body.text,
      };

      answer.comments.unshift(newComment);
      await answer.save();
      const ans = await Answer.findById(req.params.id).populate({
        path: 'comments',
        populate: { path: 'user' },
      });
      res.json(ans.comments);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'answer not Found ' });
      }
      res.status(500).send('Server error');
    }
  }
);

//@route DELETE api/answer/comment/delete/:id/:id_com
//@desc delete a comment
//@access Private
router.put('/comment/delete/:id/:id_com', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    const answerIds = answer.comments.map((comment) => comment._id.toString());

    const removeIndex = answerIds.indexOf(req.params.id_com);
    console.log(removeIndex);
    //Check if the answer is already liked by the user
    if (removeIndex !== -1) {
      answer.comments.splice(removeIndex, 1);
      await answer.save();
      const ans = await Answer.findById(req.params.id).populate({
        path: 'comments',
        populate: { path: 'user' },
      });
      res.json(ans.comments);
    }
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'answer not Found ' });
    }
    res.status(500).send('Server error');
  }
});

//@route UPDATE api/answer/comment/:id/:id_com
//@desc update a comment
//@access Private
router.put(
  '/comment/:id/:id_com',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const answer = await Answer.findOne({ _id: req.params.id });
      const user = await User.findById(req.user._id).select('-password');
      const newComment = {
        user: user,
        text: req.body.text,
      };

      //Get index
      const updateIndex = answer.comments
        .map((item) => item.id)
        .indexOf(req.params.id_com);

      answer.comments[updateIndex] = newComment;
      await answer.save();
      const ans = await Answer.findById(req.params.id).populate({
        path: 'comments',
        populate: { path: 'user' },
      });
      res.json(ans.comments);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'answer not Found ' });
      }
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
