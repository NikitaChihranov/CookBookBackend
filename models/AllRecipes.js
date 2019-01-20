let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RecipeSchema = new Schema({
    history:[
        {
            type: Schema.ObjectId,
            ref: 'Recipe'
        }
    ]
});
module.exports = mongoose.model('AllRecipes', RecipeSchema);