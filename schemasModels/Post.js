const { CommentSubSchema } = require('./Comment');
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const postSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        max: 500,
        default: "",
    },
    postDate: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: [CommentSubSchema],
        default: []
    }
})

module.exports = mongoose.model('Post', postSchema)