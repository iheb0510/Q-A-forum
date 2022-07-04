const ChatRoom = require('../models/ChatRoom');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const auth = require('../middleware/auth');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

// @route     GET api/chat/createRoom
// @desc      Post Room
// @access    Private
router.post('/createNewRoom', [auth], async (req, res) => {
  try {
    const newRoom = await ChatRoom.create({
      sender: req.user._id,
      sender_fname: req.user.fullname,
      sender_dp: req.user.dp,
      ...req.body,
    });
    if (newRoom) {
      res.status(200).json(newRoom);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get chat rooms
// routes: api/chat/getChatRooms/:userId
// method: GET
router.get('/getChatRooms/:userId', [auth], async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (user) {
      const isSender = await ChatRoom.find({ sender: userId });
      const isReceiver = await ChatRoom.find({ receiver: userId });
      if (isReceiver.length > 0 && isSender.length > 0) {
        const rooms = isReceiver.concat(isSender);
        res.status(200).json(rooms);
      } else if (isSender.length > 0) {
        res.status(200).json(isSender);
      } else if (isReceiver.length > 0) {
        res.status(200).json(isReceiver);
      } else {
        res.status(200).json([]);
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// delete chat
// routes: api/chat/deleteChat/:roomId
// method: DELETE
router.delete('/deleteChat/:roomId', [auth], async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await ChatRoom.findOne({ roomId: roomId });
    if (room) {
      const deleteRoom = await ChatRoom.deleteOne({ roomId: roomId });
      const deleteConversation = await Conversation.deleteMany({
        room: roomId,
      });
      if (deleteRoom && deleteConversation) {
        res.status(200).json({ message: 'Chat deleted!' });
      } else {
        return res.status(404).json({ message: 'Failed to delete chat! ' });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
