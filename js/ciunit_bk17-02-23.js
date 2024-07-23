$(document).ready(function () {
    if (unitListUrl !== '') {
        $.ajax({
            url: unitListUrl,
            dataType: 'json',
            success: function (data) {
                const units = data.units;
                let i = 0;
                const courseItem = $('#course-item');
                const accordionCourse = $('#accordionCourse');

                units.forEach(unit => {
                    i++;
                    const isFirstUnit = i === 1;
                    const { name, course, course_lesson, id } = unit;
                    let html = '';
                    // This code extracts and stores data from the provided unitListUrl
                    if (isFirstUnit) {
                        html += `<a id="button${i}" data-bs-toggle="collapse" data-bs-target="#collapse${i}"></a>`;
                    }
                    // This code sets the courseItem text to the extracted course name
                    courseItem.text(course.name);
                    const lessons = course_lesson;
                    // This code builds a new HTML element for each unit with respect to the extracted lesson and course data
                    html += `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading${i}">
              <button class="btnunit accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                ${name}
              </button>
            </h2>
            <div id="collapse${i}" data-id="${id}" class="accordion-collapse collapse" aria-labelledby="heading${i}" data-bs-parent="#accordionCourse">
              <div class="accordion-body">
                <ul class="unit-list">
        `;
                    // This code iterates through the extracted lessons and adds them one by one to the new HTML element
                    lessons.forEach(lesson => {
                        html += `<li class="active"><a href="#">${lesson.name}</a></li>`;
                    });

                    html += `
                </ul>
              </div>
            </div>
          </div>
        `;
                    // This code adds the newly built element to the accordionCourse element
                    accordionCourse.append(html);
                    // This code handles the click event of the first unit, which triggers the 'show' method of the #collapse${i} element to display its content.
                    if (isFirstUnit) {
                        accordionCourse.on('click', `#button${i}`, function () {
                            $(`#collapse${i}`).collapse('show');
                        }).find(`#button${i}`).trigger('click');
                    }
                });
            }
        });
    }


    $('#accordionCourse').on('show.bs.collapse', function (event) {
        var unitid = $(event.target).attr('data-id');
        var url_unit = unitLessonUrl + '/' + unitid;
        if (unitLessonUrl != '') {
            $.ajax({
                url: url_unit,
                dataType: 'json',
                success: async function (data) {
                    const unitdata = data.Unit;
                    $('.right-course-details').empty();
                    let html = '';
                    html += `<h1 class="course-heading">${unitdata.name}</h1><div class="accordion custom-accordion mt-3" id="accordionUnit">`;

                    let i = 0;
                    $.each(unitdata.course_lesson, async function (data, val) {
                        i++;
                        if (i === 1) {
                            html += `<a id="buttonNew${i}" data-bs-toggle="collapse" data-bs-target="#collapseNew${i}"></a>`;
                        }

                        const lesson_content = val.lesson_content;
                        let audio_url = '';
                        let content = '';

                        if (lesson_content[0]) {
                            content = lesson_content[0].content_description;
                            const lesssonobj = {
                                filename: lesson_content[0].filename,
                                unit_id: lesson_content[0].unit_id,
                                course_id: lesson_content[0].course_id,
                                lesson_id: lesson_content[0].lesson_id
                            };

                            html += `
    <div class="accordion-item">
        <h2 class="accordion-header" data-less-object='${JSON.stringify(lesssonobj)}' id="headingNew${i}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNew${i}" aria-expanded="false" aria-controls="collapseNew${i}">
                ${val.name}
            </button>
        </h2>
        <div id="collapseNew${i}" class="accordion-collapse collapse" aria-labelledby="headingNew${i}" data-bs-parent="#accordionUnit">
            <div class="accordion-body">
                <div class="course-content mt-3" id="contentNew${i}">${content}</div>`;



                            html += `</div></div></div>`;

                        }

                    });

                    html += '</div>';
                    $('.right-course-details').append(html);
                }
            });
            $("#buttonNew1").click(function () {
                $("#collapseNew1").collapse("show");
            });
            $(document).on('click', '.accordion-header', async function () {
                const $this = $(this);
                const lessonData = $this.data('less-object');
                const myString = $this.attr('id');
                const lastChar = myString.substr(-1);
                let html = '';

                try {
                    const response = await audioToText(lessonData);
                    const jsonObject = $.parseJSON(response.audio.content);
                    const text = jsonObject.text ?? '';
                    const audio_url = jsonObject.audio_url ?? '';

                    $(`#divtext${lastChar}`).remove();
                    $(`#divhid${lastChar}`).remove();
                    $(`#divaudio${lastChar}`).remove();
                    if (text) {
                        //html += `<div id="divtext${lastChar}" class="practice-test" autofocus>${text}</div>`;
                        html += `<div id="divtext${lastChar}" class="practice-test"></div>`;
                        html += `<div id="divhid${lastChar}" style="display:none;">${response.audio.content}</div>`;
                    }

                    if (audio_url) {
                        html += `<div id="divaudio${lastChar}" class="player paused mt-5 practice-content">


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
                            <button class="button play-pause">
                              <div class="arrow"></div>
                            </button>
                            <button class="button ff">
                              <div class="arrow"></div>
                              <div class="arrow"></div>
                            </button>
                            <!--<button class="repeat"></button>-->
                          </div>

                          <audio  id="audio-player-${lastChar}" prelaod
                            src="${audio_url}"></audio>
                        </div>`;
                        
                        //html += `<div id="divaudio${lastChar}" class="practice-content"><div class="audio-player left"><div class="info"></div><div class="icon-container"><audio id="audio-player-${lastChar}" preload="metadata" src="${audio_url}" controls></audio></div></div></div>`;

                        //html += `<div class="practice-content"><div class="audio-player"><audio id="audio-player-${lastChar}" src="${audio_url}" ></audio><button class="player-button" data-audio="#audio-player-${lastChar}">Play</button><input class="timeline" type="range" min="0" max="100" value="0" step="0.1"></div></div>`;

                        //    html = + `<div class="practice-content"><div class="player paused mt-5"><div class="info"><div class="time"><span class="current-time">0:00</span><span class="progress"><span></span></span><span class="duration">0:00</span></div></div><div class="actions"><button class="button rw"><div class="arrow"></div><div class="arrow"></div></button><button class="button play-pause"><div class="arrow"></div></button><button class="button ff"><div class="arrow"></div><div class="arrow"></div></button></div><audio prelaod src="${audio_url}"></audio></div></div>`;
                    }
                    $(`#contentNew${lastChar}`).after(html);
                    //audioPlayer(lastChar)
                    designerAudioPlayer(lastChar);
                } catch (error) {
                    console.log(error);
                }
            });

            // $(document).on('click', '.accordion-header', function () {
            //     const lessonData = $(this).data('less-object');
            //     let myString = $(this).attr('id');
            //     var lastChar = myString.substr(-1);
            //     let html = '';
            //     //const audioResponse = await audioToText(myData);

            //     audioToText(lessonData).then(function (response) {
            //         // Handle the response here
            //         if (response.audio.content) {
            //             const jsonObject = $.parseJSON(response.audio.content);
            //             console.log(jsonObject);
            //             audio_url = jsonObject.audio_url;
            //             console.log(audio_url);
            //             console.log(jsonObject.text);
            //             if (jsonObject.text) {
            //                 html += `<div class="practice-test"><p>${jsonObject.text}</p></div>`;
            //             }
            //             if (audio_url) {
            //                 html += `<div class="practice-content"><div class="audio-player left"><div class="info"></div><div class="icon-container"><audio preload="metadata" src="${audio_url}" controls></audio></div></div></div>`;
            //             }
            //             $('#contentNew' + lastChar).after(html);
            //         }
            //     }).catch(function (error) {
            //         // Handle any errors here
            //         console.log(error);
            //     });
            // });
            $('#buttonNew1').trigger('click');


            // var audioPlayers = $('.audio-player');

            // // Loop through each audio player
            // audioPlayers.each(function () {
            //     var audioPlayer = $(this);
            //     var audio = audioPlayer.find('audio')[0];
            //     console.log(audio);
            //     var playerButton = audioPlayer.find('.player-button');
            //     var timeline = audioPlayer.find('.timeline');

            //     // Attach click event listener to the player button
            //     playerButton.on('click', function () {
            //         if (audio.paused) {
            //             audio.play();
            //             playerButton.text('Pause');
            //         } else {
            //             audio.pause();
            //             playerButton.text('Play');
            //         }
            //     });

            //     // Attach change event listener to the timeline input
            //     timeline.on('change', function () {
            //         var time = audio.duration * (timeline.val() / 100);
            //         audio.currentTime = time;
            //     });

            //     // Attach timeupdate event listener to the audio element
            //     audio.addEventListener('timeupdate', function () {
            //         var value = (100 / audio.duration) * audio.currentTime;
            //         timeline.val(value);
            //     });
            // });









            // let audioPlayers = document.querySelectorAll(".audio-player");

            // if (audioPlayers.length) {
            //     audioPlayers.forEach(function (audioPlayer, i) {
            //         let audio = audioPlayer.querySelector("audio");
            //         let playerButton = audioPlayer.querySelector(".player-button");
            //         playerButton.addEventListener("click", function (e) {
            //             let current = e.currentTarget;
            //             let audio = current.closest(".audio-player").querySelector("audio");
            //             let btnSvg = current.querySelector(".useBtn");
            //             if (!audio.paused) {
            //                 btnSvg.setAttribute("href", "#icon-play");
            //                 audio.pause();
            //             } else {
            //                 btnSvg.setAttribute("href", "#icon-pause");
            //                 audio.play();
            //             }
            //         });

            //         let timeline = audioPlayer.querySelector('.timeline');
            //         timeline.addEventListener('change', function (e) {
            //             let time = (timeline.value * audio.duration) / 100;
            //             audio.currentTime = time;
            //         });

            //         audio.addEventListener('ended', function (e) {
            //             console.log('audio finished');
            //             timeline.value = 0;
            //         });

            //         audio.addEventListener('timeupdate', function (e) {
            //             let percentagePosition = (100 * audio.currentTime) / audio.duration;
            //             timeline.value = percentagePosition;

            //         });
            //     });
            // }
            //    }
            // });
        }

    });
    function audioToText(params) {
        if (params.filename) {
            return $.ajax({
                url: audioTextUrl,
                type: "POST",
                data: {
                    audio_link: `${path}/lessons/${params.filename}`,
                    course_id: params.course_id,
                    unit_id: params.unit_id,
                    lesson_id: params.lesson_id
                },
                headers: {
                    'X-CSRF-TOKEN': token
                }
            });
        } else {
            // Return a rejected Promise if there is no filename
            return Promise.reject("No filename provided");
        }
    }
    function designerAudioPlayer(id){
        var player = $('#divaudio'+id),

            audio = player.find('audio'),
            duration = $('.duration'),
            currentTime = $('.current-time'),
            progressBar = $('.progress span'),
            mouseDown = false,
            rewind, showCurrentTime;
        console.log("ssss");
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
                    console.log("current cursor: " + i);
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




        // Set up event listener for "timeupdate" on audioPlayer
        audioPlayer.addEventListener("timeupdate", function (e) {
            // Get current time in milliseconds
            const currentTimeMs = audioPlayer.currentTime * 1000;

            // Loop through all children of subtitles element
            const numChildren = subtitles.children.length;
            let scrollCounter = 0;
            for (let i = 0; i < numChildren; i++) {
                const child = subtitles.children[i];
                const childId = child.id;

                // If child´s id is lower or equal to current time, set background to yellow and scroll when threshold is met
                if (childId <= currentTimeMs) {
                    child.style.background = 'yellow';
                    if (scrollCounter >= SCROLL_THRESHOLD) {
                        const lineIndex = Math.max(i - SCROLL_OFFSET, 0);
                        console.log("current cursor: " + i);
                        const scrollTop = lineIndex;
                        $("#divtext" + id).scrollTop(scrollTop);
                        scrollCounter = 0;
                    }
                } else {
                    break;
                }
                scrollCounter++;
            }
        });
        console.log(audio);
        function secsToMins(time) {
            var int = Math.floor(time),
                mins = Math.floor(int / 60),
                secs = int % 60,
                newTime = mins + ':' + ('0' + secs).slice(-2);

            return newTime;
        }

        function getCurrentTime() {
            console.log("getCurrentTime");
            var currentTimeFormatted = secsToMins(audio[0].currentTime),
                currentTimePercentage = audio[0].currentTime / audio[0].duration * 100;

            currentTime.text(currentTimeFormatted);
            progressBar.css('width', currentTimePercentage + '%');

            if (player.hasClass('playing')) {
                showCurrentTime = requestAnimationFrame(getCurrentTime);
            } else {
                cancelAnimationFrame(showCurrentTime);
            }
        }

        audio.on('loadedmetadata', function () {
            console.log('loadmetadata');
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

        $('button').on('click', function () {
            var self = $(this);
            console.log('button click')
            if (self.hasClass('play-pause') && player.hasClass('paused')) {
                player.removeClass('paused').addClass('playing');
                audio[0].play();
                getCurrentTime();
            } else if (self.hasClass('play-pause') && player.hasClass('playing')) {
                player.removeClass('playing').addClass('paused');
                audio[0].pause();
            }

            if (self.hasClass('shuffle') || self.hasClass('repeat')) {
                self.toggleClass('active');
            }
        }).on('mousedown', function () {
            var self = $(this);

            if (self.hasClass('ff')) {
                player.addClass('ffing');
                audio[0].playbackRate = 2;
            }

            if (self.hasClass('rw')) {
                player.addClass('rwing');
                rewind = setInterval(function () { audio[0].currentTime -= .3; }, 100);
            }
        }).on('mouseup', function () {
            var self = $(this);

            if (self.hasClass('ff')) {
                player.removeClass('ffing');
                audio[0].playbackRate = 1;
            }

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

            if (mouseDown || e.type === 'click') {
                audio[0].currentTime = audio[0].duration * offsetPercentage;
                if (player.hasClass('paused')) {
                    progressBar.css('width', offsetPercentage * 100 + '%');
                }
            }
        });
    }
    function audioPlayer(id) {
        //Get elements 
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
                    console.log("current cursor: " + i);
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




        // Set up event listener for "timeupdate" on audioPlayer
        audioPlayer.addEventListener("timeupdate", function (e) {
            // Get current time in milliseconds
            const currentTimeMs = audioPlayer.currentTime * 1000;

            // Loop through all children of subtitles element
            const numChildren = subtitles.children.length;
            let scrollCounter = 0;
            for (let i = 0; i < numChildren; i++) {
                const child = subtitles.children[i];
                const childId = child.id;

                // If child´s id is lower or equal to current time, set background to yellow and scroll when threshold is met
                if (childId <= currentTimeMs) {
                    child.style.background = 'yellow';
                    if (scrollCounter >= SCROLL_THRESHOLD) {
                        const lineIndex = Math.max(i - SCROLL_OFFSET, 0);
                        console.log("current cursor: " + i);
                        const scrollTop = lineIndex;
                        $("#divtext" + id).scrollTop(scrollTop);
                        scrollCounter = 0;
                    }
                } else {
                    break;
                }
                scrollCounter++;
            }
        });



        // audioPlayer.addEventListener("timeupdate", function (e) {
        //     const currentTimeMs = audioPlayer.currentTime * 1000;
        //     const numChildren = subtitles.children.length;
        //     var j = 0;
        //     for (let i = 0; i < numChildren; i++) {

        //         const child = subtitles.children[i];
        //         const childId = child.id;
        //         if (childId <= currentTimeMs) {
        //             child.style.background = 'yellow';
        //             //child.scrollIntoView();
        //             if(j>25){
        //                 const lineIndex = i - 35; // index of the line to scroll to
        //                 console.log("current cursor" +i);
        //                 //const lineHeight = 10;
        //                 const scrollTop = lineIndex; // calculate the scroll position

        //                 $("#divtext" + id).scrollTop(scrollTop);
        //                 j = 0;
        //             }
        //         } else {
        //             break;
        //         }
        //         j++;
        //     }

        // });
        // audioPlayer.addEventListener("timeupdate", function (e) {
        //     const currentTimeMs = audioPlayer.currentTime * 1000;
        //     for (let i = 0; i < subtitles.children.length; i++) {
        //         const child = subtitles.children[i];
        //         if (child) {
        //             if (child.id <= currentTimeMs) {
        //                 child.style.background = 'yellow';
        //                 child.scrollIntoView();
        //             } else {
        //                 break;
        //             }
        //         }
        //     }
        // });
        // for (var i = 0; i < subtitles.children.length; i++) {
        //     var currentTimeMs = audioPlayer.currentTime * 1000;
        //     if (subtitles.children[i].id <= currentTimeMs && subtitles.children[i]) {
        //         subtitles.children[i].style.background = 'yellow';
        //         subtitles.children[i].scrollIntoView();
        //     } else {
        //         break; // to increase performance
        //     }
        // }

    }

});


