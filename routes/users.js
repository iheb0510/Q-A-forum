const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: config.get('mail_api_key'),
    },
  })
);

const User = require('../models/User');

// @route     POST api/users
// @desc      Regiter a user
// @access    Public
router.post(
  '/',
  check('username', 'Please add username').not().isEmpty(),
  check('fullname', 'Please add fullname').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, fullname, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        username,
        fullname,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      const payload = {
        user,
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        async (err, token) => {
          if (err) throw err;
          const url = `${config.get('CLIENT_URL')}/users/activate/${token}`;
          await transporter.sendMail({
            to: email,
            from: 'qqaforum@gmail.com',
            subject: 'CAPGEMINI Forum Email Verification',
            html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the CAPGEMINI Forum.</h2>
            <p>Congratulations! You're almost set to start using  Forum.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoratCAPGEMINIion: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Verify your email address</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        `,
          });
          res.json({
            message: 'Register Success! Please activate your email to start.',
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.post(
  '/activate',
  check('token', 'Please add token').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;

    try {
      const decoded = jwt.verify(token, config.get('jwtSecret'));
      const user = await User.create(decoded.user);
      console.log(user.github);
      res.json({ msg: 'Account has been activated!', token, user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     POST api/users/forget_password
// @desc      forget password
// @access    Public
router.post(
  '/forget_password',
  check('email', 'Please include a valid email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'User not exists' });
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        async (err, token) => {
          if (err) throw err;
          const url = `${config.get(
            'CLIENT_URL'
          )}/users/forget-password/${token}`;
          await transporter.sendMail({
            to: email,
            from: 'qqaforum@gmail.com',
            subject: 'CAPGEMINI Forum Reset password',
            html: `
              <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the CAPGEMINI Forum.</h2>
              <p>Congratulations! You're almost set to reset password using CAPGEMINI Forum.
                  Just click the button below to validate your email address.
              </p>
              
              <a href=${url} style="background: crimson; text-decoratCAPGEMINIion: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Verify your email address</a>
          
              <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          
              <div>${url}</div>
              </div>
          `,
          });
          res.json({
            message:
              'forget password step Success! Please reset your password to start.',
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     POST api/users/reset_password
// @desc      forget password
// @access    Public
router.post(
  '/reset_password',
  check('token', 'Please add token').not().isEmpty(),
  check(
    'new_password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  check(
    'confirm_password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, new_password, confirm_password } = req.body;

    try {
      const decoded = jwt.verify(token, config.get('jwtSecret'));
      const user = await User.findById(decoded.user.id).select('+password');
      if (user) {
        if (new_password === confirm_password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          await user.save();
          res.status(200);
          res.json({ message: 'Password reset successfully!' });
        } else {
          res.status(403);
          throw new Error('Password does not match!');
        }
      } else {
        res.status(404);
        throw new Error('User not found!');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
