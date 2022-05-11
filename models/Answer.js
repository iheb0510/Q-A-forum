const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

const AnswerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'question',
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    upvotes: [voteSchema],
    downvotes: [voteSchema],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
        text: {
          type: String,
          require: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    solution: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('answer', AnswerSchema);
