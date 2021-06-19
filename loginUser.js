var link = location.search.slice(12);
var append = "https://";
var fullLink = String(append + link);

function loginUser() {
    fetch(fullLink).then(response => response.json()).then(data => postMessage(data));
}

loginUser();