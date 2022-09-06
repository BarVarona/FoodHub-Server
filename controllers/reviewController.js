const { timelineContent } = require('../queries/Timeline');
const reviewSchema = require('../schemasModels/Review');


const createReview = async (req, res) => {
    const newReview = new reviewSchema({
        user: req.userId,
        ...req.body
    })
    try {
        await newReview.save()
        console.log('New review created');
        res.status(200).json(newReview._doc)
    } catch (err) {
        res.status(500).json(err)
    }
}


const updateReview = async (req, res) => {
    try {
        const review = await reviewSchema.findById(req.params.reviewId)
        if (!review) {
            console.log('Review was not found');
            res.status(404)
        }
        const reviewOwnerId = review.userId
        // const reviewOwner = await userSchema.findById(reviewOwnerId) in order to check if user isAdmin
        if (reviewOwnerId === req.body.userId) {
            await review.updateOne({ $set: req.body, })
            await review.save()
            console.log('Review updated');
            res.status(200).json('review was updated successfully.')
        } else {
            res.status(403).json("you can update only your reviews")
        }
    } catch (err) {
        res.status(500).send(err)

    }
}


const deleteReview = async (req, res) => {
    try {
        const review = await reviewSchema.findById(req.params.reviewId)
        if (!review) {
            res.status(404).json("Review was not found")
        }
        const reviewOwnerId = review.userId
        if (reviewOwnerId === req.body.userId) {
            await review.deleteOne()
            res.status(200).json("Review was deleted succesfully")
        } else {
            res.status(403).json("You can't delete review that doesn't belong to you")
        }
    } catch (err) {
        res.status(500).send(err)
    }
}


const likeReview = async (req, res) => {
    try {
        const review = await reviewSchema.findById(req.params.reviewId)
        if (!review) {
            res.status(404).json("Review doesn't exist")
        }

        if (!review.likes.includes(req.userId)) {
            review.likes.push(req.userId)
            await review.save()
            console.log(req.userId, review)
            res.status(200).json(review.likes)
        } else {
            review.likes.splice(review.likes.indexOf(req.userId), 1);
            await review.save();
            res.status(200).json(review.likes)
        }
    } catch (err) {
        res.status(500).send(err)
    }
}


const getTimeLineReviews = async (req, res) => {
    try {
        const timeline= await timelineContent(reviewSchema, req.userId, req.query.foryou === "1");
        // sort by date
        timeline.sort((a,b)=>{
            return b.dateOfVisit?.getTime() - a.dateOfVisit?.getTime();
        });
        res.status(200).json(timeline);
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

}


const commentReview = async (req, res) => {
    try {
        const review = await reviewSchema.findById(req.params.reviewId)
        review.comments.push({
            user: req.userId,
            content: req.body.content,
            date: new Date()
        });

        await review.save();

        const updatedReview = await reviewSchema.findById(req.params.reviewId).populate("comments.user")
        res.status(200).json(updatedReview.comments);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const postReviewImage = async (req, res) => {
    const review = await reviewSchema.findById(req.params.reviewId);
    review.images = [] // for now, allow only one image
    review.images.push(req.file.filename)
    await review.save();

    res.status(200).json("Picture uploaded successfully!")
}

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    likeReview,
    commentReview,
    getTimeLineReviews,
    postReviewImage
}