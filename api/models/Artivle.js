const mongooose = require('mongoose')
const Schema = mongooose.Schema

const Article = new Schema ({
  title: { type: String, required: true, index: { unique: true } },
  author: { type: String, required: true },
  body: { type: String, required: true }
})

module.exports = mongoose.model('Article', Article)
