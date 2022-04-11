const mongoose = require('mongoose');

const Schema = mongoose.Schema(
  {
    sentby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    sendto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'community',
      required: true,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('request', Schema);
