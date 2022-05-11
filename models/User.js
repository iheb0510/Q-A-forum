const mongoose = require('mongoose');

const SocialSchema = mongoose.Schema({
  platform: {
    type: String,
  },
  link: {
    type: String,
  },
});

const EduSchema = mongoose.Schema({
  institute: {
    type: String,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  present: {
    type: Boolean,
    default: false,
  },
  desc: {
    type: String,
  },
  type: {
    type: String,
  },
});

const ExperienceSchema = mongoose.Schema({
  role: {
    type: Boolean,
    default: false,
  },
  company: {
    type: String,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  present: {
    type: Boolean,
    default: false,
  },
  desc: {
    type: String,
  },
});
const communitySchema = new mongoose.Schema({
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'community',
  },
});

const UserSchema = mongoose.Schema(
  {
    isAdmin: {
      type: Boolean,
      default: false,
    },
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    dp: {
      type: String,
      default: 'uploads/images/default.png',
    },
    cover: {
      type: String,
      default: 'uploads/images/cover.png',
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    social: [SocialSchema],
    education: [EduSchema],
    experience: [ExperienceSchema],
    github: {
      type: String,
    },
    topSkills: [],
    otherSkills: [],
    workStatus: {
      type: String,
      default: 'off',
    },
    googleId: { type: String },
    twitterId: { type: String },
    githubId: { type: String },
    communities: [communitySchema],
    badge: {
      type: String,
      default: 'Beginner',
    },
    points: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('user', UserSchema);
