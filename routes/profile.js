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
  [
    auth,
    upload,
    [
      check('fullname', 'fullname is required').not().isEmpty(),
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
      check('workStatus', 'workStatus is required').not().isEmpty(),
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
      website,
      social,
      education,
      experience,
      github,
      topSkills,
      otherSkills,
      workStatus,
    } = req.body;
    try {
      const newUser = new User({
        _id: req.user._id,
        dp: req.files['dp'] && req.files['dp'][0].path,
        cover: req.files['cover'] && req.files['cover'][0].path,
        fullname,
        username,
        bio,
        website,
        social,
        education,
        experience,
        github,
        topSkills,
        otherSkills,
        workStatus,
      });

      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: newUser },
        { new: true }
      ).select('-password');

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
module.exports = router;
