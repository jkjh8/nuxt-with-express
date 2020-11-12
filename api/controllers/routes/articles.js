const config = require('../config')
const { Router } = require('express')

const router = Router()

const articlesController = require('../controllers/articlesController')

router.get('/articles', articlesController.list)
router.get('articles/:id', articlesController.show)
router.post('/articles', config.isAuthenticated, articlesController.create)
router.put('/articles/:id', config.isAuthenticated, articlesController.update)
router.delete('/articles/:id', config.isAuthenticated, articlesController.delete)

module.exports = router
