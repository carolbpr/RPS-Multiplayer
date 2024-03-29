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
// All of our connections will be stored in this directory. This refers to the players.
//Each connection is a player
var connectionsRef = database.ref("/connections");
var resultsRef = database.ref("/results");
var gameRef = database.ref("/game");
var connectedRef = database.ref(".info/connected");
//variables and counters
var player1 = "";
var player2 = "";
var connection = "";
var playerkey = "not_connected";
var time;
var player1wins = 0;
var player2wins = 0;
var player = 0;
//more database directories
database.ref("/results").set({
    message: "Make your selection to start playing",
    player1wins: 0,
    player2wins: 0,
});
database.ref("/game").set({
    on: false
});
var chatRef = database.ref("/chat");
// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
// When the client's connection state changes...
connectedRef.on("value", function (snap) {
    playerNumber = snap.numChildren();
    // If they are connected..
    if (snap.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);
        playerkey = con.key
        console.log("your key is :" + playerkey) //this key can be used to find the player later
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
        chatRef.on("value", function (snap) {
            var chat = $("<html><h6>");
            chat.html(snap.val());
            chat.prependTo($("#chat-box"));

        })
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
    //This set the player 1
    if (playerNumber === 1) {
        clearInterval(time);
        $("#player-1").css("border", "8px solid");
        $("#player-2").css("border", "3px solid");
        $(".modal").css("display", "block");
        $("#InfoCaption").html("You are Player 1");
        time = setInterval(function () {
            $("#InfoCaption").empty(),
                $("#popupInfo").css("display", "none")
        }, 5000);
        if (last === playerkey) {
            player1 = playerkey;
            player = 1;
        }
    }
    //This set the player 2
    else if (playerNumber === 2) {
        clearInterval(time);
        $(".modal").css("display", "block");
        gameRef.on("value", function (snap) {
            gameOn = snap.val().on
        });
        if (last === playerkey && gameOn == false) {
            $("#InfoCaption").html("You are Player 2");
            $("#player-1").css("border", "3px solid");
            $("#player-2").css("border", "8px solid");
            player = 2;
        }
        player2 = playerkey;
        time = setInterval(function () {
            $("#InfoCaption").empty(),
                $("#popupInfo").css("display", "none")
        }, 5000);
        database.ref("/game/on/").set(true);
    }
    //This disconnect if a third connection is intended
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
//Reset the player choice each time
function resetSelection() {
    // event.preventDefault();
    ref = database.ref("/connections/");
    ref.orderByChild("choice").limitToFirst(2).once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            database.ref("/connections/" + child.key + "/").set(true);
        })
        database.ref("/results/player1/").set("");
        database.ref("/results/player2/").set("");
    })
}
//Display the results each time and in case of a Winner also restart the game
function displayResults() {
    resultsRef.on("value", function (snap) {
        if (snap.val().player1wins >= 5) {
            message = "Player 1 is the winner!!!";
            actionMessage = "Make your move to start a New Game";
            database.ref("/results/message").set(message);
            database.ref("/results/actionMessage").set(actionMessage);
            database.ref("/results/player1wins/").set("0");
            database.ref("/results/player2wins/").set("0");
            database.ref("/chat").set("");
            database.ref("/game/on/").set(false);
            $("#results").html("<p>" + snap.val().message + "</p>");
            $("#player-1-score").html("<span>0</span>");
            $("#player-2-score").html("<span>0</span>");
            $("#action-message").html("<p>" + snap.val().actionMessage + "</p>")
            $("#chat-box").empty();
            player1wins = 0;
            player2wins = 0;
            ties = 0;
        }
        else if (snap.val().player2wins >= 5) {
            message = "Player 2 is the winner!!!";
            actionMessage = "Make your move to start a New Game";
            database.ref("/results/message").set(message);
            database.ref("/results/actionMessage").set(actionMessage);
            database.ref("/results/player1wins/").set("0");
            database.ref("/results/player2wins/").set("0");
            database.ref("/chat").set("");
            database.ref("/game/on/").set(false);
            $("#results").html("<p>" + snap.val().message + "</p>");
            $("#player-1-score").html("<span>0</span>");
            $("#player-2-score").html("<span>0</span>");
            $("#action-message").html("<p>" + snap.val().actionMessage + "</p>");
            $("#chat-box").empty();
            player1wins = 0;
            player2wins = 0;
            ties = 0;

        }
        else {
            $("#results").html("<p>" + snap.val().message + "</p>");
            $("#action-message").html("<p>" + snap.val().actionMessage + "</p>");
            $("#player-1-score").html("<span>" + snap.val().player1wins + "</span>");
            $("#player-2-score").html("<span>" + snap.val().player2wins + "</span>");

        }

    })
}

