var parameters = {}
location.search.slice(1).split("&").forEach( function(key_value) { var kv = key_value.split("="); parameters[kv[0]] = kv[1]; })

var link = parameters['link'];


function getScores2() {
    fetch(link).then(response => response.json()).then(data => postMessage(data));
}

getScores2();




