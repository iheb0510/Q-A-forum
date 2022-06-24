const mongoose = require('mongoose');

const TagSchema = mongoose.Schema(
  {
    name: {
      type: String,
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

module.exports = mongoose.model('tag', TagSchema);
