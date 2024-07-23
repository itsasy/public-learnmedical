$(document).ready(function () {
     $.ajaxSetup({
          headers: {
               'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
     });
$("#reset_password_submit").click(function (e) {
     var reset_password_form = $("#reset_password_form");
     // jQuery.validator.addMethod("customEmail", function (value, element) {
     // 	return this.optional(element) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(value);
     // }, "Please enter valid email address!");

     $.validator.addMethod("pwcheck", function (value) {
          return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
               && /[a-z]/.test(value) // has a lowercase letter
               && /\d/.test(value) // has a digit
     }, "Please enter a strong password with numbers, special and capital characters");

     reset_password_form.validate({
          rules: {

               email: {
                    required: true,
				maxlength: 320,
               },
               password: {
                    required: true,
                    pwcheck: true,
                    maxlength: 20,
               },
               password_confirmation: {
                    minlength: 8,
                    equalTo: "#password"
               }

          },
          messages: {

               email: {
                    required: "Please fill an email",
                    // customEmail:"Please fill a valid email address",
               },
               password: {
                    required: "Please fill the password",
               },
               password_confirmation: {
                    required: "Please confirm the password",
                    equalTo: "Your passwords do not match",
               },

          }
     });

     if (reset_password_form.valid() === true) {

          var reset_password_form = new FormData();
          reset_password_form.append('email', $('#email').val());
          reset_password_form.append('password', $('#password').val());
          reset_password_form.append('password_confirmation', $('#password_confirmation').val());
          reset_password_form.append('token', $('#token').val());
          //reset_password_form.append('_token', csrfToken);
          console.log(reset_password_form);
          $.ajax({
               url: reset_password_route,
               type: "POST",
               data: reset_password_form,
               contentType: false,
               processData: false,
               dataType: 'json',
               success: function (response) {
                    console.log(response)
                    if (response.msg =="Reset password Successfully") {
                         Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: "Your password has been resetted",
                              showConfirmButton: false,
                              timer: 3000
                         });

                         setTimeout(function () {
                              window.location.href = login;
                         }, 2000);
                    } else {
                         Swal.fire({
                              position: 'center',
                              icon: 'error',
                              title: "Your facing some issue",
                              showConfirmButton: false,
                              timer: 1500
                         })
                    }

               }
          });
     }
});
});