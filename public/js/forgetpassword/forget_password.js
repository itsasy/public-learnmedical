$(document).ready(function () {
$.ajaxSetup({
     headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
     }
});
$("#forget_password_form_submit").click(function (e) {
     const preloader = $('.preloader');
     
     // e.preventDefault();
     var forget_password_form = $("#forget_password_form");
     // jQuery.validator.addMethod("customEmail", function (value, element) {
     // 	return this.optional(element) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(value);
     // }, "Please enter valid email address!");
     forget_password_form.validate({
          rules: {

               email: {
                    required: true,
                    // customEmail: true
               },

          },
          messages: {

               email: {
                    required: "Please fill an email",
                    // customEmail:"Please fill a valid email address",
               },

          }
     });

     if (forget_password_form.valid() === true) {
          preloader.show();
          var forget_password_form = new FormData();
          forget_password_form.append('email', $('#email').val());
          forget_password_form.append('_token', csrfToken);
          console.log(forget_password_form);
          $.ajax({
               url: forget_password_url,
               type: "POST",
               data: forget_password_form,
               contentType: false,
               processData: false,
               dataType: 'json',
               success: function (response) {
                    try {
                         preloader.hide();
                         if (response) {
                              Swal.fire({
                                   position: 'center',
                                   icon: 'success',
                                   title: "Reset Password link sent to your email",
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
                              });
                         }
                    } catch (error) {
                         console.error("An error occurred in the success callback:", error);
                         Swal.fire({
                              position: 'center',
                              icon: 'error',
                              title: "An error occurred while processing your request",
                              showConfirmButton: false,
                              timer: 1500
                         });
                    }
               },
               error: function (xhr, status, error) {
                    console.error("AJAX request failed:", error);
                    Swal.fire({
                         position: 'center',
                         icon: 'error',
                         title: "AJAX request failed",
                         showConfirmButton: false,
                         timer: 1500
                    });
               }
          });

          /*$.ajax({
               url: forget_password_url,
               type: "POST",
               data: forget_password_form,
               contentType: false,
               processData: false,
               dataType: 'json',
               success: function (response) {
                    preloader.hide();
                    if (response) {
                         Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: "Reset Password link sent to your email",
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
          });*/
     }
});
});