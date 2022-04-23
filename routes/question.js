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
const Answer = require('../models/Answer');
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
// @desc      Get my communities questions
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

// @route     GET api/questions
// @desc      Get my questions
// @access    Private
router.get('/me', [auth], async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const questions = await Question.find({
      user: req.user._id,
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
          }
        })
      );
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

// @route     POST api/question
// @desc      Add Question
// @access    Private
router.post(
  '/:id',
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
      const question = await question.findById(req.params.id);

      await Promise.all(
        question.tags.map(async (value) => {
          let tag = await Tag.find({ _id: value });
          if (tag.length > 1) {
            await Tag.findOneAndUpdate(
              { name: value },
              { $inc: { count: -1 }, $pull: { questions: {question} } }
            );
          } else {
            await tag.remove();
          }
        })
      );
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
          }
        })
      );
      const Qtags = await Tag.find({ name: { $in: tags } });
      console.log('Qtags', Qtags);
      const newQuestion = new Question({
        user,
        question,
        community,
        tags:Qtags
      });
      const quested = await Question.findOneAndUpdate(
        { _id: quest._id },
        { $set: newQuestion },
        { new: true }
      );
      res.json(quested);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     DELETE api/question/:id
// @desc      delete Question
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    //Check if the user owns the post
    if (question.user.toString() !== req.user._id) {
      return res
        .status(404)
        .json({ message: "You are not authorized to delete this question " });
    }
    await Promise.all(
      question.tags.map(async (value) => {
        let tag = await Tag.find({ _id: value });
        if (tag.count > 1) {
          await Tag.findOneAndUpdate(
            { _id: value },
            { $inc: { count: -1 }, $pull: { questions: {question} } }
          );
        } else {
          await tag.remove();
        }
      })
    );
    await Answer.deleteMany({ question: question });
    await question.remove();
    res.json({ message: "question Deleted" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Question not Found " });
    }
    res.status(500).send("Server error");
  }
});


//@route PUT api/question/upvote/:id
//@desc Upvoted a question
//@access Private
router.put("/upvote/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    const questionIds = question.upvotes.map((upvote) => upvote.user.toString());
    const removeIndex = questionIds.indexOf(req.user._id);

    
    //Check if the question is already upvoted by the user
    if (removeIndex !== -1) {
       
      question.upvotes.splice(removeIndex, 1); 
       
    }else{
      question.upvotes.unshift({ user: req.user._id });
      }
      await question.save();
      res.json(question.upvotes);
    }catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
          return res.status(404).json({ message: "question not Found " });
        }
        res.status(500).send("Server error");
      
    }
   
});

//@route PUT api/question/downvote/:id
//@desc Downvote a question
//@access Private
router.put("/downvote/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    const questionIds = question.downvotes.map((downvote) => downvote.user.toString());
    const removeIndex = questionIds.indexOf(req.user._id);

    //Check if the question is already downvoted by the user
    if (removeIndex !== -1) {
       
      question.downvotes.splice(removeIndex, 1); 
       
    }else{
      question.downvotes.unshift({ user: req.user._id });
      }
      await question.save();
      res.json(question.downvotes);
    }catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
          return res.status(404).json({ message: "question not Found " });
        }
        res.status(500).send("Server error");
      
    }
   
});

//@route put api/question/views/:id
//@desc view a question
//@access Private
router.put("/views/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {    
      return res.status(404).json({ message: "question not Found " });
    }
    //Check if the user owns the question
    if (question.user.toString() !== req.user._id) {
      return res
        .status(404)
        .json({ message: "it's your question " });
    }

    question.views.unshift({ user: req.user._id });
    await question.save();
    res.json(question.views);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "question not Found " });
    }
    res.status(500).send("Server error");
  }
});  
module.exports = router;
