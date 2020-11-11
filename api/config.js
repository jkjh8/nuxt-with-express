const jwt = require('jsonwebtoken')

const config = {
  authSecret: '123456789!'
}

module.exports = config

module.exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token.replace(/^Bearer\s/, ''), config.authSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'unauthorized' })
      } else {
        return next()
      }
    })
  } else {
    return res.status(401).json({ message: unauthorized })
  }
}
