console.log('this js file');

$(document).ready(function () {
    var audioPlayer = document.getElementById("audiofile");
    var subtitles = document.getElementById("div2");

    //var audio_arr = <?php //echo $json_result; ?>;
    var audio_obj = document.getElementById("div3").textContent;

    var audio_arr = JSON.parse(audio_obj);
    var syncData = audio_arr.words; createSubtitle();

    function createSubtitle() {
        var element;
        for (var i = 0; i < syncData.length; i++) {
            element = document.createElement('span');
            let endtime = syncData[i].end;
            element.setAttribute("id", endtime);
            element.innerText = syncData[i].text + " ";
            subtitles.appendChild(element);
        }
    }
    audioPlayer.addEventListener("pause", function (e) {
        for (var i = 0; i < subtitles.children.length; i++) {
            subtitles.children[i].removeAttribute('style');

        }

    }); audioPlayer.addEventListener("timeupdate", function (e) {
        // syncData.forEach(function(element, index, array) {
        //     var currentTimeMs = audioPlayer.currentTime * 1000;
        //     if (currentTimeMs > element.start && currentTimeMs <= element.end && subtitles.children[index])

        //         subtitles.children[index].style.background = 'yellow';
        // });
        for (var i = 0; i < subtitles.children.length; i++) {

            var currentTimeMs = audioPlayer.currentTime * 1000;
            if (subtitles.children[i].id <= currentTimeMs && subtitles.children[i]) {
                subtitles.children[i].style.background = 'yellow';
                //subtitles.children[i].style.scrollIntoView();
                subtitles.children[i].scrollIntoView();
            } else {
                break; // to increase performance
            }
        }
    });
});