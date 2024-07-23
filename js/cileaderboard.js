//const { delay } = require("lodash");
$(document).ready(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    const ACCEPT_HEADER_VALUE = 'application/json';
    
    
    const $firstWinner = $('.firstWinner');
    const $firstWinnerScore = $('.firstWinnerScore');
    const $firstWinnerPic = $('.firstWinnerPic');
    const $secondWinner = $('.secondWinner');
    const $secondWinnerScore = $('.secondWinnerScore');
    const $secondWinnerPic = $('.secondWinnerPic');
    const $thirdWinner = $('.thirdWinner');
    const $thirdWinnerScore = $('.thirdWinnerScore');
    const $thirdWinnerPic = $('.thirdWinnerPic');
    const $bestOfDetails = $('.best-of-details');
    if (userleaderboard_url) {
        $.ajax({
            url: userleaderboard_url,
            dataType: 'json',
            headers: {
                Accept: ACCEPT_HEADER_VALUE,
                Authorization: `Bearer ${apiToken}`,
            },
            success: function ({ topthree, alluser, user_point }) {
                try {
                    setWinnerText($firstWinner, $firstWinnerScore, $firstWinnerPic, topthree[0]);
                    setWinnerText($secondWinner, $secondWinnerScore, $secondWinnerPic, topthree[1]);
                    setWinnerText($thirdWinner, $thirdWinnerScore, $thirdWinnerPic, topthree[2]);

                    userPointweek(user_point);
                    bestOfWeek(alluser);
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
    
    const $currentStreaks = $('.current-streaks');
    const $todayPoints = $('.today-points');
    const $lessonsPassed = $('.lesson-passed');
    const $userRank = $('.user-rank');
    const $userScore = $('.user-score');
    const $courseComplete = $('.course-complete');

    function setProgressText($userSelector, userValue) {
        $userSelector.text(userValue);
    }
    

    if (userProgressUrl) {
        $.ajax({
            url: userProgressUrl,
            type: "POST",
            dataType: 'json',
            headers: {
                Accept: ACCEPT_HEADER_VALUE,
                Authorization: 'Bearer ' + apiToken,
            },
            success: function (response) {
                try {
                    const { userpoint, total_point, unit_complete, lesson_passed } = response;
                    setProgressText($currentStreaks, unit_complete);
                    setProgressText($todayPoints, userpoint.today_point);
                    setProgressText($lessonsPassed, lesson_passed);
                    setProgressText($userRank, userpoint.rank);
                    setProgressText($userScore, total_point.total_point);
                    setProgressText($courseComplete, unit_complete);
                } catch (error) {
                    console.error('Error parsing response: ' + error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error making request: ' + textStatus + ', ' + errorThrown);
            },
        });
    }

    function setWinnerText($winnerSelector, $scoreSelector, $winnerPicSelector, { user_name, total_point, user_profile_pic }) {
        $winnerSelector.text(user_name);
        $scoreSelector.text(total_point);

        if (user_profile_pic) {
            $winnerPicSelector.css('background-image', `url(${user_profile_pic})`);
        }
    }
    function userPointweek(user_point) {
        var data = [];
        for (var i = 0; i < user_point.length; i++) {
            data.push({
                y: user_point[i].day,
                a: parseInt(user_point[i].point)
            });
        }
        console.log('data');
        console.log(data);
        Morris.Bar({
            element: "morris-bar-chart",
            data: data,
            xkey: "y",
            ykeys: ["a"],
            labels: ["A"],
            barColors: ["#7966ff"],
            barSizeRatio: 0.30,
            hideHover: "auto",
            gridLineColor: "#eef0f2",
            barShape: 'soft',
            resize: true,
        });
    }

    
    function bestOfWeek(alluser) {
        let html = '';

        alluser.forEach(({ user_name, email, user_profile_pic, lesson_name, total_point }, index) => {
            let badge = '';
            let profpic = defaultProfilePic;
            const slno = index + 1;

            if (index === 0) {
                badge = `<img src="${goldbadge}">`;
            } else if (index === 1) {
                badge = `<img src="${silverBadge}">`;
            } else if (index === 2) {
                badge = `<img src="${bronzeBage}">`;
            }

            if (user_profile_pic) {
                profpic = user_profile_pic;
            }

            html += `<tr><td class="medal-class">${badge} ${slno}</td><td><div class="d-flex no-block align-items-center"><div class="me-2 leaderboard-img"><img src="${profpic}" alt="user" class="rounded-circle" width="45"></div><div class=""><h5 class="mb-0 fs-4 font-medium">${user_name}</h5><span>${lesson_name}</span></div></div></td><td class="blue-grey-text text-darken-4 font-medium">${total_point}</td></tr>`;
        });

        $bestOfDetails.append(html);
    }

    
   
    });


    


    
   
    

    
    


    
    


    

    

   


    
    
    






    

    
   
    
    
    
    
    




