$(document).ready(function () {
    const post_id = $("#post-detail").attr("data-post-id");

    $("#code-form").submit(function(e){
        e.preventDefault();
        const formData     = $(this);
        const submitButton = $("#code-submit-button");
        reset();
        start();
        submitButton.html('Saving....<i class="fa fa-spin fa-spinner" aria-hidden="true"></i>');

        $.ajax({
            method: "POST",
            url: "http://localhost:8001/api/add-code",
            data: formData.serialize(),
            success: (result) => {
                submitButton.html('Save');
                pause();
                $("#comment-errors-data").html('');
                $("#comment-input").val('');
                $("#successMessage").removeClass('visually-hidden');
                getCommentsOfPosts(post_id);
            },
            error: (error) => {
                pause();
                if(error.status === 422) { // "Unprocessable Entity" - Form data invalid
                    $("#successMessage").addClass('visually-hidden');
                    var message = error.responseJSON.errors ? error.responseJSON.errors.comment ?  error.responseJSON.errors.comment[0] : '' : '';
                    $("#comment-errors-data").html(message);
                    submitButton.html('Save');
                }
            }
        });
    });

    let startDate, 
    interval = null, 
    stopwatch = document.getElementById("timer"),
    btn = document.getElementById("code-submit-button"),
    dateTimeFormat = new Intl.DateTimeFormat('default', { 
       minute: 'numeric',
       second: 'numeric',
       fractionalSecondDigits: 2});

    function startStopWatch(){
        if(interval === null){
            startDate = Date.now();
            //console.log('startDate', startDate);
            displayStopWatch();
            stopwatch.innerHTML= "test";
            interval = setInterval(displayStopWatch, 10);
        } else {
            clearInterval(interval);
            interval = null;
        }
    }

    function displayStopWatch(){
        let diff = Date.now() - startDate;
        console.log('ff', diff);
        //console.log('diff', diff);
        stopwatch.innerHTML= dateTimeFormat.format(new Date(diff));
    }

    // btn.addEventListener('click', function() {
    //     startStopWatch();
    // });

    // Convert time to a format of hours, minutes, seconds, and milliseconds

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
  
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
  
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
  
    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);
  
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");
  
    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}
  
// Declare variables to use in our functions below

let startTime;
let elapsedTime = 0;
let timerInterval;
  
// Create function to modify innerHTML

function print(txt) {
    document.getElementById("timer").innerHTML = txt;
}

// Create "start", "pause" and "reset" functions

function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        print(timeToString(elapsedTime));
    }, 10);
}

function pause() {
    clearInterval(timerInterval);
}

function reset() {
    clearInterval(timerInterval);
    print("00:00:00");
    elapsedTime = 0;
}

});





