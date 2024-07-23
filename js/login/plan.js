$(document).ready(function () {

     $.ajaxSetup({
          headers: {
               'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
     });
     // var lessonCounter = 0;
     if (plan_url !== '') {

          $.ajax({
               url: plan_url,
               dataType: 'json',
               success: function (data) {
                    try {
                         const plans = data.plans;
                         if (!Array.isArray(plans)) {
                              throw new Error("Invalid plans data. Expected an array.");
                         }

                         const planoptions = $('.plan-options');
                         plans.forEach(plan => {
                              const { name, amount, description, duration, id } = plan;
                              let planduration;
                              switch (duration) {
                                   case 1:
                                        planduration = "1 Month";
                                        break;
                                   case 3:
                                        planduration = "3 Months";
                                        break;
                                   case 6:
                                        planduration = "6 Months";
                                        break;
                                   case 12:
                                        planduration = "1 Year";
                                        break;
                                   default:
                                        throw new Error("Invalid plan duration: " + duration);
                              }

                              const html = `
          <label class="plan-option pricing-white-section mt-3">
            <input style="display:none;" type="radio" class="selectedsubscription plan-radio" name="subscription-plan[]" value="${id}">
            <p class="plan-name">${name}</p>
            <p class="month-duration">${planduration}</p>
            <p class="month">${description}</p>
            <div class="gredient-line"></div>          
            <p class="price">$ ${amount}</p>
            <p class="trial-text">per 1 month after<br> 3 day trial</p>
            <button type="button" class="btn waves-effect waves-light btn-rounded btn-primary btn-primary-theme select-plan-button"> Select </button>
          </label>
        `;
                              planoptions.append(html);
                         });
                         selectplan(); // Call the function after all plans are created
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
  function selectedsubscripton_plan(id){
       console.log("id selected subscription" + id);
    /* $.ajax({
          url: selected_plan,
          data: { "id": id},
          cache: false,
          processData: false,
          dataType: "json",
          success: function (data) {
               console.log(data);
              
          }
     })*/
       $.ajax({
            type: "POST",
            url: selected_plan,
            data: {
                 id: id,
            },
            dataType: "json",
            success: function (response) {
                 try {
                      console.log(response);

                      let planduration;
                      switch (response.message.duration) {
                           case 1:
                                planduration = "1 Month";
                                break;
                           case 3:
                                planduration = "3 Months";
                                break;
                           case 6:
                                planduration = "6 Months";
                                break;
                           case 12:
                                planduration = "1 Year";
                                break;
                           default:
                                throw new Error("Invalid plan duration: " + response.message.duration);
                      }

                      $('#plan_name').text('' + response.message.name);
                      $('#plan_duration').text('' + planduration);
                      $('#plan_amount').text('$' + response.message.amount);

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
function Plan_details(){
     if (plan_url !== '') {
         

          $.ajax({
               url: plan_url,
               dataType: 'json',
               success: function (data) {
                    try {
                         const plans = data.plans;
                         const planoptions = $('.plan-options');
                         plans.forEach(plan => {
                              const { name, amount, description, duration, id } = plan;
                              let planduration;
                              switch (duration) {
                                   case 1:
                                        planduration = "1 Month";
                                        break;
                                   case 3:
                                        planduration = "3 Months";
                                        break;
                                   case 6:
                                        planduration = "6 Months";
                                        break;
                                   case 12:
                                        planduration = "1 Year";
                                        break;
                                   default:
                                        throw new Error("Invalid plan duration: " + duration);
                              }
                              const html = `
          <label class="plan-option pricing-white-section mt-3">
            <input style="display:none;" type="radio" class="selectedsubscription plan-radio" name="subscription-plan[]" value="${id}">
            <p class="plan-name">${name}</p>
            <p class="month-duration">${planduration}</p>
            <p class="month">${description}</p>
            <div class="gredient-line"></div>          
            <p class="price">$ ${amount}</p>
            <p class="trial-text">per 1 month after<br> 3 day trial</p>
            <button type="button" class="btn waves-effect waves-light btn-rounded btn-primary btn-primary-theme select-plan-button"> Select </button>
          </label>
        `;
                              planoptions.append(html);
                         });
                         selectplan(); // Call the function after all plans are created
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
}
function selectplan() {
     const selectButtons = document.querySelectorAll('.select-plan-button');
     selectButtons.forEach(selectButton => {
          selectButton.addEventListener('click', function () {
               const radioInput = this.parentNode.querySelector('.selectedsubscription');
               radioInput.checked = true;
               const selectedRadioButton = document.querySelector('input[name="subscription-plan[]"]:checked');
               if (selectedRadioButton) {
                    const selectedValue = selectedRadioButton.value;
                    selectedsubscripton_plan(selectedValue)
                    console.log('Selected subscription plan ID: ' + selectedValue);
                    $('#plan_id').attr('value', selectedValue);
                    $('.card-selection').show();
                    $('.plan-selection').hide();
               } else {
                    console.log('Please select a subscription plan');
               }
          }.bind(selectButton));
     });
}

function selectplan_old() {
     const selectButtons = document.querySelectorAll('.select-plan-button');
     selectButtons.forEach(selectButton => {
          selectButton.addEventListener('click', () => {
               //$(this).parent().find('.selectedsubscription').prop('checked', true);
               const radioInput = this.parentNode.querySelector('.selectedsubscription');
               radioInput.checked = true;
               const selectedRadioButton = document.querySelector('input[name="subscription-plan[]"]:checked');
               if (selectedRadioButton) {
                    const selectedValue = selectedRadioButton.value;
                    console.log('Selected subscription plan ID: ' + selectedValue);
                    $('#plan_id').attr('value', selectedValue);
                    $('.card-selection').show();
                    $('.plan-selection').hide();
               } else {
                    console.log('Please select a subscription plan');
               }
          });
     });
}
$(document).ready(() => {
     const billingForm = $("#billing-form");
     const submitButton = $("#subscribe_customer_submit");
     const preloader = $('.preloader');
     
     const serializeFormData = () => {
          const billingFormData = new FormData();
          billingFormData.append("cardholdername", $("#cardholder-name").val());
          billingFormData.append("cvvno", $("#cvv").val());
          billingFormData.append("plan_id", $("#plan_id").val());
          billingFormData.append("year", $("#expiry-year").val());
          billingFormData.append("month", $("#expiry-month").val());
          billingFormData.append("cardNumber", $("#card-number").val());
          billingFormData.append("_token", csrfToken);
          return billingFormData;
     };

     submitButton.click(() => {
          jQuery.validator.addMethod("lettersonly", function (value, element) {
               return this.optional(element) || /^[a-z\s]+$/i.test(value);
          }, "Only alphabetical characters in name");
          
          const currentYear = new Date().getFullYear();

          const currentMonth = new Date().getMonth() + 1; // Adding 1 since getMonth() returns a zero-based index (0 for January, 1 for February, etc.)

          // Custom validation method to check if the selected month and year are not in the past
          jQuery.validator.addMethod("minMonthYear", function (value, element) {
               const selectedMonth = parseInt($("#expiry-month").val());
               const selectedYear = parseInt($("#expiry-year").val());

               if (selectedYear < currentYear) {
                    return false;
               } else if (selectedYear === currentYear && selectedMonth < currentMonth) {
                    return false;
               }

               return true;
          }, "Please select a valid expiration date.");
          billingForm.validate({
               rules: {
                    cardholdername: {
                         required: true,
                         lettersonly:true,
                    },
                    cardNumber: {
                         required: true,
                    //     creditcard: true,
                         digits: true,
                        
                    },
                    month: {
                         required: true,
                         minMonthYear: true,
                    },
                    year: {
                         required: true,
                         minMonthYear: true,
                    },
                    cvvno: {
                         required: true,
                         digits: true,
                         minlength: 3,
                         maxlength: 4,
                    },
               },
               messages: {
                    cardholdername: {
                         required: "Please enter the Cardholder's name.",
                    },
                    cardNumber: {
                         required: "Please enter the Card number.",
                    //     creditcard: "Please enter a valid credit card number.",
                         digits: "Please enter digits only.",

                    },
                    month: {
                         required: "Please select the expiration month.",
                         minMonthYear: "Please select a valid expiration month.",
                    },
                    year: {
                         required: "Please select the expiration year.",
                         minMonthYear: "Please select a valid expiration year.",
                    },
                    cvvno: {
                         required: "Please enter the CVV .",
                         digits: "Please enter digits only.",
                         minlength: "Please enter at least 3 digits.",
                         maxlength: "Please enter no more than 4 digits.",
                    },
               },
          });

          if (billingForm.valid()) {
               const billingFormData = serializeFormData();
               //const preloader = $('.preloader');
               preloader.show();
               $.ajax({
                    url: subscrition_url,
                    type: "POST",
                    data: billingFormData,
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    success: function (response) {
                         try {
                              console.log(response);
                              preloader.hide();

                              if (response.message === "Subscription successful") {
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
                              } else {
                                   window.location.href = customer_plan;
                              }
                         } catch (error) {
                              console.error("An error occurred in the success callback:", error);
                              // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                         }
                    },
                    error: function (xhr, status, error) {
                         try {
                              preloader.hide();
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
});


