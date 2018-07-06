/**
 * Get query parameter by name
 * https://stackoverflow.com/a/901144/6451184
 * 
 * @param {*} name 
 * @param {*} url 
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Fetch GPX data
 * 
 * @param {number} id ID of the GPX trace on www.openstreetmap.org
 */
function fetchGpxData(id) {
  return new Promise((resolve, reject) => {
    const gpxUrl = `https://www.openstreetmap.org/trace/${id}/data.gpx`
      .replace("https://www.openstreetmap.org/trace/", "https://www1.theel0ja.info/osm-proxy/trace/"); // CORS :|
    
    fetch(gpxUrl)
      .then((response) => {
        if (!response.ok) {
          reject(response.statusText);
        }

        return response;
      })
      .then((response) => response.text())
      .then((data) => resolve(data))
      .catch(reject)
  });
}




/**
 * CREATE MAP AND ADD GPX
 */



var map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const gpxId = getParameterByName("id");

if(gpxId) {
  fetchGpxData(gpxId)
    .then((gpx) => {
      new L.GPX(gpx, {async: true}).on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
      }).addTo(map);
    })
    .catch((error) => {
      console.error(error);
      alert(`ERROR: ${error}`)
    });
}