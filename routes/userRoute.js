const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { verifyJwt } = require('../middlewares/authJwt')
const upload = require('../middlewares/uploadMiddelware');

router.get('/', [verifyJwt], userController.getUser)
router.get('/friends', [verifyJwt], userController.getFriends)
router.put('/', [verifyJwt], userController.updateUser)
router.delete('/', [verifyJwt], userController.deleteUser)
router.put('/:id/follow', [verifyJwt], userController.followUser)
router.put('/:id/unfollow', [verifyJwt], userController.unfollowUser)
router.get('/:id/profile', [verifyJwt], userController.getProfile)
router.post('/image', [verifyJwt, upload.single('file')], userController.postProfileImage)

module.exports = router