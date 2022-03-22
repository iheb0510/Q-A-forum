const mongoose = require('mongoose');

const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'question',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('tag', Schema);
