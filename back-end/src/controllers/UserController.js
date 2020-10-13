const yup = require("yup");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const UserSchema = require("../models/UserSchema");

class UserController {
	async store(req, res) {
		// create schema
		const schema = yup.object().shape({
			name: yup.string().required(),
			email: yup.string().email().required(),
			password: yup.string().min(6).required(),
		});

		// verify schema == valid
		const schema_validate = await schema.validate(req.body).catch((err) => {
			return { error: err.errors[0] };
		});

		// error to validate schema
		if (schema_validate.error)
			return res.status(400).json({
				sucess: false,
				error: schema_validate.error,
			});

		const { name, email, password } = schema_validate;

		const user = await UserSchema.findOne({ email }).exec(
			async (err, doc) => {
				if (err) {
					return res.status(400).json({
						success: false,
						error: "Oops, something is wrong. Try again later.",
					});
				}
				if (doc) {
					return res.status(400).json({
						success: false,
						error: "User already exists.",
					});
				}

				// create two factor secret
				const twoFactorSecret = speakeasy.generateSecret({
					name: "Pokedex",
				});

				// transform secret into qr code img data
				const qrcode_secret = await qrcode.toDataURL(
					twoFactorSecret.otpauth_url
				);

				// create user in db
				const { _id } = await UserSchema.create({
					name,
					email,
					password,
					valid: false,
					token: twoFactorSecret.base32,
				});

				return res.status(200).json({
					sucess: true,
					msg: "Account created.",
					qr_token: qrcode_secret,
				});
			}
		);
	}
}

module.exports = new UserController();
