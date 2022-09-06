const { timelineContent } = require('../queries/Timeline');
const recipesSchema = require('../schemasModels/Recipe')
const User = require('../schemasModels/User');

const createRecipe = async (req, res) => {
    const recipe = new recipesSchema({
        user: req.userId,
        ...req.body
    })
    try {
        await recipe.save()
        console.log('New recipe created');
        res.status(200).json(recipe._doc)
    } catch (err) {
        res.status(500).json(err)
    }
}

const updateRecipe = async (req, res) => {
    try {
        const recipe = await recipesSchema.findById(req.params.recipeId)
        if (!recipe) {
            res.status(404).json("Recipe was not found")
        }
        const recipeOwnerId = recipe.userId
        if (recipeOwnerId === req.body.userId) {
            await recipe.updateOne({ $set: req.body, })
            await recipe.save()
            res.status(200).json("Recipe has been updated succssfully." + recipe)
        } else {
            res.status(403).json("you can't update posts that doesn't belong to you")
        }


    } catch (err) {
        res.status(500).json(err)
    }
}


const deleteRecipe = async (req, res) => {
    try {
        const recipe = await recipesSchema.findById(req.params.recipeId)
        if (!recipe) {
            res.status(404).json("Review was not found")
        }
        const recipeOwnerId = recipe.userId
        if (recipeOwnerId === req.body.userId) {
            await recipe.deleteOne()
            res.status(200).json("Recipe was deleted succesfully")
        } else {
            res.status(403).json("You can't delete recipe that doesn't belong to you")
        }
    } catch (err) {
        res.status(500).send(err)
    }
}


const likeRecipe = async (req, res) => {
    try {
        const recipe = await recipesSchema.findById(req.params.recipeId)
        if (!recipe) {
            res.status(404).json("Recipe doesn't exist")
        }
        if (!recipe.likes.includes(req.userId)) {
            recipe.likes.push(req.userId)
            await recipe.save()
            console.log(req.userId, recipe)
            res.status(200).json(recipe.likes)
        } else {
            recipe.likes.splice(recipe.likes.indexOf(req.userId), 1);
            await recipe.save();
            res.status(200).json(recipe.likes)
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

const commentRecipe = async (req, res) => {
    try {
        const recipe = await recipesSchema.findById(req.params.recipeId)
        recipe.comments.push({
            user: req.userId,
            content: req.body.content,
            date: new Date()
        });

        await recipe.save();

        const updatedRecipe = await recipesSchema.findById(req.params.recipeId).populate("comments.user")
        res.status(200).json(updatedRecipe.comments);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getTimeLineRecipes = async (req, res) => {
    try {
        const timeline = await timelineContent(recipesSchema, req.userId, req.query.foryou === "1");
        // sort by date
        timeline.sort((a,b)=>{
            return b.date?.getTime() - a.date?.getTime();
        });
        res.json(timeline);
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

}

const postRecipeImage = async (req, res) => {
    const recipe = await recipesSchema.findById(req.params.recipeId);
    recipe.images = [] // for now, allow only one image
    recipe.images.push(req.file.filename)
    await recipe.save();

    res.status(200).json("Picture uploaded successfully!")
}

module.exports = {
    createRecipe,
    updateRecipe,
    deleteRecipe,
    likeRecipe,
    getTimeLineRecipes,
    commentRecipe,
    postRecipeImage
}