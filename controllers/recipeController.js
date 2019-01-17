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
        let recipes = await Recipe.find({});
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
            let photo = req.file.filename;
            recipe.photo = photo;
            recipe.save();
            res.status(200).json(recipe);
        })
    }catch(e){
        next(new ControllerError(e.message, 400))
    }
};

module.exports = controller;