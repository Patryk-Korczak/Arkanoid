var link = location.search.slice(13);
var append = "http://";
var fullLink = String(append + link);

function upload() {
    console.log(link);
    fetch(fullLink).then(response => response.text()).then(data => postMessage(data));
}

upload();