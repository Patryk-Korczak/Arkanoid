var link = location.search.slice(12);
var append = "http://";
var fullLink = String(append + link);

function loginUser() {
    console.log(fullLink);
    fetch(fullLink).then(response => response.json()).then(data => postMessage(data));
}

loginUser();