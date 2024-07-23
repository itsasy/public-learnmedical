$(document).ready(function () {

     $.ajaxSetup({
          headers: {
               'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
     });
$("#customer_login_submit").click(function (e) {
     // e.preventDefault();
     var login_form = $("#customer_login");
     jQuery.validator.addMethod("customEmail", function (value, element) {
     	return this.optional(element) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(value);
     }, "Please enter valid email address!");

     // $.validator.addMethod("pwcheck",
     // 	function (value, element) {
     // 		return /^[A-Za-z0-9\d=!\-@._*]+$/.test(value);
     //      }, "Please enter valid password!");
     login_form.validate({
          rules: {
               email: {
                    required: true,
                    maxlength: 320,
                    // customEmail: true
               },
               password: {
                    required: true,
                    minlength: 8,
                    maxlength:20,
                    	// pwcheck:true,
                    // 	// numCharacters: 8,
                    // 	// useLowercase: true,
                    // 	// useUppercase: true,
                    // 	// useNumbers: true,
                    // 	// useSpecial: true
               },
          },
          messages: {
               email: {
                    required: "Please fill an email",
                    customEmail:"Please fill a valid email address",
               },
               password: {
                    required: "Please fill the password",
               },
          }
     });

     if (login_form.valid() === true) {

          var login_form_data = new FormData();
          login_form_data.append('email', $('#email').val());
          login_form_data.append('password', $('#password').val());
          login_form_data.append('device_token', $('#device_token').val());
          login_form_data.append('_token', csrfToken);

          $.ajax({
               url: login_url,
               type: "POST",
               data: login_form_data,
               contentType: false,
               processData: false,
               dataType: 'json',
               success: function (response) {
                    console.log(response.message);
                    if (response.message == 'You are login in wrong portal') {
                         Swal.fire({
                              position: 'center',
                              icon: 'error',
                              title: response.message,
                              showConfirmButton: false,
                              timer: 3000
                         });

                    } else if (response.message == 'User not found, Please try again'){
                         Swal.fire({
                              position: 'center',
                              icon: 'warning',
                              title: response.message,
                              showConfirmButton: false,
                              timer: 3000
                         });
                    }
                    else if (response.message == 'Wrong credentials') {
                         Swal.fire({
                              position: 'center',
                              icon: 'error',
                              title: response.message,
                              showConfirmButton: false,
                              timer: 3000
                         });

                    } else if (response.message == 'Invaild credentials') {
                         Swal.fire({
                              position: 'center',
                              icon: 'error',
                              title: response.message,
                              showConfirmButton: false,
                              timer: 3000
                         });

                    }
                    else{
                         setUserintime(response.user.api_token);
                         // userpointapi('user_login', response.user.api_token);
                         setTimeout(function () {
                              if (response.user.subscription_status !== 0) {
                                window.location.href = dashboard_customer;
                              } else {
                                window.location.href = customer_plan;
                              }

                         }, 2000);
                         Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: response.message,
                              showConfirmButton: false,
                              timer: 1500
                         })
                    }

               }
          });
     }
});

     function setUserintime(apiToken){
          const currentTimestamp = new Date().getTime();

     $.ajax({
          url: sessonTimeinUrl,
          type: 'POST',
          data: {
               in_time: currentTimestamp
          },
          headers: {
               Accept: "application/json",
               Authorization: `Bearer ${apiToken}`,
          },
          success: function (response) {
               console.log('Session time in set successfully.');
          },
          error: function (xhr, status, error) {
               console.log('Error setting session variable.');
          }
     });

}

     

function userpointapi(activity, apiToken) {

     const currentTimestamp = new Date().getTime();
     const userPointData = {
          "activity_type": activity,
          "point": "1",
          "point_time": currentTimestamp,
     };
     console.log('userPointData');
     console.log(userPointData);
     $.ajax({
          url: userpoint_url,
          type: "POST",
          data: { activity_type: activity, point: 1, point_time: currentTimestamp },
          headers: {
               Accept: "application/json",
               Authorization: `Bearer ${apiToken}`,
          },
          success: (response) => {
               console.log('response for user point');
               
               console.log(response);
               
               if (response.message === "Points added successfully") {
                    // Swal.fire({
                    //      position: "center",
                    //      icon: "success",
                    //      title: response.message,
                    //      showConfirmButton: false,
                    //      timer: 1500,
                    // });
               }
          },
          error: (xhr, status, error) => {
               console.log(xhr.responseText);

          },
     });
}

});