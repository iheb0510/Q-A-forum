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


//@route POST api/jobs/
//@desc add job
//@access Private
router.post(
  "/",
  [auth, [check('description', 'Text is required ').not().isEmpty(),
  check('price', 'price is required').not().isEmpty(),
  check('availability', 'availability is required').not().isEmpty(),
  check('category', 'category is required').not().isEmpty(),
  check('title', 'title is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
     const { description, price, availability, category, title , updatedAt , candidates, appliedTo ,skills} = req.body;
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newJob = new Job({
        user: user,
        description,
        price,
        availability,
        category,
        title,
        updatedAt,
        candidates,
        appliedTo,
        skills
      });
      const job = await newJob.save();
      res.json(job);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

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
      dp: req.files['dp'] && req.files['dp'][0].path,
      cover: req.files['cover'] && req.files['cover'][0].path,
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
    );

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
      /*  if (alreadysent.length > 0) {
        return res.status(404).json({ message: 'Request already sent ' });
      }*/
      if (community.createdby.toString() === req.user._id) {
        return res.status(404).json({ message: "it's your community " });
      }
      if (community.private === false) {
        community.members.unshift(user);
        await community.save();
        //await user.communities.splice(0, user.communities.length);
        await user.communities.unshift(community);
        await user.save();
      } else {
        const newRequest = new Request({
          sentby: user,
          sendto: community.createdby,
          community,
        });
        await newRequest.save();
      }
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

// @route     POST api/community/accept
// @desc      Accept request
// @access    private
router.post('/accept/:id', [auth], async (req, res) => {
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

    request.accepted = true;
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

// @route     DELETE api/community/refuse
// @desc      refuse request
// @access    private
router.delete('/refuse/:id', [auth], async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    const community = await Community.findById(request.community.toString());

    if (community.createdby.toString() !== req.user._id) {
      return res.status(404).json({ message: "it's not your community " });
    }
    request.remove();
    res.json(request);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not Found ' });
    }
    res.status(500).send('Server error');
  }
});

// @route     DELETE api/community/delete/:id
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

      await community.remove();
      res.json(user);
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
    const requests = await Request.find({ accepted: false, sendto: user }).sort(
      {
        createdAt: -1,
      }
    );
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
    const communities = await Community.find();
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

module.exports = router;
