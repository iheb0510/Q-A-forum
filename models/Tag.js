import mongoose from 'mongoose';

const Schema = mongoose.Schema({
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
});

module.exports = mongoose.model('tag', Schema);
