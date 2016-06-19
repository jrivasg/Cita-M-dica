// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');
// user schema
/* Por facilidad de intercambio de datos entre javascript 
y java, se almacena el tiempo en milisegundos*/
var AppointmentSchema = new Schema({
	date: Number,	
	createAt: Number,
	examinationRoom: String,
	nuhsa: String, 
	dateDayTime: Number,
	day: Number
});
// return the model
module.exports = mongoose.model('Appointment', AppointmentSchema);