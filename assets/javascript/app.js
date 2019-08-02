/* global firebase */

// Initialize Firebase
// Make sure that your configuration matches your firebase script version
// (Ex. 3.0 != 3.7.1)
var config = {
    apiKey: "AIzaSyCaOBaSpw5qu5LhHCoJ7sO8Gqxbbxhv1Dc",
    authDomain: "rock-paper-scissors-263e1.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-263e1.firebaseio.com",
    projectId: "rock-paper-scissors-263e1",
    storageBucket: "",
    messagingSenderId: "297603065655",
    appId: "1:297603065655:web:8d30c9a582b377fe"
};

firebase.initializeApp(config);
// -----------------------------
// Create a variable to reference the database.
var database = firebase.database();

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
var resultsRef = database.ref("/results");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
var player1 = "";
var player2 = "";
var connection = "";
var playerkey = "not_connected";
var time;
database.ref("/results").set({
    message: "Make your selection to start playing",
    player1wins: 0,
    player2wins: 0,
    player1: "",
    player2: ""

});
displayResults();
// When the client's connection state changes...
connectedRef.on("value", function (snap) {
    console.log(snap);
    playerNumber = snap.numChildren();
    console.log(playerNumber);
    // If they are connected..
    if (snap.val()) {

        // Add user to the connections list.
        var con = connectionsRef.push(true);
        playerkey = con.key
        console.log("your key is :" + playerkey) //this key can be used to find the player later
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();

    }
});


// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    playerNumber = snap.numChildren();
    val = snap.val()
    var keys = Object.keys(val);
    var last = keys[keys.length - 1];
    console.log(playerNumber);
    if (playerNumber === 1) {
        clearInterval(time);

        $(".modal").css("display", "block");
        $("#InfoCaption").html("You are Player 1");
        time = setInterval(function () {
            $("#InfoCaption").empty(),
                $("#popupInfo").css("display", "none")
        }, 5000);
        if (last === playerkey) {
            player1 = playerkey;
            console.log(player1);
        }
    }
    else if (playerNumber === 2) {
        clearInterval(time);
        $(".modal").css("display", "block");
        if (last === playerkey)
            $("#InfoCaption").html("You are Player 2");
        player2 = playerkey;
        console.log(player2);
        time = setInterval(function () {
            $("#InfoCaption").empty(),
                $("#popupInfo").css("display", "none")
        }, 5000);
    }
    else if (playerNumber > 2) {
        clearInterval(time);
        if (last === playerkey) {
            $(".modal").css("display", "block");
            $("#InfoCaption").html("Try later!, just two players at the time");
            time = setInterval(function () {
                $("#InfoCaption").empty(),
                    $("#popupInfo").css("display", "none")
            }, 5000);
            database.ref("/connections/" + playerkey).remove();
        }
    }

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});




// Creates an array that lists out all of the options (Rock, Paper, or Scissors).

// Creating variables to hold the number of wins, losses, and ties. They start at 0.
var player1wins = 0;
var player2wins = 0;
var ties = 0;

// Create variables that hold references to the places in the HTML where we want to display things.
//var directionsText = document.getElementById("directions-text");
//var userChoiceText = document.getElementById("userchoice-text");
//var computerChoiceText = document.getElementById("computerchoice-text");
//var winsText = document.getElementById("wins-text");
//var lossesText = document.getElementById("losses-text");
//var tiesText = document.getElementById("ties-text");

function resetSelection() {
    // event.preventDefault();
    ref = database.ref("/connections/");
    ref.orderByChild("choice").limitToFirst(2).once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            console.log(child);
            database.ref("/connections/" + child.key + "/").set(true);
            // console.log(child.val());
            // player1 = child.val();
            // console.log(player1);
        })
        database.ref("/results/player1/").set("");
        database.ref("/results/player2/").set("");

    })
}
function displayResults() {
    resultsRef.on("value", function (snap) {
        $("#results").html("<p>" + snap.val().message + "</p>");
        $("#player-1-score").html("<span>" + snap.val().player1wins + "</span>");
        $("#player-2-score").html("<span>" + snap.val().player2wins + "</span>");
        
        
    })
}

// This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
function game() {
    resultsRef.on("value", function (snap) {
        player1 = snap.val().player1;
        player2 = snap.val().player2;
        console.log(player1);
        console.log(player2);
    })
    if ((player1 == "r" || player1 == "p" || player1 == "s") && (player2 == "r" || player2 == "p" || player2 == "s")) {

        if (player1 === "r" && player2 === "s") {
            player1wins++;
            database.ref("/results/player1wins").set(player1wins);
            message = "Rock destroys sicssors. Player 1 wins";
            database.ref("/results/message").set(message);

            displayResults();
            resetSelection();
        }
        else if (player1 === "s" && player2 === "p") {
            player1wins++;
            database.ref("/results/player1wins").set(player1wins);
            message = "Sicssors cut paper. Player 1 win";
            database.ref("/results/message").set(message);

            displayResults();
            resetSelection();
        }
        else if (player1 === "p" && player2 === "r") {
            player1wins++;
            database.ref("/results/player1wins").set(player1wins);
            message = "Paper covers rock. Player 1 win";
            database.ref("/results/message").set(message);

            displayResults();
            resetSelection();

        }
        else if (player1 === player2) {
            ties++;
            message = "It is a draw";
            database.ref("/results/message").set(message);
        }
        else if (player1 === "s" && player2 === "r") {
            player2wins++;
            database.ref("/results/player2wins").set(player2wins);
            message = "Rock destroys sicssors. Player 2 win";
            database.ref("/results/message").set(message);

            displayResults();
            resetSelection();
        }
        else if (player1 === "p" && player2 === "s") {
            player2wins++;
            database.ref("/results/player2wins").set(player2wins);
            message = "Sicssors cut paper. Player 2 win";
            database.ref("/results/message").set(message);


            displayResults();
            resetSelection();
        }
        else if (player1 === "r" && player2 === "p") {
            player2wins++;
            database.ref("/results/player2wins").set(player2wins);
            message = "Paper covers rock. Player 2 win";
            database.ref("/results/message").set(message);

            displayResults();
            resetSelection();

        }

        return false;
    }
}
function playerchoose() {
    ref = database.ref("/connections/");
    choose1 = ref.orderByChild("choice").limitToFirst(1).once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            console.log(child.val());
            if (child.val() == "r"|| child.val() == "p" || child.val() == "s") {
                player1 = child.val();
                console.log(player1);
                database.ref("/results/player1/").set(player1);
            }

            //resetSelection();
        });
    });
    choose2 = ref.orderByChild("choice").limitToLast(1).once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            console.log(child.val());
            if (child.val() == "r"|| child.val() == "p" || child.val() == "s") {
                player2 = child.val();
                console.log(player2);
                database.ref("/results/player2").set(player2);
            }
            //resetSelection();
        });
    });
    game();
}


function playerChoicefunction(choice) {
    event.preventDefault();
    console.log(choice);
    database.ref("/connections/" + playerkey + "/").set(choice);
    playerchoose();
}

function choices() {
    event.preventDefault();
    database.ref("/results/message").set("");


    var playerChoice = $(this);
    if (playerChoice.attr("data-choice") === "rock") {
        playerChoicefunction("r");
    } else if (playerChoice.attr("data-choice") === "paper") {
        playerChoicefunction("p");
    } else if (playerChoice.attr("data-choice") === "sicssors") {
        playerChoicefunction("s");

    }
    console.log(playerkey);
}
$(document).on("click", ".choice", choices);

