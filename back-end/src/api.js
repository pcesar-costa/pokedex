const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes");

class Api {
	constructor() {
		this.server = express();

		this.mongoconnect();
		this.middlewares();
		this.server.use(routes);
	}

	mongoconnect() {
		mongoose
			.connect(process.env.MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false,
			})
			.catch((error) => {
				console.log(error);
			});

		mongoose.connection.on("error", (error) => {
			console.log("mongoose error:", error);
		});
	}

	middlewares() {
		this.server.use(cors());
		this.server.use(helmet()); // Security
		this.server.use(express.json()); // POST Requests
		// this.server.use(express.static(__dirname + '/../public'));
	}
}

module.exports = new Api().server;
