/**
 * Created by paulocristo on 25/10/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
    //_id: String,
    deviceId: String,
    description: String,
    owner: String
});

module.exports = mongoose.model('Device', DeviceSchema);

