const yup = require("yup");
const jwt = require("jsonwebtoken");
const objectid = require("mongodb").ObjectID;

const PokemonSchema = require("../models/PokemonSchema");

//create schema
const schema = yup.object().shape({
	name: yup.string().min(1).required(),
	generation: yup.number().min(1).required(),
	types: yup.string().min(1).required(),
	attacks: yup.number().min(1).required(),
});

class PokemonController {
	async store(req, res) {
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

		// prepare and insert data into db
		const { id, name, generation, types, attacks } = schema_validate;
		const on_insert = {
			$setOnInsert: {
				name,
				generation,
				types,
				attacks,
			},
		};
		const created = await PokemonSchema.findOneAndUpdate(
			{ name: name },
			on_insert,
			{ new: true, upsert: true, rawResult: true, _id: false }
		);

		// verify if exists
		if (created.lastErrorObject.updatedExisting)
			return res.status(400).json({
				sucess: false,
				error: "Pokemon already exists",
			});

		return res.status(200).json({
			sucess: true,
			data: created.value,
		});
	}

	async index(req, res) {
		if ("id" in req.query) {
			const id_ = req.query.id;

			await PokemonSchema.findOne(
				{ _id: id_ },
				{ name: 1, types: 1, generation: 1, attacks: 1 }
			).exec((err, doc) => {
				if (err) {
					return res
						.status(400)
						.json({ success: false, error: "Invalid ObjectId." });
				}
				if (!doc) {
					return res
						.status(400)
						.json({ success: false, error: "Pokemon not found." });
				}
				return res.json({ success: true, data: doc });
			});
		} else {
			const query = await PokemonSchema.find(
				{},
				{ name: 1, types: 1, generation: 1, attacks: 1 }
			).exec((err, doc) => {
				if (err) {
					return res.status(500).json({ success: false, data: {} });
				}
				return res.json(doc);
			});
		}
	}

	async update(req, res) {
		console.log(req.body);
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

		// prepare and insert data into db
		const { id, name, generation, types, attacks } = schema_validate;
		const updated = await PokemonSchema.findOneAndUpdate(
			{ _id: id },
			{ name, generation, types, attacks },
			{ new: true, upsert: false }
		).exec((err, doc) => {
			if (err) {
				return res
					.status(400)
					.json({ success: false, error: "Invalid ObjectId." });
			}
			if (!doc) {
				return res
					.status(400)
					.json({ success: false, error: "Pokemon not found." });
			}
			return res.json({ success: true, data: doc });
		});
	}

	async destroy(req, res) {
		const { id } = req.body;

		await PokemonSchema.findOneAndDelete({ _id: id }).exec((err, doc) => {
			if (err) {
				return res
					.status(400)
					.json({ success: false, error: "Invalid ObjectId." });
			}
			if (!doc) {
				return res
					.status(400)
					.json({ success: false, error: "Pokemon not found." });
			}
			return res.json({ success: true, msg: "Pokemon deleted." });
		});
	}
}

module.exports = new PokemonController();
