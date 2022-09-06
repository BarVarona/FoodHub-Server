const express = require('express');
const dotenv = require('dotenv').config()
const app = express();
const port = process.env.PORT;
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const postsRoute = require('./routes/postsRoute')
const args = process.argv
const userName = args[2]
const pass = args[3]
const bodyParser = require('body-parser')
const userSchema = require('./schemasModels/User')
const postSchema = require('./schemasModels/Post')
const reviewSchema = require('./schemasModels/Review')
const recipeSchema = require('./schemasModels/Recipe')
const reviewRoute = require('./routes/reviewRoute')
const recipesRoute = require('./routes/recipesRoute')
const generalRoute = require('./routes/generalRoute')
var cors = require('cors')




var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://" + userName + ':' + pass + "@cluster0.6ykyw.mongodb.net/Comidhub?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    // .then(clearDB())
    .then(() => app.listen(port))
    .then(console.log("connected to mongo and server listening on port " + port));

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(bodyParser.json())
app.use(cors())
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/posts', postsRoute)
app.use('/reviews', reviewRoute)
app.use('/recipes', recipesRoute)
app.use('/general', generalRoute)

async function clearDB() {

    await userSchema.deleteMany({})
    await postSchema.deleteMany({})
    await reviewSchema.deleteMany({})
    await recipeSchema.deleteMany({})

    return;
}
