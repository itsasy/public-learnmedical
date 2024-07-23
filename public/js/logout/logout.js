$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $("#customer_logout").click(function (e) {
        const ACCEPT_HEADER_VALUE = 'application/json';
        setUserActivity();
        $.ajax({
            url: logout_link,
            type: "POST",
            headers: {
                Accept: ACCEPT_HEADER_VALUE,
                Authorization: `Bearer ${apiToken}`,
            },
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (response) {
                
                if (response.message = "Logged out"){
                    $.ajax({
                        url: customer_logout,
                        method: 'GET',
                        success: function (secondResponse) {
                    
                            window.location.href = customer_login;
                        },
                        error: function (error) {
                            // Handle error for the second request
                        }
                    });
                    
                    // $(location).prop('href', '.'APP_URL'/login')
                }
            }
        });
    });
});