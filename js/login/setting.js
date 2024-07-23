$(document).ready(function () {


     $.ajax({
          url: userprofile_url,
          type: "POST",
          contentType: false,
          processData: false,
          dataType: "json",
          headers: {
               "Accept": "application/json",
               "Authorization": `Bearer ${apiToken}`
          },
          success: async (response) => {
               // Log the response for debugging purposes
               console.log(response);
               //debugger;
               // Hide the preloader
               preloader.hide();

               // Check if the password was changed successfully

          },
          error: (xhr, status, error) => {
               // Hide the preloader and log the error message
               preloader.hide();
               console.log(xhr.responseText);
          },
     });
     if (subscritiondetail_url !== '') {
          $.ajax({
               url: subscritiondetail_url,
               type: 'POST',
               data: { "_token": csrfToken },
               dataType: 'json',
               success: function (data) {
                    try {
                         const planoptions = $('.plan-options');

                         if (data.message == 'Subscription not found') {
                              const html = `
          <div class="plan-option1">
            <p class="plan-price"></p>
            <img class="img-fluid" src="${noPlanicon}" alt="No Plan">
            <h2 class="mt-3">No plan</h2>
            <ul class="plan-features"></ul>
          </div>`;
                              const subscribe_btn = `<div class="subscribe">
            <p>To subscribe to a plan, click the button below.</p>
            <button id="subscribe" type="button" class="btn waves-effect waves-light btn-rounded btn-primary btn-primary-theme select-plan-button"> Subscribe </button>
          </div>`;
                              planoptions.append(html);
                              planoptions.after(subscribe_btn);
                              document.getElementById("subscribe").addEventListener("click", subscribeFunction);
                         } else {
                              const subscription_status = data.user_subscription.status;
                              const plans = data.user_subscription;
                              const duration = data.user_subscription.plan.duration;
                              const name = data.user_subscription.plan.name;
                              const description = data.user_subscription.plan.description;
                              const amount = data.user_subscription.plan.amount;
                              const days = data.user_subscription.days;
                              const end_date = data.user_subscription.end_date;
                              const plan_id = data.user_subscription.plan_id;

                              let planduration;
                              switch (duration) {
                                   case 1:
                                        planduration = "1 month";
                                        break;
                                   case 2:
                                        planduration = "3 months";
                                        break;
                                   case 3:
                                        planduration = "6 months";
                                        break;
                                   case 4:
                                        planduration = "1 year";
                                        break;
                                   default:
                                        throw new Error("Invalid plan duration: " + duration);
                              }

                              const html = `
          <div class="plan-option1 mt-3">
            <h3>${name}</h3>
            <p class="price">$ ${amount}</p>
            <p class="month mb-0">${description}</p>
            <p class="month-duration">${planduration}</p>
            <p class="trial-text mb-0 "><b>Payment Due Days</b></p>
            <p class="trial-text mb-0">${days} Days</p>
            <p class="trial-text mb-0">${end_date}</p>
          </div>`;

                              const inactive_subscribe_btn = `<button type="button" id="unsubscribe_inactive" data-plan-id="${plan_id}" class="btn waves-effect waves-light btn-rounded btn-primary btn-primary-theme select-plan-button">Subscription Inactive</button>`;

                              const unsubscribe_btn = `<div class="unsubscribe">
            <div class="gredient-line"></div>
            <h2>Unsubscribe</h2>
            <p class="trial-text">To unsubscribe from your plan, click the button below.</p>
            <button id="unsubscribe" data-plan-id="${plan_id}" class="btn waves-effect waves-light btn-rounded btn-primary btn-primary-theme select-plan-button">Unsubscribe</button>
          </div>`;
                              planoptions.append(html);

                              if (subscription_status === 1) {
                                   planoptions.after(unsubscribe_btn);
                                   document.getElementById("unsubscribe").addEventListener("click", unsubscribeFunction);
                              } else {
                                   planoptions.after(inactive_subscribe_btn);
                              }
                         }
                    } catch (error) {
                         console.error("An error occurred:", error);
                         // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                    }
               },
               error: function (xhr, status, error) {
                    try {
                         console.error("AJAX request failed:", error);
                         console.log(xhr.responseText);
                         // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                    } catch (error) {
                         console.error("An error occurred in the error callback:", error);
                         // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                    }
               },
          });

     }
});

function subscribeFunction(){
     window.location.href = customer_plan;
}
function unsubscribeFunction() {
     const preloader = $('.preloader');
     preloader.show();
     
     $.ajax({
          url: cancelSubscription_url,
          method: "POST",
          data: { "_token": csrfToken },
          headers: {
               "Accept": "application/json",
               "Authorization": "Bearer " + apiToken
          },
          // data: { /* Your data object here */ },
          success: function (response) {
               try {
                    if (response.message == 'Subscription cancelled Successfully') {
                         const planoptions = $('.plan-options');
                         const inactive_subscribe_btn = `<button type="button" id="unsubscribe_inactive" data-plan-id="${response.subscription.plan_id}" class="btn btn-primary">Subscription Inactive</button>`;
                         preloader.hide();
                         $('.unsubscribe').remove();
                         planoptions.after(inactive_subscribe_btn);
                         Swal.fire({
                              position: 'center',
                              icon: 'error',
                              title: response.message,
                              showConfirmButton: false,
                              timer: 3000
                         });
                    } else {
                         throw new Error("Unexpected response from the server");
                    }
               } catch (error) {
                    console.error("An error occurred:", error);
                    // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
               }
          },
          error: function (jqXHR, textStatus, errorThrown) {
               try {
                    preloader.hide();
                    console.error(textStatus, errorThrown);
                    // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
               } catch (error) {
                    console.error("An error occurred in the error callback:", error);
                    // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
               }
          }
     });

}


$(document).ready(() => {
     const passwordForm = $("#change-password-form");
     const submitButton = $("#password_submit");
     const preloader = $('.preloader');
     // jQuery.validator.addMethod("pswcheck",
     //      function (value, element) {
     //           return /^(?=.*[a-z])[A-Za-z0-9\d=!\-@._*]+$/.test(value);
     //      }, "Please enter a strong password with numbers, special and capital characters");

     $.validator.addMethod("pswcheck", function (value) {
          return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
               && /[a-z]/.test(value) // has a lowercase letter
               && /\d/.test(value) // has a digit
     }, "Please enter a strong password with numbers, special and capital characters");

     const serializeFormData = () => {
          const passwordFormData = new FormData();
          passwordFormData.append("current_password", $("#current-password").val());
          passwordFormData.append("password", $("#new-password").val());
          passwordFormData.append("_token", csrfToken);
          return passwordFormData;
     };
  
     submitButton.click(() => {
         
          passwordForm.validate({
              
               rules: {
                    'current-password': {
                         required: true,
                    },
                    'new-password': {
                         required: true,
                         minlength: 8,
                         pswcheck:true,
                         
                    },
                    'confirm-password': {
                         required: true,
                         equalTo: '#new-password'
                    }
               },
               messages: {
                    'current-password': {
                         required: 'Please enter your current password.'
                    },
                    'new-password': {
                         required: 'Please enter a new password.',
                         minlength: 'Your password must be at least 8 characters long.'
                    },
                    'confirm-password': {
                         required: 'Please confirm your new password.',
                         equalTo: 'Your passwords do not match.'
                    }
               },
              
          });

          if (passwordForm.valid()) {
               const passwordFormData = serializeFormData();
               const preloader = $('.preloader');
               preloader.show();
              /* $.ajax({
                    url: changepass_url,
                    type: "POST",
                    data: passwordFormData,
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    headers: {
                         "Accept": "application/json",
                         "Authorization": "Bearer " + apiToken
                    },
                    success: (response) => {
                         console.log(response);
                         //debugger;
                         preloader.hide();
                         if (response.message === "Password changed successfully") {
                              setTimeout(() => {
                                   window.location.href = dashboard_customer;
                              }, 2000);
                              Swal.fire({
                                   position: "center",
                                   icon: "success",
                                   title: response.message,
                                   showConfirmButton: false,
                                   timer: 1500,
                              });
                         } 
                         if(response.message === 'The password is incorrect.'){
                              Swal.fire({
                                   position: "center",
                                   icon: "error",
                                   title: response.message,
                                   showConfirmButton: false,
                                   timer: 1500,
                              });
                              $('.password').val('');
                         } 
                    },
                    error: (xhr, status, error) => {
                         preloader.hide();
                         console.log(xhr.responseText);
                    },
               });*/

               $.ajax({
                    url: changepass_url,
                    type: "POST",
                    data: passwordFormData,
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    headers: {
                         "Accept": "application/json",
                         "Authorization": `Bearer ${apiToken}`
                    },
                    success: async (response) => {
                         // Log the response for debugging purposes
                         console.log(response);

                         // Hide the preloader
                         preloader.hide();

                         // Check if the password was changed successfully
                         if (response.message === "Password changed successfully") {
                              // Wait for 2 seconds before redirecting to the dashboard
                              await new Promise(resolve => setTimeout(resolve, 2000));

                              // Show a success message
                              Swal.fire({
                                   position: "center",
                                   icon: "success",
                                   title: response.message,
                                   showConfirmButton: false,
                                   timer: 1500,
                              });

                              // Redirect to the dashboard
                              window.location.href = dashboard_customer;
                         } else if (response.message === "The password is incorrect.") {
                              // Show an error message and clear the password field
                              Swal.fire({
                                   position: "center",
                                   icon: "error",
                                   title: response.message,
                                   showConfirmButton: false,
                                   timer: 1500,
                              });

                              $('.password').val('');
                         }
                    },
                    error: (xhr, status, error) => {
                         // Hide the preloader and log the error message
                         preloader.hide();
                         console.log(xhr.responseText);
                    },
               });

          }

          

          
     });
});




