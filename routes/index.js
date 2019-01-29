let express = require('express');
let router = express.Router();
let RecipeController = require('../controllers/recipeController')

router.get('/', RecipeController.findAll);
router.get('/:name', RecipeController.findByName);
router.get('/sort/s1', RecipeController.sortByDateUp);
router.get('/sort/s2', RecipeController.sortByDateDown);
router.get('/sort/s3', RecipeController.sortByAZ);
router.get('/sort/s4', RecipeController.sortByZA);
router.get('/viewAllVersions/:id', RecipeController.viewAllVersions);
router.post('/', RecipeController.create);
router.post('/uploadPhoto/:id', RecipeController.uploadPhoto);
router.put('/:name', RecipeController.update);
router.put('/updatePhoto/:id', RecipeController.updatePhoto);
router.delete('/:name', RecipeController.delete);
router.delete('/', RecipeController.deleteAll);
module.exports = router;
