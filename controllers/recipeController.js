let ControllerError = require('../errors/controllerError');
let Recipe = require('../models/recipe');
let AllRecipes = require('../models/AllRecipes');
let fs = require('fs');
let multer = require('multer');
let path = require('path');
let storageEngine = multer.diskStorage({
    destination: path.join(__dirname, '../public/photos'),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({
    storage: storageEngine,
    limits: {fileSize: 200000000}
}).single('photo');
let controller = {};
controller.findAll = async(req, res, next) => {
    try{
        let recipes = [];
        let recipesToAdd = await AllRecipes.find({});
        for(let recipe of recipesToAdd ){
            let length = recipe.history.length;
            let id = recipe.history[length-1];
            let recipe1 = await Recipe.findOne({_id: id});
            recipes.push(recipe1);
        }
        res.status(200).json(recipes);
    }catch(e){
        next(new ControllerError(e.message, 400))
    }
};
controller.viewAllVersions = async(req, res, next) => {
    try{
        let recipes = [];
        let ids = [];
        let Allrecipes = await AllRecipes.findOne({history: req.params.id});
        for(let recipe of Allrecipes.history){
            ids.push(recipe);
        }
        for(let id of ids){
            let recipe = await Recipe.findOne({_id: id});
            recipes.push(recipe);
        }
        console.log(ids);
        console.log(recipes);
        res.status(200).json(recipes);
    }catch(e){
        next(new ControllerError(e.message, 400))
    }
};
controller.findByName = async(req, res, next) => {
    try{
        let name = req.params.name;
        let recipe = await Recipe.findOne({name});
        res.status(200).json(recipe);
    }catch(e){
        next(new ControllerError(e.message, 400))
    }
};
controller.create = async(req, res, next) => {
    try{
        let name = req.body.name;
        let alreadyExists = await Recipe.findOne({name});
        if(alreadyExists) console.log('Recipe with such name already exists');
        else{
            let createdRecipe = await Recipe.create(req.body);
            let recipe = await AllRecipes.create({});
            recipe.history.push(createdRecipe);
            recipe.save();
            res.status(200).json(recipe);
        }
    }catch(e){
        next(new ControllerError(e.message, 400))
    }
};
controller.uploadPhoto = async(req, res, next) => {
    try{
        let recipeAll = await AllRecipes.findOne({_id: req.params.id});
        let recipe = await Recipe.findOne({_id: recipeAll.history[0]});
        upload(req, res, (err) => {
            if(err) console.log(err);
            if(req.file) {
                recipe.photo = req.file.filename;
                recipe.save();
                recipeAll.save();
                res.status(200).json(recipe);
            }
            else{
                next();
            }
        })
    }catch(e){
        next(new ControllerError(e.message, 400))
    }
};
controller.update = async (req, res, next) => {
    try {
        let recipeWithPhotos = await Recipe.findOne({name: req.params.name});
        console.log(recipeWithPhotos);
        let recipe = await Recipe.create(req.body);
        let allrecipe = await AllRecipes.findOne({history: recipeWithPhotos._id});
        allrecipe.history.push(recipe._id);
        allrecipe.save();
        res.status(200).json(recipe);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.updatePhoto = async (req, res, next) => {
    try {
        let recipeToUpdate = await Recipe.findOne({_id: req.params.id});
        upload(req, res, (err) => {
            if (err) console.log(err);
            recipeToUpdate.photo = req.file.filename;
            recipeToUpdate.save();
            res.status(200).json(recipeToUpdate);
        });
    }catch(e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.delete = async (req, res, next) => {
    try{
        let recipeWithPhoto = await Recipe.findOne({name: req.params.name});
        fs.unlink('./photos/' + recipeWithPhoto.photo, (err) => (err));
        let recipe = await Recipe.findOneAndRemove({name: req.params.name});
        res.status(200).json(recipe);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.deleteAll = async (req, res, next) => {
    try{
        let recipesWithPhotos = await Recipe.find({});
        await AllRecipes.deleteMany({}, (err) => {});
        let recipes = await Recipe.deleteMany({}, (err) => {});
        for(let recipe of recipesWithPhotos) {
            if(recipe.photo!=='') {
                fs.unlink('./public/photos/' + recipe.photo, (err) => (err));
            }
        }
        res.status(200).json(recipes);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
module.exports = controller;