var worker;
let scores = [];
let sortedScores = [];
let currentID;

var request;
var currentUser = "Unknown";
var db;
var localRecords = [];
var sortedLocalRecords = [];




function getScores() {
    worker = new Worker("downloadAndSortScores.js?link=http://uczelnia.secdev.pl/Testing/Download_Scores");
    worker.onmessage = function(event) {
        for (let i = 0; i < event.data.length; i++) {
            var temp = JSON.parse(event.data[i].scores);
            scores.push(new ScoreEntry(temp.nick, temp.date, temp.score));
        }
        sortedScores = scores.sort(function compare( a, b ) {
            if ( a.score > b.score ){
                return -1;
            }
            if ( a.score < b.score ){
                return 1;
            }
            return 0;
        });

        for(let i=0; i<sortedScores.length; i++) {
            if(i<9) {
                let name = String("top" + i.toString());
                document.getElementById(name).innerText = (i+1) + " | " + sortedScores[i].nick + " | " + sortedScores[i].score + " | " + sortedScores[i].date + " | ";
            }

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

function loginUser() {
    let link = String('http://uczelnia.secdev.pl/Testing/login?login=' + document.getElementById('loginValue').value +"&password=" + document.getElementById('passwordValue').value);
    worker = new Worker("loginUser.js?link=" + link);
    worker.onmessage = function (event) {
        if (event.data.hasOwnProperty("LOGIN_OK")) {
            console.log(event.data["LOGIN_OK"]);
            currentID = event.data["LOGIN_OK"];
            document.getElementById("loginResponse").innerText = "Logged in!"
            currentUser = document.getElementById('loginValue').value;
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
        } else {
            alert("Saved score to localDatabate!");
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
            if (a.score > b.score) {
                return -1;
            }
            if (a.score < b.score) {
                return 1;
            }
            return 0;
        });

        for (let i = 0; i < sortedLocalRecords.length; i++) {
            if (i < 9) {
                let name = String("local" + i.toString());
                document.getElementById(name).innerText = (i + 1) + " | " + sortedLocalRecords[i].nick + " | " + sortedLocalRecords[i].score + " | " + sortedLocalRecords[i].date + " | ";
            }

        }
    };

}
