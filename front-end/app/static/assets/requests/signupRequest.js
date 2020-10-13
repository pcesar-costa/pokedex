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
			var name = $("input#name").val();
			var email = $("input#email").val();
			var password = $("input#password").val();

			var firstName = name; // For Success/Failure Message
			// Check for white space in name for Success/Fail message
			if (firstName.indexOf(" ") >= 0) {
				firstName = name.split(" ").slice(0, -1).join(" ");
			}
			$this = $("#submitButton");

			$this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages

			$.ajax({
				url: "https://api-pokedex-pedrocosta.herokuapp.com/users",
				type: "POST",
				data: JSON.stringify({
					name: name,
					email: email,
					password: password,
				}),
				contentType: "application/json; charset=utf-8",
				cache: false,
				success: function (data) {
					// Success message
					$("#success").html("<div class='alert alert-success'>");
					$("#success > .alert-success")
						.html(
							"<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;"
						)
						.append("</button>");
					$("#success > .alert-success").append(
						"<strong>Account created. Redirecting...</strong>"
					);
					$("#success > .alert-success").append("</div>");
					//clear all fields
					$("#contactForm").trigger("reset");

					$.redirect(
						"/enable-two-factor",
						{ qr_token: data.qr_token },
						"GET"
					);
				},
				error: function (xhr, status, error) {
					var message = JSON.parse(xhr.responseText);

					// Fail message
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
					//clear all fields
					//$("#contactForm").trigger("reset");
				},
				complete: function () {
					setTimeout(function () {
						$this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
					}, 1000);
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
