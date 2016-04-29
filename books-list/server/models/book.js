/**
 * Created by paulocristo on 27/04/16.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({

    index: {type: 'Number', default: 1, required: true},
    name: String,
    genre: String,
    author: String,
    publishDate: { type: 'Date', default: Date.now, required: true },

    authorInfo: {
      name : String,
      gender: String
    }

});

//BookSchema.virtual('recid').get(function() { return this._id; });


module.exports = mongoose.model('Book', BookSchema);