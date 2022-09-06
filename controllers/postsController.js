const postSchema = require('../schemasModels/Post')
const CommentSubSchema = require('../schemasModels/Comment')
const User = require('../schemasModels/User')


const createPost = async (req, res) => {
    const newPost = new postSchema({user: req.userId, ...req.body})
    try {
        await newPost.save()
        res.status(200).json(newPost)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


const updatePost = async (req, res) => {
    try {
        const post = await postSchema.findById(req.params.postId)
        const postOwner = post.userId
        //checks if the post the user wish to update belongs to the specified user
        if (postOwner === req.body.userId) {//need to add a check if ther user is admin

            await post.updateOne({ $set: req.body, })
            await post.save()
            res.status(200).json("Post was updated successfully.")
        } else {
            res.status(403).json("you can update only your posts")
        }

    } catch (err) {
        res.status(500).json(err)

    }

}


const deletePost = async (req, res) => {
    try {
        const post = await postSchema.findById(req.params.postId)
        const postOwner = post.userId
        if (postOwner === req.body.userId) { //need to add a check if ther user is admin
            await post.deleteOne()
            res.status(200).json("Post was deleted successfully.")
        } else {
            res.status(403).json("You cant delete posts that doesnt belong to you")
        }
    } catch (err) {
        res.status(500).json(err)
    }
}


const postLike = async (req, res) => {
    try {
        const post = await postSchema.findById(req.params.postId)

        if (!post.likes.includes(req.userId)) {
            post.likes.push(req.userId)
            await post.save()
            console.log(req.userId, post)
            res.status(200).json(post.likes)
        } else {
            post.likes.splice(post.likes.indexOf(req.userId), 1);
            await post.save();
            res.status(200).json(post.likes)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


const getTimeLinePosts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId)
        const currentUserId = currentUser.id
        const currentUserReviews = await postSchema.find({ userId: currentUserId })
        const followingReviews = await Promise.all(currentUser.Following.map(friendId => {
            return postSchema.find({ userId: friendId })
        }))
        res.json(followingReviews.concat(...currentUserReviews))
    } catch (err) {
        res.status(500).json(err)
    }

}

const postComment = async (req, res) => {
    try {
        const post = await postSchema.findById(req.params.postId)
        post.comments.push({
            user: req.userId,
            content: req.body.content,
            date: new Date()
        });

        await post.save();

        const updatedPost = await postSchema.findById(req.params.postId).populate("comments.user")
        res.status(200).json(updatedPost.comments);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = { createPost, updatePost, deletePost, postLike, postComment }