var worker;
let scores = [];
let sortedScores = [];
let currentID;

var request;
var currentUser = "Unknown";
var db;
var localRecords = [];
var sortedLocalRecords = [];
var loggedIn = false;




function getScores() {
    worker = new Worker("downloadAndSortScores.js?link=http://uczelnia.secdev.pl/Testing/Download_Scores");
    worker.onmessage = function(event) {
        for (let i = 0; i < event.data.length; i++) {
            var temp = JSON.parse(event.data[i].scores);
            scores.push(new ScoreEntry(temp.nick, temp.date, temp.score));
        }
        sortedScores = scores.sort(function compare( a, b ) {
            if ( Number(a.score) > Number(b.score) ){
                return -1;
            }
            if ( Number(a.score) < Number(b.score) ){
                return 1;
            }
            return 0;
        });

        for(let i=0; i<sortedScores.length; i++) {
            if(i<=9) {
                let name = String("top" + i.toString());
                document.getElementById(name).innerText = (i+1) + " | " + sortedScores[i].nick + " | " + sortedScores[i].score + " | " + sortedScores[i].date + " | ";
            }

            console.log(sortedScores);
        }
    };
}

function registerUser() {
    let link = String('http://uczelnia.secdev.pl/Testing/Register?login=' + document.getElementById('registerValue').value +"&password=" + document.getElementById('registerPasswordValue').value);
    worker = new Worker("registerUser.js?link=" + link);
    worker.onmessage = function (event) {
        if(event.data === "\"NICK_REGISTERED\"") {
            document.getElementById("registerResponse").innerText = "User registered, you can now log in."
        } else {
            document.getElementById("registerResponse").innerText = "User already exists. Choose different name."
        }
    }
}




request = window.indexedDB.open("wyniki");


request.onerror = function(event) {

};
request.onsuccess = function(event) {

};

request.onupgradeneeded = function () {
    var db = request.result;
    var store = db.createObjectStore("MyObjectStore", {keyPath: "id", autoIncrement: true});
    var index = store.createIndex("Record", ["record.nick", "record.score", "record.date"]);
}

request.onsuccess = function () {
    console.log("DB Created/Updated");
}

function saveToLocalDB() {
    let today = new Date().toISOString().slice(0, 10)
    var db = request.result;
    var tx = db.transaction(["MyObjectStore"], "readwrite");
    var store = tx.objectStore("MyObjectStore");
    var index = store.index("Record");
    store.add([currentUser, score, today]);

    tx.oncomplete = function() {
        if(currentUser === "Unknown") {
            alert("Saved score to localDatabate as unknown, please login if you want your username to be seen!");
            getLocalRecords();
        } else {
            alert("Saved score to localDatabate!");
            getLocalRecords();
        }

    };
}

function getLocalRecords () {
    var db = request.result;
    var tx = db.transaction(["MyObjectStore"], "readwrite");
    var store = tx.objectStore("MyObjectStore");
    var index = store.index("Record");
    var temp = store.getAll();
    tx.oncomplete = function () {
        for (let i = 0; i < temp.result.length; i++) {
            localRecords.push(new ScoreEntry(temp.result[i][0], temp.result[i][2], temp.result[i][1]));
        }
        sortedLocalRecords = localRecords.sort(function compare(a, b) {
            if (Number(a.score) > Number(b.score)) {
                return -1;
            }
            if (Number(a.score) < Number(b.score)) {
                return 1;
            }
            return 0;
        });

        for (let i = 0; i < sortedLocalRecords.length; i++) {
            if (i <= 9) {
                let name = String("local" + i.toString());
                document.getElementById(name).innerText = (i + 1) + " | " + sortedLocalRecords[i].nick + " | " + sortedLocalRecords[i].score + " | " + sortedLocalRecords[i].date + " | ";
            }
        }
    };

}

function loginUser() {
    let link = String('http://uczelnia.secdev.pl/Testing/login?login=' + document.getElementById('loginValue').value +"&password=" + document.getElementById('passwordValue').value);
    worker = new Worker("loginUser.js?link=" + link);
    worker.onmessage = function (event) {
        if (event.data.hasOwnProperty("LOGIN_OK")) {
            currentID = event.data["LOGIN_OK"];
            document.getElementById("loginResponse").innerText = "Logged in!"
            currentUser = document.getElementById('loginValue').value;
            loggedIn = true;
        }
    }

}

function uploadHighest() {
    let link = "";
    if(loggedIn === true) {
        link = String('http://uczelnia.secdev.pl/Testing/Upload_Score?user_id=' + currentID +
            "&score={%22nick%22:%22" + sortedLocalRecords[0].nick + "%22,"
            + "%22score%22:%22" + sortedLocalRecords[0].score + "%22,"
            + "%22date%22:%22" + sortedLocalRecords[0].date + "%22}");


        worker = new Worker("upload.js?link=" + link);
        console.log(link);
        worker.onmessage = function (event) {
            alert("Saved to global leaderboard!");
            scores =[];
            sortedScores = [];
            getScores();
        }
    } else {
        alert("You have to login to upload to global leaderboard!");
    }


}
