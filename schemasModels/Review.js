const mongoose = require('mongoose')
const { CommentSubSchema } = require('./Comment');
const Schema = mongoose.Schema


const reviewSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    restaurantName: {
        type: String,
        required: true
    },
    totalOverview: {
        type: String,
        max: 500,
        default: "",
    },
    dateOfVisit: {
        type: Date,
        required: true
    },
    numOfDishes: {
        type: Number,
        required: true
    },
    dishesNames: {
        type: Array,
        required: true
    },
    totalPrice: {
        type: Number
    },
    location: {
        type: String
    },
    images: {
        type: Array,
    },
    serviceRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    foodRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    totalRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
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

module.exports = mongoose.model('Review', reviewSchema)