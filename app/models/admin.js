var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// admin schema 
var AdminSchema   = new Schema({
	name: String,
	adminName: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false }
});

// hash the password before the admin is saved
AdminSchema.pre('save', function(next) {
	var admin = this;

	// hash the password only if the password has been changed or admin is new
	if (!admin.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(admin.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		admin.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
AdminSchema.methods.comparePassword = function(password) {
	var admin = this;

	return bcrypt.compareSync(password, admin.password);
};

module.exports = mongoose.model('admin', AdminSchema);