// This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
function game() {
    resultsRef.on("value", function (snap) {
        player1 = snap.val().player1;
        player2 = snap.val().player2;
        player1wins =snap.val().player1wins;
        player2wins = snap.val().player2wins;
    })
    if ((player1 == "r" || player1 == "p" || player1 == "s") && (player2 == "r" || player2 == "p" || player2 == "s")) {

        if (player1 === "r" && player2 === "s") {
            player1wins++;
            message = "Rock destroys scissors. Player 1 wins";
            actionMessage = "Make your move";
            database.ref("/results/player1wins").set(player1wins);
            database.ref("/results/message").set(message);
            database.ref("/results/actionMessage").set(actionMessage);
            resetSelection();

        }
        else if (player1 === "s" && player2 === "p") {
            player1wins++
            message = "Scissors cut paper. Player 1 win";
            actionMessage = "Make your move";
            database.ref("/results/player1wins").set(player1wins);
            database.ref("/results/message").set(message);
            database.ref("/results/actionMessage").set(actionMessage);
            resetSelection();
        }
        else if (player1 === "p" && player2 === "r") {
            player1wins++;
            message = "Paper covers rock. Player 1 win";
            actionMessage = "Make your move";
            database.ref("/results/player1wins").set(player1wins++);
            database.ref("/results/message").set(message);
            database.ref("/results/actionMessage").set(actionMessage);
            resetSelection();

        }
        else if (player1 === player2) {
            
            message = "It is a draw";
            actionMessage = "Make your move";
            database.ref("/results/player1wins").set(player1wins);
            database.ref("/results/player2wins").set(player2wins);
            database.ref("/results/message").set(message);
            database.ref("/results/actionMessage").set(actionMessage);
            resetSelection();
        }
        else if (player1 === "s" && player2 === "r") {
            player2wins++;
            message = "Rock destroys scissors. Player 2 win";
            actionMessage = "Make your move";
            database.ref("/results/player2wins").set(player2wins);
            database.ref("/results/message").set(message);
            database.ref("/results/actionMessage").set(actionMessage);
            resetSelection();
        }
        else if (player1 === "p" && player2 === "s") {
            player2wins++;
            message = "Scissors cut paper. Player 2 win";
            actionMessage = "Make your move";
            database.ref("/results/player2wins").set(player2wins);
            database.ref("/results/message").set(message);
            database.ref("/results/actionMessage").set(actionMessage);
            resetSelection();
        }
        else if (player1 === "r" && player2 === "p") {
            player2wins++;
            message = "Paper covers rock. Player 2 win";
            actionMessage = "Make your move";
            database.ref("/results/player2wins").set(player2wins);
            database.ref("/results/message").set(message);
            database.ref("/results/actionMessage").set(actionMessage);
            resetSelection();
        }
    }
    displayResults();
}
//This passed the choice of each player from the database
function playerchoose() {
    ref = database.ref("/connections/");
    choose1 = ref.orderByChild("choice").limitToFirst(1).once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            if (child.val() == "r" || child.val() == "p" || child.val() == "s") {
                player1 = child.val();
                database.ref("/results/player1/").set(player1);
            }
        });
    });
    choose2 = ref.orderByChild("choice").limitToLast(1).once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            if (child.val() == "r" || child.val() == "p" || child.val() == "s") {
                player2 = child.val();
                database.ref("/results/player2").set(player2);
            }
        });
    });
    game();
}
//This record the choice in the database
function playerChoicefunction(choice) {
    event.preventDefault();
    database.ref("/connections/" + playerkey + "/").set(choice);
    playerchoose();
};
//This is the choice by the click
function choices() {
    database.ref("/results/message").set("");
    database.ref("/results/actionMessage").set("Game On");
    var playerChoice = $(this);
    if (playerChoice.attr("data-choice") === "rock") {
        playerChoicefunction("r");
    } else if (playerChoice.attr("data-choice") === "paper") {
        playerChoicefunction("p");
    } else if (playerChoice.attr("data-choice") === "scissors") {
        playerChoicefunction("s");
    }
}
$(document).on("click", ".choice", choices);
//This operate the chat
function sendMessage() {
    var gifInput = $("#chat-message").val().trim();
    if (gifInput !== "" && player == 1) {
        chat = chatRef.set("Player 1 says: " + gifInput);
        $("#chat-message").val("");
    }
    else if (gifInput !== "" && player == 2) {
        chat = chatRef.set("Player 2 says: " + gifInput);
        $("#chat-message").val("");
    }
    connectionsRef.on("value", function (snap) {
        
    });
    return false;
}
$(document).on("click", "button", sendMessage);