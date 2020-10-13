const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	generation: {
		type: Number,
		required: true,
	},
	types: {
		type: String,
		required: true,
	},
	attacks: {
		type: Number,
		required: true,
	},
});

PokemonSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Pokemons", PokemonSchema);
