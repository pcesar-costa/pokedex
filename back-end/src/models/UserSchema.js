const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_FACTOR = 12;

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	valid: { type: Boolean, default: false },
	token: { type: String, required: true },
	created: {
		type: Date,
		default: Date.now,
	},

});

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre("save", function (next) {
	const newUser = this;
	// generate a salt
	bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) return next(err);
		// hash the password using our new salt
		bcrypt.hash(newUser.password, salt, function (errhash, hash) {
			if (errhash) return next(errhash);
			// override the cleartext password with the hashed one
			newUser.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (loginPassword, cb) {
	bcrypt.compare(loginPassword, this.password, (err, isMatch) => {
		if (err) return cb(err, false);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model("User", UserSchema);
