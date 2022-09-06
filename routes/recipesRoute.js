const express = require('express')
const router = express.Router()
const recipesController = require('../controllers/recipesController')
const { verifyJwt } = require('../middlewares/authJwt')
const upload = require('../middlewares/uploadMiddelware');

//Create a recipe
router.post('/', [verifyJwt], recipesController.createRecipe)
//Upload recipe image
router.post('/:recipeId/image', [verifyJwt, upload.single('file')], recipesController.postRecipeImage)
//Like/Dislike a recipe
router.put('/:recipeId/like', [verifyJwt], recipesController.likeRecipe)
//Comment on a post
router.put('/:recipeId/comment', [verifyJwt], recipesController.commentRecipe)
router.get('/timeline', [verifyJwt], recipesController.getTimeLineRecipes)

// router.put('/:recipeId', recipesController.updateRecipe)
// router.delete('/:recipeId', recipesController.deleteRecipe)


module.exports = router