const Article = require('../models/Article')
const validator = require('express-validator')

module.exports.list = function(req, res, next) {
  Article.find({}, function(err, articles) {
    if (err) {
      return res.status(500).json({
        message: 'Error getting records'
      })
    }
    return res.json(articles)
  })
}

module.exports.show = function(req, res) {
  const id = req.params.id
  Article.findOne({ _id: id }, function(err, article) {
    if (err) {
      return res.status(500).json({
        message: 'Error getting record'
      })
    }
    if (!article) {
      return res.status(404).json({
        message: 'No such record'
      })
    }
    return res.json(article)
  })
}

module.exports.create = [
  validator.body('title', 'Please enter Article Title').isLength({ min: 1 }),
  validator.body('title').custom(value => {
    return Article.findOne({ title: value }).then(article => {
      if (article !== null) {
        return Promise.reject('Titile already in use')
      }
    })
  }),
  validator.body('author', 'Please enter Author Name').isLength({ min: 1 }),
  validator.body('body', 'Please enter Article Content').isLength({ min: 1 }),

  function(req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    const article = new Article({
      title : req.body.title,
      author : req.body.author,
      body : req.body.body
    })

    article.save(function(err, article) {
      if (err) {
        return res.status(500).json({
          message: 'Error saving record',
          error: err
        })
      }
      return res.json({
        message: 'saved',
        _id: article._id
      })
    })
  }
]

module.exports.update = [
  validator.body('title', 'Plase enter Article Title'),
  validator.body('title').custom((value, {req}) => {
    return Article.findOne({ title: value, _id:{ $ne: req.params.id } })
      .then(article => {
        if (article !== null) {
          return Promise.reject('Title already in use')
        }
    })
  }),
  validator.body('author', 'Please enter Author Name').isLength({ min: 1 }),
  validator.body('body', 'Please enter Article Content').isLength({ min: 1 }),

  function(req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    const id = req.params.id
    Article.findOne({ _id: id }, function(err, article) {
      if (err) {
        return res.status(500).json({
          message: 'Error getting record'
        })
      }
      if(!article) {
        return res.status(400).json({
          message: 'No such record'
        })
      }
      return res.json(article)
    })
  }
]

module.exports.delete = function(req, res) {
  const id = req.params.id
  Article.findByIdAndRemove(id, function(err, article) {
    if (err) {
      return res.status(500).json({
        message: 'Error getting record'
      })
    }
    return res.json(article)
  })
}
