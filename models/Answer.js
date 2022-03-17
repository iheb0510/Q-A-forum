import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

const AnswerSchema = new mongoose.Schema({
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
  upvote: [voteSchema],
  downvote: [voteSchema],
  solution: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('answer', AnswerSchema);
