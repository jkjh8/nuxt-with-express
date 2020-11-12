const config = require('../config')
const User = require('../models/User')
const validater = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


module.exports.user = function(req, res) {
  console.log("start user")
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token.replace(/^Bearer\s/, ''), config.authSecret, function(err, decode) {
      if (err) {
        return res.status(401).json({ message: 'unauthorized' })
      } else {
        return res.json({ user: decode })
      }
    })
  } else {
    return res.status(401).json({ message: 'unauthorized' })
  }
}

module.exports.register = [
  validater.body('full_name', 'Please enter Full Name').isLength({ min: 1 }),
  validater.body('email', 'Please enter Email').isLength({ min: 1 }),
  validater.body('email').custom(value => {
    console.log('find db')
    return User.findOne({ email: value }).then(user => {
      if (user !== null) {
        return Promise.reject('Email already in use')
      }
    })
  }),
  validater.body('password', 'Please enter Password').isLength({ min: 1 }),
  function(req, res) {
    const errors = validater.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    const user = new User({
      full_name: req.body.full_name,
      email: req.body.email,
      password: req.body.password
    })

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password, salt)
    user.password = hash

    //save user to db
    user.save(function(err, user) {
      if (err) {
        return res.status(500).json({
          message: 'Error saving user record',
          error: err
        })
      }
      return res.json({
        message: 'user saved',
        _id: user._id
      })
    })
  }
]

module.exports.login = [
  validater.body('email', 'Please enter Email').isLength({ min: 1 }),
  validater.body('password', 'Please enter Password').isLength({ min: 1 }),

  function(req, res) {
    const errors = validater.validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.mapped())
      return res.status(422).json({ errors: errors.mapped() })
    }
    console.log('email find start')
    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) {
        return res.status(500).json({
          message: 'Error logging in',
          error: err
        })
      }

      if (user === null) {
        return res.status(500).json({
          message: 'Email address you entered is not found'
        })
      }

      //conpare password
      return bcrypt.compare(req.body.password, user.password, function(err, isMatched) {
        if (isMatched === true) {
          console.log("login completed!")
          return res.json({
            user: {
              _id: user._id,
              email: user.email,
              full_name: user.full_name
            },
            token: jwt.sign({
              _id: user._id,
              email: user.email,
              full_name: user.full_name
            }, config.authSecret)
          })
        } else {
          return res.status(500).json({
            message: 'Invalid Email or Password entered'
          })
        }
      })
    })
  }
]

