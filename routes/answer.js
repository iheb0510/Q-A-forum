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


//@route POST api/answer/
//@desc add answer
//@access Private
router.post(
    "/",
    [auth, [check('answer', 'answer is required ').not().isEmpty(),
    check('questionId', 'questionId is required').not().isEmpty(),
  ]],
    
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
       const { answer,questionId} = req.body;
      try {
        const user = await User.findById(req.user.id).select("-password");
        const question = await Question.findById(questionId);
  
        const newAnswer = new Answer({
          user,
          question,
          answer
          
        });
        const answer = await newAnswer.save();
        res.json(job);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
      }
    }
  );

// @route     GET api/answer/:id
// @desc      Get answers by question
// @access    Private
router.get('/:id', [auth], async (req, res) => {
  try {
    const question = await Question.findById(req.params.id); 
    const answers = await Answer.find({question :question});
    res.json(answers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route PUT api/question/upvote/:id
//@desc Upvoted a question
//@access Private
router.put("/upvote/:id", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    const answerIds = answer.upvotes.map((upvote) => upvote.user.toString());
    const removeIndex = answerIds.indexOf(req.user._id);

    
    //Check if the question is already upvoted by the user
    if (removeIndex !== -1) {
       
        answer.upvotes.splice(removeIndex, 1); 
       
    }else{
        answer.upvotes.unshift({ user: req.user._id });
      }
      await answer.save();
      res.json(question.upvotes);
    }catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
          return res.status(404).json({ message: "question not Found " });
        }
        res.status(500).send("Server error");
      
    }
   
});

//@route PUT api/answer/downvote/:id
//@desc Downvote an answer
//@access Private
router.put("/downvote/:id", auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    const answerIds = answer.downvotes.map((downvote) => downvote.user.toString());
    const removeIndex = answerIds.indexOf(req.user._id);

    //Check if the question is already downvoted by the user
    if (removeIndex !== -1) {
       
        answer.downvotes.splice(removeIndex, 1); 
       
    }else{
        answer.downvotes.unshift({ user: req.user._id });
      }
      await answer.save();
      res.json(answer.downvotes);
    }catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
          return res.status(404).json({ message: "question not Found " });
        }
        res.status(500).send("Server error");
      
    }
   
});


module.exports = router;
