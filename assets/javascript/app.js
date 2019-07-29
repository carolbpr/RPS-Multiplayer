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
console.log(connectionsRef);
// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
console.log(connectedRef);
// When the client's connection state changes...

connectedRef.on("value", function (snap) {
    console.log(snap.val())
    // If they are connected..
    if (snap.val()) {
        // Add user to the connections list.
        console.log(connectionsRef);
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    }
});


// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {
    //console.log(snap.numChildren);
    if (snap.numChildren() > 2) {
        console(connectionsRef.key);
        alert("alert");
    }
  
    console.log(snap.numChildren());
});


// Creates an array that lists out all of the options (Rock, Paper, or Scissors).
var computerChoices = ["r", "p", "s"];

// Creating variables to hold the number of wins, losses, and ties. They start at 0.
var wins = 0;
var losses = 0;
var ties = 0;

// Create variables that hold references to the places in the HTML where we want to display things.
var directionsText = document.getElementById("directions-text");
var userChoiceText = document.getElementById("userchoice-text");
var computerChoiceText = document.getElementById("computerchoice-text");
var winsText = document.getElementById("wins-text");
var lossesText = document.getElementById("losses-text");
var tiesText = document.getElementById("ties-text");



// This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
function game(player1) {
    var computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];
    $("#results").empty();
    if (player1 === "r" && computerGuess === "s") {
        wins++;
        $("#results").text("Rock destroys sicssors. You win");
        $("#player-1-score").text(wins);
    }
    else if (player1 === "s" && computerGuess === "p") {
        wins++;
        $("#results").text("Sicssors cut paper. You win");
        $("#player-1-score").text(wins);
    }
    else if (player1 === "p" && computerGuess === "r") {
        wins++;
        $("#results").text("Paper covers rock. You win");
        $("#player-1-score").text(wins);

    }
    else if (player1 === computerGuess) {
        ties++;
        $("#results").text("It is a draw");
    }
    else if (player1 === "s" && computerGuess === "r") {
        losses++;
        $("#results").text("Rock destroys sicssors. You lost");
        $("#player-2-score").text(losses);
    }
    else if (player1 === "p" && computerGuess === "s") {
        losses++;
        $("#results").text("Sicssors cut paper. You lost");
        $("#player-2-score").text(losses);
    }
    else if (player1 === "r" && computerGuess === "p") {
        losses++;
        $("#results").text("Paper covers rock. You lost");
        $("#player-2-score").text(losses);

    }
return false;
}



function choices() {
    event.preventDefault();
    var playerChoice = $(this);
    if (playerChoice.attr("data-choice") === "rock") {
        game("r");
    } else if (playerChoice.attr("data-choice") === "paper") {
        game("p");
    } else if (playerChoice.attr("data-choice") === "sicssors") {
        game("s");
    }

}
$(document).on("click", ".choice", choices);

