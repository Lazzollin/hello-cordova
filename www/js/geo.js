
var onGeoSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');

    var marker = L.marker([-34.9336538,-57.9631417]).addTo(map);
    map.setView([-34.9336538,-57.9631417], 17);
};

function onGeoError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function getGeo() {
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}

function checkGeoPerm() {
    const permissions = cordova.plugins.permissions;

    permissions.checkPermission(permissions.ACCESS_FINE_LOCATION, status => {
        if (status.hasPermission) {
            $(".geo").removeClass("geo-disabled")
            $(".geo").addClass("geo-enabled")
        } else {
            $(".geo").removeClass("geo-enabled")
            $(".geo").addClass("geo-disabled")

            const error = function() {
                console.warn('Geo permission has been denied');
            };
      
            const success = function(status) {
                if(!status.hasPermission) {
                    error();
                } else {
                    $(".geo").removeClass("geo-disabled")
                    $(".geo").addClass("geo-enabled")
                }
            };
            permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, success, error);
        }   
      })
}

var map = L.map('map').setView([-34.921329, -57.954495], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);