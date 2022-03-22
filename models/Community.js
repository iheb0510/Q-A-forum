const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  createdby: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
  private: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('community', Schema);
