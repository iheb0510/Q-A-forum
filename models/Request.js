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
    status: {
      type: String,
      default: 'in_process',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('request', Schema);
