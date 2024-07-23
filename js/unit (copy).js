$(Document).ready(function () {
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

                $.each(course, function (data, value) {
                    var html = '';
                    html += '<tr class="unit_line-' + value.id + '"><td>' + i++ + '</td>';
                    html += '<td>' + value.course.name + '</td>';
                    html += '<td>' + value.name + '</td>';
                    if (value.status == 1) {
                        html += '<td>' + 'Active' + '</td>';
                    } else {
                        html += '<td>' + 'Inactive' + '</td>';
                    }
                    editUrl = url + '/' + value.id + '/edit';
                    html += '<td>' + '<a class="btn btn-light-info text-info btn-sm mx-2 edit_unit_button" data-id="' + value.id + '" href="' + editUrl + '"><i class="fas fa-pencil-alt"></i></a>' +
                        '<a class="btn btn-light-danger text-danger btn-sm delete_unit_button" href="" data-id="' + value.id + '"><i class="fas fa-trash-alt"></i></a>' + '</td></tr>';
                    $('#unit_listing_table').append(html);

                });
                $('#unit_listing_table').DataTable({
                    // "order": [0, 'desc'],
                    "ordering": true,

                });
            }
        });
    }

    var unit_id = $('#unit_id').val();
    $.ajax({
        type: "get",
        url: edit_url + '/' + unit_id,
        data: unit_id,
        dataType: "json",
        success: function (response) {
            console.log(response.Unit.name);
            var unit_name = response.Unit.name;
            var unit_description = response.Unit.description;
            var unit_logo = response.Unit.logo;
            $('#unit_title').val(unit_name);
            $('#unit_description').val(unit_description);
            $("#logo_image").attr("src",unit_logo);
            $('#course_id').val(response.Unit.course_id);
        }
    });
});

