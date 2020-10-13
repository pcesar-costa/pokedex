const jwt = require("jsonwebtoken");
var objectid = require("mongoose").Types.ObjectId;

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

		if (
			decoded_token.authenticated &&
			objectid.isValid(decoded_token.user_id)
		) {
			next();
		} else {
			throw "Invalid authentication";
		}
	} catch {
		return res.status(401).json({
			sucess: false,
			error: "Unauthorized",
		});
	}
};
