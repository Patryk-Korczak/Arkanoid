var link = location.search.slice(13);
var append = "https://";
var fullLink = String(append + link);

function registerUser() {
    fetch(fullLink).then(response => response.text()).then(data => postMessage(data));
}

registerUser();


