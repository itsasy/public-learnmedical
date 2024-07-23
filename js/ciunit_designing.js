$(document).ready(function () {
    if (unitListUrl != '') {
        $.ajax({
            url: unitListUrl,
            dataType: 'json',
            success: function (data) {
                var course = data.units;
                var i = 0;
                $.each(course, function (data, value) {
                    var html = '';
                    i++;
                    if (i === 1) {
                        html += '<a id="button' + i + '" data-bs-toggle="collapse" data-bs-target="#collapse' + i + '"></a>';
                    }
                    $('#course-item').text(value.course.name);
                    var lesson = value.course_lesson;
                    html += '<div class="accordion-item"><h2 class="accordion-header" id = "heading' + i + '"><button class="btnunit accordion-button collapsed" type="button"  data-bs-toggle="collapse" data-bs-target="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">' + value.name + '</button></h2><div id="collapse' + i + '" data-id="' + value.id + '" class="accordion-collapse collapse" aria-labelledby="heading' + i + '" data-bs-parent="#accordionCourse"><div class="accordion-body"><ul class="unit-list">';
                    $.each(lesson, function (elm, val) {
                        html += '<li class="active"><a href="#">' + val.name + '</a></li>';
                    });
                    html += '</ul></div></div></div >';

                    $('#accordionCourse').append(html);
                    $("#button1").click(function () {
                        $("#collapse1").collapse("show");
                    });
                    $('#button1').trigger('click');

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
                $(`#contentNew${lastChar}`).next('.practice-test').remove();
                $(`#contentNew${lastChar}`).next('.practice-content').remove();
                try {
                    const response = await audioToText(lessonData);
                    const jsonObject = $.parseJSON(response.audio.content);
                    const text = jsonObject.text ?? '';
                    const audio_url = jsonObject.audio_url ?? '';

                    if (text) {
                        html += `<div class="practice-test div2" autofocus>${text}</div>`;
                        html += `<div class="div3" style="display:none;">${response.audio.content}</div>`;
                    }

                    if (audio_url) {
                        html += `<div class="practice-content"><div class="audio-player left"><div class="info"></div><div class="icon-container"><audio preload="metadata" src="${audio_url}" controls></audio></div></div></div>`;
                       // html += `<div class="practice-content"><div class="audio-player"><audio id="audio-player-${lastChar}" src="${audio_url}" ></audio><button class="player-button" data-audio="#audio-player-${lastChar}">Play</button><input class="timeline" type="range" min="0" max="100" value="0" step="0.1"></div></div>`;

                    //    html = + `<div class="practice-content"><div class="player paused mt-5"><div class="info"><div class="time"><span class="current-time">0:00</span><span class="progress"><span></span></span><span class="duration">0:00</span></div></div><div class="actions"><button class="button rw"><div class="arrow"></div><div class="arrow"></div></button><button class="button play-pause"><div class="arrow"></div></button><button class="button ff"><div class="arrow"></div><div class="arrow"></div></button></div><audio prelaod src="${audio_url}"></audio></div></div>`;
                    }

                    $(`#contentNew${lastChar}`).after(html);
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


            
            const audioPlayers = document.querySelectorAll(".audio-player");

            audioPlayers.forEach((audioPlayer, i) => {
                const audio = audioPlayer.querySelector("audio");
                const playerButton = audioPlayer.querySelector(".player-button");
                const subtitles = audioPlayer.querySelector(".subtitles");

                playerButton.addEventListener("click", (e) => {
                    const current = e.currentTarget;
                    const audio = current.closest(".audio-player").querySelector("audio");
                    const btnSvg = current.querySelector(".useBtn");
                    const audioData = JSON.parse(audioPlayer.dataset.audio);
                    console.log(audioData);
                    createSubtitle(audioData);

                    if (!audio.paused) {
                        btnSvg.setAttribute("href", "#icon-play");
                        audio.pause();
                    } else {
                        btnSvg.setAttribute("href", "#icon-pause");
                        audio.play();
                    }
                });

                const timeline = audioPlayer.querySelector('.timeline');

                // timeline.addEventListener('change', (e) => {
                //     const time = (timeline.value * audio.duration) / 100;
                //     audio.currentTime = time;
                // });

                // audio.addEventListener('ended', (e) => {
                //     console.log('audio finished');
                //     timeline.value = 0;
                // });

                audio.addEventListener("pause", function (e) {
                    for (var i = 0; i < subtitles.children.length; i++) {
                        subtitles.children[i].removeAttribute('style');
                    }
                });

                audio.addEventListener("timeupdate", function (e) {
                    for (var i = 0; i < subtitles.children.length; i++) {
                        var currentTimeMs = audio.currentTime * 1000;
                        if (subtitles.children[i].id <= currentTimeMs && subtitles.children[i]) {
                            subtitles.children[i].style.background = 'yellow';
                            subtitles.children[i].scrollIntoView();
                        } else {
                            break;
                        }
                    }
                });

                function createSubtitle(audioData) {
                    try {
                        const syncData = JSON.parse(audioData.subtitles).words;
                        console.log(syncData);
                        let element;
                        for (var i = 0; i < syncData.length; i++) {
                            element = document.createElement('span');
                            let endtime = syncData[i].end;
                            element.setAttribute("id", endtime);
                            element.innerText = syncData[i].text + " ";
                            subtitles.appendChild(element);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            });


            

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

});


