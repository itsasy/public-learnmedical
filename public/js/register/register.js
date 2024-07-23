
$("#submit_register").click(function (e) {
	// e.preventDefault();
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	var register_form = $("#register_form");
	jQuery.validator.addMethod("customEmail", function (value, element) {
		return this.optional(element) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(value);
	}, "Please enter valid email address!");

	$.validator.addMethod("pwcheck", function (value) {
		return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
			&& /[a-z]/.test(value) // has a lowercase letter
			&& /\d/.test(value) // has a digit
	}, "Please enter a strong password with numbers, special and capital characters");

	// jQuery.validator.addMethod("pwcheck",function (value, element) {
	// 		alert('fadsfsd');
	// 	return this.optional(element) || /^(?=.*[a-z])[A-Za-z0-9\d=!\-@._*]+$/.test(value);
	// 	}, "Please enter a strong password with numbers, special and capital characters");

	jQuery.validator.addMethod("lettersonly", function (value, element) {
		return this.optional(element) || /^[a-z\s]+$/i.test(value);
	}, "Only alphabetical characters");

	// jQuery.validator.addMethod("numbersonly", function (value, element) {
	// 	return this.optional(element) || /^(\+36)[0-9]{9}$/i.test(value);
	// }, "Only numerical characters");


	register_form.validate({
		rules: {
			first_name: {
				required: true,
				lettersonly: true
			},
			last_name: {
				required: true,
				lettersonly: true
			},
			email: {
				required: true,
				maxlength: 320,
				remote: {

					url: checkEmail,
					type: "post",
					data: {
						email: function () {
							return $("#email").val();
						}
					},
					// '_token':$('meta[name="csrf_token"]').attr('content'),
				}
				// customEmail: true
			},
			// phone: {
			// 	required: true,
			// 	number: true,

				// matches: "[0-9]+",
				// //  minlength: 10,
				// //   maxlength: 10 
			// },

			password: {
				required: true,
				pwcheck: true,
				maxlength: 20,

					// numCharacters: 8,
					// useLowercase: true,
					// useUppercase: true,
					// useNumbers: true,
					// useSpecial: true

			},
			password_confirmation: {
				minlength: 8,
				equalTo: "#password"
			}
		},
		messages: {

			first_name: {
				required: "Please fill the first name",
			},
			last_name: {
				required: "Please fill the last name",
			},
			email: {
				required: "Please fill an email",
				remote: 'Email already in use , please try another email',
				// customEmail:"Please fill a valid email address",
			},
			// phone: {
			// 	required: "Please fill the phone number",
			// 	number: "Please fill a valid phone number",

			// },
			password: {
				required: "Please fill the password",
			},
			password_confirmation: {
				required: "Please confirm the password",
				equalTo: "Your passwords do not match",
			},
		}
	});

	if (register_form.valid() === true) {

		var first_name = $('#first_name').val()
		var register_form_data = new FormData();
		register_form_data.append('first_name', first_name);
		register_form_data.append('last_name', $('#last_name').val());
		register_form_data.append('email', $('#email').val());
		register_form_data.append('password', $('#password').val());
		// register_form_data.append('phone', $('#phone').val());
		register_form_data.append('password_confirmation', $('#password_confirmation').val());
		register_form_data.append('_token', csrf_token);

		$.ajax({
			url: register_url,
			type: "POST",
			data: register_form_data,
			contentType: false,
			processData: false,
			dataType: 'json',
			success: function (response) {
				
				if (response.message == 'User Registered Successfully') {
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: "User registered successfully",
						showConfirmButton: false,
						timer: 3000
					});

					setTimeout(function () {
						window.location.href = login;
					}, 2000);
				} else if(response.message == 'The email has already been taken.'){
					
					Swal.fire({
						position: 'center',
						icon: 'error',
						title: "Email has already been taken",
						showConfirmButton: false,
						timer: 3000
					});
				}else {
					Swal.fire({
						position: 'center',
						icon: 'error',
						title: "issue in registering user",
						showConfirmButton: false,
						timer: 1500
					})
				}

			}
		});
	}
});