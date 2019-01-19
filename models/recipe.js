let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RecipeSchema = new Schema({
    name: String,
    ingredients: String,
    photo: String,
    text: String,
    author: String,
    dateOfCreation: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('About', RecipeSchema);