const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CommentSubSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        max: 500,
        default: "",
    },
    date: {
        type: Date,
    }
})

module.exports = { CommentSubSchema };// this is a sub-schema