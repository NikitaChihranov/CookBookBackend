let ControllerError = require('../errors/controllerError');
let Recipe = require('../models/recipe');
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
        let recipes = await Recipe.find({}).sort({dateOfCreation: 'asc'});
        res.status(200).json(recipes);
    }catch(e){
        next(new ControllerError(e.message, 400))
    }
};
controller.findByName = async(req, res, next) => {
    try{
        let name = req.body.name;
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
            let recipe = await Recipe.create(req.body);
            res.status(200).json(recipe);
        }
    }catch(e){
        next(new ControllerError(e.message, 400))
    }
};
controller.uploadPhoto = async(req, res, next) => {
    try{
        let recipe = await Recipe.findOne({_id: req.params.id});
        upload(req, res, (err) => {
            if(err) console.log(err);
            recipe.photo = req.file.filename;
            recipe.save();
            res.status(200).json(recipe);
        })
    }catch(e){
        next(new ControllerError(e.message, 400))
    }
};
controller.update = async (req, res, next) => {
    try {
        let recipeWithPhotos = await Recipe.findOne({name: req.params.name});
        let photo1 = recipeWithPhotos.photo;
        fs.unlink('./photos/' + photo1, (err) => (err));
        let recipe = await Recipe.findOneAndUpdate(req.params.name, req.body, {new: true});
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
        let recipe = await Recipe.findOneAndRemove({_id: req.params.id});
        res.status(200).json(recipe);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.deleteAll = async (req, res, next) => {
    try{
        let recipesWithPhotos = await Recipe.find({});
        let recipes = await Recipe.deleteMany({}, (err) => {});
        for(let recipe of recipesWithPhotos) {
            fs.unlink('./photos/' + recipe.photo, (err) => (err));
        }
        res.status(200).json(recipes);
        console.log(recipes);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
module.exports = controller;