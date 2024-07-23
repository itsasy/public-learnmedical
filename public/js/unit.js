$(document).ready(function () {
    $(document).on('change', '[data-toggle="toggle"]', function () {
        $(this).parents().next('.hide').toggle();
    });
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    if (unitListUrl != '') {
        $.ajax({
            url: unitListUrl,
            dataType: 'json',
            success: function (data) {
                var course = data.units;
                var i = 1;
                var html = '';
                // unit listing
                $.each(course, function (data, value) {
                    var status_check = '';
                    var checked = '';
                    html += '<tr class="unit_line-' + value.id + '"><td>' + i++ + '</td>';
                    html += '<td>' + value.course.name + '</td>';
                    html += '<td>' + (value.section ? value.section.name : '') + '</td>';
                    html += `<td>${value.link ? `<a href="${value.link}" target="_blank">${value.name}</a>` : value.name}</td>`;
                    if (value.logo) {
                        html += '<td><div class="el-card-item">\
                        <div class="el-card-avatar el-overlay-1" >\
                        <a class="image-popup-vertical-fit" href="'+ value.logo + '">\
                            <img class="rounded-circle" src="'+ value.logo + '">\
                        </a>\
                      </div >\
                        </div ></td>';
                    } else {
                        html += '<td>N/A</td>';
                    }

                    if (value.status == 1) {
                        status_check = 'Active';
                        checked = 'checked';
                    } else {
                        status_check = 'Inactive';
                        checked = ' ';
                    }
                    html += '<td><div class="form-check form-switch"><input\
                      class="form-check-input unitstatus" data-id="'+ value.id + '" data-status="' + value.status + '" type="checkbox" id="flexSwitchCheckChecked"' + checked + '/>\
                    <label class="form-check-label" \
                      >'+ status_check + '</label></div></td>';
                    editUrl = url + '/' + value.id + '/edit';
                    html += '<td>' + '<a class="btn btn-light-info text-info btn-sm mx-2 edit_unit_button" data-id="' + value.id + '" href="' + editUrl + '"><i class="fas fa-pencil-alt"></i></a>' +
                        '<a class="btn btn-light-danger text-danger btn-sm delete_unit_button" href="" data-id="' + value.id + '"><i class="fas fa-trash-alt"></i></a>' + '</td></tr>';
                });
                $('#unit_listing_table').append(html);
                $('#unit_listing_table').DataTable({
                    // "order": [0, 'desc'],
                    "ordering": true,
                });
            }
        });

    }

    $(document).on('change', '.unitstatus', function () {
        var id = $(this).attr('data-id');
        var status = $(this).attr('data-status');
        var btn = $(this);
        $.ajax({
            type: "post",
            url: updatestatusUrl,
            data: { 'id': id, 'status': status },
            dataType: "json",
            success: function (response) {
                Swal.fire({
                    text: 'Status Updated!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                })
                btn.attr('data-status', response.new_status);
                btn.next().html('Inactive');
                if (response.new_status) {
                    btn.next().html('Active');
                }
            }
        })
    })

    // redirect to edit layout

    var unit_id = $('#unit_id').val();
    if (edit_url != '' && unit_id) {
        $.ajax({
            type: "get",
            url: edit_url + '/' + unit_id,
            data: unit_id,
            dataType: "json",
            success: function (response) {
                var unit_name = response.Unit.name;
                var unit_description = response.Unit.description;
                var unit_logo = response.Unit.logo;
                var unit_link = response.Unit.link;
                if (unit_link) {
                    $('#unit_link').val(unit_link);
                    $('.content-link').removeClass('d-none');
                } else {
                    $('.content-link').addClass('d-none');
                }
                $('#unit_title').val(unit_name);
                $('#unit_description').val(unit_description);
                if (unit_logo) {
                    $("#logo_image").attr("src", unit_logo);
                } else  {
                    $("#logo_image").addClass('d-none');
                }
                $('#course_id').val(response.Unit.course_id);
                $('#section_id').val(response.Unit.section_id);
            }
        });
    }


    // update functionality

    $(document).on('click', '.update_unit', function () {
        const unit_id = $('#unit_id').val();
        const unit_title = $('#unit_title').val();
        const unit_link = $('#unit_link').val();
        const unit_description = $('#unit_description').val();
        const unit_is_premium = $('[name="premium"]:checked').val();
        const course_id = $('#course_id').val();
        const section_id = $('#section_id').val();
        const file = $('#logo')[0].files.length ? $('#logo')[0].files[0] : null;

        const updateformData = new FormData();
        if (file) {
            updateformData.append('logo', file);
        }
        updateformData.append('name', unit_title);
        updateformData.append('link', unit_link);
        updateformData.append('description', unit_description);
        updateformData.append('premium', unit_is_premium);
        updateformData.append('id', unit_id);
        updateformData.append('course_id', course_id);
        updateformData.append('section_id', section_id);
        updateformData.append('_token', csrftoken);

        $.ajax({
            type: "POST",
            url: update_url + "/" + unit_id,
            data: updateformData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (response) {
                Swal.fire({
                    text: 'Unit Updated!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function () {
                    window.location.href = unit_listing;
                }, 1000);
            },
            error: function(error){
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: error.responseJSON.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        });
    });

    // delete unit

    $(document).on("click", ".delete_unit_button", function (e) {
        e.preventDefault();
        var id = $(this).attr("data-id");
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this unit',
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
                        url: delete_url + "/" + id,
                        data: { "id": id },
                        contentType: false,
                        cache: false,
                        processData: false,
                        method: "delete",
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            if (data.status == 'success') {
                                console.log('.unit_line', id);
                                $('.unit_line-' + id).remove();
                                // window.reload();
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    text: 'Unit deleted successfully',
                                    title: data.msg,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                setTimeout(function () {
                                    location.reload();
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


    // back from lesson to unit

    $(document).ready(function () {
        $("#example-manipulation-t-0").click(function () {
            $("#example-manipulation-p-0").show(".content");
            $("#example-manipulation-p-1").hide(".steps");
            $("#example-manipulation-p-2").hide(".steps");
            $('.first').removeClass('done').addClass('current');
            $('.middle').removeClass('current').addClass('done');
        });

        var preview_status = false;

        // first next after unit details....

        $("#example-manipulation-t-1").click(function () {
            $("#checkboxes1").hide();
            $("#show_vedio_link1").hide();
            var form = $("#add_unit_form");
            $.validator.addMethod('filesize', function (value, element, param) {
                return this.optional(element) || (element.files[0].size <= param)
            }, 'File size must be less than 1 MB');
            // public function passes($attribute, $value) {
            //     $regex = '/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';
            //     return preg_match($regex, $value);
            // }
            jQuery.validator.addMethod("videoLink", function (value, element) {
                return this.optional(element) || /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/i.test(value);
            }, "Please enter valid video link!");
            form.validate({
                rules: {
                    unit_title: {
                        required: true,

                    },
                    unit_description: {
                        required: true,
                        minlength: 6,
                    },
                    logo: {
                        required: true,
                        filesize: 1048576,
                        accept: "jpg,png,jpeg,gif,svg"
                    },
                    lesson_title: {
                        required: true,
                    },
                    lesson_description: {
                        required: true,
                        minlength: 6,
                    },
                    lesson_type: {
                        required: true,
                    },
                    conversation_text: {
                        required: true,
                        minlength: 6,
                    },
                    conversation_text_spanish: {
                        required: true,
                        minlength: 6,
                    },
                    "attachment_file[]": {
                        required: true,
                        accept: "audio/*"
                    },
                    "video_link[]": {
                        required: true,
                        videoLink:true,
                    },
                    character_name: {
                        required: true,
                    },

                    conversation_audio_male: {
                        required: true,
                        accept: "audio/*"
                    },
                    conversation_audio_female: {
                        required: true,
                        accept: "audio/*"
                    },
                    conversation_text_female: {
                        required: true,
                    },
                    conversation_text_male: {
                        required: true,
                    },
                    conversation_text_spanish_male: {
                        required: true,
                    },
                    conversation_text_spanish_female: {
                        required: true,
                    },
                    phrase_text: {
                        required: true,
                    },
                    spanish_phrase_text: {
                        required: true,
                    },
                    normal_audio: {
                        required: true,
                        accept: "audio/*"
                    },
                    slow_audio: {
                        required: true,
                        accept: "audio/*"
                    }

                },
                messages: {
                    unit_title: {
                        required: "Please fill the unit title",

                    },
                    unit_description: {
                        required: "Please describe the unit",
                    },
                    logo: {
                        required: "Please add a logo",
                    },
                    lesson_title: {
                        required: "Please fill the lesson title",
                    },
                    lesson_type: {
                        required: "Please select a lesson type",
                    },
                    "attachment_file[]": {
                        required: "Please select the file",
                        accept: "please select only mp4,mp3"
                    },
                    conversation_text: {
                        required: "Please fill the conversation transcription",
                    },
                    conversation_text_spanish: {
                        required: "Please fill the conversation transcription",
                    },
                    "video_link[]": {
                        required: "Please add a vedio link",
                    },
                    character_name: {
                        required: "Please fill character name",

                    },
                    conversation_audio_male: {
                        required: "Please add conversation audio for male",
                        accept: "please select only mp4,mp3"
                    },
                    conversation_audio_female: {
                        required: "Please add conversation audio for female",
                        accept: "please select only mp4,mp3"
                    },
                    conversation_text_female: {
                        required: "Please fill conversation text for male",
                    },
                    conversation_text_male: {
                        required: "Please fill conversation text for female",
                    },
                    conversation_text_spanish_male: {
                        required: "Please fill conversation text for male",
                    },
                    conversation_text_spanish_female: {
                        required: "Please fill conversation text for male",
                    },
                    phrase_text: {
                        required: "Please fill in a phrase",
                    },
                    spanish_phrase_text: {
                        required: "Please fill in a spanish phrase",
                    },
                    normal_audio: {
                        required: "Please add an audio",
                        accept: "please select only mp4,mp3"
                    },
                    slow_audio: {
                        required: "Please add an audio",
                        accept: "please select only mp4,mp3"
                    }
                }
            });
            if (form.valid() === true) {
                $("#example-manipulation-p-1").show(".content");
                $("#example-manipulation-p-0").hide(".steps");
                $("#example-manipulation-p-2").hide(".steps");
                $(".convo_div").hide();
                $('.first').removeClass('current').addClass('done');
                $('.middle').removeClass('done').addClass('current');

            };

            // back from preview to lesson....

            $("#example-manipulation-t-1back").click(function () {
                $("#example-manipulation-p-1").show(".content");
                $("#example-manipulation-p-0").hide(".steps");
                $("#example-manipulation-p-2").hide(".steps");
                $('.last').removeClass('current').addClass('done');
                $('.middle').removeClass('done').addClass('current');


            });
        })

        // Unique check for unit name

        $("#unit_title").keypress(function () {
            var unit_name = $(this).val();
            $.ajax({
                type: "get",
                url: check_unit_name,
                data: { 'name': unit_name },
                dataType: "json",
                success: function (response) {
                    var unit_name_status = response.status;
                    var unit_name_message = response.message;
                    if (unit_name_status == "success") {
                        $('#unit_title_error').text(unit_name_message).css("color", "green");
                        $("#example-manipulation-t-1").removeAttr("style");
                    } else {
                        $('#unit_title_error').text(unit_name_message).css("color", "red");
                        $("#example-manipulation-t-1").css({ 'pointer-events': 'none', 'cursor': 'default' });
                    }
                }
            });
        });

        // Unique check for lesson name

        $("#lesson_title1").keypress(function () {
            var lesson_name = $(this).val();
            $.ajax({
                type: "get",
                url: check_lesson_name,
                data: { 'name': lesson_name },
                dataType: "json",
                success: function (response) {
                    var lesson_name_status = response.status;
                    var lesson_name_message = response.message;
                    if (lesson_name_status == "success") {
                        $('#lesson_title_error').text(lesson_name_message).css("color", "green");
                    } else {
                        $('#lesson_title_error').text(lesson_name_message).css("color", "red");
                    }
                }
            });
        });

        // html for multiple add phrases for preview
        //<div class="col-md-3 mb-2"><label for="position-3">Phrase/Full text :</label></div>\
        //<div class="col-md-3 mb-2"><label for="title-3" id="phrase_text_data'+ added_phrases_count + '"></label></div>\

        var next_count = 0;
        $("#example-manipulation-t-2").click(function () {
            $('.lesson_preview').trigger('click');
            $(this).data('clicked', true);
            next_count++;
            $('#next_count').val(next_count);
            $('#lesson_type_1').hide();
            $('#lesson_type_2').hide();
            $('#lesson_type_3').hide();

            // Fetching all the data according to the respective lesson type

            var unit_title = $('input[name=unit_title]').val();
            var unit_description = $('textarea[name=unit_description]').val();
            var lesson_type = $("select.lesson_type").val();


            if (lesson_type == 1) {
                $('#lesson_type_2').hide();
                $('#lesson_type_3').hide();
                $('#lesson_type_1').fadeIn('8');
                var lesson_title = $("input.lesson_title").val();
                var lesson_description = $("textarea.lesson_description").val();
                var conversation_text = $("textarea#conversation_text1").val();
                var conversation_text_spanish = $("textarea#conversation_text_spanish1").val();
                var conversation_audio = $("input#conversation_audio1").val().split('\\').pop();
                var video_link = $("input#video_link1").val();
                $("#unit_title_data").text(unit_title);
                $("#unit_description_data").text(unit_description);
                $("#lesson_title_data").text(lesson_title);
                $("#lesson_type_data").text("Lesson Content");
                $("#lesson_description_data").text(lesson_description);
                if (video_link) {
                    $('#audio_content').hide();
                    // $("#video_link_data").text(video_link);
                } else {
                    $('#video_content').hide();
                    $("#conversation_text_data").text(conversation_text);
                    $("#conversation_text_data_spanish").text(conversation_text_spanish);
                    $("#conversation_audio_data").text(conversation_audio);
                }
            }

            if (lesson_type == 2) {
                $('#lesson_type_1').hide();
                $('#lesson_type_3').hide();
                $('#lesson_type_2').fadeIn('8');
                var lesson_title = $("input.lesson_title").val();
                var lesson_description = $("textarea.lesson_description").val();
                var character_name_female = $("input#character_name_female1").val();
                var character_name_male = $("input#character_name_male1").val();
                var conversation_text_female = $("textarea#conversation_text_female1").val();
                var conversation_text_male = $("textarea#conversation_text_male1").val();
                var conversation_text_female_spanish = $("textarea#conversation_text_female_spanish1").val();
                var conversation_text_male_spanish = $("textarea#conversation_text_male_spanish1").val();
                var conversation_audio_female = $("input#conversation_audio_female1").val().split('\\').pop();
                var conversation_audio_male = $("input#conversation_audio_male1").val().split('\\').pop();

                $("#unit_title_data").text(unit_title);
                $("#unit_description_data").text(unit_description);
                $("#lesson_title_data_2").text(lesson_title);
                $("#lesson_type_data_2").text("Practice Conversations");
                $("#lesson_description_data_2").text(lesson_description);
                $("#female_character_data").text(character_name_female);
                $("#male_character_data").text(character_name_male);
                $("#female_conversation_text_data_2").text(conversation_text_female);
                $("#male_conversation_text_data_2").text(conversation_text_male);
                $("#female_conversation_text_spanish_data").text(conversation_text_female_spanish);
                $("#male_conversation_text_spanish_data").text(conversation_text_male_spanish);
                $("#female_conversation_text_data").text(conversation_audio_female);
                $("#male_conversation_text_data").text(conversation_audio_male);
            }
            if (lesson_type == 3) {
                $('#lesson_type_1').hide();
                $('#lesson_type_2').hide();
                $('#lesson_type_3').fadeIn('8');
                var lesson_title = $("input.lesson_title").val();
                var lesson_description = $("textarea.lesson_description").val();
                var phrase_text = $("input.phrase_text").val();
                var normal_speed = $("input.normal_audio").val().split('\\').pop();
                var slow_speed = $("input.slow_audio").val().split('\\').pop();

                $("#unit_title_data").text(unit_title);
                $("#unit_description_data").text(unit_description);
                $("#lesson_title_data_3").text(lesson_title);
                $("#lesson_type_data_3").text("Lesson Vocabulary");
                $("#lesson_description_data_3").text(lesson_description);
                $("#phrase_text_data").text(phrase_text);
                $("#normal_speed_data").text(normal_speed);
                $("#slow_speed_data").text(slow_speed);
            }


            // necessary for lesson validations to initiate
            var lesson_form = $("#add_unit_form");
            lesson_form.validate({
            });
            if (lesson_form.valid() === true) {
                $("#example-manipulation-p-2").show(".content");
                $("#example-manipulation-p-1").hide(".steps");
                $("#example-manipulation-p-0").hide(".steps");
                $('.last').removeClass('done').addClass('current');
                $('.middle').removeClass('current').addClass('done');
            }
        });
        var j = 0;
        var k = 1;
        // var typei = 0;
        var i = 0;
        // add convo option
        $(document).on("click", '.add_convo', function () {
            var html = addtype2html(i);
            var lessonid = $('#addlessoncount').val();
            console.log(lessonid, 'lessonidtop')
            var previewhtml = addtype2previewhtml(typei, lessonid);
            var clid = "#cloned_convo" + lessonid;
            $(html).clone().appendTo(clid);
            $("#lesson_type_2").append(previewhtml);
            // console.log(clid)
            // $(html).clone().appendTo(clid);
            i++;
            typei++;
        });
        // add convo option
        $(document).on("click", '.add_phrase', function () {
            $(this).data('clicked', true);
            var html = addtype3html(i);
            var lessonid = $('#addlessoncount').val();
            var perviewhtml = addtype3perviewhtml(type3i, lessonid);
            var clid = "#cloned_convo_phrase" + lessonid;
            $(html).clone().appendTo(clid);
            $("#lesson_type_3").append(perviewhtml);
            //$(".show3").clone().appendTo("#cloned_convo_");
            //$('#phrase_click_count').val(count);
            i++;
            type3i++;
        });

        //  lesson type 1 html

        //  lesson type 3 html
        // <label for="">Phrase/Full text</label><br><input type="text" class="form-control phrase_text" id="phrase_text' + j + '" name="phrase_text"><br>\
        // <br><label for="">Spanish Phrase/Full text</label>\
        // <br><input type="text" class="form-control spanish_phrase_text" id="spanish_phrase_text'+ j + '" name="spanish_phrase_text"><br></br>\
        function addtype3html(j) {
            var html = '<div class="convo_div"><label for="formFileLg" class="form-label phrase_normal">Audio(Normal Speed)</label><br>\
        <input class="form-control form-control-lg normal_audio" id="normal_audio'+ j + '" type="file" name="normal_audio">\
        <span id="conversation_audio_error" class="errors"></span><br>\
        <label for="formFileLg" class="form-label">Audio(Slow Speed)</label><br>\
        <input class="form-control form-control-lg slow_audio" id="slow_audio'+ j + '" type="file" name="slow_audio">\
        <span id="conversation_audio_error" class="errors"></span><br></div>';
            return html;
        }



        // lesson type 2 html

        function addtype2html(j) {
            var html = '<div class="convo_div"><label for="formFileLg" class="form-label">Character Name (Female)</label>\
  <input class="form-control form-control-lg character_name" id="character_name_female'+ j + '" type="text" name="character_name" placeholder="Alisa">\
  <span id="character_name_error" class="errors"></span>\
  <br>\
  <label for="formFileLg" class="form-label">Conversation Transcription</label>\
  <textarea class="form-control form-control-lg conversation_text_practice" id="conversation_text_female'+ j + '" name="conversation_text" placeholder="Enter conversation transcription here"></textarea>\
  <span id="conversation_text_error" class="errors"></span><br>\
  <label for="formFileLg" class="form-label">Conversation Transcription (Spanish)</label>\
  <textarea class="form-control form-control-lg conversation_text_spanish_practice" id="conversation_text_female_spanish'+ j + '" name="conversation_text_spanish" placeholder="Enter conversation transcription in spanish here"></textarea>\
  <span id="conversation_text_error" class="errors"></span><br>\
  <label for="formFileLg" class="form-label">Conversation Audio</label>\
  <input class="form-control form-control-lg conversation_audio_practice" id="conversation_audio_female1" type="file" name="conversation_audio_female">\
  <span id="conversation_audio_error" class="errors"></span>\
  <br>\
  <hr>\
  <label for="formFileLg" class="form-label">Character Name (Male)</label>\
  <input class="form-control form-control-lg character_name" id="character_name_male'+ j + '" type="text" name="character_name" placeholder="John">\
  <input id="character_gender_male1" class="character_gender" value="male" type="hidden"></input>\
  <span id="character_name_error" class="errors"></span><br>\
  <label for="formFileLg" class="form-label">Conversation Transcription</label>\
  <textarea class="form-control form-control-lg conversation_text_practice" id="conversation_text_male'+ j + '" name="conversation_text" placeholder="Enter conversation transcription here"></textarea>\
  <span id="conversation_text_error" class="errors"></span><br>\
  <label for="formFileLg" class="form-label">Conversation Transcription (Spanish)</label>\
  <textarea class="form-control form-control-lg conversation_text_spanish_practice" id="conversation_text_male_spanish'+ j + '" name="conversation_text_spanish" placeholder="Enter conversation transcription in spanish here"></textarea>\
  <span id="conversation_text_error" class="errors"></span><br>\
  <label for="formFileLg" class="form-label">Conversation Audio</label>\
  <input class="form-control form-control-lg conversation_audio_practice" id="conversation_audio_male'+ j + '" type="file" name="conversation_audio_male">\
  <span id="conversation_audio_error" class="errors"></span>\
  <br></div>';
            return html;
        }
        // <div class="col-md-3 mb-2 lessionviewperview" id="pharseleble' + j + k + '" data-lessonid="' + k + '" style="display:none" ><label for="position-3">Phrase/Full text :</label></div>\
        // <div class="col-md-3 mb-2 lessionviewperview" id="pharsevalue'+ j + k + '" data-lessonid="' + k + '" style="display:none"><label for="title-3" id="phrase_text_data' + j + k + '"></label></div>\
        // <div class="col-md-3 mb-2 lessionviewperview" id="spanishpharseleble'+ j + k + '" data-lessonid="' + k + '" style="display:none"><label for="position-3">Spanish Phrase/Full text :</label></div>\
        // <div class="col-md-3 mb-2 lessionviewperview" id="spanishpharsevalue'+ j + k + '" data-lessonid="' + k + '" style="display:none"><label for="title-3" id="spanish_phrase_text_data' + j + k + '"></label></div>\
        function addtype3perviewhtml(j, k) {
            var html = '<div class="col-md-3 mb-2 lessionviewperview" id="audiolable'+ j + k + '" data-lessonid="' + k + '" style="display:none"><label for="title2-3">Audio(Normal speed) :</label></div>\
            <div class="col-md-3 mb-2 lessionviewperview" id="audiovalue'+ j + k + '"  data-lessonid="' + k + '" style="display:none"><label for="title-3" id="normal_speed_data' + j + k + '"></label></div>\
            <div class="col-md-3 mb-2 lessionviewperview" id="slowaudiolable'+ j + k + '" data-lessonid="' + k + '" style="display:none"><label for="text2-3">Audio(Slow speed) :</label></div>\
            <div class="col-md-3 mb-2 lessionviewperview" id="slowaudiovalue'+ j + k + '" data-lessonid="' + k + '" style="display:none"><label for="title-3" id="slow_speed_data' + j + k + '"></label></div>';
            return html;
        }
        // <div class="col-md-3 mb-2 viewlessonpreview" id="femalelabel'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="text2-3">Female Conversation Text : </label></div>\
        // <div class="col-md-3 mb-2 viewlessonpreview" id="femalevalue'+ l + k + '" data-lessonid="' + m + '" style="display:none" ><label for="title-3" id="female_conversation_text_data' + l + m + '" data-lessonchar="' + m + '" ></label></div>\
        // <div class="col-md-3 mb-2 viewlessonpreview" id="converstionmalelabel'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="text2-3">Male Conversation Text : </label></div>\
        // <div class="col-md-3 mb-2 viewlessonpreview" id="converstionmalevalue'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="title-3" id="male_conversation_text_data_2' + l + m + '" data-lessonchar="' + m + '"></label></div>\
        // <div class="col-md-3 mb-2 viewlessonpreview" id="femalespanishlabel'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="text2-3">Female Conversation Text (Spanish): </label></div>\
        // <div class="col-md-3 mb-2 viewlessonpreview" id="femalespanishvalue'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="text2-3" id="female_conversation_text_spanish_data' + l + m + '" data-lessonchar="' + m + '" ></label></div>\
        // <div class="col-md-3 mb-2 viewlessonpreview" id="converstionspanishmalelabel'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="text2-3">Male Conversation Text (Spanish): </label></div>\
        // <div class="col-md-3 mb-2 viewlessonpreview" id="converstionspanishmalevalue'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="text2-3" id="male_conversation_text_spanish_data' + l + m + '" data-lessonchar="' + m + '" ></label></div>\
        function addtype2previewhtml(l, m) {
            var html = '<div class="col-md-3 mb-2 viewlessonpreview" id="conversionlabel' + l + m + '" data-lessonid="' + m + '" style="display:none"><label for="text2-3">Character Name (Female): </label></div> \
                <div class="col-md-3 mb-2 viewlessonpreview" id="conversionvalue'+ l + m + '" data-lessonid="' + m + '" style="display:none" ><label for="title-3" id="female_character_data' + l + m + '" data-lessonchar="' + m + '"></label></div>\
                <div class="col-md-3 mb-2 viewlessonpreview" id="femaleaudiolabel'+ l + m + '" data-lessonid="' + m + '" style="display:none" ><label for="text2-3">Female Conversation Audio: </label></div>\
                <div class="col-md-3 mb-2 viewlessonpreview" id="femaleaudiovalue'+ l + m + '" data-lessonid="' + m + '" style="display:none" ><label for="title-3" id="female_audio' + l + m + '" data-lessonchar="' + m + '" ></label></div>\
                <div class="col-md-3 mb-2 viewlessonpreview" id="malelabel'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="text2-3">Character Name (Male) : </label></div>\
                <div class="col-md-3 mb-2 viewlessonpreview" id="malevalue'+ l + m + '" data-lessonid="' + m + '" style="display:none" ><label for="title-3" id="male_character_data' + l + m + '" data-lessonchar="' + m + '"></label></div>\
                <div class="col-md-3 mb-2 viewlessonpreview" id="maleaudiolabel'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="text2-3">Male Conversation Audio : </label></div>\
                <div class="col-md-3 mb-2 viewlessonpreview" id="maleaudiovalue'+ l + m + '" data-lessonid="' + m + '" style="display:none"><label for="title-3" id="male_audio' + l + m + '" data-lessonchar="' + m + '"> </label></div>';
            return html;
        }

        // add multiple lessons under a unit

        var rowNum = 1;
        $("#add_lesson").removeAttr('href');
        $(this).data('clicked', true);
        $(document).on('click', '#add_lesson', function () {
            var checked_radio = $('input[type=radio][name=inlineRadioOptions]:checked').attr('id');
            // $("#"+checked_radio).prop('checked', true);
            rowNum++;
            var id = $(this).attr('id');
            $(this).attr('data-id', rowNum);
            $("#addlessoncount").val(rowNum);
            var cloned = $("#lesson_content").clone().appendTo("#cloned_lesson");
            cloned.attr('id', 'lesson_content' + rowNum);
            var lesson_title_id = cloned.find('#lesson_title1').attr('id', 'lesson_title' + rowNum).val('');
            cloned.find('#lesson_type1').attr('id', 'lesson_type' + rowNum).val('');
            cloned.find('#lesson_description1').attr('id', 'lesson_description' + rowNum).val('');
            cloned.find('#lesson1').attr('id', '#lesson1' + rowNum);
            cloned.find('#lesson2').attr('id', '#lesson2' + rowNum);
            cloned.find('#show1').attr('id', 'show1' + rowNum);
            cloned.find('#show2').attr('id', 'show2' + rowNum);
            cloned.find('#show3').attr('id', 'show3' + rowNum);
            cloned.find('#inlineRadio_audio1').attr('id', 'inlineRadio_audio' + rowNum);
            cloned.find('#inlineRadio_video1').attr('id', 'inlineRadio_video' + rowNum);
            cloned.find('#checkboxes1').attr('id', 'checkboxes' + rowNum).hide();
            $('#inlineRadio_audio' + rowNum).attr('name', 'inlineRadioOptions' + rowNum);
            $('#inlineRadio_video' + rowNum).attr('name', 'inlineRadioOptions' + rowNum);
            cloned.find('#show_vedio_link1').attr('id', 'show_vedio_link' + rowNum).hide();
            cloned.find('#conversation_text1').attr('id', 'conversation_text' + rowNum).val('');
            cloned.find('#conversation_text_spanish1').attr('id', 'conversation_text_spanish' + rowNum).val('');
            cloned.find('#conversation_audio1').attr('id', 'conversation_audio' + rowNum).val('');
            cloned.find('#video_link1').attr('id', 'video_link' + rowNum).val('');
            cloned.find('#character_name_female1').attr('id', 'character_name_female' + rowNum).val('');
            cloned.find('#character_name_male1').attr('id', 'character_name_male' + rowNum).val('');
            cloned.find('#conversation_text_female1').attr('id', 'conversation_text_female' + rowNum).val('');
            cloned.find('#conversation_text_male1').attr('id', 'conversation_text_male' + rowNum).val('');
            cloned.find('#conversation_text_female_spanish1').attr('id', 'conversation_text_female_spanish' + rowNum).val('');
            cloned.find('#conversation_text_male_spanish1').attr('id', 'conversation_text_male_spanish' + rowNum).val('');
            cloned.find('#conversation_audio_female1').attr('id', 'conversation_audio_female' + rowNum).val('');
            cloned.find('#conversation_audio_male1').attr('id', 'conversation_audio_male' + rowNum).val('');
            cloned.find("#cloned_convo1").attr('id', 'cloned_convo' + rowNum).val('');
            cloned.find("#cloned_convo_phrase1").attr('id', 'cloned_convo_phrase' + rowNum).val('');
            cloned.find('#phrase_text1').attr('id', 'phrase_text' + rowNum).val('');
            cloned.find('#spanish_phrase_text1').attr('id', 'spanish_phrase_text' + rowNum).val('');
            cloned.find('#normal_audio1').attr('id', 'normal_audio' + rowNum).val('');
            cloned.find('#slow_audio1').attr('id', 'slow_audio' + rowNum).val('');
            $('#lesson_content' + rowNum).find(".convo_div").hide();
            var lesson_num = rowNum;
            $("#" + checked_radio).prop('checked', true);

            // lesson buttons on preview as per lesson numbers
            $('#lesson_list').append(' <li role="tab" class="two done" aria-disabled="false" aria-selected="true"><a id="lesson' + lesson_num + '" class="lesson_preview" data-id="' + lesson_num + '" aria-controls="example-vertical-p-0"> Lesson ' + lesson_num + '</a></li>')

            $(document).on('change', '#lesson_type' + rowNum, function () {

                var id = $(this).attr('id');
                var demovalue = $(this).val();
                $("#inlineRadio_audio" + rowNum).prop('checked', true);
                // $('#lesson_content' + rowNum).find(".convo_div").hide();


                if (id == 'lesson_type' + rowNum) {
                    if (demovalue == 1) {
                        // $('#lesson_content').find("div.convo_div").fadeOut("800");
                        $("#checkboxes" + rowNum).show();
                        $("#show" + demovalue + rowNum).hide();
                        $("#show_vedio_link" + rowNum).hide();
                    } else {
                        $("#checkboxes" + rowNum).hide();
                        $('#lesson_content' + rowNum).find("div.convo_div").fadeOut("800");
                        $('#lesson_content' + rowNum).find("#show" + demovalue + rowNum).fadeIn("800");
                    }
                    if (demovalue == 2) {

                        var previewhtml = addtype2previewhtml(typei, rowNum);
                        $("#lesson_type_2").append(previewhtml);
                        typei++;
                    }
                    if (demovalue == 3) {
                        var previewhtml_3 = addtype3perviewhtml(type3i, rowNum);
                        $("#lesson_type_3").append(previewhtml_3);
                        type3i++;
                    }
                    $("#inlineRadio_audio" + rowNum).click(function () {
                        $('#lesson_content' + rowNum).find("#show" + demovalue + rowNum).fadeIn("800");
                        $('#lesson_content' + rowNum).find("#show_vedio_link" + rowNum).fadeOut("800");
                    });

                    $("#inlineRadio_video" + rowNum).click(function () {
                        $('#lesson_content' + rowNum).find("#show" + demovalue + rowNum).fadeOut("800");
                        $('#lesson_content' + rowNum).find("#show_vedio_link" + rowNum).fadeIn("800");
                    });

                    $('#lesson_content' + rowNum).find(".convo_div").hide();
                    $('#lesson_content' + rowNum).find("#show" + demovalue + rowNum).show();
                }
            });

            $("#add_convo").click(function () {
                $(".show2" + rowNum).clone().appendTo("#cloned_convo");
                // j++;
                // var html = addtype2html(j);
                // $(html).clone().appendTo("#cloned_convo");
            });
        });

        $(document).on('click', '.lesson_preview', function () {
            $('.lesson_preview').parent().removeClass('current');
            $('.lesson_preview').parent().addClass('done');
            $(this).parent().removeClass('done');
            $(this).parent().addClass('current');
            var id = $(this).attr('id');
            var data_id = $(this).attr('data-id');
            var unit_title = $('input[name=unit_title]').val();
            var unit_description = $('textarea[name=unit_description]').val();
            var lesson_type = $("select#lesson_type" + data_id + "").val();
            var lesson_title = $("input#lesson_title" + data_id + "").val();
            var lesson_description = $("textarea#lesson_description" + data_id + "").val();
            if (lesson_type === '1') {
                $('#lesson_type_2').hide();
                $('#lesson_type_3').hide();
                $('#lesson_type_1').fadeIn('8');
                var conversation_text = $("textarea#conversation_text" + data_id + "").val();
                var conversation_text_spanish = $("textarea#conversation_text_spanish" + data_id + "").val();
                var conversation_audio = $("input#conversation_audio" + data_id + "").val().split('\\').pop();
                var video_link = $("input#video_link" + data_id + "").val().split('\\').pop();
                $('#lesson_title_data').text(lesson_title);
                $('#lesson_type_data').text(lesson_type);
                $('#lesson_description_data').text(lesson_description);
                if (video_link) {
                    $('#audio_div').hide();
                    $('#video_div').fadeIn();
                    $('#video_link_data').text(video_link);
                } else {
                    $('#video_div').hide();
                    $('#audio_div').fadeIn();
                    $('#conversation_text_data').text(conversation_text);
                    $('#conversation_text_data_spanish').text(conversation_text_spanish);
                    $('#conversation_audio_data').text(conversation_audio);
                }
            }
            if (lesson_type === '2') {
                var character_name = [];
                $("input.character_name").each(function (i, v) {
                    if (v != '') {
                        character_name.push($(this).val());
                    }
                });
                var button = [];
                $("a.lesson_preview").each(function () {
                    button.push($(this).attr('data-id'));
                });
                var c_text = [];
                $("textarea.conversation_text_practice").each(function (i, v) {
                    if (v != '') {
                        c_text.push($(this).val());
                    }
                });
                var c_text_spanish = [];
                $("textarea.conversation_text_spanish_practice").each(function (i, v) {
                    if (v != '') {
                        c_text_spanish.push($(this).val());
                    }
                });
                var filemale = [];
                $.each($("input.conversation_audio_practice"), function () {
                    filemale.push($(this)[0].files[0]);
                });
                console.log(filemale);
                $('#lesson_type_1').hide();
                $('#lesson_type_3').hide();
                $('#lesson_type_2').fadeIn('8');
                var lesson_title = $("input#lesson_title" + data_id + "").val();
                var lesson_description = $("textarea#lesson_description" + data_id + "").val();
                var j = 1;
                var k = 0;
                var ap_val = $("#append_type2_value").val();
                $.each(character_name, function (i, v) {
                    if (v != '' && ap_val === '0') {
                        if (j % 2 == 0) {
                            $("#male_character_data" + k + data_id).text(v);
                            $('#male_conversation_text_data_2' + k + data_id).text(c_text[i]);
                            $('#male_conversation_text_spanish_data' + k + data_id).text(c_text_spanish[i]);
                            if (filemale[i].name != 'undefined') {
                                $('#male_audio' + k + data_id).text(filemale[i].name);
                                // $('#male_conversation_text_data' + i + data_id).text(filemale[i].name);
                            }
                            k++;
                        } else {
                            $('#female_character_data' + k + data_id).text(v);
                            $('#female_conversation_text_data' + k + data_id).text(c_text[i]);
                            $('#female_conversation_text_spanish_data' + k + data_id).text(c_text_spanish[i]);
                            if (filemale[i].name != 'undefined') {
                                $('#female_audio' + k + data_id).text(filemale[i].name);
                            }
                            i++;
                        }

                        j++;
                    }
                });
                $.each($(".viewlessonpreview"), function () {
                    var dataLessonId = $(this).attr('data-lessonid');
                    if ($(this).attr('data-lessonid') == data_id) {
                        $(this).show();
                    } else {
                        console.log('data-id problem')
                        $(this).hide();
                    }
                });

            }
            if (lesson_type == 3) {
                var button = [];
                $("a.lesson_preview").each(function () {
                    button.push($(this).attr('data-id'));
                });
                $('#lesson_type_1').hide();
                $('#lesson_type_2').hide();
                $('#lesson_type_3').fadeIn('8');
                var lesson_title = $("input#lesson_title" + data_id + "").val();
                var lesson_description = $("textarea#lesson_description" + data_id + "").val();

                $("#unit_title_data").text(unit_title);
                $("#unit_description_data").text(unit_description);
                $("#lesson_title_data_3").text(lesson_title);
                $("#lesson_type_data_3").text("Lesson Vocabulary");
                $("#lesson_description_data_3").text(lesson_description);

                var phrase_text = [];
                $("input.phrase_text").each(function (i, v) {
                    if (v != '') {
                        phrase_text.push($(this).val());
                    }
                });
                var spanish_phrase_text = [];
                $("input.spanish_phrase_text").each(function (i, v) {
                    if (v != '') {
                        spanish_phrase_text.push($(this).val());
                    }
                });
                var normal_audio = [];
                $.each($("input.normal_audio"), function () {
                    normal_audio.push($(this)[0].files[0]);
                });
                var slow_audio = [];
                $.each($("input.slow_audio"), function () {
                    slow_audio.push($(this)[0].files[0]);
                });
                var append_type3 = $("#append_type3").val();
                var html = '';

                $.each(normal_audio, function (i, v) {
                    if (v != '') {
                        $('#phrase_text_data' + i + data_id).text(v);
                        $('#spanish_phrase_text_data' + i + data_id).text(spanish_phrase_text[i]);
                        if (normal_audio[i].name != 'undefined') {
                            $('#normal_speed_data' + i + data_id).text(normal_audio[i].name);
                        }
                        if (slow_audio[i].name != 'undefined') {
                            $('#slow_speed_data' + i + data_id).text(slow_audio[i].name);
                        }
                    }
                });
                $.each($(".lessionviewperview"), function () {
                    var dataLessonId = $(this).attr('data-lessonid');
                    console.log(dataLessonId, 'lesson-id');
                    console.log(data_id, 'data_id');
                    if ($(this).attr('data-lessonid') == data_id) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }
        });
        var typei = 0;
        var type3i = 0;
        // input fields according to lesson type
        $(document).on('change', '#lesson_type1', function () {

            var id = $(this).attr('id');
            var demovalue = $(this).val();
            $("#show_vedio_link1").hide();
            $("#show1").hide();

            if (id == 'lesson_type1') {
                if (demovalue == 1) {
                    $('#lesson_content').find("div.convo_div").fadeOut("800");
                    $("#checkboxes1").show();
                    $("#show1").hide();
                    $("#show_vedio_link1").hide();
                } else {
                    $("#checkboxes1").hide();
                    $('#lesson_content').find("div.convo_div").fadeOut("800");
                    $('#lesson_content').find(".show" + demovalue).fadeIn("800");
                }
            }
            if (demovalue == 2) {

                var previewhtml = addtype2previewhtml(typei, 1);
                $("#lesson_type_2").append(previewhtml);
                typei++;
            }
            if (demovalue == 3) {
                var previewhtml_3 = addtype3perviewhtml(type3i, 1);
                $("#lesson_type_3").append(previewhtml_3);
                type3i++;
            }
            $("#inlineRadio_audio1").click(function () {
                $('#lesson_content').find("div.convo_div").fadeOut("800");
                $('#lesson_content').find(".show" + demovalue).fadeIn("800");
                $('#lesson_content').find("#show_vedio_link1").fadeOut("800");
            });

            $("#inlineRadio_video1").click(function () {
                $('#lesson_content').find(".show" + demovalue).fadeOut("800");
                $('#lesson_content').find("#show_vedio_link1").fadeIn("800");
            });

            // $('#cloned_convo').hide();
            $("#lesson_type" + demovalue).show().appendTo('#lesson_content1');
            $(id).after(".lesson_content1show" + demovalue).show().after
        });

        // store unit and lesson .....
        $("#submit_all_data, #submit_all_data_link").click(function () {
            $(".convo_div").hide();
            const preloader = $('.preloader');
            preloader.show();

            const unit_type = $('input[name="unit_type"]:checked').val();
            const unit_title = $('#unit_title').val();
            const unit_link = $('#unit_link').val();
            const unit_description = $('#unit_description').val();
            const unit_is_premium = $('[name="premium"]:checked').val();
            const course_id = $('#course_id').text();
            const section_id = $('#section_id').val();
            const file = $('#logo')[0].files.length > 0 ? $('#logo')[0].files[0] : null;

            const formData = new FormData();
            if (file) {
                formData.append('logo', file);
            }
            formData.append('unit_type', unit_type);
            formData.append('name', unit_title);
            formData.append('link', unit_link);
            formData.append('description', unit_description);
            formData.append('premium', unit_is_premium);
            formData.append('course_id', course_id);
            formData.append('section_id', section_id);
            var fileNametype1 = '';
            function result_type(r) {
                fileNametype1 = r;//assigning value return
            }
            $.ajax({
                url: add_unit,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                dataType: 'json',
                success: function (data, statusText, xhr) {
                    if (unit_type == 1) {
                        const unit_id = data.course.id;
                        let url = add_lesson;
                        var course_id = $('#course_id').text();
                        var lesson_title = [];
                        $("input.lesson_title").each(function () {
                            lesson_title.push($(this).val());
                        });
                        var lesson_type = [];
                        var lesson_description = [];
                        $("textarea.lesson_description").each(function () {
                            lesson_description.push($(this).val());
                        });
                        $("select.lesson_type").each(function () {
                            lesson_type.push($(this).val());
                        });
                        var lessontypeince = 1
                        $.each(lesson_title, function (index, value) {
                            if (lesson_type[index] == 2) {
                                var lessonformData = new FormData();
                                lessonformData.append('name', value);
                                lessonformData.append('lessiontype_id', lesson_type[index]);
                                lessonformData.append('description', lesson_description[index]);
                                var character_name = [];
                                $("input[name='character_name']").each(function () {
                                    character_name.push(this.value);

                                });
                                var c_text = [];
                                $("textarea[name ='conversation_text']").each(function () {
                                    c_text.push(this.value);

                                });
                                var c_text_spanish = [];
                                $("textarea[name ='conversation_text_spanish']").each(function () {
                                    c_text_spanish.push(this.value);

                                });

                                var filemale = [];
                                $.each($("input.conversation_audio_practice"), function () {
                                    filemale.push($(this)[0].files);
                                });
                                $.each(character_name, function (i, v) {
                                    // lang.push(this.value);
                                    if (v != '') {
                                        lessonformData.append('character_name[]', v)
                                    }
                                });
                                $.each(c_text, function (i, v) {
                                    if (v != '') {
                                        lessonformData.append('conversion_text[]', v)
                                    }

                                });
                                $.each(c_text_spanish, function (i, v) {
                                    if (v != '') {
                                        lessonformData.append('spanish_conversationtext[]', v)
                                    }
                                });

                                lessonformData.append('bounes_lession[]', '1');

                                $.each(filemale, function (i, v) {
                                    $.each(v, function (i, file) {
                                        UploadFile(file, lesson_type[index])
                                    });
                                    if (fileNametype1 != '') {
                                        lessonformData.append('attachment_file[]', fileNametype1);
                                    }
                                });

                                lessonformData.append('course_id', course_id);
                                lessonformData.append('unit_id', unit_id);
                                $.ajax({
                                    url: url,
                                    type: "POST",
                                    data: lessonformData,
                                    contentType: false,
                                    processData: false,
                                    // dataType: 'json',
                                    success: function (data) {
                                        // lessonformData.reset();
                                        console.log(data, 'lesson data');
                                        // window.location.href = unit_listing;
                                    }
                                });
                            }
                            if (lesson_type[index] === '1') {
                                var lessonformData = new FormData();

                                lessonformData.append('name', value);
                                lessonformData.append('lessiontype_id', lesson_type[index]);
                                lessonformData.append('description', lesson_description[index]);
                                lessonformData.append('content_description[]', $('#conversation_text' + lessontypeince).val());
                                lessonformData.append('spanish_conversationtext[]', $('#conversation_text_spanish' + lessontypeince).val());
                                lessonformData.append('bounes_lession[]', '1');
                                if ($('#video_link' + lessontypeince).val() != '') {
                                    lessonformData.append('video_link[]', $('#video_link' + lessontypeince).val());
                                }
                                $.each($("#conversation_audio" + lessontypeince)[0].files, function (i, file) {
                                    UploadFile(file, lesson_type[index]);
                                });
                                if (fileNametype1 != '') {
                                    lessonformData.append('attachment_file[]', fileNametype1);
                                }
                                lessonformData.append('course_id', course_id);
                                lessonformData.append('unit_id', unit_id);
                                $.ajax({
                                    url: url,
                                    type: "POST",
                                    data: lessonformData,
                                    contentType: false,
                                    processData: false,
                                    // dataType: 'json',
                                    success: function (data) {
                                        // lessonformData.reset();
                                        console.log(data, 'lesson data');
                                        // window.location.href = unit_listing;
                                    }
                                });

                            } if (lesson_type[index] === '3') {
                                var lessonformData = new FormData();
                                lessonformData.append('name', value);
                                lessonformData.append('description', lesson_description[index]);
                                lessonformData.append('lessiontype_id', lesson_type[index]);
                                $("input.phrase_text").each(function (i, v) {
                                    if (v != '') {
                                        lessonformData.append('phrase_text[]', $(this).val());
                                    }

                                });
                                $("input.spanish_phrase_text").each(function (i, v) {
                                    if (v != '') {
                                        lessonformData.append('spanish_phrase_text[]', $(this).val());
                                    }

                                });
                                var normal_audio = [];
                                $.each($("input.normal_audio"), function () {
                                    normal_audio.push($(this)[0].files);
                                });
                                $.each(normal_audio, function (i, file) {
                                    $.each(file, function (i, file) {
                                        UploadFile(file, lesson_type[index])
                                    });
                                    if (fileNametype1 != '') {
                                        lessonformData.append('fast_filename[]', fileNametype1);
                                    }
                                });

                                var slow_audio = [];
                                $.each($("input.slow_audio"), function () {
                                    slow_audio.push($(this)[0].files);
                                });
                                $.each(slow_audio, function (i, file) {

                                    $.each(file, function (i, file) {
                                        UploadFile(file, lesson_type[index])
                                    });
                                    if (fileNametype1 != '') {
                                        lessonformData.append('slow_filename[]', fileNametype1);
                                    }
                                });
                                lessonformData.append('course_id', course_id);
                                lessonformData.append('unit_id', unit_id);
                                $.ajax({
                                    url: url,
                                    type: "POST",
                                    data: lessonformData,
                                    contentType: false,
                                    processData: false,
                                    // dataType: 'json',
                                    success: function (data) {
                                        console.log(data, 'lesson data ');
                                    },

                                });
                            }
                            lessontypeince++;
                        });
                    }
                    window.location.href = unit_listing;
                    preloader.hide();
                },
                error: function (error){
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: error.responseJSON.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    preloader.hide();
                }
            });

            function UploadFile(file, lossontype) {
                var luploadData = new FormData();
                luploadData.append('attachment_file', file);
                luploadData.append('lessontype', lossontype);
                $.ajax({
                    url: fileUpload,
                    type: "POST",
                    data: luploadData,
                    contentType: false,
                    processData: false,
                    async: false,
                    //  dataType: 'json',
                    success: function (data) {
                        result_type(data.fileName);
                    },
                    timeout: 5000
                });

            }
        });
    });
});


