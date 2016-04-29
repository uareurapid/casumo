/**
 * Created by paulocristo on 27/04/16.
 */



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
    //id: ObjectId,
    name: String,
    gender: String

});

/*TrackableSchema.methods.toJSON = function() {
 var obj = this.toObject();
 delete obj.passwordHash
 return obj;
 };*/

module.exports = mongoose.model('Author', AuthorSchema);