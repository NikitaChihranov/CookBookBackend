let express = require('express');
let router = express.Router();
let RecipeController = require('../controllers/recipeController')

router.get('/', RecipeController);
router.get('/:name', RecipeController);
router.post('/', RecipeController);
router.post('/:id/uploadPhoto', RecipeController);
router.put('/:name', RecipeController);
router.put('/:id/updatePhoto', RecipeController);
router.delete('/:name', RecipeController);
module.exports = router;
