const reviewSchema = require('../schemasModels/Review');

async function getTopReviews() {
    // can be done using aggregate...
    const reviews = await reviewSchema.find()
    .populate("user")
    .populate("comments.user");
    reviews.sort((a, b) => b.likes.length - a.likes.length);
    const topReviews = reviews.slice(0, 3);
    return topReviews.map(res => res._doc);
}

module.exports = { getTopReviews }