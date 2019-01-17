let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RecipeSchema = new Schema({
    dish: String,
    ingredients: String,
    photo: String,
    text: String,
    author: String,
    text: String
    dateOfCreation: new Date()
});

module.exports = mongoose.model('About', RecipeSchema);