$(document).on('click', '.update_unit', function () {
    var unit_id = $('#unit_id').val();
    var unit_title = $('#unit_title').val();
    var unit_description = $('#unit_description').val();
    var course_id = $('#course_id').val();
    var file = $('#logo').val();
    var file = logo.files[0];

    var updateformData = new FormData();
    updateformData.append('logo', file);
    updateformData.append('name', unit_title);
    updateformData.append('description', unit_description);
    updateformData.append('id', unit_id);
    updateformData.append('course_id', course_id);
    updateformData.append('_token', csrftoken);

    $.ajax({
        type: "POST",
        url: update_url + "/" + unit_id,
        data: updateformData,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            console.log(response, 'unit_data');
            Swal.fire({
                text: 'Unit Updated!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(function () {
                window.location.href = unit_listing;
            }, 1000);
        }
    });
});

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
                                title: data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(function () {
                                window.reload();
                                window.location.href = unit_listing;
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

$(document).ready(function () {
    $("#example-manipulation-t-0").click(function () {
        $("#example-manipulation-p-0").show(".content");
        $("#example-manipulation-p-1").hide(".steps");
        $("#example-manipulation-p-2").hide(".steps");
        $('.first').removeClass('done').addClass('current');
        $('.middle').removeClass('current').addClass('done');
    });
    $("#example-manipulation-t-1").click(function () {
        $('.first').removeClass('current').addClass('done');
        $('.middle').removeClass('done').addClass('current');
        var form = $("#add_unit_form");

        form.validate({
            rules: {
                unit_title: {
                    required: true,
                    // unique: true

                },
                unit_description: {
                    required: true,
                    minlength: 6,
                },
                logo: {
                    required: true,
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
                },
                "video_link[]": {
                    required: true,
                },
                character_name_male: {
                    required: true,
                },
                character_name_female: {
                    required: true,
                },
                conversation_audio_male: {
                    required: true,
                },
                conversation_audio_female: {
                    required: true,
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
                normal_audio: {
                    required: true,
                },
                slow_audio: {
                    required: true,
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
                    required: "Please fill the conversation text",
                },
                conversation_text: {
                    required: "Please fill the conversation text",
                },
                conversation_text_spanish: {
                    required: "Please fill the conversation text",
                },
                "video_link[]": {
                    required: "Please add a vedio link",
                },
                character_name_male: {
                    required: "Please fill character name for male",
                },
                character_name_female: {
                    required: "Please fill character name for female",
                },
                conversation_audio_male: {
                    required: "Please add conversation audio for male",
                },
                conversation_audio_female: {
                    required: "Please add conversation audio for female",
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
                normal_audio: {
                    required: "Please add an audio",
                },
                slow_audio: {
                    required: "Please add an audio",
                }
            }
        });
        if (form.valid() === true) {
            $("#example-manipulation-p-1").show(".content");
            $("#example-manipulation-p-0").hide(".steps");
            $("#example-manipulation-p-2").hide(".steps");
            $(".convo_div").hide();

        };
        $("#example-manipulation-t-1back").click(function () {
            $("#example-manipulation-p-1").show(".content");
            $("#example-manipulation-p-0").hide(".steps");
            $("#example-manipulation-p-2").hide(".steps");
            $('.last').removeClass('current').addClass('done');
            $('.middle').removeClass('done').addClass('current');
        });
    })


    $("#example-manipulation-t-2").click(function () {

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

            $("#unit_title_data").text(unit_title);
            $("#unit_description_data").text(unit_description);
            $("#lesson_title_data").text(lesson_title);
            $("#lesson_type_data").text("Lesson Content");
            $("#lesson_description_data").text(lesson_description);
            $("#conversation_text_data").text(conversation_text);
            $("#conversation_text_data_spanish").text(conversation_text_spanish);
            $("#conversation_audio_data").text(conversation_audio);

        } else if (lesson_type == 2) {
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
        } else {
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

    // add convo option
    $("#add_convo").click(function () {
        $(".show2").clone().appendTo("#cloned_convo");
    });

    // add convo option
    $("#add_phrase").click(function () {
        $(".show3").clone().appendTo("#cloned_convo");
    });


    // add multiple lessons under a unit
    var rowNum = 1;
    $("#add_lesson").removeAttr('href');
    $(document).on('click', '#add_lesson', function () {

        rowNum++;
        var id = $(this).attr('id');
        $(this).attr('data-id', rowNum);
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

        cloned.find('#phrase_text1').attr('id', 'phrase_text' + rowNum).val('');
        cloned.find('#normal_audio1').attr('id', 'normal_audio' + rowNum).val('');
        cloned.find('#slow_audio1').attr('id', 'slow_audio' + rowNum).val('');
        $('#lesson_content' + rowNum).find(".convo_div").hide();
        var lesson_num = rowNum;

        // lesson buttons on preview as per lesson numbers 
        $('#lesson_list').append(' <li role="tab" class="two done" aria-disabled="false" aria-selected="true"><a id="lesson' + lesson_num + '" class="lesson_preview" data-id="' + lesson_num + '" aria-controls="example-vertical-p-0"> Lesson ' + lesson_num + '</a></li>')

        $(document).on('change', '#lesson_type' + rowNum, function () {
            var id = $(this).attr('id');
            var demovalue = $(this).val();
            if (id == 'lesson_type' + rowNum) {
                $('#lesson_content' + rowNum).find(".convo_div").hide();
                $('#lesson_content' + rowNum).find("#show" + demovalue + rowNum).show();
            }
        });
    });



    // preview details with respect to lesson
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
        if (lesson_type == 1) {
            $('#lesson_type_2').hide();
            $('#lesson_type_3').hide();
            $('#lesson_type_1').fadeIn('8');
            var lesson_title = $("input#lesson_title" + data_id + "").val();
            var lesson_description = $("textarea#lesson_description" + data_id + "").val();
            var conversation_text = $("textarea#conversation_text" + data_id + "").val();
            var conversation_text_spanish = $("textarea#conversation_text_spanish" + data_id + "").val();
            var conversation_audio = $("input#conversation_audio1").val().split('\\').pop();
            alert(conversation_audio);

            $("#unit_title_data").text(unit_title);
            $("#unit_description_data").text(unit_description);
            $("#lesson_title_data").text(lesson_title);
            $("#lesson_type_data").text("Lesson Content");
            $("#lesson_description_data").text(lesson_description);
            $("#conversation_text_data").text(conversation_text);
            $("#conversation_text_data_spanish").text(conversation_text_spanish);
            $("#conversation_audio_data").text(conversation_audio);

        } else if (lesson_type == 2) {
            $('#lesson_type_1').hide();
            $('#lesson_type_3').hide();
            $('#lesson_type_2').fadeIn('8');
            var lesson_title = $("input#lesson_title" + data_id + "").val();
            var lesson_description = $("textarea#lesson_description" + data_id + "").val();
            var character_name_female = $("input#character_name_female" + data_id + "").val();
            var character_name_male = $("input#character_name_male" + data_id + "").val();
            var conversation_text_female = $("textarea#conversation_text_female" + data_id + "").val();
            var conversation_text_male = $("textarea#conversation_text_male" + data_id + "").val();
            var conversation_text_female_spanish = $("textarea#conversation_text_female_spanish" + data_id + "").val();
            var conversation_text_male_spanish = $("textarea#conversation_text_male_spanish" + data_id + "").val();
            var conversation_audio_male = $("input#conversation_audio_male" + data_id + "").val().split('\\').pop();
            var conversation_audio_female = $("input#conversation_audio_female" + data_id + "").val().split('\\').pop();

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
        } else {
            $('#lesson_type_1').hide();
            $('#lesson_type_2').hide();
            $('#lesson_type_3').fadeIn('8');
            var lesson_title = $("input#lesson_title" + data_id + "").val();
            var lesson_description = $("textarea#lesson_description" + data_id + "").val();
            var phrase_text = $("input#phrase_text" + data_id + "").val();
            var normal_audio = $("input#normal_audio" + data_id + "").val();
            var slow_audio = $("input#slow_audio" + data_id + "").val();
            $("#unit_title_data").text(unit_title);
            $("#unit_description_data").text(unit_description);
            $("#lesson_title_data_3").text(lesson_title);
            $("#lesson_type_data_3").text("Lesson Vocabulary");
            $("#lesson_description_data_3").text(lesson_description);
            $("#phrase_text_data").text(phrase_text);
            $("#normal_audio_data").text(normal_audio);
            $("#slow_audio_data").text(slow_audio);

        }
    });

    // input fields according to lesson type
    $(document).on('change', '#lesson_type1', function () {
        var id = $(this).attr('id');
        var demovalue = $(this).val();
        if (id == 'lesson_type1') {
            $('#lesson_content').find("div.convo_div").fadeOut("800");
            $('#lesson_content').find(".show" + demovalue).fadeIn("800");
        }
        $("#lesson_type" + demovalue).show(content).appendTo('#lesson_content1');
        $(id).after(".lesson_content1show" + demovalue).show().after
    });

    // store unit and lesson .....
    $("#submit_all_data").click(function () {
        $(".convo_div").hide();
        var unit_title = $('#unit_title').val();
        var unit_description = $('#unit_description').val();
        var course_id = $('#course_id').text();
        var file = $('#logo').val();
        var file = logo.files[0];

        var formData = new FormData();
        formData.append('logo', file);
        formData.append('name', unit_title);
        formData.append('description', unit_description);
        formData.append('course_id', course_id);
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
                var status = xhr.status;
                console.log(status);
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
                //  return false;

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
                    } else if (lesson_type[index] == 1) {
                        var lessonformData = new FormData();

                        lessonformData.append('name', value);
                        lessonformData.append('lessiontype_id', lesson_type[index]);
                        lessonformData.append('description', lesson_description[index]);
                        lessonformData.append('content_description[]', $('#conversation_text' + lessontypeince).val());
                        lessonformData.append('spanish_conversationtext[]', $('#conversation_text_spanish' + lessontypeince).val());
                        lessonformData.append('bounes_lession[]', '1');
                        lessonformData.append('video_link[]', $('#video_link' + lessontypeince).val());
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

                    } else {
                        var lessonformData = new FormData();
                        lessonformData.append('name', value);
                        lessonformData.append('description', lesson_description[index]);
                        lessonformData.append('lessiontype_id', lesson_type[index]);
                        $("input.phrase_text").each(function (i, v) {
                            if (v != '') {
                                lessonformData.append('phrase_text[]', $(this).val());
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
                                console.log(data, 'lesson data');
                            }
                        });
                    }
                    lessontypeince++;
                });
                Swal.fire({
                    text: 'Unit Added!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function () {
                    window.location.href = unit_listing;
                }, 1000);
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
                    // lessonformData.reset();
                    // console.log(data, 'lesson data');
                    // if(data.message === "Audio text created"){
                    //fileName = data.fileName;
                    //  $("#upload_attach_file_name").val(fileName);
                    //    }else{
                    //     return false;
                    //    }

                    // return false;
                    // window.location.href = unit_listing;
                },
                timeout: 5000
            });

        }
    });


});


