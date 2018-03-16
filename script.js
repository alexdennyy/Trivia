var currentQuestion = 0;
var wrongCount = 0;
var correctCount = 0;
$(document).ready(function(){
    $("#playInterface").hide();
    $.ajax({
        url: "https://opentdb.com/api_category.php",
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        success: function (result) {
            myFunction(result);
        },
        error: function () {
            alert('Failed!');
        }
    });


    $("#start").on("click", function(){
        var category = $("#category").val();
        var difficulty = $("#difficulty").val();
        $(this).closest(".row").hide();
        $("#playInterface").show();
        console.log(category);
        console.log(difficulty);
        $.ajax({
            url: "https://opentdb.com/api.php?amount=10&category=" + category + "&difficulty=" + difficulty +"&type=multiple",
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            success: function (result) {
                questions = result;
                startGame(result);
            },
            error: function(){
                alert('Failed to retrieve');
            }
        })
    });
    correctCount = 0;
    wrongCount = 0;
    $(".choice").on("click", function(){
        var guess = $(this).text();
        if(guess == questions.results[currentQuestion].correct_answer){
            console.log("correct");
            $("#playInterface").css("background-color", "lime");
            setTimeout(changeColor, 300);
            correctCount++;
        } else {
            var correctAnswer =
            $("#playInterface").css("background-color", "red");
            console.log("wrong correct answer was "  + questions.results[currentQuestion].correct_answer);
            setTimeout(changeColor, 300);
            wrongCount++;
        }
        currentQuestion++;
        if(currentQuestion < 10){
            console.log("You have " + wrongCount + " wrong answers and " + correctCount + " right answers");
            startGame(questions);
        } else {
            endGame(correctCount, wrongCount);
        }
    });
    $("#restart").on("click", function(){
        $("#restart").text("Restart");
        console.log("restarting");
        $(".end").remove();
        $("#start").closest(".row").show();
        $("#playInterface").hide();
        currentQuestion = 0;
        correctCount = 0;
        wrongCount = 0;
    });
});

var changeColor = function() {
    $("#playInterface").css("background-color", "mediumaquamarine");
}

function endGame(right, wrong){
    console.log(right + " correct");
    console.log(wrong + " wrong");
    $("#restart").text("Play Again");
    $(".play").hide();
    $("#playInterface").append("<div class='row end'><div class='col-md-3'><div class='col-md-6' id='notify'></div><div class='col-md-3'></div></div></div>");
    $("#notify").text(right + " / 10");
}

function startGame(questions){

    if(questions.response_code == 1){
        $("#question").html("There's not enough questions available, please select another category");
        $("#question").show();
        $("#options1, #options2").hide();
    }

    if(questions.response_code == 0){
        var options = [];
        $("#options1, #options2, .play").show();
        for(var i = 0; i < 3; i++) {
            options.push(questions.results[currentQuestion].incorrect_answers[i]);
        }
        options.push(questions.results[currentQuestion].correct_answer);
        console.log(options);
        console.log(questions);
        options = shuffle(options);
        console.log(options);
        $("#question").html(questions.results[currentQuestion].question);
        for(var i = 0; i < 5; i++) {
            $("#option" + i + "").find("button").html(options[i - 1]);
        }
    }


}


function myFunction(json){
    var html = "";
    for (var i = 0;i < json.trivia_categories.length; i++){
        html += "<option value='" + json.trivia_categories[i].id + "'>" + json.trivia_categories[i].name + "</option>"
    }
    $("#category").html(html);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

