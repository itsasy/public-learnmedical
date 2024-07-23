$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

function setUserActivity() {
    const currentTimestamp = new Date().getTime();
    $.ajax({
        url: useractivitylink,
        type: 'POST',
        data: {
            in_time: in_time,
            out_time: currentTimestamp
        },
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiToken}`,
        },
        success: function (response) {
            console.log('user session time in and out time set successfully.');
        },
        error: function (xhr, status, error) {
            console.log('Error setting session variable.');
        }
    });

}