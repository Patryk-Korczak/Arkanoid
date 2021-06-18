var link = location.search.slice(13);
var append = "http://";
var fullLink = String(append + link);

function registerUser() {
    console.log(fullLink);
    fetch(fullLink).then(response => response.text()).then(data => postMessage(data));
}

registerUser();


