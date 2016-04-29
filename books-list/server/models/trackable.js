/**
 * Created by paulocristo on 25/10/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrackableSchema = new Schema({
    //id: ObjectId,
    name: String,
    description: String,
    owner: String,
    creationDate: String,
    type: String,//1-'person','3-animal','2-object',
    privacy: String,//public, private, protected
    unlockCode: String


    /*type: {
        validator: function(v) {
            return v==='animal' || v==='person' || v==='object';
        },
        message: '{VALUE} is not a valid trackable type!'
    }*/
});

/*TrackableSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.passwordHash
    return obj;
};*/

module.exports = mongoose.model('Trackable', TrackableSchema);


