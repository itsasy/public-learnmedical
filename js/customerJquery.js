$(document).ready(function () {
    // $('#zero_config').DataTable({
    //     //"ordering": true,
    //     "columnDefs": [
    //         { "orderable": true, "targets": 0, "emptyCells": "last" },
    //         { "orderable": true, "targets": 1 },
    //         { "orderable": true, "targets": 2},
    //         { "orderable": true, "targets": 3 },
    //         { "orderable": true, "targets": 4 }
    //     ]
    // });
    $('#zero_config').DataTable({
        "order": [[0, "desc"]],
        "columnDefs": [
            { "orderable": true, "targets": 0 },
            { "orderable": true, "targets": 1 },
            { "orderable": true, "targets": 2 },
            { "orderable": true, "targets": 3 },
        ]
    });
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(".btn-checkbox").click(function (e) {
        e.preventDefault();
        var status;
        if ($(this).prop("checked") == true) {
            status = 1;
        } else if ($(this).prop("checked") == false) {
            status = 0;
        }
        console.log(status + 'status');

        var user = $(this).data("id");
       
        $.ajax({
            type: 'POST',
            url: path + '/statusup/',
            data: {
                user: user,
                status: status
            },
            success: function (data) {
                try {
                    if ($.isEmptyObject(data.error)) {
                        if (status === 1) {
                            $('.status-' + user).find('input').prop('checked', true);
                            $('.status-' + user).find('label').text('Active');
                        } else {
                            $('.status-' + user).find('input').prop('checked', false);
                            $('.status-' + user).find('label').text('Inactive');
                        }
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: data.msg,
                            showConfirmButton: false,
                            timer: 1500
                        });

                        //var customerUrl = window.location;
                        //window.location.replace(customerUrl);
                    } else {
                        printErrorMsg(data.error);
                    }
                } catch (error) {
                    console.error("An error occurred while processing the AJAX response:", error);
                    // Handle the error appropriately, e.g., show a user-friendly error message
                }
            },
            error: function (xhr, status, error) {
                console.error("An error occurred during the AJAX request:", error);
                // Handle the error appropriately, e.g., show a user-friendly error message
            }
        });
;

    });
    
    $(document).on('click', '.btn-delete-customer', function (e) {
        e.preventDefault();
        // Store Customer id from data-id attribute
        let id = $(this).attr('data-id');

        // Use SweetAlert2 to confirm action before executing AJAX request
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this Customer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            // If user confirms modal, execute AJAX request
            if (result.isConfirmed) {
                // Set a timeout function
                setTimeout(() => {
                    // Make the AJAX request
                    $.ajax({
                        url: `${path}/customer/delete/${id}`,
                        data: { "id": id, "_method": 'DELETE', "_token": token },
                        contentType: false,
                        cache: false,
                        processData: false,
                        dataType: 'json',
                        success: (data) => {
                            try {
                                // Handle response
                                if (data.status == 'success') {
                                    // Remove customer element from page
                                    $(`.customer-line-${id}`).remove();

                                    // Display success alert
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: data.msg,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });

                                    // Reload page after 2 seconds
                                    setTimeout(() => {
                                        window.location.replace(window.location);
                                    }, 2000);
                                } else {
                                    // Display error alert
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'error',
                                        title: data.msg,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }
                            } catch (error) {
                                console.error("An error occurred while processing the AJAX response:", error);
                                // Handle the error appropriately, e.g., show a user-friendly error message
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("An error occurred during the AJAX request:", error);
                            // Handle the error appropriately, e.g., show a user-friendly error message
                        }
                    });

                
                }, 1000);
            } else {
                // Reset input value
                $(this).val('');
            }
        });
    });

    

    $(document).on("click", ".btn-delete-customer12", function (e) {
        e.preventDefault();
        // Store Customer id from data-id attribute
        let id = $(this).attr("data-id");

        // Use SweetAlert2 to display confirmation modal
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this Customer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            // If user confirms modal, execute AJAX request
            if (result.isConfirmed) {
                // Set a timeout function
                setTimeout(function () {
                    $.ajax({
                        url: path + "/customer/delete/" + id, // Request URL    
                        data: { "id": id, "_method": 'DELETE', "_token": token }, // Data to send with request
                        contentType: false, // Content-type to specify when sending request
                        cache: false, // Caching
                        processData: false, // Prevents from converting collections to strings
                        dataType: "json", // Indicate AJAX response format
                        success: function (data) { // Function to execute on successful AJAX request & response
                            // Handle response
                            console.log(data);
                            if (data.status == 'success') {
                                // Remove customer element from page
                                $('.customer-line-' + id).remove();

                                // Display success alert
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: data.msg,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                // Reload page after 2 seconds
                                setTimeout(function () {
                                    var customerUrl = window.location;
                                    window.location.replace(customerUrl);
                                }, 2000);
                            } else {
                                // Display error alert
                                Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    title: data.msg,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            }
                        }
                    })
                }, 1000);
            } else {
                // Reset input value
                $(this).val('');
            }

        });
    });
    $(document).on("click", ".btn-delete-staff", function (e) {
        e.preventDefault();
        const id = $(this).attr("data-id");
        
        // Prompt the user to confirm that they want the delete an staff member
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this staff',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            // If confirmed, send an ajax request for deleting the staff member
            if (result.isConfirmed) {
                setTimeout(function () {

                    $.ajax({
                        url: path + "/staff/delete/" + id,
                        data: { "id": id, "_method": 'DELETE', "_token": token },
                        contentType: false,
                        cache: false,
                        processData: false,
                        dataType: "json",
                        success: function (data) {
                            try {
                                if (data.status == 'success') {
                                    $('.staff-line-' + id).remove();
                                    // Show success notification
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: data.msg,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    // Redirect to the staff list page
                                    setTimeout(function () {
                                        window.location.replace(window.location);
                                    }, 1000);
                                } else {
                                    // Show error notification
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'error',
                                        title: data.msg,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }
                            } catch (error) {
                                console.error("An error occurred while processing the AJAX response:", error);
                                // Handle the error appropriately, e.g., show a user-friendly error message
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("An error occurred during the AJAX request:", error);
                            // Handle the error appropriately, e.g., show a user-friendly error message
                        }
                    });

                   
                }, 1000);
            } else {
                $(this).val('');
            }
        });
    });

    

    $(document).on("click", ".btn-delete-testimonial", function (e) {
        e.preventDefault();
        const id = $(this).attr("data-id");
        // Prompt the user to confirm that they want the delete an staff member
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this testimonial',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            // If confirmed, send an ajax request for deleting the staff member
            if (result.isConfirmed) {
                setTimeout(function () {
                    
                    $.ajax({
                        url: "/testimonial/delete/" + id,
                        data: { "id": id, "_method": 'DELETE', "_token": token },
                        contentType: false,
                        cache: false,
                        processData: false,
                        dataType: "json",
                        type: "POST",
                        success: function (data) {
                            try {
                                if (data.status === 'success') {
                                    $('.testimonial-line-' + id).remove();
                                    // Show success notification
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: data.msg,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    setTimeout(function () {
                                        window.location.replace(window.location);
                                    }, 1000);
                                } else {
                                    // Show error notification
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'error',
                                        title: data.msg,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }
                            } catch (error) {
                                console.error("An error occurred in the success callback:", error);
                                // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                            }
                        },
                        error: function (xhr, status, error) {
                            try {
                                console.error("AJAX request failed:", error);
                                // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                            } catch (error) {
                                console.error("An error occurred in the error callback:", error);
                                // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                            }
                        }
                    });

                }, 1000);
            } else {
                $(this).val('');
            }
        });
    });
});

