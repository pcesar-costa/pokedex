// Libs
const express = require("express");
const path = require("path");

// Controllers
const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");
const PokemonController = require("./controllers/PokemonController");

// Auth middleware
const auth = require("./config/auth");

// Main vars
const routes = express.Router();

// API Routes
routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.post("/pokemon", auth, PokemonController.store);
routes.get("/pokemon", auth, PokemonController.index);
routes.put("/pokemon", auth, PokemonController.update);
routes.delete("/pokemon", auth, PokemonController.destroy);

//The 404 Route (ALWAYS Keep this as the last route)
routes.get("*", function (req, res) {
	return res
		.status(404)
		.json({ success: false, status: 404, error: "Route not found" });
});

module.exports = routes;
