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
    worker = new Worker("downloadAndSortScores.js?link=https://uczelnia.secdev.pl/Testing/Download_Scores");
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
        $('#leaderboardTable').html("");
        let data = "<table class=\"table table-bordered\">" +
            "  <thead>\n" +
            "    <tr>\n" +
            "      <th scope=\"col\">#</th>\n" +
            "      <th scope=\"col\">Nick</th>\n" +
            "      <th scope=\"col\">Score</th>\n" +
            "      <th scope=\"col\">Date</th>\n" +
            "    </tr>\n" +
            "  </thead>\n" +
            "  <tbody>\n";

        for(let i=0; i<sortedScores.length;i++) {
            if(i<10) {
                let j = i+1;
                data +="<tr>\n" +
                    "      <th scope=\"row\">"+j+"</th>\n" +
                    "      <td>"+sortedScores[i].nick+"</td>\n" +
                    "      <td>"+sortedScores[i].score+"</td>\n" +
                    "      <td>"+sortedScores[i].date+"</td>\n" +
                    "    </tr>\n";
            }
        }

        data += " </tbody>\n" +
            "</table>";

        $('#leaderboardTable').append(data);

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

request.onupgradeneeded = function () {
    var db = request.result;
    var store = db.createObjectStore("MyObjectStore", {keyPath: "id", autoIncrement: true});
    var index = store.createIndex("Record", ["record.nick", "record.score", "record.date"]);
}

request.onsuccess = function () {
    getLocalRecords();
    getScores();
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

        $('#localScores').html("");
        let data = "<table class=\"table table-bordered\">" +
            "  <thead>\n" +
            "    <tr>\n" +
            "      <th scope=\"col\">#</th>\n" +
            "      <th scope=\"col\">Nick</th>\n" +
            "      <th scope=\"col\">Score</th>\n" +
            "      <th scope=\"col\">Date</th>\n" +
            "    </tr>\n" +
            "  </thead>\n" +
            "  <tbody>\n";

        for(let i=0; i<sortedLocalRecords.length;i++) {
            if(i<10) {
                let j = i+1;
                data +="<tr>\n" +
                    "      <th scope=\"row\">"+j+"</th>\n" +
                    "      <td>"+sortedLocalRecords[i].nick+"</td>\n" +
                    "      <td>"+sortedLocalRecords[i].score+"</td>\n" +
                    "      <td>"+sortedLocalRecords[i].date+"</td>\n" +
                    "    </tr>\n";
            }
        }

        data += " </tbody>\n" +
            "</table>";


        $('#localScores').append(data);
    };

}

function loginUser() {
    let link = String('http://uczelnia.secdev.pl/Testing/login?login=' + document.getElementById('loginValue').value +"&password=" + document.getElementById('passwordValue').value);
    worker = new Worker("loginUser.js?link=" + link);
    worker.onmessage = function (event) {
        if (event.data.hasOwnProperty("LOGIN_OK")) {
            currentID = event.data["LOGIN_OK"];
            currentUser = document.getElementById('loginValue').value;
            document.getElementById("loginResponse").innerText = "Logged in as " + currentUser;

            loggedIn = true;
        } else {
            document.getElementById("loginResponse").innerText = "Incorrect login/password!";
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


