const yup = require("yup");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");

const UserSchema = require("../models/UserSchema");

class SessionController {
	async store(req, res) {
		const { type } = req.body;

		// two factor authentication
		if (type == "token") {
			const { user_token, user_code } = req.body;

			// verify JWT token
			const access = await jwt.verify(
				user_token,
				process.env.JWT_SECRET,
				async (err, decoded) => {
					if (err) return { valid: false };

					const user_id = decoded.user_id;
					const user = await UserSchema.findOne({ _id: user_id });

					// verify if 2f is valid
					const valid = speakeasy.totp.verify({
						secret: user.token,
						encoding: "base32",
						token: user_code,
						window: 15,
					});
					return {
						user_id,
						valid,
					};
				}
			);

			if (access.valid) {
				const user_token_authorized = jwt.sign(
					{ user_id: access.user_id, authenticated: true },
					process.env.JWT_SECRET,
					{ expiresIn: process.env.JWT_EXPIRES }
				);
				return res.json({
					success: true,
					user_token: user_token_authorized,
				});
			}
			return res.status(401).json({
				sucess: false,
				error: "Session expired or Two-factor code invalid.",
			});
		} else {
			// login with email and password
			const { email, password } = req.body;
			const user = await UserSchema.findOne({ email });

			if (!user) {
				return res
					.status(401)
					.json({ sucess: false, error: "User doesn't exist." });
			}

			user.comparePassword(password, async (err, isMatch) => {
				if (isMatch) {
					const user_id = user._id;

					// create a jwt token
					const user_token = jwt.sign(
						{ user_id: user._id, authenticated: false },
						process.env.JWT_SECRET,
						{ expiresIn: "5m" }
					);

					return res.json({
						success: true,
						user_token,
					});
				}

				return res
					.status(401)
					.json({ sucess: false, error: "Invalid password." });
			});
		}
	}
}

module.exports = new SessionController();
