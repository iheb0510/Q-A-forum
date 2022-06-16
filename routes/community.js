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
const updatePoints = require('../utils/updatePoints');

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
        dp: req.files['dp']
          ? req.files['dp'][0].path
          : 'uploads/images/community.jpg',
        cover: req.files['cover']
          ? req.files['cover'][0].path
          : 'uploads/images/cover.png',
        name,
        description,
        createdby: user,
        private,
      });
      newCommunity.members.unshift(user);
      const community = await newCommunity.save();
      user.communities.unshift(community);
      await user.save();
      await updatePoints(user._id, 5);
      console.log('com', community);
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

// @route     PUT api/community
// @desc      Update community
// @access    private
router.put('/:id', [auth, upload], async (req, res) => {
  const { name, description, private } = JSON.parse(req.body.data);
  try {
    let community = await Community.findById(req.params.id);
    if (community.createdby.toString() !== req.user._id)
      res.json("it's not your community");
    const user = await User.findById(req.user._id).select('-password');
    const newCommunity = new Community({
      _id: req.params.id,
      dp: req.files['dp'] ? req.files['dp'][0].path : community.dp,
      cover: req.files['cover'] ? req.files['cover'][0].path : community.cover,
      name,
      description,
      createdby: user,
      private,
      members: community.members,
    });

    community = await Community.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newCommunity },
      { new: true }
    )
      .populate('members')
      .populate('createdby');

    res.json(community);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not Found ' });
    }
    res.status(500).send('Server error');
  }
});

// @route     POST api/community/join
// @desc      Add community
// @access    private
router.put(
  '/join/:id',
  auth,

  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      const community = await Community.findById(req.params.id);
      const requ = await Request.find({ sentby: req.user._id });
      const alreadysent = requ.filter(
        (requete) => requete.community.toString() === req.params.id
      );
      console.log(alreadysent.length);
      /*  if (alreadysent.length > 0) {
        return res.status(404).json({ message: 'Request already sent ' });
      }*/
      if (community.createdby.toString() === req.user._id) {
        console.log(1);
        return res.status(404).json({ message: "it's your community " });
      }
      if (community.private === false) {
        community.members.unshift(user);
        await community.save();
        //await user.communities.splice(0, user.communities.length);
        await user.communities.unshift(community);
        await user.save();
        await updatePoints(community.createdby.toString(), 3);
        await updatePoints(user._id, 1);
        console.log(2);
      } else {
        const newRequest = new Request({
          sentby: user,
          sendto: community.createdby,
          community,
        });
        await newRequest.save();
        console.log(3);
      }
      const requests = await Request.find().sort({
        createdAt: -1,
      });
      res.json(community, requests);
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
router.put('/accept/:id', [auth], async (req, res) => {
  try {
    /*const request = await Request.findOneAndUpdate(
      { _id: req.params.id },
      { accepted: true },
      { new: true }
    );*/
    const request = await Request.findById(req.params.id);
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

    request.status = 'accepted';
    await request.save();
    await updatePoints(community.createdby.toString(), 3);
    await updatePoints(user._id, 1);
    res.json(request);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not Found ' });
    }
    res.status(500).send('Server error');
  }
});

// @route     Put api/community/refuse
// @desc      refuse request
// @access    private
router.put('/refuse/:id', [auth], async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    const community = await Community.findById(request.community.toString());

    if (community.createdby.toString() !== req.user._id) {
      return res.status(404).json({ message: "it's not your community " });
    }
    request.status = 'refused';
    await request.save();
    res.json(request);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not Found ' });
    }
    res.status(500).send('Server error');
  }
});

// @route     Put api/community/delete/:id
// @desc      delete community
// @access    private
router.put('/delete/:id', [auth], async (req, res) => {
  try {
    /* await User.updateMany(
      {},
      {
        $set: {
          communities: [],
        },
      }
    );
    await Community.updateMany(
      {},
      {
        $set: {
          members: [],
        },
      }
    );*/
    const community = await Community.findById(req.params.id);
    if (!community) {
      res.json({ message: 'community not found ' });
    } else if (community.createdby.toString() !== req.user._id) {
      return res.status(404).json({ message: "it's not your community " });
    } else {
      await Request.deleteMany({ community: community });
      const user = await User.updateMany(
        { communities: community },
        {
          $pull: {
            communities: { community },
          },
        }
      );
      await updatePoints(community.createdby.toString(), -20);
      await community.remove();
      res.json(community);
    }
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not Found ' });
    }
    res.status(500).send('Server error');
  }
});

//@Route GET api/community/requests
// @Description  Test route
// @Access private
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const requests = await Request.find({ status: 'in_process', sendto: user })
      .sort({
        createdAt: -1,
      })
      .populate('community')
      .populate('sentby');
    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@Route GET api/community/requests
// @Description  Test route
// @Access private
router.get('/requestsMe', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const requests = await Request.find().sort({
      createdAt: -1,
    });
    console.log(requests);
    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
//@Route GET api/community/
// @Description  Test route
// @Access Public
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('members')
      .populate('createdby');
    res.json(communities);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@Route GET api/community/me
// @Description  get my communities
// @Access Public
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const communities = await Community.find({
      _id: { $in: user.communities },
    });
    res.json(communities);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@Route GET api/community/:id
// @Description  Test route
// @Access Public
router.get('/:id', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('members')
      .populate('createdby');
    res.json(community);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
