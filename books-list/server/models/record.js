/**
 * Created by paulocristo on 25/10/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordSchema = new Schema({
    //id: ObjectId,
    name: String,//name of the place
    description: String,//some description
    latitude: String,
    longitude: String,
    time: Date,//'time of the record',
    trackableId: String,
    deviceId: String//'the device that sent the record
});

module.exports = mongoose.model('Record', RecordSchema);

