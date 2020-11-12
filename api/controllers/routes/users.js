const config = require('../config')
const { Router } = require('express')

const router = Router()

const usersController = require('../controllers/usersController')

router.post('/users/register', usersController.register)
router.post('/users/login', usersController.login)
router.post('/users.user', usersController.user)

module.exports = router
