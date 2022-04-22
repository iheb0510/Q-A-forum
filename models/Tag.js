const mongoose = require('mongoose');

const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('tag', Schema);
