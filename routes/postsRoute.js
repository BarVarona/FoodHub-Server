const express = require('express')
const router = express.Router()
const postsController = require('../controllers/postsController')
const { verifyJwt } = require('../middlewares/authJwt')


//Create post
router.post('/', [verifyJwt], postsController.createPost)
//Like/Dislike a post
router.put('/:postId/like', [verifyJwt], postsController.postLike)
//Comment on a post
router.put('/:postId/comment', [verifyJwt], postsController.postComment)

//get a post
//get timeline posts
// router.get('/timeline', postsController.getTimeLinePosts)

// //Update post
// router.put('/:postId', postsController.updatePost)
// //Delete post
// router.delete('/:postId', postsController.deletePost)




module.exports = router