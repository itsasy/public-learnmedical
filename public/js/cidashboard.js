//const { delay } = require("lodash");
$(document).ready(function () {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    const ACCEPT_HEADER_VALUE = 'application/json';
    
    
    const $courseActivity = $('.course-activity');
    const $currentStreak = $('.current-streak');
   const $hoursNumber = $('.hours-number');
  const $notificationCount = $('.notification-count');
  
    if (userdashboard_url) {
        
      $.ajax({
        url: userdashboard_url,
        type: "POST",
        dataType: 'json',
        headers: {
          Accept: ACCEPT_HEADER_VALUE,
          Authorization: `Bearer ${apiToken}`,
        },
        success: function ({ lessontrack, user_dash, spent_time, notification_count }) {
          try {
            const notificationCount = parseInt(notification_count);
            if (!isNaN(notificationCount) && notificationCount > 0) {
              const htmlString = `${notificationCount} New`;
              $notificationCount.html(htmlString);
            }

            CourseActivity(lessontrack);
            currentStreak(user_dash);
            graphSpenttime(spent_time);

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
    
    

    function CourseActivity(lessontrack) {
        let newElement = '';
        var parent = $courseActivity;
        //lessontrack.forEach(({  play_precentage, unit_name, lesson_name  }, index) => {
      if (lessontrack.unit_name && lessontrack.play_precentage){

        newElement += `<div class="course-details mt-4">
                <div class="d-flex align-items-center">

                    <div class="icon-course"><img src="${courseIcon}" alt="user" width="30" /></div>
                    <p class="course-name">${lessontrack.unit_name}</p>
                </div>
                <div class="d-flex align-items-center mt-4 progress-text">
                    <p>${lessontrack.lesson_name}</p>
                    <p class="ms-auto">${lessontrack.play_precentage}%</p>
                </div>
                <div class="progress ">
                    <div class="progress-bar bg-purple" role="progressbar" style="width: ${lessontrack.play_precentage}%" aria-valuenow="${lessontrack.play_precentage}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>`;
      }

      //  });

        parent.children().first().after(newElement);
    }
  
    function currentStreak(user_dash) {
      //class="css-bar mb-0 css-bar-100"
        const parent = $currentStreak;
        const cards = user_dash.map(({
            name,
            points,
            color
        }) => {
            const cardHTML = `
      <div class="card" style="width: 50%;">
        <div class="card-body py-0 px-2">
          <div class="current-task">
            <div class="d-flex align-items-center px-2">
              
                <div data-label="${name}" style="background-color:${color}" ></div>
              
              <div>
                <h3 class="mb-0 current-streaks">${name}</h3>
              </div>
            </div>
            <div class="task-done px-2 py-0">You Scored <span>${points}</span> <img src="${partyIcon}" /> <p>${points}</p>${points ? '<br />' : ''}</div>
          </div>
        </div>
      </div>
    `;
            return cardHTML;
        });

        const newElement = `
    <div class="carousel-item active">
      <div class="card-wrapper container-sm d-flex justify-content-around px-0">
        ${cards.slice(0, 2).join('')}
      </div>
    </div>
    <div class="carousel-item">
      <div class="card-wrapper container-sm d-flex justify-content-around px-0">
        ${cards.slice(2, 4).join('')}
      </div>
    </div>
  `;
  /***
   * 
    <div class="carousel-item">
      <div class="card-wrapper container-sm d-flex justify-content-around px-0">
        ${cards.slice(4).join('')}
      </div>
    </div>
   */

        console.log($currentStreak); // Check the value of $currentStreak
        parent.append(newElement);

    }
  function graphSpenttime_old(spent_time) {
    const data = spent_time.map(({ day, hours }) => ({
     name: day,
     data: [parseInt(hours)]
   }));

   const hoursInDay = 24;
   const categories = Array.from({ length: hoursInDay }, (_, i) => i.toString());

   Highcharts.chart('container', {
     chart: {
       type: 'column',
       marginTop: 40,
       marginBottom: 80,
       plotBorderWidth: 1
     },
     title: {
       text: 'Data by Weekday and Hour for Each Day'
     },
     xAxis: {
       categories,
       title: {
         text: 'Hour of the Day'
       }
     },
     yAxis: {
       title: {
         text: 'Value'
       }
     },
     legend: {
       enabled: true
     },
     tooltip: {
       enabled: true,
       formatter: function () {
         return `${this.series.name}: ${this.y}`;
       }
     },
     plotOptions: {
       series: {
         borderWidth: 1,
         dataLabels: {
           enabled: true,
           color: '#000000'
         }
       }
     },
     series: data
   });
  } 
  function graphSpenttime(spent_time) {
    if (!spent_time || !spent_time.length) {
      console.error('Invalid spent_time parameter');
      return;
    }
    let total_hours = 0;
    spent_time.forEach(({ day, hours }) => {
      total_hours += parseInt(hours);
    });
    $hoursNumber.html(total_hours +' Hrs');

    const categories = spent_time.map((item) => item.day);
    const data = spent_time.map((item) => [0, parseInt(item.hours)]);

    Highcharts.chart('container', {
      chart: {
        type: 'columnrange',
        inverted: true
      },
      accessibility: {
        description: 'Image description: .'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: 'Hours'
        }
      },
      tooltip: {
        valueSuffix: 'Hrs'
      },
      plotOptions: {
        columnrange: {
          dataLabels: {
            enabled: true,
            format: '{y}'
          }
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Hours',
        data: data,
        color: '#8f97fe',
        borderRadius: '2%',
      }]
    });
  }
  
    });


    


    
   
    

    
    


    
    


    

    

   


    
    
    






    

    
   
    
    
    
    
    




