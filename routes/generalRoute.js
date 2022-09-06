const express = require('express')
const router = express.Router()
const generalController = require('../controllers/generalController')
const { verifyJwt } = require('../middlewares/authJwt')


router.get('/timeline', [verifyJwt], generalController.getTimeLine)
router.get('/image', generalController.getImage)

module.exports = router