const bcrypt = require('bcrypt')
const userSchema = require('../schemasModels/User')
const recipesSchema = require('../schemasModels/Recipe');
const reviewSchema = require('../schemasModels/Review');
const postsSchema = require('../schemasModels/Post');
const { timelineContent } = require('../queries/Timeline');


const updateUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        //checking if user wants to update his password
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(2);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await userSchema.findByIdAndUpdate(req.params.id, { $set: req.body, });
            res.status(200).json("Account has been updated")
        } catch (err) {
            return res.json(500).send(err)
        }

    } else {
        return res.status(403).json("you cant update")
    }
}


const deleteUser = async (req, res) => {
    console.log('delete user func');
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await userSchema.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted")
        } catch (err) {
            return res.json(500).send(err)
        }

    } else {
        return res.status(403).json("you can delete only your user")
    }
}


const getUser = async (req, res) => {
    try {
        const user = await userSchema.findById(req.userId)
        const { password, isAdmin, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(404).json("User not found")
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id)
        const { password, isAdmin, ...other } = user._doc

        // stats:
        const reviewsCount = await reviewSchema.count({
            user: user._id
        });
        const recipesCount = await recipesSchema.count({
            user: user._id
        });

        // recent activity:
        let posts = await timelineContent(postsSchema, req.userId, false, user._id);
        posts = posts.map(post => {
            return {
                ...post,
                type: 'Post'
            }
        });

        let reviews = await timelineContent(reviewSchema, req.userId, false, user._id);
        reviews = reviews.map(review => {
            return {
                ...review,
                type: 'Review'
            }
        });

        let recipes = await timelineContent(recipesSchema, req.userId, false, user._id);
        recipes = recipes.map(recipe => {
            return {
                ...recipe,
                type: 'Recipe'
            }
        });

        const timeline = [...posts, ...reviews, ...recipes];
        // sort by date
        timeline.sort((a,b)=>{
            const dateA = a.type === "Post" ? a.postDate :
                            a.type === "Recipe" ? a.date : a.dateOfVisit;

            const dateB = b.type === "Post" ? b.postDate :
                        b.type === "Recipe" ? b.date : b.dateOfVisit;

            return dateB?.getTime() - dateA?.getTime();
        });

        res.status(200).json({
            ...other,
            reviewsCount,
            recipesCount,
            timeline
        });

    } catch (err) {
        console.log(err)
        res.status(404).json("User not found")
    }
}

const getFriends = async (req, res) => {
    try {
        const currentUser = await userSchema.findById(req.userId)

        let following = await userSchema.find({
            _id: {
                $in: currentUser.Following
            }
        })
        following = following.map(user => {
            const { password, isAdmin, ...other } = user._doc
            return other;
        })

        let followers = await userSchema.find({
            _id: {
                $in: currentUser.Followers
            }
        })
        followers = followers.map(user => {
            const { password, isAdmin, ...other } = user._doc
            return other;
        })

        res.status(200).json({
            following,
            followers
        })

    } catch (err) {
        res.status(404).json("User not found")
    }
}

const followUser = async (req, res) => {
    console.log("follow user func");
    if (req.params.id !== req.userId) {
        try {
            const user = await userSchema.findById(req.params.id) //the user we wish to follow
            const currentUser = await userSchema.findById(req.userId)
            if (!currentUser.Following.includes(req.params.id)) {
                currentUser.Following.push(req.params.id)
                await currentUser.save()
                user.Followers.push(req.userId)
                await user.save()
                res.status(200).json("successfully followed " + user.firstName)
            } else {
                res.status(403).json("user is already being followed")
            }
        } catch (err) {
            res.status(400).json("couldnt follow for now/ user not exist")
        }

    } else {
        res.status(403).json("you cant follow yourself")
    }
}

const unfollowUser = async (req, res) => {
    console.log("unfollow user func");
    if (req.params.id !== req.userId) {
        try {
            const user = await userSchema.findById(req.params.id) //the user we wish to unfollow
            const currentUser = await userSchema.findById(req.userId)
            if (currentUser.Following.includes(req.params.id)) {
                user.Followers.splice(user.Followers.indexOf(req.userId), 1)
                await user.save()
                currentUser.Following.splice(currentUser.Following.indexOf(req.params.id), 1)
                await currentUser.save()
                res.status(200).json("successfully unfollowed " + user.firstName)
            } else {
                res.status(403).json("user is already being unfollowed")
            }
        } catch (err) {
            res.status(500).json(err)
        }

    } else {
        res.status(403).json("you cant unfollow yourself")
    }
}

const postProfileImage = async (req, res) => {
    const user = await userSchema.findById(req.userId);
    user.profilePicture = req.file.filename
    await user.save();
    res.status(200).json("Picture uploaded successfully!")
}

module.exports = {
    updateUser,
    deleteUser,
    getUser,
    getProfile,
    followUser,
    unfollowUser,
    getFriends,
    postProfileImage
}