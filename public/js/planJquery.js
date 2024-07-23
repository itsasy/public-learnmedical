$(document).ready(function () {
    $('#zero_config').DataTable();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });



    $(document).on("click", ".btn-delete-plan", function (e) {
        e.preventDefault();
        var id = $(this).attr("data-id");
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this Plan',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {

                setTimeout(function () {
                    $.ajax({
                        url: "plan/delete/"+ id,
                        data: { "id": id,"_method":'DELETE', "_token": token },
                        contentType: false,
                        cache: false,
                        processData: false,
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            if (data.status == 'success') {
                                //$('#loader').hide();
                                // $('#addLenderModal').hide();
                                $('.plan-line-' + id).remove();
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: data.msg,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                setTimeout(function () {
                                    var planUrl = window.location;
                                    window.location.replace(planUrl);
                                }, 2000);
                            } else {
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
                $(this).val('');
            }

        });


    });

    $(".btn-checkbox").click(function (e) {
        e.preventDefault();
        var status;
        if ($(this).prop("checked") == true) {
            status = 1;
        } else if ($(this).prop("checked") == false) {
            status = 0;
        }
        var plan = $(this).data("id");
        $.ajax({
            type: 'POST',
            url: path + '/updatePlanstatus/',
            data: {
                plan: plan,
                status: status
            },
            success: function (data) {
                alert(data);
                if ($.isEmptyObject(data.error)) {
                    //var cmsUrl = window.location;
                    //window.location.replace(cmsUrl);
                    
                    if (status === 1) {
                        $('.status-' + plan).find('input').prop('checked', true);
                        $('.status-' + plan).find('label').text('Active');
                    } else {
                        $('.status-' + plan).find('input').prop('checked', false);
                        $('.status-' + plan).find('label').text('Inactive');
                    }
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })  
                    
                } else {
                    printErrorMsg(data.error);
                }
            }
        });

    });
});