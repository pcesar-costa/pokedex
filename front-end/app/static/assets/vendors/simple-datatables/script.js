$(document).on("click", ".open-DeleteDialog", function (e) {
	const myBookId = $(this).data("id");
	$(".modal-body #in-delete-id").val(myBookId);

	$("#delete").click((e) => {
		e.preventDefault();
		const delete_id = $(".modal-body #in-delete-id");

		$.ajax({
			url: "https://api-pokedex-pedrocosta.herokuapp.com/pokemon",
			type: "DELETE",
			headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
			data: JSON.stringify({
				id: delete_id.val(),
			}),
			contentType: "application/json; charset=utf-8",
			cache: false,
			success: function (data) {
				setTimeout(function () {
					window.location.reload();
				}, 1000);
			},
			error: function (xhr, status, error) {
				if (xhr.status == 401) {
					Cookies.remove("user_token");
					setTimeout(function () {
						window.location.reload();
					}, 500);
				}
				var message = JSON.parse(xhr.responseText);

				$("#success").html("<div class='alert alert-danger'>");
				$("#success > .alert-danger")
					.html(
						"<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;"
					)
					.append("</button>");
				$("#success > .alert-danger").append(
					$("<strong>").text(message.error)
				);
				$("#success > .alert-danger").append("</div>");
			},
		});
	});
});

$(document).on("click", ".open-EditDialog", function (e) {
	$(".modal-body #edit-id").val($(this).data("id"));
	$(".modal-body #pokemon-name-modal").val($(this).data("name"));
	$(".modal-body #pokemon-generation-modal").val($(this).data("generation"));
	$(".modal-body #pokemon-types-modal").val($(this).data("types"));
	$(".modal-body #pokemon-attacks-modal").val($(this).data("attacks"));

	// console.log($(this).data());

	//$("#edit").click((e) => {
	//	e.preventDefault();
	//	const edit_id = $(".modal-body #edit-id");
	//});
});

$(function () {
	$(
		"#contactForm input,#contactForm textarea,#contactForm button"
	).jqBootstrapValidation({
		preventSubmit: true,
		submitError: function ($form, event, errors) {
			// additional error messages or events
		},
		submitSuccess: function ($form, event) {
			event.preventDefault(); // prevent default submit behaviour
			// get values from FORM
			var form_data = {
				id: $("input#edit-id").val(),
				name: $("input#pokemon-name-modal").val(),
				generation: $("input#pokemon-generation-modal").val(),
				types: $("input#pokemon-types-modal").val(),
				attacks: $("input#pokemon-attacks-modal").val(),
			};
			console.log(JSON.stringify(form_data));

			$this = $("#submitButton");
			$this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages

			$.ajax({
				url: "https://api-pokedex-pedrocosta.herokuapp.com/pokemon",
				type: "PUT",
				headers: {
					Authorization: `Bearer ${Cookies.get("user_token")}`,
				},
				data: JSON.stringify(form_data),
				contentType: "application/json; charset=utf-8",
				cache: false,
				success: function (data) {
					setTimeout(function () {
						window.location.reload();
					}, 500);
				},
				error: function (xhr, status, error) {
					var message = JSON.parse(xhr.responseText);
					if (xhr.status == 401) {
						Cookies.remove("user_token");
						setTimeout(function () {
							window.location.reload();
						}, 500);
					}
					// Fail message
					$("#success-edit").html("<div class='alert alert-danger'>");
					$("#success-edit > .alert-danger").append(
						$("<strong>").text(message.error)
					);
					$("#success-edit > .alert-danger").append("</div>");
				},
				complete: function () {
					setTimeout(function () {
						$this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
					}, 100);
				},
			});
		},
		filter: function () {
			return $(this).is(":visible");
		},
	});

	$('a[data-toggle="tab"]').click(function (e) {
		e.preventDefault();
		$(this).tab("show");
	});
});

/*When clicking on Full hide fail/success boxes */
$("#name").focus(function () {
	$("#success").html("");
});

$(document).on("click", "#logout-btn", function (e) {
	Cookies.remove("user_token");
	window.location.href = "/login";
});

$(document).on("click", ".open-AddDialog", function (e) {
	console.log("Oi");
});

$(function () {
	$(
		"#contactFormAdd input,#contactFormAdd textarea,#contactFormAdd button"
	).jqBootstrapValidation({
		preventSubmit: true,
		submitError: function ($form, event, errors) {
			// additional error messages or events
		},
		submitSuccess: function ($form, event) {
			event.preventDefault(); // prevent default submit behaviour
			// get values from FORM
			var form_data = {
				name: $("input#pokemon-name-addmodal").val(),
				generation: $("input#pokemon-generation-addmodal").val(),
				types: $("input#pokemon-types-addmodal").val(),
				attacks: $("input#pokemon-attacks-addmodal").val(),
			};
			console.log(JSON.stringify(form_data));

			$this = $("#submitButtonAdd");
			$this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages

			$.ajax({
				url: "https://api-pokedex-pedrocosta.herokuapp.com/pokemon",
				type: "POST",
				headers: {
					Authorization: `Bearer ${Cookies.get("user_token")}`,
				},
				data: JSON.stringify(form_data),
				contentType: "application/json; charset=utf-8",
				cache: false,
				success: function (data) {
					setTimeout(function () {
						window.location.reload();
					}, 500);
				},
				error: function (xhr, status, error) {
					var message = JSON.parse(xhr.responseText);
					console.log(xhr.status);
					if (xhr.status == 401) {
						Cookies.remove("user_token");
						setTimeout(function () {
							window.location.reload();
						}, 500);
					}
					// Fail message
					$("#success-add").html("<div class='alert alert-danger'>");
					$("#success-add > .alert-danger").append(
						$("<strong>").text(message.error)
					);
					$("#success-add > .alert-danger").append("</div>");
				},
				complete: function () {
					setTimeout(function () {
						$this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
					}, 100);
				},
			});
		},
		filter: function () {
			return $(this).is(":visible");
		},
	});

	$('a[data-toggle="tab"]').click(function (e) {
		e.preventDefault();
		$(this).tab("show");
	});
});
