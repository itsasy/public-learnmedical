
$("#submit_profile_details").click(function (e) {

    var form = $("#profile_form_data");
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");
    form.validate({
        rules: {
            f_name: {
                required: true,
                lettersonly: true,
            },
            l_name: {
                required: true,
                lettersonly: true,

            },  
          
            phone: {
                // required: true,
                number: true
            },
        },
        messages: {
            f_name: {
                required: "Please fill the first_name",
            },
            l_name: {
                required: "Please describe last_name",
            },
            phone: {
                // required: "Please add a phone number",
                number: "Please enter a valid number"
            },
        }
    });
    if (form.valid() === true) {
        var first_name = $('#tb-fname').val();
        var last_name = $('#tb-lname').val();
        var email = $('#tb-email').val();
        var phone = $('#tb-phone').val();

        var update_profile_data = new FormData();
        update_profile_data.append('first_name', first_name);
        update_profile_data.append('last_name', last_name);
        update_profile_data.append('email', email);
        update_profile_data.append('phone', phone);
        update_profile_data.append('_token', csrf_Token);
        $.ajax({
            url: profile_url,
            type: "POST",
            data: update_profile_data,
            contentType: false,
            processData: false,
            dataType: 'json',

            success: function (response) {
                console.log(response.message)
                if (response.message == 'profile data successfully updated') {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: response.message,
                        showConfirmButton: false,
                        timer: 3000
                    });

                    // setTimeout(function () {
                    //     window.location.href = dashboard_customer;
                    // }, 2000);
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }

            }
        });
    }
});