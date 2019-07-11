const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mailer = require("../libs/mail");

// Load User model
const Users = require('../models/Users');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Forget password page
router.get('/forget', forwardAuthenticated, (req, res) => res.render('forget'));

//Reset Page
router.get('/reset/:token', async (req, res) => {
  const user = await Users.findOne({ resetPasswordToken: req.params.token })
  
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.redirect('/users/login');
  }
    
  res.render('reset', {
    token: req.params.token
  });

});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2, image } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      image
    });
  } else {
    Users.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          image
        });
      } else {
        const newUser = new Users({
          name,
          email,
          password,
          image
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});



// Forget
router.post('/forget', async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email: email });

  if(!user){
    req.flash('error','No account with that email address exists.')
    res.redirect('/forget');
    // res.send('email not found');
  }

  else {

    var buf = await crypto.randomBytes(20);
    var token = buf.toString('hex');

    resetPasswordToken = token;
    resetPasswordExpires = Date.now() + 1800000; //30mins

    update = {
      resetPasswordToken: resetPasswordToken ,
      resetPasswordExpires: resetPasswordExpires
    }
    filter = {
      email: email
    }
    
    await Users.findOneAndUpdate(filter, update)

    try {
      mailer.sendVerificationMail(
        email,
        'OfficeMarshall Password Reset',
        'http://' + req.headers.host + '/users/reset/' + token
        );
      req.flash('success_msg', 'An email has been sent to' + email + ' with further intructions.');
      res.redirect('/users/login')
    } catch(ex) {
      return res.status(500).send(ex.message);
    }
  }
});


//Reset Password
router.post('/reset/:token', async (req, res) => {
  
  const user = await Users.findOne({ 
    resetPasswordToken: req.params.token,
  });

  if(!user) {
    return res.status(401).send('invalid or expired token');
  }
  
  const { password, password2 } = req.body;
  const token = req.params.token;

  let errors = [];

  if (!password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('reset', {
      errors,
      password,
      password2,
      token
    });
    // res.send('password does not match');
  } else {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        // password = hash;
        resetPasswordToken = undefined
        resetPasswordExpires = undefined

        update = {
          password: hash,
          resetPasswordToken,
          resetPasswordExpires
        }

        filter = {
          resetPasswordToken: token
        }

        try {
          mailer.ConfirmationMail(
            user.email,
            'Your password has been changed',
            user.email
            );
          Users
            .findOneAndUpdate(filter, update)
            .catch(err => console.log(err));
          req.flash('success_msg','Password updated successfully');
          res.redirect('/users/login');
        } catch(ex) {
          return res.status(500).send(ex.message);
        }
      });
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
