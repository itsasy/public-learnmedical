$(document).ready(function () {
    $('.convo_div').hide();
    var j = 1;
    $(document).on('change', '#lesson_type1', function () {

        var id = $(this).attr('id');
        var demovalue = $(this).val();

        if (id == 'lesson_type1') {

            $('#lesson_content').find(".convo_div").hide();
            $('#lesson_content').find("#show" + demovalue).show();
            // if(demovalue ==='2'){
            //     var html = addtype2html(j,l=0);
            //     $('#show2').append(html);
            // }
        }
        j++;
    });
    $("#add_convo").click(function () {
        var html = addtype2html(j, l = 0);
        html = '<hr>' + html;
        $('#show2').append(html);
    });
    $('#add_phrase').click(function () {
        var html = addtype3html(j, l = 0);
        html = '<hr>' + html;
        $('#show3').append(html);
    });
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    if (ListUrl != '') {
        console.log(ListUrl);
        $.ajax({
            url: ListUrl,
            dataType: 'json',
            success: function (data) {
                var course = data.Lessions;
                var i = 1;

                // lesson listing
                $.each(course, function (data, value) {
                    var html = '';
                    html += '<tr class="unit_line-' + value.id + '"><td>' + i++ + '</td>';
                    html += '<td>' + value.courseunit.name + '</td>';
                    html += '<td>' + value.name + '</td>';
                    html += '<td style="white-space: initial;" >' + value.description + '</td>';
                    var word_count = value.word_count;
                    $word_status = '';
                    if(word_count == 0){
                        $word_status ="Your uploaded audio has no word found please update the valid audio";
                    }
                    if (value.status == 1) {
                        status_check = 'Active';
                        checked = 'checked';
                        html += '<td><div class="form-check form-switch"><input\
                      class="form-check-input lessonstatus" data-id="'+ value.id + '" data-status="' + value.status + '" type="checkbox" id="flexSwitchCheckChecked'+ value.id +'"' + checked + '/>\
                    <label class="form-check-label" for="flexSwitchCheckChecked'+ value.id +'" \
                      >'+ status_check + '</label></div></td>';
                    } else if (value.status == 0) {
                        status_check = 'Inactive';
                        checked = ' ';
                        html += '<td><div class="form-check form-switch"><input\
                      class="form-check-input lessonstatus" data-id="'+ value.id + '" data-status="' + value.status + '" type="checkbox" id="flexSwitchCheckChecked'+ value.id +'"' + checked + '/>\
                    <label class="form-check-label" for="flexSwitchCheckChecked'+ value.id +'" \
                      >'+ status_check + '</label></div></td>';
                    } else {
                        status_check = 'Inactive';
                        $('lessonstatus').hide();
                        html += '<td style="white-space: initial;" > Pending <p style="color:red">'+ $word_status +' </p></td>';
                    }
                    editUrl = url + '/' + value.id + '/edit';
                    html += '<td>' + '<a class="btn btn-light-info text-info btn-sm mx-2 edit_unit_button" data-id="' + value.id + '" href="' + editUrl + '"><i class="fas fa-pencil-alt"></i></a>' +
                        '<a class="btn btn-light-danger text-danger btn-sm delete_lesson_button" href="" data-id="' + value.id + '"><i class="fas fa-trash-alt"></i></a>' + '</td></tr>';
                    $('#lesson_listing_table').append(html);
                });
                $('#lesson_listing_table').DataTable({
                    // "order": [0, 'desc'],
                    //"ordering": true,
                });
            }
        });
    }

    // redirecting to edit layout and fetch the respective data

    var lesson_id = $('#lesson_id').val();
    if (lesson_id){
        $("#checkboxes1").hide();
        $.ajax({
            type: "get",
            url: edit_url + '/' + lesson_id,
            data: lesson_id,
            dataType: "json",
            success: function (response) {
                console.log(response.Lessions);
                var unit_id = response.Lessions.unit_id;

                var lesson_name = response.Lessions.name;
                var lesson_description = response.Lessions.description;
                var lesson_logo = response.Lessions.logo;
                var lesson_type = response.Lessions.lessontype_id;
                var course_id = response.Lessions.course_id;
                $('#lesson_title1').val(lesson_name);
                $('#lesson_description1').val(lesson_description);
                $('#lesson_type1').val(lesson_type).trigger('change');
                $('#logo').val(lesson_logo);

                $('#course_id').val(course_id);
                $('#unit_id').val(unit_id);
                if (lesson_type == 1 && response.Lessions.lesson_content.length) {
                    var conversation_text = (response.Lessions.lesson_content[0].content_description) ? response.Lessions.lesson_content[0].content_description : '';
                    var spanish_conversationtext = response.Lessions.lesson_content[0].spanish_conversationtext
                    var video_link1 = response.Lessions.lesson_content[0].video_link;
                    var filename = response.Lessions.lesson_content[0].filename;
                    var video_link = video_link1.trim();
                    if (video_link) {
                        $("#inlineRadio_video1").prop("checked", true);
                        $("#checkboxes1").show();
                        $('#lesson_content').find("#show_video_link1").fadeIn("800");
                        $('#lesson_content').find("#show1").fadeOut("100");
                        $("#video_link1").val(video_link1);

                    } else {
                        $("#checkboxes1").show();
                        $("#inlineRadio_audio1").prop("checked", true);
                        $('#lesson_content').find("#show1").fadeIn("800");
                        $('#lesson_content').find("#show_video_link1").hide();
                        $('#conversation_text1').val(conversation_text);
                        $('#conversation_text_spanish1').val(spanish_conversationtext);
                        $("#audioLink").attr("href", filename);
                        if(response.Lessions.lesson_content[0].word_count == 0){
                            $(".type1wordcount").show();
                            $(".type1wordcount").text('This audio is word count is null , please update the audio file');
                        }

                    }
                }
                if (lesson_type == 2) {
                    var j = 1;
                    // console.log(response.Lessions.lesson_conversion,'before');
                    $.each(response.Lessions.lesson_conversion, function (i, v) {

                        var html = addtype2html(j, l = 1);
                        $('#show2').append(html);
                        var k = 0;
                        $('#lesson_content').find("#show_video_link1").hide();
                        $("#character_name_female" + j).val(v.character_name)
                       // $("#conversation_text_female" + j).val(v.conversation_text);
                       // $("#conversation_text_female_spanish" + j).val(v.spanish_conversationtext);
                        $("#audioLinkFemale" + j).attr("href", v.attachment_file);
                        $("#character_name_male" + j).val(v.lesson_conversionreply.character_name)
                     //   $("#conversation_text_male" + j).val(v.lesson_conversionreply.conversation_text)
                      //  $("#conversation_text_male_spanish" + j).val(v.lesson_conversionreply.spanish_conversationtext)
                        $("#audioLinkMale" + j).attr("href", v.lesson_conversionreply.attachment_file);
                        if(v.word_count == 0){
                            $("#audioLinkMalewordcount" + j).show();
                            $("#audioLinkMalewordcount" + j).text('This audio is word count is null , please update the audio file');
                        }
                        if(v.lesson_conversionreply.word_count == 0){
                            $("#audioLinkFemalewordcount" + j).show();
                            $("#audioLinkFemalewordcount" + j).text('This audio is word count is null , please update the audio file');
                        }
                        j++;
                    });
                } if (lesson_type == 3) {
                    var j = 1;
                    $.each(response.Lessions.lesson_vocabulary, function (i, v) {
                        $('#lesson_content').find("#show_video_link1").hide();
                        var html = addtype3html(j, l = 1);
                        $('#show3').append(html);
                       // $("#phrase_text" + j).val(v.phrase_text);
                       // $("#spanish_phrase_text" + j).val(v.spanish_phrase_text);
                        $("#audiofastfile" + j).attr("href", v.fast_filename);
                        $("#audioslowfile" + j).attr("href", v.slow_filename);
                        if(v.lesson_conversionreply && v.lesson_conversionreply.word_count == 0){
                            $("#audioLinkFemalewordcount" + j).show();
                            $("#audioLinkFemalewordcount" + j).text('This audio is word count is null , please update the audio file');
                        }
                        j++;
                    });
                }
                $('#lesson_title1').val(lesson_name);
                $('#lesson_description1').val(lesson_description);
                $('#lesson_type1').val(lesson_type).trigger('change');
                $('#logo').val(lesson_logo);
                $('#course_id').val(course_id);
                $('#unit_id').val(unit_id);

            }
        });
    }

    // html for lesson type 2
//     <label for="formFileLg" class="form-label">Conversation Transcription</label>\
//     <textarea class="form-control form-control-lg conversation_text_practice" id="conversation_text_female'+ j + '" name="conversation_text" placeholder="Enter conversation transcription here"></textarea>\
//   <span id="conversation_text_error" class="errors"></span><br>\
//   <label for="formFileLg" class="form-label">Conversation Transcription (Spanish)</label>\
//   <textarea class="form-control form-control-lg conversation_text_spanish_practice" id="conversation_text_female_spanish'+ j + '" name="conversation_text_spanish" placeholder="Enter conversation transcription in spanish here"></textarea>\
//   <span id="conversation_text_error" class="errors"></span><br>\



//     <label for="formFileLg" class="form-label">Conversation Transcription</label>\
//     <textarea class="form-control form-control-lg conversation_text_practice" id="conversation_text_male'+ j + '" name="conversation_text" placeholder="Enter conversation transcription here"></textarea>\
//   <span id="conversation_text_error" class="errors"></span><br>\
//   <label for="formFileLg" class="form-label">Conversation Transcription (Spanish)</label>\
//   <textarea class="form-control form-control-lg conversation_text_spanish_practice" id="conversation_text_male_spanish'+ j + '" name="conversation_text_spanish" placeholder="Enter conversation transcription in spanish here"></textarea>\
//   <span id="conversation_text_error" class="errors"></span><br>\
    function addtype2html(j, l) {
        var html = '<label for="formFileLg" class="form-label">Character Name (Female)</label>\
  <input class="form-control form-control-lg character_name" id="character_name_female'+ j + '" type="text" name="character_name" placeholder="Alisa">\
  <span id="character_name_error" class="errors"></span>\
  <br>\
  <label for="formFileLg" class="form-label">Conversation Audio</label>\
  <input class="form-control form-control-lg conversation_audio_practice_female" id="conversation_audio_female'+j+'" type="file" name="conversation_audio_female">\
  <span id="conversation_audio_error" class="errors"></span>\
  <br>';
        if (l == 1) {
            html = html + '<a href="" id="audioLinkFemale' + j + '" class="form-label" target="_blank">Upload Audio</a><br><hr>';
            html = html + '<p style="display:none" id="audioLinkMalewordcount' + j +'"></p>';
        }
        html = html + '<label for="formFileLg" class="form-label">Character Name (Male)</label>\
  <input class="form-control form-control-lg character_name" id="character_name_male'+ j + '" type="text" name="character_name" placeholder="John">\
  <input id="character_gender_male1" class="character_gender" value="male" type="hidden"></input>\
  <span id="character_name_error" class="errors"></span><br>\
  <label for="formFileLg" class="form-label">Conversation Audio</label>\
  <input class="form-control form-control-lg conversation_audio_practice_male" id="conversation_audio_male'+ j + '" type="file" name="conversation_audio_male">\
  <span id="conversation_audio_error" class="errors"></span>\
  <br>';
        if (l == 1) {
            html = html + '<a href="" id="audioLinkMale' + j + '" class="form-label" target="_blank">Upload Audio</a> <br><br><hr>';
            html = html + '<p style="display:none" id="audioLinkMalewordcount' + j +'"></p>';
        }
        return html;
    }

    // html for lesson type 3
    function addtype3html(j, l) {
        // <label for="">Phrase/Full text</label><br><input type="text" class="form-control phrase_text" id="phrase_text' + j + '" name="phrase_text"><br>\
        // <br><label for="">Spanish Phrase/Full text</label><br><input type="text" class="form-control spanish_phrase_text" id="spanish_phrase_text' + j + '" name="spanish_phrase_text"><br>\

        var html = '<label for="formFileLg" class="form-label phrase_normal">Audio(Normal Speed)</label><br>\
  <input class="form-control form-control-lg normal_audio" id="normal_audio'+ j + '" type="file" name="normal_audio">\
  <span id="conversation_audio_error" class="errors"></span><br>';
        if (l == 1) {
            html = html + '<a href="" id="audiofastfile' + j + '" class="form-label" target="_blank">Upload Audio</a><br>';
        }
        html = html + '<label for="formFileLg" class="form-label">Audio(Slow Speed)</label><br>\
  <input class="form-control form-control-lg slow_audio" id="slow_audio'+ j + '" type="file" name="slow_audio">\
  <span id="conversation_audio_error" class="errors"></span><br>';
        if (l == 1) {
            html = html + '<a href="" id="audioslowfile' + j + '" class="form-label" target="_blank">Upload Audio</a><br> <hr>';
        }
        return html;
    }
});

