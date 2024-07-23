//add lesson

$("#next1").click(function () {
    $("#checkboxes1").hide();
    $("#show_vedio_link1").hide();
    var form = $("#add_unit_form");
    jQuery.validator.addMethod("videoLink", function (value, element) {
        return this.optional(element) || /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/i.test(value);
    }, "Please enter valid video link!");
    form.validate({
        rules: {
            unit_type: {
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
            unit_type: {
                required: "Please select the unit title",
            },

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
/* <div class="col-md-3 mb-2"><label for="position-3">Phrase/Full text :</label></div>\
<div class="col-md-3 mb-2"><label for="title-3" id="phrase_text_data'+ added_phrases_count + '"></label></div>\ */
function addPhaseConvo(added_phrases_count) {
    var html = '<div class="col-md-3 mb-2" > <label for="title2-3">Audio(Normal speed) :</label></div >\
            <div class="col-md-3 mb-2"><label for="title-3" id="normal_speed_data'+ added_phrases_count + '"></label></div>\
            <div class="col-md-3 mb-2"><label for="text2-3">Audio(Slow speed) :</label></div>\
            <div class="col-md-3 mb-2"><label for="title-3" id="slow_speed_data'+ added_phrases_count + '"></label></div>'

    return html;
}

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

        $("#unit_title_data").text(unit_title);
        $("#unit_description_data").text(unit_description);
        $("#lesson_title_data").text(lesson_title);
        $("#lesson_type_data").text("Lesson Content");
        $("#lesson_description_data").text(lesson_description);
        $("#conversation_text_data").text(conversation_text);
        $("#conversation_text_data_spanish").text(conversation_text_spanish);
        $("#conversation_audio_data").text(conversation_audio);
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

var j = 0;
var k = 1;
// add convo option
$(document).on("click", '.add_convo', function () {

    // $(".show2").clone().appendTo("#cloned_convo");
    j++;
    var html = addtype2html(j);
    var lessonid = $('#addlessoncount').val();
    var clid = "#cloned_convo" + lessonid;
    console.log(clid)
    $(html).clone().appendTo(clid);
    k++;
});
var i = 0;
// add convo option
$(document).on("click", '.add_phrase', function () {
    // $(this).data('clicked', true);
    i++;
    var html = addtype3html(i);
    var lessonid = $('#addlessoncount').val();
    var clid = "#cloned_convo_phrase" + lessonid;
    $(html).clone().appendTo(clid);
    //$(".show3").clone().appendTo("#cloned_convo_");
    //$('#phrase_click_count').val(count);
});

//  lesson type 3 html
/* <label for="">Phrase/Full text</label><br><input type="text" class="form-control phrase_text" id="phrase_text' + j + '" name="phrase_text"><br>\
    <br><input type="text" class="form-control spanish_phrase_text" id="spanish_phrase_text'+ j + '" name="spanish_phrase_text"><br></br>\ */

function addtype3html(j) {
    var html = ' <div class="convo_div"><label for="formFileLg" class="form-label phrase_normal">Audio(Normal Speed)</label><br>\
        <input class="form-control form-control-lg normal_audio" id="normal_audio'+ j + '" type="file" name="normal_audio">\
  <span id="conversation_audio_error" class="errors"></span><br>\
  <label for="formFileLg" class="form-label">Audio(Slow Speed)</label><br>\
  <input class="form-control form-control-lg slow_audio" id="slow_audio'+ j + '" type="file" name="slow_audio">\
  <span id="conversation_audio_error" class="errors"></span><br></div>';
    return html;
}

// lesson type 2 html

// <label for="formFileLg" class="form-label">Conversation Text</label>\
// <textarea class="form-control form-control-lg conversation_text_practice" id="conversation_text_female'+ j + '" name="conversation_text" placeholder="Enter conversation text here"></textarea>\
//   <span id="conversation_text_error" class="errors"></span><br>\
//   <label for="formFileLg" class="form-label">Conversation Text (Spanish)</label>\
//   <textarea class="form-control form-control-lg conversation_text_spanish_practice" id="conversation_text_female_spanish'+ j + '" name="conversation_text_spanish" placeholder="Enter conversation text in spanish here"></textarea>\
//   <span id="conversation_text_error" class="errors"></span><br>\


/* <label for="formFileLg" class="form-label">Conversation Text</label>\
  <textarea class="form-control form-control-lg conversation_text_practice" id="conversation_text_male'+ j + '" name="conversation_text" placeholder="Enter conversation text here"></textarea>\
  <span id="conversation_text_error" class="errors"></span><br>\
  <label for="formFileLg" class="form-label">Conversation Text (Spanish)</label>\
  <textarea class="form-control form-control-lg conversation_text_spanish_practice" id="conversation_text_male_spanish'+ j + '" name="conversation_text_spanish" placeholder="Enter conversation text in spanish here"></textarea>\
  <span id="conversation_text_error" class="errors"></span><br>\ */
function addtype2html(j) {
    var html = '<div class="convo_div"><label for="formFileLg" class="form-label">Character Name (Female)</label>\
  <input class="form-control form-control-lg character_name" id="character_name_female'+ j + '" type="text" name="character_name" placeholder="Alisa">\
  <span id="character_name_error" class="errors"></span>\
  <br>\
  <label for="formFileLg" class="form-label">Conversation Audio</label>\
  <input class="form-control form-control-lg conversation_audio_practice" id="conversation_audio_female1" type="file" name="conversation_audio_female">\
  <span id="conversation_audio_error" class="errors"></span>\
  <br>\
  <hr>\
  <label for="formFileLg" class="form-label">Character Name (Male)</label>\
  <input class="form-control form-control-lg character_name" id="character_name_male'+ j + '" type="text" name="character_name" placeholder="John">\
  <input id="character_gender_male1" class="character_gender" value="male" type="hidden"></input>\
  <span id="character_name_error" class="errors"></span><br>\
  <label for="formFileLg" class="form-label">Conversation Audio</label>\
  <input class="form-control form-control-lg conversation_audio_practice" id="conversation_audio_male'+ j + '" type="file" name="conversation_audio_male">\
  <span id="conversation_audio_error" class="errors"></span>\
  <br></div>';
    return html;
}

// add multiple lessons under a unit

var rowNum = 1;
$("#add_lesson").removeAttr('href');
$(document).on('click', '#add_lesson', function () {
    var checked_radio = $('input[type=radio][name=inlineRadioOptions]:checked').attr('id');

    rowNum++;
    // $("#checkboxes"+ rowNum).hide();
    // $("#show_vedio_link" + rowNum).hide();
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
    // var unit_title = $('#unit_title').val();
    var unit_name = $('#unit_title').find(":selected").text();
    var unit_id = $('#unit_title').find(":selected").val();
    // // var unit_description = $(unit_id).attr('description');
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
        console.log(conversation_text);
        $('#unit_title_data').text(unit_name);
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
        $("input.character_name").each(function () {
            character_name.push(this.value);

        });
        var c_text = [];
        $("textarea.conversation_text_practice").each(function () {
            c_text.push(this.value);

        });
        var c_text_spanish = [];
        $("textarea.conversation_text_spanish_practice").each(function () {
            c_text_spanish.push(this.value);

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
        var j = 1
        var ap_val = $("#append_type2_value").val();
        $.each(character_name, function (i, v) {
            if (v != '' && ap_val === '0') {
                console.log(filemale[i].name);
                if (j % 2 == 0) {
                    //    var character_name_female = $("input#character_name_female" + data_id + "").val();
                    //     var character_name_female = $('.character_name').$(this).attr('name');

                    //     var character_name_male = $("input#character_name_male" + data_id + "").val();
                    //     var conversation_text_female = $("textarea#conversation_text_female" + data_id + "").val();
                    //     var conversation_text_male = $("textarea#conversation_text_male" + data_id + "").val();
                    //     var conversation_text_female_spanish = $("textarea#conversation_text_female_spanish" + data_id + "").val();
                    //     var conversation_text_male_spanish = $("textarea#conversation_text_male_spanish" + data_id + "").val();
                    //     var conversation_audio_male = $("input#conversation_audio_male" + data_id + "").val().split('\\').pop();
                    //     var conversation_audio_female = $("input#conversation_audio_female" + data_id + "").val().split('\\').pop();


                    // <div class="col-md-3 mb-2"><label for="text2-3">Female Conversation Text : </label></div>\
                    // <div class="col-md-3 mb-2"><label for="title-3" id="female_conversation_text_data'+ j + '">' + c_text[i] + '</label></div>\
                    // <div class="col-md-3 mb-2"><label for="text2-3">Female Conversation Text (Spanish): </label></div>\
                    // <div class="col-md-3 mb-2"><label for="title-3" id="female_conversation_text_spanish_data'+ j + '">' + c_text_spanish[i] + '</label></div>\

                    // <div class="col-md-3 mb-2"><label for="text2-3">Male Conversation Text : </label></div>\
                    // <div class="col-md-3 mb-2"><label for="title-3" id="female_conversation_text_data'+ j + '">' + c_text[i] + '</label></div>\
                    // <div class="col-md-3 mb-2"><label for="text2-3">Male Conversation Text (Spanish): </label></div>\
                    // <div class="col-md-3 mb-2"><label for="title-3" id="female_conversation_text_spanish_data'+ j + '">' + c_text_spanish[i] + '</label></div>\


                    $("#lesson_type_2").append('<div class="col-md-3 mb-2"><label for="text2-3">Character Name (Male) : </label></div>\
                <div class="col-md-3 mb-2"><label for="title-3" id="female_character_data'+ j + '">' + v + '</label></div>\
                <div class="col-md-3 mb-2"><label for="text2-3">Male Conversation Audio: </label></div>\
                <div class="col-md-3 mb-2"><label for="title-3" id="female_conversation_text_data'+ j + '">' + filemale[i].name + '</label></div>');
                } else {
                    $("#lesson_type_2").append('<div class="col-md-3 mb-2"><label for="text2-3">Character Name (Female): </label></div>\
                <div class="col-md-3 mb-2"><label for="title-3" id="female_character_data'+ j + '">' + v + '</label></div>\
                <div class="col-md-3 mb-2"><label for="text2-3">Female Conversation Audio: </label></div>\
                <div class="col-md-3 mb-2"><label for="title-3" id="female_conversation_text_data'+ j + '">' + filemale[i].name + '</label></div>\
               ')
                }
                j++;
            }
        });
        $("#append_type2_value").val('1');
        $("#unit_title_data").text(unit_name);
        // $("#unit_description_data").text(unit_description);
        $("#lesson_title_data_2").text(lesson_title);
        $("#lesson_type_data_2").text("Practice Conversations");
        $("#lesson_description_data_2").text(lesson_description);
        // $("#female_character_data").text(character_name_female);
        // $("#male_character_data").text(character_name_male);
        // $("#female_conversation_text_data_2").text(conversation_text_female);
        // $("#male_conversation_text_data_2").text(conversation_text_male);
        // $("#female_conversation_text_spanish_data").text(conversation_text_female_spanish);
        // $("#male_conversation_text_spanish_data").text(conversation_text_male_spanish);
        // $("#female_conversation_text_data").text(conversation_audio_female);
        // $("#male_conversation_text_data").text(conversation_audio_male);
    }
    if (lesson_type === '3') {
        $('#lesson_type_1').hide();
        $('#lesson_type_2').hide();
        $('#lesson_type_3').fadeIn('8');
        var lesson_title = $("input#lesson_title" + data_id + "").val();
        var lesson_description = $("textarea#lesson_description" + data_id + "").val();

        var phrase_text = $("input#phrase_text" + data_id + "").val();
        var phrase_text_spanish = $("input#spanish_phrase_text" + data_id + "").val();
        var normal_audio = $("input#normal_audio" + data_id + "").val();
        var slow_audio = $("input#slow_audio" + data_id + "").val();
        $("#unit_title_data").text(unit_name);
        // $("#unit_description_data").text(unit_description);
        $("#lesson_title_data_3").text(lesson_title);
        $("#lesson_type_data_3").text("Lesson Vocabulary");
        $("#lesson_description_data_3").text(lesson_description);
        // $("#phrase_text_data").text(phrase_text);
        // $("#normal_audio_data").text(normal_audio);
        // $("#slow_audio_data").text(slow_audio);

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
        $.each(phrase_text, function (i, v) {
            if (v != '' && append_type3 === '0') {
                $("#lesson_type_3").append('<div class="col-md-4 mb-2"><label for="position-3">Phrase/Full text :</label></div>\
                    <div class="col-md-8 mb-2"><label class="text-normal" for="title-3" id="phrase_text_data'+ i + '">' + v + '</label></div>\
                    <div class="col-md-4 mb-2"><label for="position-3">Spanish Phrase/Full text :</label></div>\
                    <div class="col-md-8 mb-2"><label class="text-normal" for="title-3" id="spanish_phrase_text_data'+ i + '">' + spanish_phrase_text[i] + '</label></div>\
                    <div class="col-md-4 mb-2"><label for="title2-3">Audio(Normal speed) :</label></div>\
                    <div class="col-md-8 mb-2"><label class="text-normal" for="title-3" id="normal_speed_data'+ i + '">' + normal_audio[i].name + '</label></div>\
                    <div class="col-md-4 mb-2"><label for="text2-3">Audio(Slow speed) :</label></div>\
                    <div class="col-md-8 mb-2"><label class="text-normal" for="title-3" id="slow_speed_data'+ i + '">' + slow_audio[i].name + '</label></div>');
            }
        });
        $("#append_type3").val('1');
    }
});

// input fields according to lesson type
// $(document).on('change', '#lesson_type1', function () {

//     var id = $(this).attr('id');
//     var demovalue = $(this).val();
//     if (id == 'lesson_type1') {
//         $('#lesson_content').find("div.convo_div").fadeOut("800");
//         $('#lesson_content').find(".show" + demovalue).fadeIn("800");
//     }
//     // $('#cloned_convo').hide();
//     $("#lesson_type" + demovalue).show().appendTo('#lesson_content1');
//     $(id).after(".lesson_content1show" + demovalue).show().after
// });

// store unit and lesson .....
$("#submit_all_data").click(function () {
    $(".convo_div").hide();
    // var unit_id = $('#unit_title').val();
    var unit_name = $('#unit_title').find(":selected").text();
    var unit_id = $('#unit_title').find(":selected").val();
    var course_id = $('#course_id').text();

    var fileNametype1 = '';
    function result_type(r) {
        fileNametype1 = r;//assigning value return
    }

    let url = add_lesson;
    // var course_id = $('#course_id').text();

    var lesson_title = [];
    $("input.lesson_title").each(function () {
        lesson_title.push($(this).val());
    });
    console.log(lesson_title);
    var lesson_type = [];

    var lesson_description = [];
    $("textarea.lesson_description").each(function () {
        lesson_description.push($(this).val());
    });

    var lesson_premium = [];
    $("div.is-premium").each(function () {
        lesson_premium.push($(this).find('[name="premium"]:checked').val());
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
            lessonformData.append('premium', lesson_premium[index]);
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
            lessonformData.append('_token', csrF_Token);
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
                    window.location.href = lesson_listing;
                }
            });
        }
        if (lesson_type[index] === '1') {
            var lessonformData = new FormData();

            lessonformData.append('name', value);
            lessonformData.append('lessiontype_id', lesson_type[index]);
            lessonformData.append('description', lesson_description[index]);
            lessonformData.append('premium', lesson_premium[index]);
            lessonformData.append('content_description[]', $('#conversation_text' + lessontypeince).val());
            lessonformData.append('spanish_conversationtext[]', $('#conversation_text_spanish' + lessontypeince).val());
            lessonformData.append('bounes_lession[]', '1');
            // lessonformData.append('video_link[]', $('#video_link' + lessontypeince).val());
            lessonformData.append('_token', csrF_Token);
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
                    window.location.href = lesson_listing;
                }
            });

        }
        if (lesson_type[index] === '3') {
            var lessonformData = new FormData();
            lessonformData.append('name', value);
            lessonformData.append('description', lesson_description[index]);
            lessonformData.append('premium', lesson_premium[index]);
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
            lessonformData.append('_token', csrF_Token);
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
                    window.location.href = lesson_listing;

                },

            });
        }
        lessontypeince++;
    });
    // window.location.href = lesson_listing;

    // }
    // });

    function UploadFile(file, lossontype) {
        var luploadData = new FormData();
        luploadData.append('attachment_file', file);
        luploadData.append('lessontype', lossontype);
        luploadData.append('_token', csrF_Token);

        $.ajax({
            url: fileUpload,
            type: "POST",
            data: luploadData,
            contentType: false,
            processData: false,
            async: false,
            //  dataType: 'json',
            success: function (data) {
                if(data.fileName === 'Please send valid Extenbsions'){
                    alert(data.fileName);
                    return false;
                }else{
                result_type(data.fileName);
                }
            },
            timeout: 5000
        });

        // }
    }
});
