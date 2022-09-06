const { getTopReviews } = require('../queries/Review');
const { timelineContent } = require('../queries/Timeline');
const postSchema = require('../schemasModels/Post');
const recipesSchema = require('../schemasModels/Recipe')
const reviewSchema = require('../schemasModels/Review');
const { join } = require('path');

const getImage = async (req, res) => {
    res.sendFile(join(__dirname, '..', 'images', req.query.imageName));
}

const getTimeLine = async (req, res) => {
    try {
        let posts = await timelineContent(postSchema, req.userId, req.query.foryou === "1");
        posts = posts.map(post => {
            return {
                ...post,
                type: 'Post'
            }
        });

        let reviews = await timelineContent(reviewSchema, req.userId, req.query.foryou === "1");
        reviews = reviews.map(review => {
            return {
                ...review,
                type: 'Review'
            }
        });

        let recipes = await timelineContent(recipesSchema, req.userId, req.query.foryou === "1");
        recipes = recipes.map(recipe => {
            return {
                ...recipe,
                type: 'Recipe'
            }
        });

        timeline = [...posts, ...reviews, ...recipes];

        // sort by date
        timeline.sort((a,b)=>{
            const dateA = a.type === "Post" ? a.postDate :
                           a.type === "Recipe" ? a.date : a.dateOfVisit;

            const dateB = b.type === "Post" ? b.postDate :
                        b.type === "Recipe" ? b.date : b.dateOfVisit;

            return dateB?.getTime() - dateA?.getTime();
        });

        const topReviews = await getTopReviews();

        res.json({ timeline, topReviews });
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

}

module.exports = { getImage, getTimeLine }