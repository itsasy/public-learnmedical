//const { delay } = require("lodash");
$(document).ready(function () {
    const preloader = $('.preloader');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    const swalOptions = {
        iconHtml: `<img src="${thumbsupicon}" alt="thumbs up icon" width="180" height="180">`,
        title: "Great Work",
        text: "Let's move to the next lesson",
        showConfirmButton: true,
    };
    var globalcounter = 0;
    
    if (courseListUrl !== '') {
        preloader.show();    
        $.ajax({
            url: courseListUrl,
            dataType: 'json',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${apiToken}`,
            },
            success: function (data) {

                const courses = data.Courses;
                let i = 0;
                let htmlCourse = '';
                
                const courseList = $('#course-list');

                courses.forEach(course => {

                    htmlCourse += `<div class="d-flex align-items-center"><div class=""><h1 class="course-heading" id="course-item">${course.name}</h1></div><div class="ms-auto" style="position: relative;"><img src="${courseIcon}" class="d-block w-100" alt="..." /></div></div><div class="accordion custom-accordion slim-scroll mt-3" id="accordionCourse${course.id}"></div>`;
                
                });
                courseList.append(htmlCourse);
                
                courses.forEach(course => {
                    courseUnitlisting(course.id)

                });
            },
            error: (jqXHR, textStatus, errorThrown) => {
                setTimeout(function () {
                    preloader.hide();
                }, 3000);
                console.error(textStatus, errorThrown);
            }
        });
    }
    
    function courseUnitlisting(courseId){
    /// var lessonCounter = 0;
   // const accordionCourse = $(`#accordionCourse${courseId}`);
        
    if (CourseUnitListUrl !== '') {
        preloader.show();
        $.ajax({
            url: CourseUnitListUrl,
            type: "POST",
            data: { course_id: courseId },
            dataType: 'json',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${apiToken}`,
            },
            success: function (data) {
                const units = data.course_unit;
                let i = 0;
                
              //  const accordionCourse = $('#accordionCourse'+);
                const accordionCourse = $(`#accordionCourse${courseId}`);
                accordionCourse.empty();
                // Check if all units have a status of zero
                let allUnitsAreZero = units.every(unit => parseInt(unit.unit_status, 10) === 0);
                let unitVariable;
                if (allUnitsAreZero) {
                // Set the variable to 0 if all units have a status of zero
                unitVariable = 0;
                } else {
                // Set the variable to 1 if at least one unit has a non-zero status
                unitVariable = 1;
                }
                let prevUnitStatus = 0;
                units.forEach(unit => {
                    i++; // increment i by 1
                    const isFirstUnit = i === 1; // check if i is equal to 1 and store the result in isFirstUnit
                    const { name, course_lesson, id, unit_status } = unit; // extract properties from unit object and assign them to variables
                    const currentUnitStatus = parseInt(unit_status); // convert unit_status to an integer and store it in currentUnitStatus
                    let html = ''; // initialize an empty string
                    // This code generates an HTML link with specific attributes based on the value of isFirstUnit
                    if (isFirstUnit) {
                    html += `<a id="button${i}" data-unitVariable="${unitVariable}" data-bs-toggle="collapse" data-bs-target="#collapse${i}"></a>`;
                    }
                    // This code sets the courseItem text to the extracted course name
                    
                    const lessons = course_lesson;
                    // This code builds a new HTML element for each unit with respect to the extracted lesson and course data
                    html += `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading${i}">
              <button id="unitbtn${i}" class="btnunit accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                ${name}
              </button>
            </h2>
            <div id="collapse${i}" data-id="${id}" class="accordion-collapse collapse" aria-labelledby="heading${i}" data-bs-parent="#accordionCourse${courseId}">
              <div class="accordion-body">
                <ul class="unit-list">
        `;  
       
                    // This code iterates through the extracted lessons and adds them one by one to the new HTML element
                    lessons.forEach(lesson => {
                        
                        const bonusClass = lesson.bounes_lesson === 1 ? "bonus-lesson" : "";
                        html += `<li class="active ${bonusClass}"><a href="#">${lesson.name}</a></li>`;

                    });

                    html += `
                </ul>
              </div>
            </div>
          </div>
        `;
                    // This code adds the newly built element to the accordionCourse element
                    accordionCourse.append(html);

                    if (prevUnitStatus === 1 && currentUnitStatus === 0) {
                        $(`#heading${i} button`).addClass('unitcurrentactive');
                        const unitVar = 0;
                        // html += `<a id="button${i}" data-unitVariable="${unitVar}" data-bs-toggle="collapse" data-bs-target="#collapse${i}"></a>`;
                    }
                    // This code handles the click event of the first unit, which triggers the 'show' method of the #collapse${i} element to display its content.
                    
                    //setTimeout(function () {
                        if (isFirstUnit) {

                            if (unitVariable === 0) {
                                $(`#button${i}`).addClass('unitFirstactive');
                            }
                            accordionCourse.on('click', `#button${i}`, function () {
                                $(`#collapse${i}`).collapse('show');

                            }).find(`#button${i}`).trigger('click');
                            
                            

                        }
                    prevUnitStatus = currentUnitStatus;    
                    //  setTimeout(function () {
                    //     preloader.hide();
                    //  }, 3000);
                    //}, 500);
                    //clearTimeout(timerId);
                    
                });
            },
            error: (jqXHR, textStatus, errorThrown) => {
                setTimeout(function () {
                    preloader.hide();
                }, 3000);
                console.error(textStatus, errorThrown);
            }
        });
        $(document).on('click', '.fast-track', function (event) {
           
            var currentElement = $(this); // replace with your own selector
            var nextImageDivs = currentElement.nextAll().filter('img, div').slice(0, 3);
            var nextDivs = currentElement.parents().nextAll().filter('img, div').slice(0, 3);

            var nextImageDiv1Id = nextImageDivs.eq(0).attr('class');
            var nextImageDiv2Id = nextDivs.eq(0).attr('id');
            var nextImageDiv3Id = nextDivs.eq(1).attr('id');

            $(`#${nextImageDiv3Id}`).addClass('hideClass');
            $(`#${nextImageDiv3Id}`).hide();
            $(`#${nextImageDiv2Id}`).addClass('showClass');
            $(`#${nextImageDiv2Id}`).show();
            //var autostring = nextImageDiv2Id.match(/\d+/)[0];
            var autostring = "";

            for (var i = 0; i < nextImageDiv2Id.length; i++) {
                if (!isNaN(nextImageDiv2Id.charAt(i))) {
                    autostring += nextImageDiv2Id.charAt(i);
                    break; // Exit the loop after the first number is found
                }
            }
            

            var courseID = currentElement.attr('data-course-id');
            var unitID = currentElement.attr('data-unit-id');
            var lessonID = currentElement.attr('data-lesson-id');
            var vocabularyID = currentElement.attr('data-vocabulary-id');
            var lastchar = currentElement.attr('data-lastchar');
            var track = currentElement.attr('data-track');
            
            let audioPlayer = document.getElementById("audio-player-" + lastchar);
            audioPlayer.src = '';
            audioPlayer.load();
            audioPlayer.src = track;
            selectPlayerVocabulary(lastchar, autostring, lessonID, vocabularyID, courseID, unitID);
            setUserActivity();
            audioPlayer.play();
           

        });
        $(document).on('click', `.slow-track`, function (event) {
            var currentElement = $(this); // replace with your own selector
            var previousImage = currentElement.prev('img');
            var nextDivs = currentElement.parents().nextAll('div').slice(0, 2);

            var nextDiv1Id = nextDivs.eq(0).attr('id');
            var nextDiv2Id = nextDivs.eq(1).attr('id');
            $(`#${nextDiv1Id}`).addClass('hideClass');
            $(`#${nextDiv1Id}`).hide();
            $(`#${nextDiv2Id}`).addClass('showClass');
            $(`#${nextDiv2Id}`).show();
           // var autostring = nextDiv2Id.match(/\d+/)[0];
            var autostring = "";
            for (var i = 0; i < nextDiv2Id.length; i++) {
                if (!isNaN(nextDiv2Id.charAt(i))) {
                    autostring += nextDiv2Id.charAt(i);
                    break; // Exit the loop after the first number is found
                }
            }
            var courseID = currentElement.attr('data-course-id');
            var unitID = currentElement.attr('data-unit-id');
            var lessonID = currentElement.attr('data-lesson-id');
            var vocabularyID = currentElement.attr('data-vocabulary-id');
            var lastchar = currentElement.attr('data-lastchar');
            var track = currentElement.attr('data-track');

            let audioPlayer = document.getElementById("audio-player-" + lastchar);

            audioPlayer.src = '';
            audioPlayer.load();
            audioPlayer.src = track;
            selectPlayerVocabulary(lastchar, autostring, lessonID, vocabularyID, courseID, unitID);
            setUserActivity();
            audioPlayer.play();
            
            
        });
        $(`#accordionCourse${courseId}`).on('show.bs.collapse', function (event) {
            var unitid = $(event.target).attr('data-id');
            var collapseid = $(event.target).attr('id');
            var url_unit = unitLessonUrl + '/' + unitid;
            if (unitLessonUrl != '') {
              
                preloader.show();
                $.ajax({
                    url: url_unit,
                    dataType: 'json',
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${apiToken}`,
                    },
                    success: async function (data) {
                        const unitdata = data.Unit;
                         $('.right-course-details').empty();
                         var univar;
                        if ($(`#button${courseId}`).hasClass('unitFirstactive')){
                            univar = 1;
                        }
                        
                        var lastDigit = collapseid.match(/\d$/)[0];
                        
                        if ($(`#unitbtn${lastDigit}`).hasClass('unitcurrentactive')) {
                            univar = 1;
                            
                        }
                        // if ($(`#${id} h2 button.unitcurrentactive`).length > 0) {
                        //     console.log(id + '5454545454464654566456');
                        //     univar = 1;
                        // }

                        let html = '';
                        html += `<h1 class="course-heading">${unitdata.name}</h1><div class="accordion custom-accordion slim-scroll mt-3" id="accordionUnit">`;

                        let i = 0;
                        let prevLessonTrackStatus = 0;
                        let prevLessonView = 0;

                        $.each(unitdata.course_lesson, async function (data, val) {
                            i++;
                            const currentLessonTrackStatus = parseInt(val.lessontrack_status);
                            const currentLessonView = parseInt(val.lesson_view);

                            if (prevLessonTrackStatus === 1 && currentLessonTrackStatus === 0) {
                                val.lessontrack_status = 1;
                                val.lesson_view = 1;
                            } else {
                                val.lessontrack_status = currentLessonTrackStatus;
                                val.lesson_view = currentLessonView;
                            }

                            html += CreateAccordinHtml(data, val, i, univar, val.lessontrack_status, val.lesson_view);

                            prevLessonTrackStatus = currentLessonTrackStatus;
                            prevLessonView = currentLessonView;
                        });

                       /* let prevLessonTrackStatus = 0;
                        let prevLessonView = 0;
                        $.each(unitdata.course_lesson, async function (data, val) {
                            i++;
                            console.log("course esson val");
                            console.log(typeof(val.lessontrack_status));
                            console.log(typeof (val.lesson_view));

                            // Check if previous values were set to 1
                            if (prevLessonTrackStatus === 1 && prevLessonView === 1) {
                                prevLessonTrackStatus = 1;
                                prevLessonTrackStatus = 1;
                            }else{
                                prevLessonTrackStatus = parseInt(val.lessontrack_status);
                                prevLessonView = parseInt(val.lesson_view);
                            }
                            html += CreateAccordinHtml(data, val, i, univar, prevLessonTrackStatus, prevLessonView);
                            // Store current values for the next iteration
                            prevLessonTrackStatus = parseInt(val.lessontrack_status);
                            prevLessonView = parseInt(val.lesson_view);
                        });*/

                        html += '</div></div>';
                        $('.right-course-details').append(html);
                        // setTimeout(function () {
                        //     preloader.hide();
                        // }, 3000);
                    },
                    error: (xhr, status, error) => {
                        // Hide the preloader and log the error message
                        setTimeout(function () {
                            preloader.hide();
                        }, 3000);
                        console.log(xhr.responseText);
                    },
                });
                $("#buttonNew1").click(function () {
                    $("#collapseNew1").collapse("show");
                });
                /*$(document).ready(function () {
                  // Disable the accordion
                    
                  // Enable and open the first accordion item after 1 seconds
                  setTimeout(function () {
                     const accordionUnit = $('#accordionUnit > .accordion-item');
                     accordionUnit.addClass('inactive');
                     const firstChild = accordionUnit.first();
                     firstChild.removeClass('inactive');
                     $('#accordionUnit .accordion-item:first-of-type .accordion-button').click();
                  }, 500);
                });*/
                function isYouTubeLink(url) {
                    // Regular expression pattern to match YouTube URLs
                    var pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)/;

                    // Test if the URL matches the pattern
                    return pattern.test(url);
                }
                function getYouTubeVideoId(url) {
                    // Regular expression pattern to match YouTube URLs
                    var pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([^&?\/ ]{11})/;

                    // Execute the pattern and extract the video ID
                    var match = url.match(pattern);

                    // Check if a match is found and return the video ID
                    if (match && match[1]) {
                        return match[1];
                    } else {
                        // Invalid YouTube URL
                        return null;
                    }
                }

       //left sider bar unit click functionlity works
                $(document).on('click', '.accordion-header', async function () {
                    const $this = $(this);
                   // alert('hello');  
                    preloader.show();
                    var selectedDiv = $this.parent(); // Replace "selectedDiv" with the ID or selector of your selected div
                    
                    var countLesson = selectedDiv.siblings('div.accordion-item').length + 1;
                    
                    const lessonView = $this.data('lessonview');
                    const lessonData = $this.data('less-object');
                    const lesson_id = $this.data('lessonid');
                    const lesson_percent = $this.data('lessontrack');
                    
                    if (lesson_percent == null) {
                        userpointapi(lesson_id, 'lesson_view');
                    }
                    setUserActivity();
                    const lessonType = $this.data('lesson-type');
                    const myString = $this.attr('id');
                    const lastChar = myString.substr(-1);
                    
                    const audioPlayer = document.querySelector('.audioPlayer');
                    if (audioPlayer) {
                        emptyAudioForPlayer();
                    }

                    if (lessonType === 1) {
                        $('.preloader').show();

                        const lesson_audio_url = $this.data('audio-url');
                        const bounes_lesson = $this.data('bounes_lesson');
                        const lesson_video_url = $this.data('video-url');
                        
                        try {
                            
                            if (bounes_lesson === 1) {
                                // Get the video container element
                                const videoContainer = document.getElementById('video-container' + lastChar);
                                if (videoContainer.firstChild){
                                    while (videoContainer.firstChild) {
                                        videoContainer.removeChild(videoContainer.firstChild);
                                    }
                                }
                                userpointapi(lesson_id, 'video_start');


                                var videoUrl = lesson_video_url;
                                var isValidLink = isYouTubeLink(videoUrl);

                                if (isValidLink) {
                                    //document.addEventListener('DOMContentLoaded', function () {
                                        var lesson_video_url2 = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with the actual YouTube video URL

                                        var videoId = getYouTubeVideoId(lesson_video_url);
                                        const playerId = 'youtube-video-' + lesson_id;
                                        
                                        //const videoContainer = document.getElementById('video-container');
                                        if (!videoContainer) {
                                            console.log('videoContainer element not found');
                                            return;
                                        }

                                        const video = document.createElement('div');
                                        video.setAttribute('id', playerId);
                                        videoContainer.appendChild(video);

                                        function onYouTubeIframeAPIReady() {
                                            player = new YT.Player(playerId,  {
                                                height: '360',
                                                width: '625',
                                                videoId: videoId,
                                                events: {
                                                    'onReady': onPlayerReady,
                                                    'onStateChange': onPlayerStateChange
                                                }
                                            });
                                        }
                                    if (typeof YT !== 'undefined' && YT.loaded) {
                                        // If the YouTube API is already loaded, call onYouTubeIframeAPIReady directly
                                        onYouTubeIframeAPIReady();
                                    } else {
                                        // Load the YouTube API asynchronously
                                        var tag = document.createElement('script');
                                        tag.src = 'https://www.youtube.com/iframe_api';
                                        var firstScriptTag = document.getElementsByTagName('script')[0];
                                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                                    }
                                        /*if (typeof YT !== 'undefined' && YT.loaded) {
                                            // If the YouTube API is already loaded, call onYouTubeIframeAPIReady directly
                                            onYouTubeIframeAPIReady();
                                        } else {
                                            // Load the YouTube API asynchronously
                                            var tag = document.createElement('script');
                                            tag.src = 'https://www.youtube.com/iframe_api';
                                            var firstScriptTag = document.getElementsByTagName('script')[0];
                                            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                                        }*/
                                    var video_start = 0;
                                    var video_end = 0;
                                    var playPrecentage = 0;
                                    userLessonTrackApi(lesson_id, handleResponse);
                                    function handleResponse(response) {
                                        video_start = response.lesson_track.start_datetime;
                                        video_end = response.lesson_track.audio_duration;
                                        playPrecentage = parseInt(response.lesson_track.play_precentage);
                                        if (playPrecentage == 100) {
                                            var collapseElement = $(`#collapseNew${lastChar}`);
                                            const nextChild = collapseElement.parents().next();
                                            nextChild.removeClass('inactive');
                                        }
                                        if (video_end) {
                                            playVideoFromCurrentTime(video_end);
                                        }

                                    }
                                    function playVideoFromCurrentTime(currentTime) {
                                        const seekOffset = 10; // Offset of 10 seconds (you can adjust this as needed)
                                        const seekTime = currentTime + seekOffset;
                                        const allowSeekAhead = true; // Allow seeking ahead
                                        player.seekTo(seekTime, allowSeekAhead);

                                    }    


                                    function onPlayerReady(event) {
                                        // Video is ready to play
                                        //player.addEventListener('onPlayerTimeUpdate', onPlayerTimeUpdate);
                                        //player.addEventListener('onProgress', onPlayerTimeUpdate);
                                        player.addEventListener('onStateChange', onPlayerStateChange);
                                    }
                                    let videoytplayed = false;
                                  /*  function onPlayerStateChange(event) {

                                        if (event.data === YT.PlayerState.PLAYING) {
                                            // Video started playing
                                            setUserActivity();
                                            

                                            const videoCurrentTime = player.getCurrentTime();
                                            
                                            const currentTimeMs = Math.floor(videoCurrentTime * 1000);
                                            const videoDuration = player.getDuration();
                                            myFunction(videoCurrentTime,videoDuration) ;
                                            const progress = Math.floor((videoCurrentTime / videoDuration) * 100);

                                            //lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, video_end,videoCurrentTime);
                                            const currentTimestamp = new Date().getTime();
                                            const vacubularyId = [];
                                            var unitresult = compareNumberAndString(countLesson, lastChar);
                                            lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, currentTimestamp, videoCurrentTime, unitresult, vacubularyId);

                                        } else if (event.data === YT.PlayerState.ENDED) {
                                            // Video ended
                                            const videoCurrentTimeMs = player.getCurrentTime() * 1000;
                                            const videoDuration = player.getDuration();
                                            const progress = Math.floor(player.getCurrentTime() / videoDuration * 100);
                                            //lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, video_end,videoCurrentTimeMs);
                                            const currentTimestamp = new Date().getTime();
                                            const vacubularyId = [];
                                            var unitresult = compareNumberAndString(countLesson, lastChar);
                                            lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, currentTimestamp, videoCurrentTimeMs, unitresult, vacubularyId);
                                            //if (progress == 100){
                                            videoplayed = true;
                                            
                                            var collapseElement = $(`#collapseNew${lastChar}`);
                                            const nextChild = collapseElement.parents().next();
                                            nextChild.removeClass('inactive');

                                        } else if (event.data === YT.PlayerState.PAUSED) {
                                            setUserActivity();
                                        }

                                        myFunction(videoCurrentTime, videoDuration)
                                        {
                                            //function onPlayerTimeUpdate(event) {
                                            // Video time updated
                                            console.log('Video time updated:', player.getCurrentTime());
                                            

                                            const videoCurrentTime = videoCurrentTime;
                                            
                                            const currentTimeMs = Math.floor(videoCurrentTime * 1000);
                                            const myVideo = document.getElementById("my-video" + lesson_id);
                                            const videoDuration = videoDuration;
                                            const progress = Math.floor((videoCurrentTime / videoDuration) * 100);
                                            
                                            if (progress === 100 && videoplayed) {
                                                Swal.fire({
                                                    iconHtml: `<img src="${thumbsupicon}" alt="thumbs up icon" width="180" height="180">`,
                                                    title: 'Great Work',
                                                    text: "Let's move to the next lesson",
                                                    showConfirmButton: true,
                                                });
                                            }
                                            if (progress % 10 === 0) {
                                                //lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, video_end, videoCurrentTime);

                                                const currentTimestamp = new Date().getTime();
                                                const vacubularyId = [];
                                                lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, currentTimestamp, videoCurrentTime, 0, vacubularyId);
                                            }
                                        }

                                    }*/

                                    //vidoe playing function in lesson type 1
                                    function onPlayerStateChange(event) {
                                        if (event.data === YT.PlayerState.PLAYING) {
                                            // Video started playing
                                            
                                            setUserActivity();
                                            const videoCurrentTime = player.getCurrentTime();
                                            const videoDuration = player.getDuration();
                                            
                                            setInterval(function () {
                                                myFunction(videoCurrentTime, videoDuration);
                                            }, 1000); 

                                            const progress = Math.floor((videoCurrentTime / videoDuration) * 100);
                                            
                                            const currentTimestamp = new Date().getTime();
                                            const vacubularyId = [];
                                            var unitresult = compareNumberAndString(countLesson, lastChar);
                                            lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, currentTimestamp, videoCurrentTime, unitresult, vacubularyId);
                                        } else if (event.data === YT.PlayerState.ENDED) {
                                            // Video ended
                                            
                                            const videoCurrentTime = player.getCurrentTime();
                                            const videoDuration = player.getDuration();
                                            const progress = Math.floor((videoCurrentTime / videoDuration) * 100);
                                            
                                            const currentTimestamp = new Date().getTime();
                                            const vacubularyId = [];
                                            var unitresult = compareNumberAndString(countLesson, lastChar);
                                            lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, currentTimestamp, videoCurrentTime, unitresult, vacubularyId);

                                            videoytplayed = true;
                                            var collapseElement = $(`#collapseNew${lastChar}`);
                                            const nextChild = collapseElement.parents().next();
                                            nextChild.removeClass('inactive');
                                        } else if (event.data === YT.PlayerState.PAUSED) {
                                            setUserActivity();
                                        }
                                    }
                                    //image appearing for thumb function    
                                    function myFunction(videoCurrentTime, videoDuration) {
                                        
                                        const currentTimeMs = Math.floor(videoCurrentTime * 1000);
                                        const myVideo = document.getElementById(playerId);
                                        const progress = Math.floor((videoCurrentTime / videoDuration) * 100);
                                        
                                        if (progress === 100 && videoytplayed) {
                                            Swal.fire({
                                                iconHtml: `<img src="${thumbsupicon}" alt="thumbs up icon" width="180" height="180">`,
                                                title: 'Great Work',
                                                text: "Let's move to the next lesson",
                                                showConfirmButton: true,
                                            });
                                        }

                                        if (progress % 10 === 0) {
                                            const currentTimestamp = new Date().getTime();
                                            const vacubularyId = [];
                                            lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, currentTimestamp, videoCurrentTime, 0, vacubularyId);
                                        }
                                    }
                                  
                                   // });

                                    
                                }else{

                                    //videoContainer.empty();
                                    // Create a new video element
                                    const video = document.createElement('video');
                                    video.src = lesson_video_url;
                                    video.setAttribute('id', 'my-video' + lesson_id);
                                    // Set video attributes (optional)
                                    video.controls = true;
                                    video.autoplay = false;
    
                                    // Add the video element to the container
                                    videoContainer.appendChild(video);
                                    var video_start = 0;
                                    var video_end = 0;
                                    var playPrecentage = 0;
                                    userLessonTrackApi(lesson_id, handleResponse);
                                    function handleResponse(response) {
                                        video_start = response.lesson_track.start_datetime;
                                        video_end = response.lesson_track.audio_duration;
                                        playPrecentage = parseInt(response.lesson_track.play_precentage);
                                        if (playPrecentage == 100) {
                                            var collapseElement = $(`#collapseNew${lastChar}`);
                                            const nextChild = collapseElement.parents().next();
                                            nextChild.removeClass('inactive');
                                        }
                                        if (video_end) {
                                            playVideoFromCurrentTime(video_end);
                                        }

                                    }
                                    function playVideoFromCurrentTime(currentTime) {
                                        video.currentTime = currentTime;

                                    }

                                    video.addEventListener('play', () => {
                                        setUserActivity();
                                        const videoCurrentTime = video.currentTime;
                                        const currentTimeMs = video.currentTime * 1000;
                                        const audioDuration = video.duration;
                                        const progress = Math.floor(video.currentTime / audioDuration * 100);
                                        //lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, video_end,videoCurrentTime);
                                        const currentTimestamp = new Date().getTime();
                                        const vacubularyId = [];
                                        var unitresult = compareNumberAndString(countLesson, lastChar);
                                        lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, currentTimestamp, videoCurrentTime, unitresult, vacubularyId);


                                    });
                                    video.addEventListener('pause', () => {
                                        setUserActivity();
                                    });
                                    let videoplayed = false;
                                    video.addEventListener('ended', () => {
                                        const videoCurrentTimeMs = video.currentTime * 1000;

                                        const videoDuration = video.duration;
                                        const progress = Math.floor(video.currentTime / videoDuration * 100);
                                        //lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, video_end,videoCurrentTimeMs);
                                        const currentTimestamp = new Date().getTime();
                                        const vacubularyId = [];
                                        var unitresult = compareNumberAndString(countLesson, lastChar);
                                        lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, currentTimestamp, videoCurrentTimeMs, unitresult, vacubularyId);
                                        //if (progress == 100){
                                        videoplayed = true;
                                        /* if (typeof video.play === 'function' && !video.paused) {
                                             
                                                 console.log('Video is playing');
                                                 
                                         console.log("video lessson progress");
                                         
                                         Swal.fire({
                                             iconHtml: `<img src="${thumbsupicon}" alt="thumbs up icon" width="180" height="180">`, // Set the custom HTML code for the icon
                                             title: "Great Work ",
                                             text: "Let's move to the next lesson", // Set the message text
                                             showConfirmButton: true, // Show the confirmation button
                                         });
                                        }*/
                                        var collapseElement = $(`#collapseNew${lastChar}`);
                                        const nextChild = collapseElement.parents().next();
                                        nextChild.removeClass('inactive');
                                    });

                                    video.addEventListener("timeupdate", function (e) {
                                        const videoCurrentTime = video.currentTime;
                                        const currentTimeMs = video.currentTime;
                                        var myVideo = $("#my-video" + lesson_id)[0];
                                        var videoduration = video.duration;
                                        const progress = Math.floor(video.currentTime / videoduration * 100);

                                        if (progress === 100 && videoplayed) {
                                            Swal.fire({
                                                iconHtml: `<img src="${thumbsupicon}" alt="thumbs up icon" width="180" height="180">`,
                                                title: 'Great Work',
                                                text: "Let's move to the next lesson",
                                                showConfirmButton: true,
                                            });
                                        }
                                        if (progress % 10 === 0) {
                                            //lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, video_end, videoCurrentTime);

                                            const currentTimestamp = new Date().getTime();
                                            const vacubularyId = [];
                                            lessonTrackApi(lessonData.course_id, lessonData.unit_id, lesson_id, progress, currentTimestamp, videoCurrentTime, 0, vacubularyId);
                                        }
                                        // if (video.currentTime == videoduration && updval) {
                                        //     userpointapi(lesson_id, 'video_completed');
                                        //     updval = 0;
                                        // }
                                    });
                                    
                                }
                               
                                setTimeout(function () {
                                    preloader.hide();
                                }, 3000);
                            } else {
                                // select the element to which you want to append a child
                                const parent = $('#divaudio' + lastChar);

                                // create a new child element and append it to the last child of the parent element
                                parent.children(':last-child').append(`<audio id="audio-player-${lastChar}" class="audioPlayer"  preload src="${lesson_audio_url}"></audio>`);
                                //parent.children(':last-child').append(`<audio id="audio-player-369" class="audioPlayer"  preload src="http://ec2-3-144-30-98.us-east-2.compute.amazonaws.com/lessions/lessionaudio/1686839009403QnsHVeL.mp3"></audio><button id="playPauseBtn">55</button>`);

                                setTimeout(function () {
                                    preloader.hide();
                                }, 3000);

                                /*var audio = $('#audio-player-369')[0];
                                var isPlaying = false;
                                $('#playPauseBtn').click(function () {
                                    if (isPlaying) {
                                        audio.pause();
                                        isPlaying = false;
                                        $(this).text('Play');
                                    } else {
                                        audio.play();
                                        isPlaying = true;
                                        $(this).text('Pause');
                                    }
                                });*/
                                const eyeText = $(`#eyetext${lastChar}`);
                                const eyeTextHide = $(`#eyetexthide${lastChar}`);
                                const divText = $(`#divtext${lastChar}`);

                                eyeTextHide.hide();

                                eyeText.click(function () {
                                    eyeText.hide();
                                    divText.hide();
                                    eyeTextHide.show();
                                });

                                eyeTextHide.click(function () {
                                    eyeTextHide.hide();
                                    divText.show();
                                    eyeText.show();
                                });

                                $('#divtext' + lastChar).empty();
                                designerAudioPlayer(lastChar, lesson_id, lessonData.unit_id, lessonData.course_id, lesson_percent, countLesson, lessonView, lesson_audio_url);
                            }


                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if (lessonType === 2) {
                        let html = '';
                        const preloader = $('.preloader');
                        preloader.show();
                        const unit_id = $this.data('unitid');
                        const course_id = $this.data('courseid');
                        const arrlesslength = $this.data('arr-lesson');
                        const lessonCount = $this.data('count-lesson');

                        // await Promise.all(promises).then(function () {
                        const playerHtml = createPlayerHtml(lastChar, arrlesslength, true);
                        html += playerHtml;
                        // $(`#collapseNew${lastChar} > accordion-body`).children(':last-child').append(html);

                        const accordionBody = $(`#collapseNew${lastChar} > .accordion-body`);
                        const lastChild = accordionBody.children().last();
                        lastChild.after(html);

                        setTimeout(function () {
                            preloader.hide();
                        }, 3000);



                        var audio_start = 0;
                        var audio_end = 0;
                        var playPrecentage = 0;
                        userLessonTrackApi(lesson_id, handleResponse);
                        function handleResponse(response) {
                            audio_start = response.lesson_track.start_datetime;
                            audio_end = response.lesson_track.audio_duration;
                            playPrecentage = parseInt(response.lesson_track.play_precentage);
                            if (playPrecentage == 100) {
                                var collapseElement = $(`#collapseNew${lastChar}`);
                                const nextChild = collapseElement.parents().next();
                                nextChild.removeClass('inactive');
                            }
                        }


                        multicharAudioPlayer(lastChar, arrlesslength, lessonCount);
                        $(`#playConversion-${lastChar}`).on('click', function () {
                            $('.mic-icon').hide();
                            $(`#playConversion-${lastChar}`).removeClass('active');
                            $(this).find('a').addClass('active');
                            $(`#characterA-${lastChar}`).find('a').removeClass('active');
                            $(`#characterB-${lastChar}`).find('a').removeClass('active');
                            changeCharacterBtn(lastChar, lessonCount);
                            playNext(lastChar, lessonCount, lesson_id, course_id, unit_id, countLesson);
                        });
                        $(`#characterA-${lastChar}`).on('click', function () {
                            $('.mic-icon').hide();
                            $('#divtext12').children().css('background', '');
                            $(this).find('a').addClass('active');
                            $(`#playConversion-${lastChar}`).find('a').removeClass('active');
                            $(`#characterB-${lastChar}`).find('a').removeClass('active');
                            console.log(countLesson+"count lesson");
                            changeCharacterBtn(lastChar, lessonCount);
                            playAudioForCharacter('characterA', lastChar, lessonCount, lesson_id, course_id, unit_id, countLesson);
                        });
                        $(`#characterB-${lastChar}`).on('click', function () {
                            $('.mic-icon').hide();
                            $(this).find('a').addClass('active');
                            $(`#playConversion-${lastChar}`).find('a').removeClass('active');
                            $(`#characterA-${lastChar}`).find('a').removeClass('active');
                            changeCharacterBtn(lastChar, lessonCount);
                            playAudioForCharacter('characterB', lastChar, lessonCount, lesson_id, course_id, unit_id, countLesson);
                        });

                        //  });

                    }
                    if (lessonType === 3) {
                        let html = '';
                        // let lessonCounter = 0;
                        const preloader = $('.preloader');
                        preloader.show();


                        const arrlesslength = $this.data('arr-lesson');
                        const arraytracklength = arrlesslength * 2;



                        const playerHtml = createPlayerHtml(lastChar, arraytracklength, false);

                        html += playerHtml;
                        // $(`#collapseNew${lastChar} > accordion-body`).children(':last-child').append(html);

                        const accordionBody = $(`#collapseNew${lastChar} > .accordion-body`);
                        const lastChild = accordionBody.children().last();
                        lastChild.after(html);

                        //$(`#contentNew${lastChar}`).children(':last-child').append(html);

                        setTimeout(function () {
                            preloader.hide();
                        }, 3000);
                        //$('#divtext' + lastChar).empty();
                        multicharAudioPlayer(lastChar, 2, arraytracklength);
                        //playNext(lastChar, arraytracklength, lesson_id);
                    }

                });
                $('#buttonNew1').trigger('click');
                 setTimeout(function () {
                     preloader.hide();
                 }, 3000);
            }

        });


    }
        function compareNumberAndString(number, string) {
            var convertedString = parseInt(string); // or parseFloat(string) for decimal numbers

            if (number === convertedString) {
                return 1;
            } else {
                return 2;
            }
        }
      
        function CreateAccordinHtml(data, val, i, univar, prevLessonTrackStatus, prevLessonView) {
            let htmlAccordin = '';
            
            const lessonId = val.id;
            var unit_lesson = lessondetailUrl;
            if (lessondetailUrl != '') {
                $.ajax({
                    url: unit_lesson,
                    type: "POST",
                    data: { lesson_id: lessonId },
                    dataType: 'json',
                    async: false,
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${apiToken}`,
                    },
                    success: async function (data) {
                        const lessondata = data.Lessions;
                        
                        let lessonInactive = '';
                        if (i === 1) {
                            htmlAccordin += `<a id="buttonNew${i}" data-bs-toggle="collapse" data-bs-target="#collapseNew${i}"></a>`;
                        }
                        let lesson_track = null;
                        if (lessondata.lesson_track) {
                            lesson_track = val.lesson_track.play_precentage;
                        }
                        //const lessonStatus = parseInt(lessondata.lessontrack_status);
                        //const lessonView = parseInt(lessondata.lesson_view);
                        const lessonStatus = parseInt(val.lessontrack_status);
                        const lessonView = parseInt(val.lesson_view);
                        
                        
                        if (prevLessonTrackStatus === 0 && prevLessonView === 0) {
                            //lessonInactive = 'inactive';
                            // last code disable all the inactive accordins in lesson according to requirement
                            lessonInactive = 'active';
                        }

                       // if (lessonStatus === 0 && lessonView === 0) {
                       //     lessonInactive = 'inactive';
                       // }
                        console.log(univar);
                        if (univar === 1 && i === 1) {
                            lessonInactive = 'active';
                        }
                        
                        const lessonContent = lessondata.lesson_content;
                        const lessonConversion = lessondata.lesson_conversion;
                        const lessonVocabulary = lessondata.lesson_vocabulary;

                        let audio_url = '';
                        let content = '';


                        const hasLessonContent = lessonContent.length > 0;
                        const hasLessonConversion = lessonConversion.length > 0;
                        const hasLessonVocabulary = lessonVocabulary.length > 0;



                        if (hasLessonContent) {
                          
                            htmlAccordin += lessonContentAccordin(lessondata, lessonContent, i, lesson_track, val, lessonInactive, lessonView);
                        }

                        if (hasLessonConversion) {
                            htmlAccordin += lessonConversionAccordin(lessonConversion, i, val, lessonInactive, lessonView);
                        }

                        if (hasLessonVocabulary) {

                            const arrlessonlength = lessonVocabulary.length;
                            //${lessonobj3}
                            htmlAccordin += `
    <div class="accordion-item ${lessonInactive}">
        <h2 class="accordion-header"  data-lessonid='${lessondata.id}'  data-lesson-type='3' data-less-object='${lessonVocabulary}'  data-arr-lesson='${arrlessonlength}' id="headingNew${i}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNew${i}" aria-expanded="false" aria-controls="collapseNew${i}">
                ${val.name}
            </button>
        </h2>
        <div id="collapseNew${i}" class="accordion-collapse collapse" aria-labelledby="headingNew${i}" data-bs-parent="#accordionUnit">
            <div class="accordion-body">
                <div class="course-content mt-3" id="contentNew${i}">${content}</div>`;

                            // $.each(lessonVocabulary, function(index, value) {
                            //    htmlAccordin += lessonVocabularyAccordin(value, i,val); 
                            //        });
                            lessonVocabulary.forEach((value, index) => {
                                
                                htmlAccordin += `<div class="track-icons"><img src="${fastTrackicon}" data-course-id="${value.course_id}" data-unit-id="${value.unit_id}" data-lesson-id="${value.lesson_id}" data-vocabulary-id="${value.id}" data-lastchar="${i}"  data-track="${value.fast_filename}" alt="user" class="fast-track  rounded rounded-40 profile-img" width="40" /><img src="${slowTrackicon}" data-course-id="${value.course_id}" data-unit-id="${value.unit_id}" data-lesson-id="${value.lesson_id}" data-vocabulary-id="${value.id}" data-lastchar="${i}" alt="user" data-track="${value.slow_filename}" class="slow-track rounded rounded-40 " width="40" /></div>`;
                                htmlAccordin += lessonVocabularyAccordin(value, i, val, index);
                                
                            });

                            //console.log('lessonVocabulary');
                            //console.log(lessonVocabulary);

                            htmlAccordin += `</div></div></div>`;

                        }

                    }

                });

            }

            return htmlAccordin;

        }


        function lessonVocabularyAccordin(lessonVocabulary, i, val, PreIndex) {
            let htmlAccordin = '';

            const {
                lesson_id: voclessonId,
                phrase_text: content,
                lesson_vocabulary_id: lessonvocabulary_id,
                fast_filename: filenameFast,
                slow_filename: filenameSlow,
                unit_id,
                course_id
            } = lessonVocabulary;

            const lesssonobjvocabulury = JSON.stringify([
                {
                    lessonvocabulary_id,
                    vocabulary_file_type: 1,
                    filename: filenameFast,
                    unit_id,
                    course_id,
                    lesson_id: voclessonId
                },
                {
                    lessonvocabulary_id,
                    vocabulary_file_type: 2,
                    filename: filenameSlow,
                    unit_id,
                    course_id,
                    lesson_id: voclessonId
                }
            ]);
            const lessonobj3 = lesssonobjvocabulury;
            const lesssonobjaudiostriker = lessonVocabulary.audiostriker;
            const vocabularyhtml = [];
            let lessonCounterVocabulary = 0;
            if (PreIndex != lessonCounterVocabulary) {
                lessonCounterVocabulary = PreIndex + 1;
            }

            //for (const value of lesssonobjaudiostriker) {
            for (const [index, value] of lesssonobjaudiostriker.entries()) {
                if (!value || !value.content) {
                    continue;
                }

                try {
                    const { text: responseText = '', audio_url: responseAudioUrl = '' } = JSON.parse(value.content);

                    if (responseText.trim()) {
                        lessonCounterVocabulary++;
                        htmlAccordin += createDialogHtmlVocabulary(lessonCounterVocabulary, i, gender = 0, JSON.parse(value.content), value, index);
                    }
                } catch (error) {
                    console.error("Invalid JSON:", error);
                }
                
            }
    
            /*for (const [index, value] of lesssonobjaudiostriker.entries()) {    
                if (value && value.content) {
                    const responseJson = value.content;

                    let text = '';
                    let audio_url = '';

                    if (responseJson) {
                        const { text: responseText, audio_url: responseAudioUrl } = $.parseJSON(value.content);
                        const jsonObject = $.parseJSON(responseJson);
                        text = responseText ?? '';
                        audio_url = responseAudioUrl ?? '';
                    }

                    //const jsonObject = JSON.parse(responseJson);
                    //const text = jsonObject.text?.trim();
                    //const audio_url = jsonObject.audio_url?.toString();
                    
                    if (text) {
                        lessonCounterVocabulary++;
                        htmlAccordin += createDialogHtmlVocabulary(lessonCounterVocabulary, i, gender = 0, jsonObject, value, index);
                    }
                }
            }*/

            return htmlAccordin;
        }



        // setTimeout(function () {
        //     var playPrecentage = 0;
        //     userLessonTrackApi(voclessonId, handleResponse);
        //     function handleResponse(response) {

        //         playPrecentage = parseInt(response.lesson_track.play_precentage);
        //         if (playPrecentage == 100) {


        //             var collapseElement = $(`#collapseNew${i}`);
        //             const nextChild = collapseElement.parents().next();
        //             nextChild.removeClass('inactive');

        //         }
        //     }
        // }, 1000); 
        function lessonConversionAccordin(lesson_conversion, i, val, lessonInactive, lessonView) {
            htmlAccordin = '';
            const convslessonId = lesson_conversion[0].lesson_id;
            const convsUnitId = lesson_conversion[0].unit_id;
            const convsCourseId = lesson_conversion[0].course_id;
            content = lesson_conversion[0].conversation_text;
            var lessonobj2 = JSON.stringify(lesson_conversion);
            const arrlessonlength = lesson_conversion.length;
            let lessonCounter = 0;
            //const preloader = $('.preloader');
            //preloader.show();

            let conversionhtml = '';
            lesson_conversion.map(async function (value, data) {
                const lesssonConversobj = {
                    filename: value.attachment_file,
                    unit_id: value.unit_id,
                    course_id: value.course_id,
                    lesson_id: value.lesson_id
                };
                const gender = value.character_gender;
                const response = value.audiostriker;
                const jsonObject = $.parseJSON(response.content);

                const text = jsonObject.text ?? '';
                const audio_url = jsonObject.audio_url ?? '';



                if (jsonObject.text) {
                    ++lessonCounter;
                    const dialoghtml = createDialogHtml(lessonCounter, i, gender, jsonObject, response);
                    const lessonConversationReply = value.lesson_conversionreply;

                    let replyDialogHtml = '';
                    if (lessonConversationReply) {
                        const responseRly = lessonConversationReply.audiostriker;
                        const jsonObjectRly = $.parseJSON(responseRly.content);
                        const text = jsonObjectRly.text ?? '';
                        const audio_url = jsonObjectRly.audio_url ?? '';

                        if (jsonObjectRly.text) {
                            ++lessonCounter;
                            replyDialogHtml = createDialogHtml(lessonCounter, i, lessonConversationReply.character_gender, jsonObjectRly, responseRly);

                        }
                    }

                    conversionhtml += dialoghtml + replyDialogHtml;
                }
            });

            htmlAccordin += `
    <div class="accordion-item ${lessonInactive} ${lessonView}">
        <h2 class="accordion-header" data-lessonview='${lessonView}' data-unitid='${convsUnitId}' data-courseid='${convsCourseId}' data-lessonid='${convslessonId}' data-count-lesson='${lessonCounter}' data-arr-lesson='${arrlessonlength}' data-lesson-type='2' data-less-object='${lessonobj2}' id="headingNew${i}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNew${i}" aria-expanded="false" aria-controls="collapseNew${i}">
                ${val.name}
            </button>
        </h2>`;
            htmlAccordin += `<div id="collapseNew${i}" class="accordion-collapse collapse" aria-labelledby="headingNew${i}" data-bs-parent="#accordionUnit">
            <div class="accordion-body">
                <div class="course-content mt-3" id="contentNew${i}">${content}</div>`;

            htmlAccordin += conversionhtml;

            htmlAccordin += `</div></div></div>`;

            // setTimeout(function () {
            //     var playPrecentage = 0;
            //     userLessonTrackApi(convslessonId, handleResponse);
            //     function handleResponse(response) {

            //         playPrecentage = parseInt(response.lesson_track.play_precentage);
            //         if (playPrecentage == 100) {


            //             var collapseElement = $(`#collapseNew${i}`);
            //             const nextChild = collapseElement.parents().next();
            //             nextChild.removeClass('inactive');


            //         }
            //     }
            // }, 2000);
            return htmlAccordin;
        }



        function lessonContentAccordin(lessondata, lesson_content, i, lesson_track, val, lessonInactive, lessonView) {
            let htmlAccordin = '';
           // console.log("lesson_content:--------"+lesson_content[0]);
            const contntlessonId = lesson_content[0].lesson_id;
            content_lesson = lessondata.description;
            //content = lesson_content[0].content_description;
            content = lessondata.description;
            
            const lesssonobj = {
                filename: lesson_content[0].filename,
                unit_id: lesson_content[0].unit_id,
                course_id: lesson_content[0].course_id,
                lesson_id: lesson_content[0].lesson_id
            };
            const response = lesson_content[0].audiostriker;
            const bounes_lession = lesson_content[0].bounes_lesson; 
            const video_link = lesson_content[0].video_link;
            let text = '';
            let audio_url = '';

            if (response) {
                const { text: responseText, audio_url: responseAudioUrl } = $.parseJSON(response.content);
                text = responseText ?? '';
                audio_url = responseAudioUrl ?? '';
            }
            

            var playPrecentage = 0;
            userLessonTrackApi(contntlessonId, handleResponse);
            function handleResponse(response) {
                playPrecentage = parseInt(response.lesson_track.play_precentage);
                if (playPrecentage == 100) {
                    setTimeout(function () {
                        var collapseElement = $(`#collapseNew${i}`);
                        const nextChild = collapseElement.parents().next();
                        nextChild.removeClass('inactive');
                    }, 1000);
                }
            }
            htmlAccordin += `
    <div class="accordion-item ${lessonInactive} ${lessonView}">
        <h2 class="accordion-header" data-lessonview='${lessonView}' data-lessontrack='${lesson_track}'  data-lessonid='${contntlessonId}'  data-bounes_lesson='${bounes_lession}' data-video-url='${video_link}' data-audio-url='${audio_url}'  data-lesson-type='1' data-less-object='${JSON.stringify(lesssonobj)}' id="headingNew${i}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNew${i}" aria-expanded="false" aria-controls="collapseNew${i}">
                ${val.name}
            </button>
        </h2>
        <div id="collapseNew${i}" class="accordion-collapse collapse" aria-labelledby="headingNew${i}" data-bs-parent="#accordionUnit">
            <div class="accordion-body">
                `;
            let videohtml = '';
            if (bounes_lession === 1) {
                videohtml = `<div class="video-container bonus-video" id="video-container${i}"></div><div class="course-content" id="contentNew${i}">${content_lesson}</div>`;
                htmlAccordin += videohtml;
            }
            else {
                if (text) {
                    htmlAccordin += `<div class="course-content" id="contentNew${i}">${content}</div><div class="eye-btn"><div id="eyetext${i}"><i class="bi-eye-fill"></i> Hide
                  </div><div id="eyetexthide${i}"><i class="bi-eye-slash-fill"></i> View
                  </div></div><div id="divtext${i}" class="practice-test slim-scroll"></div>`;
                    htmlAccordin += `<div id="divhid${i}" style="display:none;">${response.content}</div>`;
                }
                if (audio_url && bounes_lession !== 1) {
                    htmlAccordin += `<div id="divaudio${i}" class="player paused mt-5 practice-content"><div class="info"><div class="time"><span class="current-time">0:00</span><span class="progress"><span></span></span><span class="duration">0:00</span></div></div><div class="actions"><button class="button rw"><div class="arrow"></div><div class="arrow"></div></button><button class="button buttonaudio play-pause"><div class="arrow"></div></button><button class="button ff"><div class="arrow"></div><div class="arrow"></div></button></div></div>`;
                }
                
            }





            /*if (bounes_lession === 1) {
                videohtml = `<div class="video-container" id="video-container${i}"></div>`;
                htmlAccordin += videohtml;
            } else {
                if (text) {
                    htmlAccordin += `<div class="eye-btn"><div id="eyetext${i}"><i class="bi-eye-fill"></i> Hide
                      </div><div id="eyetexthide${i}"><i class="bi-eye-slash-fill"></i> View
                      </div></div><div id="divtext${i}" class="practice-test slim-scroll"></div>`;
                    htmlAccordin += `<div id="divhid${i}" style="display:none;">${response.content}</div>`;
                }
                if (audio_url && bounes_lession !== 1) {
                    htmlAccordin += `<div id="divaudio${i}" class="player paused mt-5 practice-content"><div class="info"><div class="time"><span class="current-time">0:00</span><span class="progress"><span></span></span><span class="duration">0:00</span></div></div><div class="actions"><button class="button rw"><div class="arrow"></div><div class="arrow"></div></button><button class="button play-pause"><div class="arrow"></div></button><button class="button ff"><div class="arrow"></div><div class="arrow"></div></button></div></div>`;
                }
            }*/
            htmlAccordin += `</div></div></div>`;
            return htmlAccordin;
        }


        function createDialogHtml(data, lastChar, gender = 0, jsonObject, response) {

            // set a default value for gender as 0
            let charImg = '';
            switch (gender) { // use a switch statement instead of multiple if statements
                case 1:
                    charImg = `<img src="ci/assets/images/character-a.png" alt="user" class="male rounded rounded-40 profile-img" width="40" />`;
                    break;
                case 2:
                    charImg = `<img src="ci/assets/images/character-b.png" alt="user" class="female rounded rounded-40 profile-img" width="40"/>`;
                    break;
                default: // handle the case when gender is not 1 or 2
                    charImg = '';
                    break;
            }
            // use template literals for better readability
            let html = `
        <div id="divchar${data}${lastChar}" class="coversation-div d-flex"> 
            <div class="conversation-img">
                ${charImg}
            </div>
            <div id="divtext${data}${lastChar}" class="practice-test conversation-text slim-scroll px-3"></div>
            <div id="divmic${data}${lastChar}" class="mic-icon" style="display:none;">
                <i class="bi-mic-mute-fill"></i>
            </div>
            <div id="divsocket${data}${lastChar}" style="display:none;"></div>
            <div id="divhid${data}${lastChar}" style="display:none;">${response.content}</div>
            <div id="divaudio${data}${lastChar}" style="display:none;">${jsonObject.audio_url}</div>
        </div>`;
            return html;
        }

        function createDialogHtmlVocabulary(data, lastChar, gender = 0, jsonObject, response, index) {

            // set a default value for gender as 0
            let charImg = '';
            switch (gender) { // use a switch statement instead of multiple if statements
                case 1:
                    charImg = `<img src="ci/assets/images/character-a.png" alt="user" class="male rounded rounded-40 profile-img" width="40" />`;
                    break;
                case 2:
                    charImg = `<img src="ci/assets/images/character-b.png" alt="user" class="female rounded rounded-40 profile-img" width="40"/>`;
                    break;
                default: // handle the case when gender is not 1 or 2
                    charImg = '';
                    break;
            }
            
           
            const showvocab = index === 1 ? "hideClass" : "showClass";

            // use template literals for better readability
            let html = `
        <div id="divchar${data}${lastChar}" class="coversation-div ${showvocab}"> 
            <div class="conversation-img">
                ${charImg}
            </div>
            <div id="divtext${data}${lastChar}" class="practice-test conversation-text slim-scroll px-3"></div>
            <div id="divmic${data}${lastChar}" class="mic-icon" style="display:none;">
                <i class="bi-mic-mute-fill"></i>
            </div>
            <div id="divhid${data}${lastChar}" style="display:none;">${response.content}</div>
            <div id="divaudio${data}${lastChar}" style="display:none;">${jsonObject.audio_url}</div>
        </div>`;
            return html;
        }

        async function createReplyDialogHtml(lesssonConversobj, lessonConversationReply, data, lastChar) {
            try {
                let html = '';
                // if (!Array.isArray(lessonConversationReply)) { // Check if lessonConversationReply is not an array
                //     throw new TypeError('lessonConversationReply must be an array'); // Throw an error if it's not
                // }

                let lessonConversationReplyNew = [];

                if (!Array.isArray(lessonConversationReply)) {
                    lessonConversationReplyNew = [lessonConversationReply];
                }

                // Now you can pass lessonConversationReply to the code that expects an array

                for (const val of lessonConversationReplyNew) {
                    const promise = await handleOneLoop(lesssonConversobj, val, data, lastChar);
                    html += promise;
                }
                return html;
            } catch (err) {
                console.error('error', err);
                return '';
            }
        }


        async function handleOneLoop(lesssonConversobj, val, data, lastChar) {

            let html = '';
            let gender_rply = val.character_gender;

            const lesssonConversRlyobj = {
                filename: val.filename,
                unit_id: lesssonConversobj.unit_id,
                course_id: lesssonConversobj.course_id,
                lesson_id: lesssonConversobj.lesson_id
            };

            //const jsonLesssonConversRlyobj = JSON.stringify(lesssonConversRlyobj);
            // if (lesssonConversRlyobj) {
            //     throw new Error('val is null check please');
            // }
            const responseRlyData = await audioToText(lesssonConversRlyobj);

            const responseRly = await responseRlyData.json();
            const jsonObjectRly = $.parseJSON(responseRly.audio.content);
            const text_rply = responseRly.audio.content.text ?? '';
            const audio_url_rply = responseRly.audio.content.audio_url ?? '';
            $(`#divchar${data}${lastChar}`).remove();
            $(`#divtext${data}${lastChar}`).remove();
            $(`#divhid${data}${lastChar}`).remove();
            $(`#divaudio${data}${lastChar}`).remove();
            // let datavar = 'R-' + data;
            if (jsonObjectRly.text) {

                let dialoghtml = createDialogHtml(data, lastChar, gender_rply, jsonObjectRly, responseRly);
                html += dialoghtml;
                return html;
            }
        }

        //create player Html  
        function createPlayerHtml(lastChar, arrlessonlength, hasConversation) {
            let displayHide = hasConversation ? "" : "display:none";
            $(`#audioPlayer${lastChar}`).remove();

            let html = `<div id="audioPlayer${lastChar}" class="player paused mt-3" style="${displayHide}">
                <div class="practice-content">
                  <div class="info">
                    <div class="time">
                      <span class="current-time">0:00</span>
                      <span class="progress"><span></span></span>
                      <span class="duration">0:00</span>
                    </div>
                  </div>
                  <div class="actions">
                    <button class="button rw">
                      <div class="arrow"></div>
                      <div class="arrow"></div>
                    </button>
                    <button class="button${lastChar} button play-pause">
                      <div class="arrow"></div>
                    </button>
                    <button class="button ff">
                      <div class="arrow"></div>
                      <div class="arrow"></div>
                    </button>
                  </div>
                  <audio id="audio-player-${lastChar}" class="audioPlayer" prelaod src=""></audio>
                </div>`;
            if (hasConversation) {
                html += `<div class="converstaion">
              <ul>
                <li id="playConversion-${lastChar}">
                  <a><img src="ci/assets/images/converstaion.png" alt="user" class="rounded rounded-40 profile-img" width="40"/> Play Conversation</a>
                </li>
                <li id="characterA-${lastChar}">
                  <a><img src="ci/assets/images/character-a.png" alt="user" class="rounded rounded-40 profile-img" width="40"/> Play Character A</a>
                </li>
                <li id="characterB-${lastChar}">
                  <a><img src="ci/assets/images/character-b.png" alt="user" class="rounded rounded-40 profile-img" width="40"/> Play Character B</a>
                </li>
              </ul>
            </div>`;
            }
            return html;
        }

        //This is an asynchronous function that takes in a parameter `params`
        async function audioToText(params) {
            //If any of these values are not present in params, the function returns a Promise rejection with the message "Missing required parameter"
            if (!params.filename || !params.course_id || !params.unit_id || !params.lesson_id) {
                return Promise.reject("Missing required parameter");
            }

            //Otherwise, this object is created with its properties being assigned to corresponding values extracted from `params` (with additional strings as per requirements)
            //audio_link: `${path}/lessons/${params.filename}`,
            const data = {
                audio_link: `${params.filename}`,
                course_id: params.course_id,
                unit_id: params.unit_id,
                lesson_id: params.lesson_id,
            };

            //if the `params` object has the property `lessonvocabulary_id`, it is assigned to the `data` object
            if (params.lessonvocabulary_id) {
                data.lessonvocabulary_id = params.lessonvocabulary_id;
            }

            //if the `params` object has the property `vocabulary_file_type`, it is assigned to the `data` object
            if (params.vocabulary_file_type) {
                data.vocabulary_file_type = params.vocabulary_file_type;
            }

            //a POST request is sent to the `audioTextUrl` with the `data` object provided along with header keys of "Content-Type" and "X-CSRF-TOKEN" and values of "application/json" and token respectively
            return fetch(audioTextUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": token,
                },
                body: JSON.stringify(data),
            });
        }

// This is used for Lesson Converstions multicharacter.
        function multicharAudioPlayer(lastChar, arrlessonlength, lessonCounter) {

            let player = $('#audioPlayer' + lastChar);
            let audio = player.find('audio');
            let duration = $('.duration');
            let currentTime = $('.current-time');
            let progressBar = $('.progress span');
            let mouseDown = false;
            let rewind, showCurrentTime;
            let audioPlayer = document.getElementById("audio-player-" + lastChar);
            let i = 0;
            let audioFiles = [];
            //let audioCharacterFiles = [];
            let audioCharacterFiles = {
                characterA: [],
                characterB: []
            };
            let tempMale = [];
            let tempFemale = [];
            for (let i = 1; i <= lessonCounter; i++) {
                audioFiles[i] = $(`#divaudio${i}${lastChar}`).text();
                $(`#divtext${i}${lastChar}`).empty();
                let audio_obj = $(`#divhid${i}${lastChar}`).text();
                if (audio_obj) {
                    let audio_arr = JSON.parse(audio_obj);
                    createSubtitle(audio_arr.words, i, lastChar);
                }

            }
// Append word to get from audio striker per word start and end
            function createSubtitle(syncData, ind, lastChar) {
                let subtitles = document.getElementById(`divtext${ind}${lastChar}`);
                var element;
                for (var i = 0; i < syncData.length; i++) {
                    element = document.createElement('span');

                    let endtime = syncData[i].end;
                    element.setAttribute("id", endtime);
                    element.innerText = syncData[i].text + " ";
                    subtitles.appendChild(element);
                }
            }
            let index = 0;
            let currentAudioIndex = 0;
            let autostring = index;
            audioPlayer.src = audioFiles[index];

        }
        function multiArraySearch(myArray, searchValue) {
            return myArray.some(subArray => subArray.includes(searchValue));
        }


        function playAudioForCharacter(character, lastChar, lessonCounter, lessonID, courseID, unitID, countLesson) {
            const audioPlayer = document.getElementById(`audio-player-${lastChar}`);
            const audioCharacterFiles = { characterA: [], characterB: [] };
            const audioFiles = [];
            const audioCharFiles = [];

            for (let i = 1; i <= lessonCounter; i++) {
                const audioFile = document.querySelector(`#divaudio${i}${lastChar}`).textContent;
                audioFiles[i] = audioFile;

                const imgMale = document.querySelector(`#divchar${i}${lastChar} img.male`);
                if (imgMale) {
                    audioCharFiles[i] = `characterA,${audioFile}`;
                    audioCharacterFiles['characterA'].push([i, audioFile].filter(isNonEmpty));
                }

                const imgFemale = document.querySelector(`#divchar${i}${lastChar} img.female`);
                if (imgFemale) {
                    audioCharFiles[i] = `characterB,${audioFile}`;
                    audioCharacterFiles['characterB'].push([i, audioFile].filter(isNonEmpty));
                }
            }


            const files = audioCharacterFiles[character][0];

            let index = 1;
            audioPlayer.onended = function () {
                index++;
                if (audioCharFiles[index]) {

                    const charIndex = audioCharFiles[index].split(",");
                    const chartype = charIndex[0];
                    if (chartype && character === chartype) {
                        let valid = multiArraySearch(audioCharacterFiles[chartype], index);
                        if (valid) {
                            mediaRecorderCharacter(lastChar, index, lessonID);
                        }

                    } else {
                        let valid = multiArraySearch(audioCharacterFiles[chartype], index);
                        if (valid) {
                            playAudio(lastChar, index, audioFiles, lessonID);
                        }

                    }
                }

                if (index < 0 || index >= audioFiles.length) {

                    //lessonTrackApi(courseID, unitID, lessonID, 100, '');
                    let audioPlayer = document.getElementById("audio-player-" + lastChar);
                    const audioCurrentTimeMs = audioPlayer.currentTime * 1000;
                    const currentTimestamp = new Date().getTime();
                    const vacubularyId = [];
                    var unitresult = compareNumberAndString(countLesson, lastChar);
                    lessonTrackApi(courseID, unitID, lessonID, 100, currentTimestamp, audioCurrentTimeMs, unitresult, vacubularyId);
                    Swal.fire({
                        iconHtml: `<img src="${thumbsupicon}" alt="thumbs up icon" width="180" height="180">`, // Set the custom HTML code for the icon
                        title: "Great Work",
                        text: "Let's move to the next lesson", // Set the message text
                        showConfirmButton: true, // Show the confirmation button
                    });
                    var collapseElement = $(`#collapseNew${lastChar}`);
                    const nextChild = collapseElement.parents().next();
                    nextChild.removeClass('inactive');
                    return;
                }

            };

            //Play the first audio file
            if (index === 1) {
                const charIndex = audioCharFiles[index].split(",");
                //const fileIndex = audioCharacterFiles[charIndex[0]][0][index]?.[0];
                const chartype = charIndex[0];
                const fileIndex = audioCharacterFiles[chartype][0][0];
                if (character === charIndex[0]) {
                    mediaRecorderCharacter(lastChar, fileIndex, lessonID);
                } else {


                    if (fileIndex) playAudio(lastChar, fileIndex, audioFiles, lessonID);

                }
            }

        }

        function isNonEmpty(value) {
            return Boolean(value);
        }
        function mediaRecorderCharacter_new(lastChar, index, lessonID) {
            const divmic = document.querySelector(`#divmic${index}${lastChar}`);
            divmic.style.display = 'block';
            const audioPlayer = document.getElementById(`audio-player-${lastChar}`);
            const messageEl = document.querySelector(`#divsocket${index}${lastChar}`);
            
            var audio_hide_obj = document.querySelector(`#divhid${index}${lastChar}`).textContent;
            var audio_hide_arr = JSON.parse(audio_hide_obj);
            var syncData_hide = audio_hide_arr.text;
            
            
            
            let isRecording = false;
            let socket;
            let recorder;

            const startRecording = async () => {
                const response = await fetch(realTokenUrl); // get temp session token from server.js (backend)
                const data = await response.json();

                if (data.error) {
                    alert(data.error);
                    return;
                }

                const { token } = data;

                // establish wss with AssemblyAI (AAI) at 16000 sample rate
                socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

                // handle incoming messages to display transcription to the DOM
                const texts = {};
                socket.onmessage = (message) => {
                    let msg = '';
                    const res = JSON.parse(message.data);
                    texts[res.audio_start] = res.text;
                    const keys = Object.keys(texts).sort((a, b) => a - b);
                    for (const key of keys) {
                        if (texts[key]) {
                            msg += ` ${texts[key]}`;
                        }
                    }
                    messageEl.innerText = msg;
                };

                socket.onerror = (event) => {
                    console.error(event);
                    socket.close();
                };

                socket.onclose = (event) => {
                    console.log(event);
                    socket = null;
                };

                // begin recording
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        recorder = new RecordRTC(stream, {
                            type: 'audio',
                            mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
                            recorderType: StereoAudioRecorder,
                            timeSlice: 250, // set 250 ms intervals of data that sends to AAI
                            desiredSampRate: 16000,
                            numberOfAudioChannels: 1, // real-time requires only one channel
                            bufferSize: 4096,
                            audioBitsPerSecond: 128000,
                            ondataavailable: (blob) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const base64data = reader.result;

                                    // audio data must be sent as a base64 encoded string
                                    if (socket) {
                                        socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                                    }
                                };
                                reader.readAsDataURL(blob);
                            },
                        });

                        recorder.startRecording();
                    })
                    .catch((err) => console.error(err));
            };

            const stopRecording = () => {
                if (socket) {
                    socket.send(JSON.stringify({ terminate_session: true }));
                    socket.close();
                    socket = null;
                }

                if (recorder) {
                    recorder.pauseRecording();
                    recorder = null;
                }

                isRecording = false;
                const messagetext = messageEl.textContent;
                usermatchString(syncData_hide, messagetext);
                messageEl.innerText = '';
            };

            const toggleRecording = () => {
                if (isRecording) {
                    stopRecording();
                } else {
                    startRecording();
                }

                isRecording = !isRecording;
            };

            divmic.addEventListener('click', toggleRecording);
        }

        function mediaRecorderCharacter(lastChar, index, lessonID) {

            const divmic = document.querySelector(`#divmic${index}${lastChar}`);
            divmic.style.display = 'block';
            const startButton = document.getElementById("start");
            const stopButton = document.getElementById("stop");
            const audioPlayer = document.getElementById(`audio-player-${lastChar}`);
          //  var audio_hide_obj = document.querySelector(`#divhid${index}${lastChar}`);;
            const messageEl = document.querySelector(`#divsocket${index}${lastChar}`);
            var audio_hide_obj = document.querySelector(`#divhid${index}${lastChar}`).textContent;
            var audio_hide_arr = JSON.parse(audio_hide_obj);
            var syncData_hide = audio_hide_arr.text;

            //var audio_hide_obj = document.querySelector(`#divhid${index}${lastChar}`);
            //var syncData_hide = audio_hide_obj.textContent;

            let selectedMedia = null;
            let chunks = [];
            let mediaRecorder, mediaStream;
            
            
            let isRecording = false;
            let socket;
            let recorder;
            const startRecording = async () => {
                //const response = await fetch('http://localhost:8001'); // get temp session token from server.js (backend)
                const response = await fetch(realTokenUrl); // get temp session token from server.js (backend)
                const data = await response.json();

                if (data.error) {
                    alert(data.error)
                }

                const { token } = data;

                // establish wss with AssemblyAI (AAI) at 16000 sample rate
                socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

                // handle incoming messages to display transcription to the DOM
                const texts = {};
                socket.onmessage = (message) => {
                    let msg = '';
                    const res = JSON.parse(message.data);
                    texts[res.audio_start] = res.text;
                    const keys = Object.keys(texts);
                    keys.sort((a, b) => a - b);
                    for (const key of keys) {
                        if (texts[key]) {
                            msg += ` ${texts[key]}`;
                        }
                    }
                    
                    messageEl.innerText = msg;
                };

                socket.onerror = (event) => {
                    console.error(event);
                    socket.close();
                }

                socket.onclose = event => {
                    console.log(event);
                    socket = null;
                }

                // begin recording
                //messageEl.style.display = '';
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        recorder = new RecordRTC(stream, {
                            type: 'audio',
                            mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
                            recorderType: StereoAudioRecorder,
                            timeSlice: 250, // set 250 ms intervals of data that sends to AAI
                            desiredSampRate: 16000,
                            numberOfAudioChannels: 1, // real-time requires only one channel
                            bufferSize: 4096,
                            audioBitsPerSecond: 128000,
                            ondataavailable: (blob) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const base64data = reader.result;

                                    // audio data must be sent as a base64 encoded string
                                    if (socket) {
                                        socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                                    }
                                };
                                reader.readAsDataURL(blob);
                            },
                        });

                        recorder.startRecording();
                    })
                    .catch((err) => console.error(err));
            };
            const stopRecording = () => {
                if (socket) {
                    socket.send(JSON.stringify({ terminate_session: true }));
                    socket.close();
                    socket = null;
                }

                if (recorder) {
                    recorder.pauseRecording();
                    recorder = null;
                }
                divmic.disabled = true;
                divmic.classList.add('recording-stopped');
                divmic.style.display = 'none';
                isRecording = false;
                
                
            };

            function startRecording_old() {
                const audioMediaConstraints = {
                    audio: true,
                    video: false,
                };
                // Access the camera and microphone
                navigator.mediaDevices.getUserMedia(
                    audioMediaConstraints)
                    .then((mediaStream) => {

                        mediaRecorder =
                            new MediaRecorder(mediaStream);
                        // window.mediaStream = mediaStream;
                        // window.mediaRecorder = mediaRecorder;
                        mediaRecorder.start();
                        mediaRecorder.ondataavailable = (e) => {
                            chunks.push(e.data);
                        };
                        mediaRecorder.onstop = () => {
                            const blob = new Blob(
                                chunks, {
                                type: "audio/mpeg"
                            });
                            chunks = [];
                            //audioPlayer.controls = true;
                            const recordedMediaURL = URL.createObjectURL(blob);
                            audioPlayer.src = recordedMediaURL;

                            //userRealtimeStreaming(recordedMediaURL, syncData_hide);
                            userpointapi(lessonID, 'audio_start');
                            audioPlayer.play();

                        };
                        $(divmic).children('i').removeClass('bi-mic-mute-fill');
                        divmic.classList.add('bi-mic-fill');
                    });
            }

            function stopRecording_old() {
                mediaRecorder.stop();

                divmic.disabled = true;
                divmic.classList.add('recording-stopped');
                divmic.style.display = 'none';
                const messagetext = messageEl.textContent;
                usermatchString(syncData_hide, messagetext);
                messageEl.innerText = '';

            }
            divmic.addEventListener('click', () => {
                //$('.mic-icon i').hasClass(`bi-mic-mute-fill`) ? startRecording() : stopRecording();
                if ($(`#divmic${index}${lastChar}`).hasClass(`bi-mic-fill`)) {
                    stopRecording_old();
                    stopRecording();
                } else {
                    startRecording_old();
                    startRecording();
                }
                
                isRecording = !isRecording;
               
               
            });
        }
       
        function userRealtimeStreaming(realtimeAudioUrl, syncData_hide){
            const streamUrl = 'wss://api.assemblyai.com/v2/stream';
            const audioUrl = realtimeAudioUrl;

            const socket = new WebSocket(streamUrl);

            socket.addEventListener('open', () => {
                // Send the API key to authenticate the connection
                // socket.send(JSON.stringify({
                //     authorization: `Bearer ${assemblyaikey}`
                // }));


                // Send the audio URL to start the transcription
                socket.send(JSON.stringify({
                    'audio_url': audioUrl,
                    'language_model': 'assemblyai_default'
                }));
            });

            socket.addEventListener('message', (event) => {
                // Handle the transcription results here
                const data = JSON.parse(event.data);
                usermatchString(syncData_hide, data.text);
                console.log(data.text);
            });

            socket.addEventListener('error', (event) => {
                // Handle any errors here
                console.error(event);
            });
        }
        function playNext(lastChar, lessonCounter, lessonID, courseID, unitID, countLesson) {
            let audioFiles = [];
            for (let i = 1; i <= lessonCounter; i++) {
                audioFiles[i] = $(`#divaudio${i}${lastChar}`).text();
            }
            let currentAudioIndex = 1;

            let audioPlayer = document.getElementById("audio-player-" + lastChar);
            audioPlayer.src = audioFiles[currentAudioIndex];
            playAudio(lastChar, currentAudioIndex, audioFiles, lessonID);



            audioPlayer.onended = function () {
                currentAudioIndex++;
                if (currentAudioIndex >= 0 && currentAudioIndex < audioFiles.length) {
                    playAudio(lastChar, currentAudioIndex, audioFiles, lessonID);
                } else {
                    // lessonTrackApi(courseID, unitID, lessonID, 100, '');
                    const audioCurrentTimeMs = audioPlayer.currentTime * 1000;
                    const currentTimestamp = new Date().getTime();
                    const vacubularyId = [];
                    var unitresult = compareNumberAndString(countLesson, lastChar);
                    lessonTrackApi(courseID, unitID, lessonID, 100, currentTimestamp, audioCurrentTimeMs, unitresult, vacubularyId);
                    Swal.fire({
                        iconHtml: `<img src="${thumbsupicon}" alt="thumbs up icon" width="180" height="180">`, // Set the custom HTML code for the icon
                        title: "Great Work ",
                        text: "Let's move to the next lesson", // Set the message text
                        showConfirmButton: true, // Show the confirmation button
                    });
                    var collapseElement = $(`#collapseNew${lastChar}`);
                    const nextChild = collapseElement.parents().next();
                    nextChild.removeClass('inactive');
                }


            };
        } 
        // This function is used to change the character button
        function changeCharacterBtn(lastChar, lessonCounter) {
            // Get the audio player element based on the last character
            let audioPlayer = document.getElementById("audio-player-" + lastChar);
            // Reset the audio player
            audioPlayer.load();
            audioPlayer.src = '';
            // Reset the background color of the child elements in divtext
            for (let i = 1; i <= lessonCounter; i++) {
                $(`#divtext${i}${lastChar}`).children().css('background', '');
                console.log(`#divtext${i}${lastChar}`);
            }
        }
        function emptyAudioForPlayer() {
            const audioPlayer = document.querySelector('.audioPlayer');
            if (audioPlayer) {
                audioPlayer.remove();
                audioPlayer.pause();
                audioPlayer.src = '';
            }
        }



        function playAudio(lastChar, nextIndex, audioFiles, lessonID) {
            let audioPlayer = document.getElementById("audio-player-" + lastChar);

            audioPlayer.src = '';
            // Load and play the same audio file again
            audioPlayer.load();
            audioPlayer.src = audioFiles[nextIndex];
            selectPlayer(lastChar, nextIndex, lessonID);
            //$('.button' + lastChar).trigger('click');
            userpointapi(lessonID, 'audio_start');
            setUserActivity();
            audioPlayer.play();

        }

        function selectPlayerVocabulary(lastChar, audioString, lessonID, vocabularyID, courseid, unitid) {
            //++audioString;
            var player = $('#audioPlayer' + lastChar),

                audio = player.find('audio'),
                duration = $('.duration'),
                currentTime = $('.current-time'),
                progressBar = $('.progress span'),
                mouseDown = false,
                rewind, showCurrentTime;
            let audioPlayer = document.getElementById("audio-player-" + lastChar);
            const SCROLL_THRESHOLD = 25;
            const SCROLL_OFFSET = 35;


            // let subtitles = $(`#divtext${audioString}${lastChar}`);

            // Optimize the code to use removeAttribute() method instead of setting the style property
            // Register an event listener for when audio is paused
            audioPlayer.addEventListener("pause", function (e) {
                let scrollCounter = 0;
                let subtitles = $(`#divtext${audioString}${lastChar}`);
                //Loop through all the subtitle children (lines)
                for (var i = 0; i < subtitles.children.length; i++) {
                    //Remove any styling applied to the subtitle
                    subtitles.children[i].removeAttribute('style');
                    // When the scrolling threshold is reached
                    if (scrollCounter >= SCROLL_THRESHOLD) {
                        // Calculate the line index starting at the offset
                        const lineIndex = Math.max(i - SCROLL_OFFSET, 0);
                        // Log out the current cursor position
                        // Set the scrollTop of the subtitles window 
                        const scrollTop = lineIndex;
                        $("#divtext" + id).scrollTop(scrollTop);
                        // Reset the scroll counter
                        scrollCounter = 0;
                    }
                    // Increment the scroll counter
                    scrollCounter++;
                }
            });
            const audioElement = $("#audio-player-" + lastChar)[0];
            let updval = 1;
            /*audioPlayer.addEventListener("timeupdate", function (e) {
                const currentTimeMs = audioPlayer.currentTime * 1000;
                const audioDuration = audioElement.duration;
                const audioCurTime = audioElement.currentTime;

                //const progress = audioElement.currentTime / audioDuration * 100;

                const progress = Math.floor(audioElement.currentTime / audioDuration * 100);
                const currentTimestamp = new Date().getTime();
                const vacubularyId = [vocabularyID];
                const TRACK_INTERVAL = 10;
                const TRACK_NONE = 0;

                //  const shouldTrack = ;

                if (progress % TRACK_INTERVAL === 0 && progress <= 100) {
                    lessonTrackApi(courseid, unitid, lessonID, progress, currentTimestamp, audioCurTime, 0, vacubularyId);
                }
                //if (progress % 10 === 0 || progress != 100) {
                //lessonTrackApi(courseid, unitid, lessonid, progress, audio_end, audioCurTime);

                // }


                let scrollCounter = 0;
                for (let i = 0; i < subtitles.children.length; i++) {
                    const child = subtitles.children[i];
                    const childId = child.id;

                    if (childId <= currentTimeMs) {
                        //child.style.background = 'yellow';
                        child.style.color = '#fd9370';
                        if (scrollCounter >= SCROLL_THRESHOLD) {
                            const lineIndex = Math.max(i - SCROLL_OFFSET, 0);
                            const scrollTop = lineIndex;
                            divText.scrollTop(scrollTop);
                            scrollCounter = 0;
                        }
                    } else {
                        break;
                    }
                    scrollCounter++;
                }
            });*/
            audioPlayer.addEventListener("timeupdate", function (e) {

                const currentTimeMs = audioPlayer.currentTime * 1000;
                var myAudio = $("#audio-player-" + lastChar)[0];


                var audioduration = myAudio.duration;
                //const currentTimeMs = audioPlayer.currentTime * 1000;
                const audioDuration = audioElement.duration;
                const audioCurTime = audioElement.currentTime;
                
                if (audioPlayer.currentTime == audioduration && updval) {
                    userpointapi(lessonID, 'audio_completed');
                    updval = 0;

                }
                const progress = Math.floor(audioElement.currentTime / audioDuration * 100);
                const currentTimestamp = new Date().getTime();
                const vacubularyId = [vocabularyID];
                const TRACK_INTERVAL = 10;
                const TRACK_NONE = 0;

                //  const shouldTrack = ;

                if (progress % TRACK_INTERVAL === 0 && progress <= 100) {
                    lessonTrackApi(courseid, unitid, lessonID, progress, currentTimestamp, audioCurTime, 0, vacubularyId);
                }
                let subtitles = $(`#divtext${audioString}${lastChar}`).children();
                const numChildren = subtitles.length;
                let scrollCounter = 0;
                for (let i = 0; i < numChildren; i++) {
                    const child = subtitles[i];
                    const childId = child.id;

                    if (childId <= currentTimeMs) {

                        child.style.color = '#fd9370';
                        if (scrollCounter >= SCROLL_THRESHOLD) {
                            const lineIndex = Math.max(i - SCROLL_OFFSET, 0);
                            const scrollTop = lineIndex;
                            $(`#divtext${audioString}${lastChar}`).scrollTop(scrollTop);
                        }

                    } else {
                        break;
                    }
                    scrollCounter++;
                }



            });

            function secsToMins(time) {
                var int = Math.floor(time),
                    mins = Math.floor(int / 60),
                    secs = int % 60,
                    newTime = mins + ':' + ('0' + secs).slice(-2);

                return newTime;
            }

            function getCurrentTime() {
                var currentTimeFormatted = secsToMins(audioPlayer.currentTime),
                    currentTimePercentage = audioPlayer.currentTime / audioPlayer.duration * 100;

                currentTime.text(currentTimeFormatted);
                progressBar.css('width', currentTimePercentage + '%');

                if (player.hasClass('playing')) {
                    showCurrentTime = requestAnimationFrame(getCurrentTime);
                } else {
                    cancelAnimationFrame(showCurrentTime);
                }
            }
            audio.on('loadedmetadata', function () {

                var durationFormatted = secsToMins(audio[0].duration);
                duration.text(durationFormatted);
            }).on('ended', function () {
                if ($('.repeat').hasClass('active')) {
                    audio[0].currentTime = 0;
                    audio[0].play();
                } else {
                    player.removeClass('playing').addClass('paused');
                    audio[0].currentTime = 0;
                }
            });

            $('.button' + lastChar).on('click', function () {
                var self = $(this);
                // Handles playing and pausing
                if (self.hasClass('play-pause')) {
                    if (player.hasClass('paused')) {
                        player.removeClass('paused').addClass('playing');
                        audio[0].play();
                        getCurrentTime();
                    } else if (player.hasClass('playing')) {
                        player.removeClass('playing').addClass('paused');
                        audio[0].pause();
                    }
                }

                // Handles shuffling and repeating
                if (self.hasClass('shuffle') || self.hasClass('repeat')) {
                    self.toggleClass('active');
                }
            }).on('mousedown', function () {
                var self = $(this);
                // Handles fast-forward
                if (self.hasClass('ff')) {
                    player.addClass('ffing');
                    audio[0].playbackRate = 2;
                }

                // Handles rewinding
                if (self.hasClass('rw')) {
                    player.addClass('rwing');
                    rewind = setInterval(function () { audio[0].currentTime -= .3; }, 100);
                }
            }).on('mouseup', function () {
                var self = $(this);

                // Handles fast-forward
                if (self.hasClass('ff')) {
                    player.removeClass('ffing');
                    audio[0].playbackRate = 1;
                }

                // Handles rewinding
                if (self.hasClass('rw')) {
                    player.removeClass('rwing');
                    clearInterval(rewind);
                }
            });
            player.on('mousedown mouseup', function () {
                mouseDown = !mouseDown;
            });

            progressBar.parent().on('click mousemove', function (e) {
                var self = $(this),
                    totalWidth = self.width(),
                    offsetX = e.offsetX,
                    offsetPercentage = offsetX / totalWidth;

                // Handle drags and clicks on progress bar
                if (mouseDown || e.type === 'click') {
                    audio[0].currentTime = audio[0].duration * offsetPercentage;
                    if (player.hasClass('paused')) {
                        progressBar.css('width', offsetPercentage * 100 + '%');
                    }
                }

            });

        }
        function selectPlayer(lastChar, audioString, lessonID) {
            //++audioString;
            var player = $('#audioPlayer' + lastChar),

                audio = player.find('audio'),
                duration = $('.duration'),
                currentTime = $('.current-time'),
                progressBar = $('.progress span'),
                mouseDown = false,
                rewind, showCurrentTime;
            let audioPlayer = document.getElementById("audio-player-" + lastChar);
            const SCROLL_THRESHOLD = 25;
            const SCROLL_OFFSET = 35;


            // let subtitles = $(`#divtext${audioString}${lastChar}`);

            // Optimize the code to use removeAttribute() method instead of setting the style property
            // Register an event listener for when audio is paused
            audioPlayer.addEventListener("pause", function (e) {
                let scrollCounter = 0;
                let subtitles = $(`#divtext${audioString}${lastChar}`);
                //Loop through all the subtitle children (lines)
                for (var i = 0; i < subtitles.children.length; i++) {
                    //Remove any styling applied to the subtitle
                    subtitles.children[i].removeAttribute('style');
                    // When the scrolling threshold is reached
                    if (scrollCounter >= SCROLL_THRESHOLD) {
                        // Calculate the line index starting at the offset
                        const lineIndex = Math.max(i - SCROLL_OFFSET, 0);
                        // Log out the current cursor position
                        // Set the scrollTop of the subtitles window 
                        const scrollTop = lineIndex;
                        $("#divtext" + id).scrollTop(scrollTop);
                        // Reset the scroll counter
                        scrollCounter = 0;
                    }
                    // Increment the scroll counter
                    scrollCounter++;
                }
            });
            let updval = 1;
            audioPlayer.addEventListener("timeupdate", function (e) {

                const currentTimeMs = audioPlayer.currentTime * 1000;
                var myAudio = $("#audio-player-" + lastChar)[0];


                var audioduration = myAudio.duration;

                if (audioPlayer.currentTime == audioduration && updval) {
                    userpointapi(lessonID, 'audio_completed');
                    updval = 0;

                }
                let subtitles = $(`#divtext${audioString}${lastChar}`).children();
                const numChildren = subtitles.length;
                let scrollCounter = 0;
                for (let i = 0; i < numChildren; i++) {
                    const child = subtitles[i];
                    const childId = child.id;

                    if (childId <= currentTimeMs) {

                        child.style.color = '#fd9370';
                        if (scrollCounter >= SCROLL_THRESHOLD) {
                            const lineIndex = Math.max(i - SCROLL_OFFSET, 0);
                            const scrollTop = lineIndex;
                            $(`#divtext${audioString}${lastChar}`).scrollTop(scrollTop);
                        }

                    } else {
                        break;
                    }
                    scrollCounter++;
                }



            });

            function secsToMins(time) {
                var int = Math.floor(time),
                    mins = Math.floor(int / 60),
                    secs = int % 60,
                    newTime = mins + ':' + ('0' + secs).slice(-2);

                return newTime;
            }

            function getCurrentTime() {
                var currentTimeFormatted = secsToMins(audioPlayer.currentTime),
                    currentTimePercentage = audioPlayer.currentTime / audioPlayer.duration * 100;

                currentTime.text(currentTimeFormatted);
                progressBar.css('width', currentTimePercentage + '%');

                if (player.hasClass('playing')) {
                    showCurrentTime = requestAnimationFrame(getCurrentTime);
                } else {
                    cancelAnimationFrame(showCurrentTime);
                }
            }
            audio.on('loadedmetadata', function () {

                var durationFormatted = secsToMins(audio[0].duration);
                duration.text(durationFormatted);
            }).on('ended', function () {
                if ($('.repeat').hasClass('active')) {
                    audio[0].currentTime = 0;
                    audio[0].play();
                } else {
                    player.removeClass('playing').addClass('paused');
                    audio[0].currentTime = 0;
                }
            });

            $('.button' + lastChar).on('click', function () {
                var self = $(this);
                // Handles playing and pausing
                if (self.hasClass('play-pause')) {
                    if (player.hasClass('paused')) {
                        player.removeClass('paused').addClass('playing');
                        audio[0].play();
                        getCurrentTime();
                    } else if (player.hasClass('playing')) {
                        player.removeClass('playing').addClass('paused');
                        audio[0].pause();
                    }
                }

                // Handles shuffling and repeating
                if (self.hasClass('shuffle') || self.hasClass('repeat')) {
                    self.toggleClass('active');
                }
            }).on('mousedown', function () {
                var self = $(this);
                // Handles fast-forward
                if (self.hasClass('ff')) {
                    player.addClass('ffing');
                    audio[0].playbackRate = 2;
                }

                // Handles rewinding
                if (self.hasClass('rw')) {
                    player.addClass('rwing');
                    rewind = setInterval(function () { audio[0].currentTime -= .3; }, 100);
                }
            }).on('mouseup', function () {
                var self = $(this);

                // Handles fast-forward
                if (self.hasClass('ff')) {
                    player.removeClass('ffing');
                    audio[0].playbackRate = 1;
                }

                // Handles rewinding
                if (self.hasClass('rw')) {
                    player.removeClass('rwing');
                    clearInterval(rewind);
                }
            });
            player.on('mousedown mouseup', function () {
                mouseDown = !mouseDown;
            });

            progressBar.parent().on('click mousemove', function (e) {
                var self = $(this),
                    totalWidth = self.width(),
                    offsetX = e.offsetX,
                    offsetPercentage = offsetX / totalWidth;

                // Handle drags and clicks on progress bar
                if (mouseDown || e.type === 'click') {
                    audio[0].currentTime = audio[0].duration * offsetPercentage;
                    if (player.hasClass('paused')) {
                        progressBar.css('width', offsetPercentage * 100 + '%');
                    }
                }

            });

        }
        
        function usermatchString(string1, string2) {

            $.ajax({
                url: usermatchString_url,
                type: "POST",
                data: { string1: string1, string2: string2 },
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${apiToken}`,
                },
                success: (response) => {
                    const matchDataDiv = document.createElement("div");
                    for (const key in response.match_data) {
                        const value = response.match_data[key];
                        const formattedText = `${key}: ${value}`;
                        const formattedDiv = document.createElement("div");
                        formattedDiv.textContent = formattedText;
                        matchDataDiv.appendChild(formattedDiv);
                    }

                    Swal.fire({
                        title: "Audio feedback",
                        html: `<div>${matchDataDiv.innerHTML}</div>`,
                        confirmButtonText: "OK"
                    });
                
                },
                error: (xhr, status, error) => {
                    console.log(xhr.responseText);
                    console.log(error);

                },
            });
        }

        function userLessonTrackApi(lessonId, callback) {

            $.ajax({
                url: userlessontrack_url,
                type: "POST",
                data: { lesson_id: lessonId },
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${apiToken}`,
                },
                success: (response) => {

                    callback(response);


                },
                error: (xhr, status, error) => {
                    console.log(xhr.responseText);
                    console.log(error);

                },
            });
        }
        function lessonTrackApi(courseId, unitId, lessonId, percentage, startcurrentTime, audioDuration, unitComplete, vacubularyId) {
            if (percentage > 0) {

                const currentTimestamp = new Date().getTime();

                $.ajax({
                    url: lessontrack_url,
                    type: "POST",
                    data: { course_id: courseId, unit_id: unitId, lesson_id: lessonId, play_precentage: percentage, start_datetime: startcurrentTime, audio_duration: audioDuration, unitcomplete: unitComplete, vacubulary_id: vacubularyId },
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${apiToken}`,
                    },
                    success: (response) => {
                        if (response.message === "Lesson view successfully") {
                            /*Swal.fire({
                                position: "center",
                                icon: "success",
                                title: response.message,
                                showConfirmButton: false,
                                timer: 1500,
                            });*/
                        }
                    },
                    error: (xhr, status, error) => {
                        console.log(xhr.responseText);
                        console.log(error);

                    },
                });
            }
        }

        function userpointapi(lessonId, activity) {

            const currentTimestamp = new Date().getTime();
            const userPointData = {
                "lesson_id": lessonId,
                "activity_type": activity,
                "point": "1",
                "point_time": currentTimestamp,
            };
            $.ajax({
                url: userpoint_url,
                type: "POST",
                data: { lesson_id: lessonId, activity_type: activity, point: 1, point_time: currentTimestamp },
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${apiToken}`,
                },
                success: (response) => {
                    if (response.message === "Points added successfully") {
                        // Swal.fire({
                        //     position: "center",
                        //     icon: "success",
                        //     title: response.message,
                        //     showConfirmButton: false,
                        //     timer: 1500,
                        // });
                    }
                },
                error: (xhr, status, error) => {
                    console.log(xhr.responseText);

                },
            });
        }

        function designerAudioPlayer(id, lessonid, unitid, courseid, lesson_percent, countLesson, lessonView, lesson_audio_url) {
            var player = $('#divaudio' + id),

                audio = player.find('audio'),
                duration = $('.duration'),
                currentTime = $('.current-time'),
                progressBar = $('.progress span'),
                mouseDown = false,
                rewind, showCurrentTime;

            var audioPlayer = document.getElementById("audio-player-" + id);
            var subtitles = document.getElementById("divtext" + id);

            //Scroll to the div to make current text visible
            $("#divtext" + id).get(0).scrollIntoView();

            //Parse audio object into array
            var audio_obj = document.getElementById("divhid" + id).textContent;

            //Parse audio object from JSON 
            var audio_arr = JSON.parse(audio_obj);
            // Retrieve word data from the parsed audio object
            var syncData = audio_arr.words;
            // Call createSubtitle function
            createSubtitle();

            // Function to create subtitles element
            function createSubtitle() {
                //create variable element 
                var element;
                // Loop through the syncData array
                for (var i = 0; i < syncData.length; i++) {
                    // Create span element 
                    element = document.createElement('span');
                    // Retrieve endtime from syncData 
                    let endtime = syncData[i].end;
                    // Set id attribute of span element to the element's end time
                    element.setAttribute("id", endtime);
                    // Set the inner text of element to the text in syncData and add a space character
                    element.innerText = syncData[i].text + " ";
                    // Append the created element to the subtitles element 
                    subtitles.appendChild(element);
                }
            }

            // Set the constant values for scrolling, which decide at what point to scroll and the offset to the top of the window
            const SCROLL_THRESHOLD = 25;
            const SCROLL_OFFSET = 35;

            // Register an event listener for when audio is paused
            audioPlayer.addEventListener("pause", function (e) {
                let scrollCounter = 0;
                //Loop through all the subtitle children (lines)
                for (var i = 0; i < subtitles.children.length; i++) {
                    //Remove any styling applied to the subtitle
                    subtitles.children[i].removeAttribute('style');
                    // When the scrolling threshold is reached
                    if (scrollCounter >= SCROLL_THRESHOLD) {
                        // Calculate the line index starting at the offset
                        const lineIndex = Math.max(i - SCROLL_OFFSET, 0);
                        // Log out the current cursor position
                        // Set the scrollTop of the subtitles window 
                        const scrollTop = lineIndex;
                        $("#divtext" + id).scrollTop(scrollTop);
                        // Reset the scroll counter
                        scrollCounter = 0;
                    }
                    // Increment the scroll counter
                    scrollCounter++;
                }
            });
            var audio_start = 0;
            var audio_end = 0;
            var playPrecentage = 0;
            userLessonTrackApi(lessonid, handleResponse);
            function handleResponse(response) {
                audio_start = response.lesson_track.start_datetime;
                audio_end = response.lesson_track.audio_duration;
                playPrecentage = parseInt(response.lesson_track.play_precentage);
                if (playPrecentage == 100) {
                    var collapseElement = $(`#collapseNew${id}`);
                    const nextChild = collapseElement.parents().next();
                    nextChild.removeClass('inactive');
                }
                if (audio_end) {
                    playAudioFromCurrentTime(audio_end);
                }

            }
            /*audioPlayer.addEventListener('play', () => {
                const myAudioplay = $(`#audio-player-${id}`)[0];
                const audioCurTime = myAudioplay.currentTime;
                const currentTimeMs = audioPlayer.currentTime * 1000;
                const audioDuration = myAudioplay.duration;
                const progress = Math.floor(myAudioplay.currentTime / audioDuration * 100);
                //lessonTrackApi(courseid, unitid, lessonid, progress, audio_end, audioCurrentTime);
    
                interval = setInterval(function () {
                    lessonTrackApi(courseid, unitid, lessonid, progress, audio_end, audioCurTime);
                    debugger;
                    
                }, 60000);
    
                
            });*/
            
                // Code to be executed after a 1-second delay
                audioPlayer.addEventListener('play', () => {
                    setUserActivity();
                    const myAudioPlay = $(`#audio-player-${id}`)[0];
                    const audioCurTime = myAudioPlay.currentTime;
                    const audioDuration = myAudioPlay.duration;
                    if (audioDuration === 0) {
                        return;
                    }
                    const progress = Math.floor(myAudioPlay.currentTime / audioDuration * 100);
                });
              //  console.log('Delayed code executed.');
            
            
            
            let audioplayed = false;
            audioPlayer.addEventListener('ended', () => {
                const myAudio = $(`#audio-player-${id}`)[0];
                const audioCurrentTimeMs = myAudio.currentTime * 1000;
                const currentTimeMs = audioPlayer.currentTime * 1000;
                const audioDuration = myAudio.duration;
                const progress = Math.floor(myAudio.currentTime / audioDuration * 100);
                const currentTimestamp = new Date().getTime();
                const vacubularyId = [];
                if (progress === 100) {
                    var unitresult = compareNumberAndString(countLesson, id);
                    lessonTrackApi(courseid, unitid, lessonid, progress, currentTimestamp, audioCurrentTimeMs, unitresult, vacubularyId);
                }
                audioplayed = true;
                var collapseElement = $(`#collapseNew${id}`);
                const nextChild = collapseElement.parents().next();
                nextChild.removeClass('inactive');
            });

            const audioElement = $("#audio-player-" + id)[0];
            const divText = $("#divtext" + id);
            function playAudioFromCurrentTime(currentTime) {
                audioElement.currentTime = currentTime;
            }
            audioPlayer.addEventListener("timeupdate", function (e) {
                const currentTimeMs = audioPlayer.currentTime * 1000;
                const audioDuration = audioElement.duration;
                const audioCurTime = audioElement.currentTime;
                const progress = Math.floor(audioElement.currentTime / audioDuration * 100);
                const currentTimestamp = new Date().getTime();
                const vacubularyId = [];
                const TRACK_INTERVAL = 10;
                const TRACK_NONE = 0;
                if (progress % TRACK_INTERVAL === 0 && progress <= 100) {
                    lessonTrackApi(courseid, unitid, lessonid, progress, currentTimestamp, audioCurTime, 0, vacubularyId);
                }
                if (audioplayed && progress === 100) {
                    Swal.fire({
                        iconHtml: `<img src="${thumbsupicon}" alt="thumbs up icon" width="180" height="180">`,
                        title: "Great Work ",
                        text: "Let's move to the next lesson",
                        showConfirmButton: true,
                    });
                }
                let scrollCounter = 0;
                for (let i = 0; i < subtitles.children.length; i++) {
                    const child = subtitles.children[i];
                    const childId = child.id;
                    if (childId <= currentTimeMs) {
                        child.style.color = '#fd9370';
                        if (scrollCounter >= SCROLL_THRESHOLD) {
                            const lineIndex = Math.max(i - SCROLL_OFFSET, 0);
                            const scrollTop = lineIndex;
                            divText.scrollTop(scrollTop);
                            scrollCounter = 0;
                        }
                    } else {
                        break;
                    }
                    scrollCounter++;
                }
            });





            function secsToMins(time) {
                const int = Math.floor(time);
                const mins = Math.floor(int / 60);
                const secs = int % 60;
                const newTime = `${mins}:${('0' + secs).slice(-2)}`;
                return newTime;
            }
            function getCurrentTime() {
                const currentTimeFormatted = secsToMins(audio[0].currentTime);
                const currentTimePercentage = audio[0].currentTime / audio[0].duration * 100;
                const startcurrentTimeMs = audio[0].currentTime * 1000;
                currentTime.text(currentTimeFormatted);
                progressBar.css('width', `${currentTimePercentage}%`);
                if (audio[0].currentTime === 0) {
                    const currentProgress = Math.floor(currentTimePercentage);
                }
                if (player.hasClass('playing')) {
                    showCurrentTime = requestAnimationFrame(getCurrentTime);
                } else {
                    cancelAnimationFrame(showCurrentTime);
                }
            }
            audio.on('loadedmetadata', function () {
                const durationFormatted = secsToMins(audio[0].duration);
                duration.text(durationFormatted);
            }).on('ended', function () {
                if ($('.repeat').hasClass('active')) {
                    audio[0].currentTime = 0;
                    audio[0].play();
                } else {
                    player.removeClass('playing').addClass('paused');
                    audio[0].currentTime = 0;
                }
            });
            /*
            audio[0].play();
            userpointapi(lessonid, 'audio_start');
            getCurrentTime();*/
            var isPlaying = false;
            $('.button').click(function () {
                if (isPlaying) {
                    audio[0].pause();
                    isPlaying = false;
                    player.removeClass('playing').addClass('paused');
                } else {
                    audio[0].play();
                    isPlaying = true;
                    userpointapi(lessonid, 'audio_start');
                    getCurrentTime();
                    player.removeClass('paused').addClass('playing');
                }
            }).on('mousedown', function () {
                handleMouseDown($(this));
            }).on('mouseup', function () {
                handleMouseUp($(this));
            });
            
            /*var isPaused = false;
            $('.button').on('click', function () {
                var self = $(this);
                if (self.hasClass('play-pause') && player.hasClass('paused')) {
                    player.removeClass('paused').addClass('playing');

                    if (isPaused) {
                        resumeAudio()
                            .then(() => {
                                // Handle successful resume
                                console.log('Audio resumed.');
                                getCurrentTime();
                                // Do additional actions if needed
                            })
                            .catch((error) => {
                                console.error('Error resuming audio:', error);
                                // Handle the error
                            });
                    } else {
                        loadAndPlayAudio()
                            .then(() => {
                                userpointapi(lessonid, 'audio_start');
                                getCurrentTime();
                            })
                            .catch((error) => {
                                console.error('Error loading and playing audio:', error);
                            });
                    }

                    isPaused = false;
                } else if (self.hasClass('play-pause') && player.hasClass('playing')) {
                    player.removeClass('playing').addClass('paused');

                    pauseAudio()
                        .then(() => {
                            // Handle successful pause
                            isPaused = true;
                        })
                        .catch((error) => {
                            console.error('Error pausing audio:', error);
                        });
                }

                if (self.hasClass('shuffle') || self.hasClass('repeat')) {
                    self.toggleClass('active');
                }
            }).on('mousedown', function () {
                handleMouseDown($(this));
            }).on('mouseup', function () {
                handleMouseUp($(this));
            });*/
                               

            /*$('.button').on('click', function () {
                
                var self = $(this);
                if (self.hasClass('play-pause') && player.hasClass('paused')) {
                    player.removeClass('paused').addClass('playing');
                   
                    loadAndPlayAudio()
                        .then(() => {
                            userpointapi(lessonid, 'audio_start');
                            getCurrentTime();
                        })
                        .catch((error) => {
                            console.error('Error loading and playing audio:', error);
                        });

                } else if (self.hasClass('play-pause') && player.hasClass('playing')) {
                    console.log("pause  while clicking on play button");
                    player.removeClass('playing').addClass('paused');
                    //pauseAudio();

                    pauseAudio()
                        .then(() => {
                            // Handle successful pause
                        })
                        .catch((error) => {
                            console.error('Error pausing audio:', error);
                        });
                } else if (self.hasClass('play-pause') && player.hasClass('paused') && self.hasClass('resume')) {
                    console.log("resuming while clicking on play button");
                    player.removeClass('paused').addClass('playing');
                    //resumeAudio();
                    resumeAudio()
                        .then(() => {
                            // Handle successful resume
                        })
                        .catch((error) => {
                            console.error('Error resuming audio:', error);
                        });
                }

                if (self.hasClass('shuffle') || self.hasClass('repeat')) {
                    self.toggleClass('active');
                }
            

            }).on('mousedown', function () {
                handleMouseDown($(this));
            }).on('mouseup', function () {
                handleMouseUp($(this));
            });*/
            
            
            
            player.on('mousedown mouseup', function () {
                mouseDown = !mouseDown;
            });

           
            player.on('mousedown mouseup', function () {
                mouseDown = !mouseDown;
            });
            progressBar.parent().on('click mousemove', function (e) {
                handleProgressBarClick($(this), e);
            });



            /************adding button  click  ************************/

            function loadAndPlayAudio() {
                return new Promise((resolve, reject) => {
                    var audioElement = audio[0];

                    const playOnce = () => {
                        audioElement.play()
                            .then(() => {
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            });
                        audioElement.removeEventListener('canplay', playOnce); // Remove the 'canplay' event listener
                    };
                    
                        // code to execute after 3 seconds
                        audioElement.addEventListener('canplay', playOnce);
                    
                    // Set the src attribute of the audio element
                    audioElement.src = lesson_audio_url;

                    // Handle error events, if any
                    audioElement.addEventListener('error', (event) => {
                        reject(event.error);
                    });
                });
            }

            function handleMouseDown(button) {
                if (button.hasClass('ff')) {
                    player.addClass('ffing');
                    audio[0].playbackRate = 2;
                }

                if (button.hasClass('rw')) {
                    player.addClass('rwing');
                    rewind = setInterval(function () { audio[0].currentTime -= .3; }, 100);
                }
            }

            function handleMouseUp(button) {
                if (button.hasClass('ff')) {
                    player.removeClass('ffing');
                    audio[0].playbackRate = 1;
                }

                if (button.hasClass('rw')) {
                    player.removeClass('rwing');
                    clearInterval(rewind);
                }
            }

            function handleProgressBarClick(progressBar, event) {
                var totalWidth = progressBar.width();
                var offsetX = event.offsetX;
                var offsetPercentage = offsetX / totalWidth;

                if (mouseDown || event.type === 'click') {
                    audio[0].currentTime = audio[0].duration * offsetPercentage;
                    if (player.hasClass('paused')) {
                        progressBar.css('width', offsetPercentage * 100 + '%');
                    }
                }
            }

            function pauseAudio() {
                return new Promise((resolve, reject) => {
                    var audioElement = audio[0];
                        // code to execute after 3 seconds
                        audioElement.pause();
                    
                    
                    var previousTime = audioElement.paused ? audioElement.currentTime : 0; // Store the previous time if paused
                   

                    audioElement.currentTime = previousTime; // Set the current time to the stored previous time
                    resolve();

                   // audioElement.src = lesson_audio_url;

                    // Handle error events, if any
                    audioElement.addEventListener('error', (event) => {
                        reject(event.error);
                    });
                });
            }

            function resumeAudio() {
                return new Promise((resolve, reject) => {
                    var audioElement = audio[0];
                    var previousTime = audioElement.paused ? audioElement.currentTime : 0; // Store the previous time if paused

                    const playOnce = () => {
                        audioElement.currentTime = previousTime; // Set the current time to the stored previous time
                        audioElement.removeEventListener('canplaythrough', playOnce); // Remove the 'canplaythrough' event listener
                        audioElement.play()
                            .then(() => {
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    };
                    
                        // code to execute after 3 seconds
                        audioElement.addEventListener('canplaythrough', playOnce);
                    
                    // Set the src attribute of the audio element
                    audioElement.src = lesson_audio_url;

                    // Handle error events, if any
                    audioElement.addEventListener('error', (event) => {
                        reject(event.error);
                    });
                });
            }
            /*************adding button click ***********************/
        }
}

    
    
   

});


