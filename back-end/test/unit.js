var should = require("should");
var request = require("request");
var chai = require("chai");
var expect = chai.expect;

var base_url = "http://localhost:3333";

describe("Teste API Pokedex", function () {
	var form = {
		name: "Test",
		email: `test-${Math.random() * 10}@test-user.com`,
		password: `test-${Math.random() * 10}`,
	};

	it("Criar usuário", function (done) {
		request(
			{
				url: `${base_url}/users`,
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: form,
				json: true,
			},
			(error, res, body) => {
				_body = body;
				expect(res.statusCode).to.equal(200);
				body.should.have.property("qr_token");
				done();
			}
		);
	});

	it("Criar sessão - login", function (done) {
		request(
			{
				url: `${base_url}/sessions`,
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: {
					email: form.email,
					password: form.password,
				},
				json: true,
			},
			(error, res, body) => {
				expect(res.statusCode).to.equal(200);
				body.should.have.property("user_token");
				form["user_token"] = body.user_token;
				console.log(form);
			}
		);
	});
});
