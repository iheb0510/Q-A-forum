const express = require('express');
const router = express.Router();
const config = require('config');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const { check, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const Community = require('../models/Community');
const User = require('../models/User');
const Request = require('../models/Request');

// @route     POST api/community
// @desc      Add community
// @access    private
router.post(
  '/',
  [auth, upload],

  async (req, res) => {
    const { name, description, private } = JSON.parse(req.body.data);
    try {
      const user = await User.findById(req.user._id).select('-password');
      const newCommunity = new Community({
        dp: req.files['dp'] && req.files['dp'][0].path,
        cover: req.files['cover'] && req.files['cover'][0].path,
        name,
        description,
        createdby: user,
        private,
      });
      newCommunity.members.unshift(user);
      const community = await newCommunity.save();
      user.communities.unshift(community);
      await user.save();
      res.json(community);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not Found ' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route     POST api/community/add
// @desc      Add community
// @access    private
router.post(
  '/add',
  [auth, upload],

  async (req, res) => {
    const { name, description, private } = JSON.parse(req.body.data);
    try {
      const user = await User.findById(req.user._id).select('-password');
      const newCommunity = new Community({
        dp: req.files['dp'] && req.files['dp'][0].path,
        cover: req.files['cover'] && req.files['cover'][0].path,
        name,
        description,
        createdby: user,
        private,
      });
      newCommunity.members.unshift(user);
      const community = await newCommunity.save();
      //await user.communities.splice(0, user.communities.length);
      await user.communities.unshift(community);
      await user.save();
      res.json(user.communities);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not Found ' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route     POST api/community/join
// @desc      Add community
// @access    private
router.post(
  '/join/:id',
  [auth],

  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      const community = await Community.findById(req.params.id);
      const requ = await Request.find({ sentby: req.user._id });
      const alreadysent = requ.filter(
        (requete) => requete.community.toString() === req.params.id
      );
      console.log(alreadysent.length);
      if (alreadysent.length > 0) {
        return res.status(404).json({ message: 'Request already sent ' });
      }
      if (community.createdby.toString() === req.user._id) {
        return res.status(404).json({ message: "it's your community " });
      }
      const newRequest = new Request({
        sentby: user,
        sendto: community.createdby,
        community,
      });
      const request = await newRequest.save();
      res.json(request);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not Found ' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route     POST api/community/accept
// @desc      Accept request
// @access    private
router.post('/accept/:id', [auth], async (req, res) => {
  try {
    const request = await Request.findOneAndUpdate(
      { _id: req.params.id },
      { accepted: true },
      { new: true }
    );
    const community = await Community.findById(request.community.toString());
    const user = await User.findById(request.sentby.toString()).select(
      '-password'
    );

    if (community.createdby.toString() !== req.user._id) {
      return res.status(404).json({ message: "it's not your community " });
    }
    community.members.unshift(user);
    await community.save();
    //await user.communities.splice(0, user.communities.length);
    await user.communities.unshift(community);
    await user.save();

    res.json(request);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not Found ' });
    }
    res.status(500).send('Server error');
  }
});
module.exports = router;
