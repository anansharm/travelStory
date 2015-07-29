var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({

	name: String,
	username: { type: String, required: true, index:{unique: true}},
	password: { type: String, required: true, select: false}
});


userSchema.pre('save', function(next){ //Pre is a method of mongoose

	var user = this;

	if(!user.isModified('password')) return next(); //if password is not modifuied go to next matching route
	bcrypt.hash(user.password,null,null, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});
userSchema.methods.comparePassword = function(password){
	var user = this;
	return bcrypt.compareSync(password, user.password);
}
module.exports = mongoose.model('User', userSchema);