// update lesson functionality

$(document).on('click', '.update_lesson', function () {
    var course_id = $('#course_id').val();
    var unit_id = $('#unit_id').val();
    var lesson_id = $("#lesson_id").val();
    var form = $("#edit_unit_form");
    form.validate({
        rules: {
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
               // required: true,
                accept: "audio/*"
            },
            "video_link[]": {
                required: true,
            },
            character_name: {
                required: true,
            },
            conversation_audio_male: {
               // required: true,
                accept: "audio/*"
            },
            conversation_audio_female: {
                //required: true,
                accept: "audio/*"
            },
            conversation_text_female: {
                required: true,
            },
            conversation_text_male: {
                required: true,
            },
            conversation_text_spanish: {
                required: true,
            },
            phrase_text: {
                required: true,
            },
            normal_audio: {
               // required: true,
                accept: "audio/*"
            },
            slow_audio: {
               // required: true,
                accept: "audio/*"
            }

        },
        messages: {
            lesson_title: {
                required: "Please fill the lesson title",
            },
            lesson_type: {
                required: "Please select a lesson type",
            },
            "attachment_file[]": {
                required: "Please fill the conversation text",
                accept: "please select only mp4,mp3"
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
            conversation_text_spanish: {
                required: "Please fill conversation text",
            },

            phrase_text: {
                required: "Please fill in a phrase",
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

    var updateformData = new FormData();

    updateformData.append('name', $("input.lesson_title").val());
    updateformData.append('description', $("textarea.lesson_description").val());
    updateformData.append('premium', $('[name="premium"]:checked').val());

    updateformData.append('id', lesson_id);
    updateformData.append('course_id', course_id);
    updateformData.append('unit_id', unit_id);
    updateformData.append('_token', csrftoken);
    var fileNametype1 = '';
    function result_type(r) {
        fileNametype1 = r;//assigning value return

    }
    var lesson_title = [];
    $("input.lesson_title").each(function () {
        lesson_title.push($(this).val());
    });
    var lesson_type = [];
    $("select.lesson_type").each(function () {
        lesson_type.push($(this).val());
    });

    var lesson_description = [];
    $("textarea.lesson_description").each(function () {
        lesson_description.push($(this).val());
    });
    $.each(lesson_type, function (index, value) {
        if (value == 1) {
            updateformData.append('content_description[]', $('#conversation_text1').val());
            updateformData.append('spanish_conversationtext[]', $('#conversation_text_spanish1').val());
            updateformData.append('lessiontype_id', 1);
            updateformData.append('bounes_lession[]', 1);
            $.each($("#conversation_audio1")[0].files, function (i, file) {
                UploadFile(file, value);
            });
            if (fileNametype1 != '') {
                updateformData.append('attachment_file[]', fileNametype1);
            } else {
                var href = $("#audioLink").attr('href');
                var index = href.lastIndexOf("/") + 1;
                var filename = href.substr(index);
                updateformData.append('attachment_file[]', filename);
            }
            var video_link = [];
            $("input.video_link").each(function () {

               // updateformData.append('video_link[]', $(this).val());
                if ($(this).val() != '') {
                    updateformData.append('video_link[]', $(this).val());
                }
            });


        }
        if (value == 2) {
            var character_name = [];
            $("input[name='character_name']").each(function () {
                character_name.push(this.value);

            });
            updateformData.append('lessiontype_id', 2);
            var c_text = [];
            $("textarea[name ='conversation_text']").each(function () {
                c_text.push(this.value);

            });
            var c_text_spanish = [];
            $("textarea[name ='conversation_text_spanish']").each(function () {
                c_text_spanish.push(this.value);

            });

            var filemale = [];
            var k = 1;
            $.each($("input.conversation_audio_practice_male"), function () {
                $.each($(this)[0].files, function (i, file) {
                    UploadFile(file, value)
                });
                if (fileNametype1 != '') {
                    updateformData.append('attachment_file[]', fileNametype1);
                } else {
                    var href = $("#audioLinkMale" + k).attr('href');
                    var index = href.lastIndexOf("/") + 1;
                    var filename = href.substr(index);
                    updateformData.append('attachment_file[]', filename);
                }
                k++;

            });
            var t = 1;
            $.each($("input.conversation_audio_practice_female"), function () {
                $.each($(this)[0].files, function (i, file) {
                    UploadFile(file, value)
                });
                if (fileNametype1 != '') {
                    updateformData.append('attachment_file[]', fileNametype1);
                } else {
                    var href = $("#audioLinkFemale" + t).attr('href');
                    var index = href.lastIndexOf("/") + 1;
                    var filename = href.substr(index);
                    updateformData.append('attachment_file[]', filename);
                }
                t++;
            });
            $.each(character_name, function (i, v) {
                // lang.push(this.value);
                if (v != '') {
                    updateformData.append('character_name[]', v)
                }
            });
            $.each(c_text, function (i, v) {
                if (v != '') {
                    updateformData.append('conversion_text[]', v)
                }

            });
            $.each(c_text_spanish, function (i, v) {
                if (v != '') {
                    updateformData.append('spanish_conversationtext[]', v)
                }
            });
            var k = 1;
            $.each(filemale, function (i, v) {
                $.each(v, function (i, file) {
                    UploadFile(file, value)
                });
                if (fileNametype1 != '') {
                    updateformData.append('attachment_file[]', fileNametype1);
                } else {
                    var href = $("#audioLinkFemale" + k).attr('href');
                    var index = href.lastIndexOf("/") + 1;
                    var filename = href.substr(index);
                    updateformData.append('attachment_file[]', filename);
                }
                k++;
            });

        }
        if (value == 3) {
            updateformData.append('lessiontype_id', 3);
            $("input.phrase_text").each(function (i, v) {
                if (v != '') {
                    updateformData.append('phrase_text[]', $(this).val());
                }

            });
            $("input.spanish_phrase_text").each(function (i, v) {
                if (v != '') {
                    updateformData.append('spanish_phrase_text[]', $(this).val());
                }

            });
            var k = 1;
            $.each($("input.normal_audio"), function () {
                $.each($(this)[0].files, function (i, file) {
                    UploadFile(file, 3)
                });
                if (fileNametype1 != '') {
                    updateformData.append('fast_filename[]', fileNametype1);
                }
                else {
                    var href = $("#audiofastfile" + k).attr('href');
                    var index = href.lastIndexOf("/") + 1;
                    var filename = href.substr(index);
                    updateformData.append('fast_filename[]', filename);
                }
                k++;
            });
            var t = 1;
            $.each($("input.slow_audio"), function () {
                $.each($(this)[0].files, function (i, file) {
                    UploadFile(file, 3)
                });
                if (fileNametype1 != '') {
                    updateformData.append('slow_filename[]', fileNametype1);
                } else {
                    var href = $("#audioslowfile" + t).attr('href');
                    var index = href.lastIndexOf("/") + 1;
                    var filename = href.substr(index);
                    updateformData.append('slow_filename[]', filename);
                }
                t++;

            });

        }
    })};

    $.ajax({
        type: "POST",
        url: update_url + "/" + lesson_id,
        data: updateformData,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            console.log(response, 'unit_data');
            // window.location.href = lesson_listing;
            Swal.fire({
                text: 'Lesson Updated!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(function () {
                window.location.href = lesson_listing;
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

// delete lesson

$(document).on("click", ".delete_lesson_button", function (e) {
    e.preventDefault();
    var id = $(this).attr("data-id");
    Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this lesson',
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
                                // position: 'top-end',
                                icon: 'success',
                                title: data.msg,
                                text: 'Lesson Deleted Successfully',
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


$(document).on('change', '.lessonstatus', function () {
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

