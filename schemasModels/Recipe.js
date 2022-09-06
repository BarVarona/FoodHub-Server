const mongoose = require('mongoose')
const { CommentSubSchema } = require('./Comment');
const Schema = mongoose.Schema

const recipeSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    dishName: {
        type: String,
        required: true
    },
    generalDesciption: {
        type: String
    },
    numOfIngridients: {
        type: Number,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    images: {
        type: Array
    },
    instructions: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        // required: true
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

module.exports = mongoose.model('Recipes', recipeSchema)