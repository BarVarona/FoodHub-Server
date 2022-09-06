const User = require('../schemasModels/User');

const followingTimeline = async (schema, currentUser) => { 
    // following:
    const followingPosts = await schema.find({
        user: {
            $in: [...currentUser.Following, currentUser._id.toString()]
        }
    })
    .populate("user")
    .populate("comments.user")
    .limit(20);

    return followingPosts.map(res => res._doc);
}

const forYouTimeline = async (schema, currentUser) => {

    const above10likes = (await schema.find()
        .populate("user")
        .populate("comments.user")
    ).filter(element => element.likes.length >= 10);

    const followingUsers = await User.find({
        _id: {
            $in: currentUser.Following
        }
    });

    const followingFollowingElements = 
    (await Promise.all(followingUsers.map(followingUser => {
        return schema.find({
            user: {
                $in: followingUser.Following
            }
        })
        .populate("user")
        .populate("comments.user")
    })))
    // merge all lists into one list
    .reduce((previousValue, currentValue) => [...previousValue, ...currentValue], []);

    
    const result = [...above10likes, ...followingFollowingElements]
    // remove duplicates
    .filter((item, index, list) => {
        return list.findIndex(element => {
            return element._id.equals(item._id)
        }) === index;
    })
    // remove my following and myself
    .filter((item) => ![...currentUser.Following, currentUser._id].find(id => {
        return id.toString() === item.user._id.toString();
    }));
    
    return result.map(res => res._doc);
}

const recentActivityTimeline = async (schema, profileId) => {
    const allElements = await schema.find({ user: profileId })
    .populate("user")
    .populate("comments.user")
    .limit(4);

    return allElements.map(res => res._doc);
}

const timelineContent = async (schema, userId, foryou = false, profileId = null) => {
    if (profileId) {
        return recentActivityTimeline(schema, profileId)
    }

    const currentUser = await User.findById(userId);

    if (foryou) {
        return forYouTimeline(schema, currentUser);
    }

    return followingTimeline(schema, currentUser);
}

module.exports = { 
    followingTimeline,
    forYouTimeline,
    recentActivityTimeline,
    timelineContent
}
