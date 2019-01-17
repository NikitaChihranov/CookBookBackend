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

    }catch(e){
        next(new ControllerError(e.message, 400))
    }
}
module.exports = controller;