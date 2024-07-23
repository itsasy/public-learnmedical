//const { delay } = require("lodash");

$(document).ready(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    if (notificationListUrl !== '') {
        
        $.ajax({
            url: notificationListUrl,
            type: "POST",
            dataType: 'json',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${apiToken}`,
            },
            success: function (data) {
                try {
                    const notifications = data.notifications;
                    const notificationCount = parseInt(data.notification_count);
                    const notificationList = $('#notification-list');
                    let htmlNotification = '';

                    if (!isNaN(notificationCount) && notificationCount > 0) {
                        const htmlString = `${notificationCount} New`;
                        $notificationCount.html(htmlString);
                    }

                    $("#notification_bell").hide();
                    if (notifications.length > 0) {
                        $("#notification_bell").show();
                    }

                    notifications.forEach((notification) => {
                        const dateTime = new Date(notification.updated_at);
                        const timeString = dateTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
                        htmlNotification += `
          <a href="javascript:void(0)" class="message-item">
            <span class="btn btn-danger btn-circle">
              <i data-feather="link" class="feather-sm fill-white"></i>
            </span>
            <div class="mail-contnet">
              <h5 class="message-title">${notification.user_name}</h5>
              <span class="mail-desc">${notification.message}</span>
              <span class="time text-start p-0">${timeString}</span>
            </div>
          </a>
        `;
                    });

                    notificationList.append(htmlNotification);

                } catch (error) {
                    console.error("An error occurred in the success callback:", error);
                    // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                try {
                    console.error(`Error making request: ${textStatus}, ${errorThrown}`);
                    // Optionally, you can handle specific HTTP status codes here.
                    if (jqXHR.status === 401) {
                        // Handle unauthorized access
                    } else if (jqXHR.status === 403) {
                        // Handle forbidden access
                    }
                    // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                } catch (error) {
                    console.error("An error occurred in the error callback:", error);
                    // Optionally, you can show an error message to the user using Swal.fire() or any other error handling approach.
                }
            }
        });

    }

});



