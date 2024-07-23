$(document).ready(function () {
    $('#zero_config').DataTable();
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

        var cms = $(this).data("id");
        $.ajax({
            type: 'POST',
            url: path + '/cmsstatus/',
            data: {
                cms: cms,
                status: status
            },
            success: function (data) {
                if ($.isEmptyObject(data.error)) {
                    if (status === 1) {
                        $('.status-' + cms).find('input').prop('checked', true);
                        $('.status-' + cms).find('label').text('Active');
                    } else {
                        $('.status-' + cms).find('input').prop('checked', false);
                        $('.status-' + cms).find('label').text('Inactive');
                    }
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: data.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })  
                    //var cmsUrl = window.location;
                    //window.location.replace(cmsUrl);
                    // location.reload();
                } else {
                    printErrorMsg(data.error);
                }
            }
        });

    });
    $(document).on("click", ".btn-delete-cms", function (e) {
        e.preventDefault();
        var id = $(this).attr("data-id");
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this cms',
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
                        url: path + "/cms/delete/" + id,
                        data: { "id": id, "_method": 'DELETE', "_token": token },
                        contentType: false,
                        cache: false,
                        processData: false,
                        dataType: "json",
                        success: function (data) {
                            if (data.status == 'success') {
                                //$('#loader').hide();
                                $('.cms-line-' + id).remove();
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: data.msg,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                setTimeout(function () {
                                    var cmsUrl = window.location;
                                    window.location.replace(cmsUrl);
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
                }, 100);
            } else {
                $(this).val('');
            }

        });


    });
});