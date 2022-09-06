const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const { verifyJwt } = require('../middlewares/authJwt')
const upload = require('../middlewares/uploadMiddelware');

//Create a review
router.post('/', [verifyJwt], reviewController.createReview)
//Upload review image
router.post('/:reviewId/image', [verifyJwt, upload.single('file')], reviewController.postReviewImage)
//Like/Dislike a review
router.put('/:reviewId/like', [verifyJwt], reviewController.likeReview)
//Comment on a review
router.put('/:reviewId/comment', [verifyJwt], reviewController.commentReview)
//Get reviews timeline
router.get('/timeline', [verifyJwt], reviewController.getTimeLineReviews)

// //Update a review
// router.put('/:reviewId', reviewController.updateReview)
// //Delete a review
// router.delete('/:reviewId', reviewController.deleteReview)





module.exports = router