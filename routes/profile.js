const express = require('express');
const router = express.Router();
const config = require('config');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const { check, validationResult } = require('express-validator');
const upload = require('../middleware/upload');

const User = require('../models/User');

router.put(
  '/',
  [
    auth,
    upload,
    [
      /*check('fullname', 'fullname is required').not().isEmpty(),
      check('username', 'username is required').not().isEmpty(),
      check('bio', 'bio is required').not().isEmpty(),
      check('location', 'location is required').not().isEmpty(),
      check('website', 'website is required').not().isEmpty(),
      check('social', 'social is required').not().isEmpty(),
      check('education', 'education is required').not().isEmpty(),
      check('experience', 'experience is required').not().isEmpty(),
      check('github', 'github is required').not().isEmpty(),
      check('topSkills', 'topSkills is required').not().isEmpty(),
      check('otherSkills', 'otherSkills is required').not().isEmpty(),
      check('workStatus', 'workStatus is required').not().isEmpty(),*/
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      fullname,
      username,
      bio,
      location,
      website,
      social,
      education,
      experience,
      github,
      topSkills,
      otherSkills,
      workStatus,
    } = JSON.parse(req.body.data);
    try {
      const us = await User.findById(req.user._id).select('-password');
      const newUser = new User({
        _id: req.user._id,
        dp: req.files['dp'] ? req.files['dp'][0].path : us.dp,
        cover: req.files['cover'] ? req.files['cover'][0].path : us.cover,
        fullname,
        username,
        location,
        bio,
        website,
        social,
        education,
        experience,
        github,
        topSkills,
        otherSkills,
        workStatus,
        communities: us.communities,
        points: us.points,
        badge: us.badge,
      });

      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: newUser },
        { new: true }
      );
      console.log(user);
      res.json(user);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not Found ' });
      }
      res.status(500).send('Server error');
    }
  }
);
router.put(
  '/images',
  auth,
  upload,

  async (req, res) => {
    try {
      if (req.files['dp'])
        console.log('http://localhost:5000/' + req.files['dp'][0].path);

      if (req.files['cover'])
        console.log('http://localhost:5000/' + req.files['cover'][0].path);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not Found ' });
      }
      res.status(500).send('Server error');
    }
  }
);

//@Route GET api/profile/:id
// @Description  Test route
// @Access Public
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@Route GET api/profile/:id
// @Description  Test route
// @Access Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.find( {_id:{$ne: req.user._id} }).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
