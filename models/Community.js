const mongoose = require('mongoose');

const Schema = mongoose.Schema(
  {
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
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
    dp: {
      type: String,
      default: '/uploads/images/community.png',
    },
    cover: {
      type: String,
      default: '/uploads/images/cover.png',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    private: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('community', Schema);
