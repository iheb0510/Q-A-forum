const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

const QuestionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
      },
    ],
    views: [voteSchema],
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'community',
    },
    upvotes: [voteSchema],
    downvotes: [voteSchema],
    solved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    usePushEach: true,
  }
);

module.exports = mongoose.model('question', QuestionSchema);
