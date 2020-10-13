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
			var twofactorcode = $("input#twofactorcode").val();

			$this = $("#submitButton");

			$this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages

			$.ajax({
				url: "https://api-pokedex-pedrocosta.herokuapp.com/sessions",
				type: "POST",
				data: JSON.stringify({
					user_token: Cookies.get("user_token"),
					user_code: twofactorcode,
					type: "token",
				}),
				contentType: "application/json; charset=utf-8",
				cache: false,
				success: function (data) {
					$.redirect(
						"/session",
						{ user_token: data.user_token },
						"POST"
					);
				},
				error: function (xhr, status, error) {
					var message = JSON.parse(xhr.responseText);

					// Fail message
					$("#success").html("<div class='alert alert-danger'>");
					$("#success > .alert-danger").append(
						$("<strong>").text(message.error)
					);
					$("#success > .alert-danger").append("</div>");
					//clear all fields
					$("#contactForm").trigger("reset");
					Cookies.remove("user_token");

					setTimeout(function () {
						window.location.reload();
					}, 2500);
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
