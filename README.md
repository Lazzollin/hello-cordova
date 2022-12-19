# Cordova test app

This is an app I've made to test out cordova and some of it's available plugins, as well as making my own to list all sensors available in an android phone

The app has a bottom tab navigator that's used to separate 4 different tests

## Camera test

<img align="right" src="https://user-images.githubusercontent.com/48962891/208433529-a7859b82-cfcd-49f6-bddc-af94bcf8e425.png" alt="drawing" width="200"/>

This test uses <a href="https://github.com/apache/cordova-plugin-camera" target="_blank">cordova-plugin-camera</a> to use the phone's camera.
 
The `Open camera` button calls the `camera.getPicture(successCallback, errorCallback, options)` method, which takes a CameraOptions object as parameter to determine its behavior. In this case the object's `Camera.sourceType` variable defaults to `Camera.PictureSourceType.CAMERA`, which opens the default camera app, lets you take a picture, and then returns the result with the `cameraSuccess` as a String.
This string is passed to the given `onCameraSuccess(imgURL)` method below to set the src attribute of the `img` tag at the top using JQuery.

onCameraSuccess method:
```
function onCameraSuccess(imgURL) {
    console.log('Camera success, image saved on: ' + imgURL)
    $("#camera-img").attr("src", imgURL)
}
```
The Open gallery button, also calls the `camera.getPicture(successCallback, errorCallback, options)` method, but passes an object `{sourceType: Camera.PictureSourceType.PHOTOLIBRARY}` as parameter to override the default `Camera.sourceType` to `Camera.PictureSourceType.PHOTOLIBRARY`, so instead of the camera, it opens up the phone's gallery and lets you pick a picture from it, this will end up with a similar result as the Open camera button, with this method returning a String with the `cameraSuccess` method to be passed to `onCameraSuccess(imgURL)` to show it in the `img` tag on the top.
<br><br><br>

## Geo location test

<img align="right" src="https://user-images.githubusercontent.com/48962891/208433542-14e23cb2-8f43-42bb-9b88-5d53f1668084.png" alt="drawing" width="200"/>

In order to get the geo position, first we have to check if we're allowed to use the device's location services.

To achieve this, we can tap the `Check geo permission` button, which will call the `checkGeoPerm()` method below:
```
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
```

Using the [cordova-plugin-android-permissions](https://github.com/NeoLSN/cordova-plugin-android-permissions) plugin, it'll check if `ACCESS_FINE_LOCATION` permission is granted, this will return its status to a callback function, with which we'll check if `status.hasPermission` equals to `true`, then using JQuery, we can add the `geo-enabled` class to the Geo permission `p` tag above the map, which will turn its background-color to green, to let us know that we're ready to go.

In the case that `status.hasPermission` equals to `false`, we'll call `permissions.requestPermission` to prompt the user with the option to give the app access to our location.

Now on to the most important part of this test, the map and getting the phone's location.

The map was made dynamically using [leaflet.js](https://leafletjs.com/), in order to do this first we add to the top of the HTML the leaftet.js CDN for the scripts and css.

```
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
    integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
    crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
    integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
    crossorigin=""></script>
```

After that we create a map instance attached to a div tag and set up the initial view
```
<div id="map"></div>
```
```
var map = L.map('map').setView([lat, long], 13);
```

Then we'll load the tiles to show the actual map, in this case we're getting them from [OSM](https://www.openstreetmap.org/ "OpenStreetMap")

```
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

<img align="left" src="https://user-images.githubusercontent.com/48962891/208493411-f41a53d8-16fd-4f98-a580-a6072001d5ba.png" alt="drawing" width="200"/>

Now we're finally ready to get our location, to do this we can tap on the `Get geo position` button, this will call our `getGeo()` function, which will call `navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError)` with the following methods:

```
function onGeoSuccess(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');

    var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
    map.setView([position.coords.latitude, position.coords.longitude], 17);
};

function onGeoError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
```

This, if we have the needed permissions to use the location services, will return and alert with all the data provided by said service, and then it will add a marker and set the center of our map on our current location

## Custom test
<img align="right" src="https://user-images.githubusercontent.com/48962891/208433549-776ad815-f331-42b3-b7df-4c3ed58600b2.png" alt="drawing" width="200"/>

Here we can test out the custom plugin I've made. For this I used [cordova-plugman](https://github.com/apache/cordova-plugman) to generate the initial code to start building the plugin.

In this base code we have an echo functionality, which from the JavaScript end, will send a string to the Android end (below the cordova WebView), and then back to JavaScript.

To do this first it defines a function `coolMethod()` (cool name), which calls the exec cordova method `exec(success, error, 'PluginCustom', 'coolMethod', [arg0])`.
exec is used to call the `execute` method of the `CordovaPlugin` class, which we'll override to add our own functionality, for this we'll create a new class `PluginCustom` that'll extend `CordovaPlugin`, and then override the `execute` method, like this:

```
public class PluginCustom extends CordovaPlugin {
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("coolMethod")) {
            String message = args.getString(0);
            this.coolMethod(message, callbackContext);
            return true;
        return false;
    }
```

So now we can call the `coolMethod()` below from our cordova app.

```
var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'PluginCustom', 'coolMethod', [arg0]);
};
```

Next, we'll add the actual custom plugin, this will call a method on the android side of things, to get a list of all the available sensors on the phone.

First we'll add our JavaScript method to interact with our app.

```
exports.getSensorData = function (success, error) {
    exec(success, error, 'PluginCustom', 'getSensorData', ['']);
}
```

and then we add a new method to the java `PluginCustom` class.

```
private void getSensorData(CallbackContext callbackContext, Context appContext) {
    sensorManager = (SensorManager) appContext.getSystemService(Context.SENSOR_SERVICE);
    List<Sensor> sensorList = sensorManager.getSensorList(Sensor.TYPE_ALL);
}
```

<img align="left" src="https://user-images.githubusercontent.com/48962891/208433551-2f9dc707-db8e-4c59-8d3b-51ba3813d38a.png" alt="drawing" width="200"/>

At last we'll transform our `List<Sensor>` to a JSONArray to return to the JavaScript end. To achieve this we could use Java libraries like [gson](https://github.com/google/gson), but instead I went with a pure Java approach, which consists of making a new JSONObject, adding the Sensor object attributes from the list, and then appending this JSONObject to a JSONArray.

```
JSONArray mJSONresult = new JSONArray();

for (int i = 0; i <= sensorList.size()-1; i++) {
    JSONObject mJSONobj = new JSONObject();

    Sensor sensor = sensorList.get(i);

    try {
        mJSONobj.put("Name", sensor.getName());
        mJSONobj.put("Type", sensor.getStringType());
    } catch (JSONException e) {
        callbackContext.error(e.toString());
    }

    mJSONresult.put(mJSONobj);
}
```

Then we pass our new JSONArray to the `callbackContext.success()` method to send it to the JavaScript end.

After all this, we can finally tap on the `List all sensors` button to get a list of all available sensors.


## Other tests
<img align="left" src="https://user-images.githubusercontent.com/48962891/208433557-c42d213d-a88b-4702-8f92-35be018543cd.png" alt="drawing" width="200"/>

On the right-most tab we have other cordova plugins that aren't as "heavy" as the other two, this are:

&ensp;&ensp;&ensp; ❖ <a href="https://github.com/apache/cordova-plugin-device">cordova-plugin-device</a>

&ensp;&ensp;&ensp; ❖ <a href="https://github.com/apache/cordova-plugin-dialogs">cordova-plugin-dialogs</a>

&ensp;&ensp;&ensp; ❖ <a href="https://github.com/apache/cordova-plugin-vibration">cordova-plugin-vibration</a>

&ensp;&ensp;&ensp; ❖ <a href="https://github.com/apache/cordova-plugin-network-information">cordova-plugin-network-information</a>


This pages are apart from the other because of them not being as packed of stuff to do as the first two, making them a little less interesting to talk about, and less extensive to explain, but also, because of space in the bottom tab bar, and me wanting to make another navigator (more on this later).

### Device info test
<img align="right" src="https://user-images.githubusercontent.com/48962891/208433560-37425a38-a18f-4f8a-aece-f39c5ec38d79.png" alt="drawing" width="150"/>
First let's talk about the first one in the list, the device plugin. This plugin gives us info of the device as strings, yeah that's it.

To use it we just get the property we want `device.<info>`, simple as that. The properties available are:
```
 device.cordova
 device.model
 device.platform
 device.uuid
 device.version
 device.manufacturer
 device.isVirtual
 device.serial
 device.sdkVersion (Android only)
```

### Dialogs test
<img align="right" src="https://user-images.githubusercontent.com/48962891/208438352-dcf7f548-0487-4b18-b52b-5b0f142fbedc.gif" alt="drawing" width="200"/>

The dialogs plugin lets us prompt the user with information, an option, an input field or just play a notification sound.

The code used to make the demo work goes as follows:
```
function testAlert() {
    navigator.notification.alert(
        "This is a test alert, it'll callback a method to notify you you've been notified", 
        c => $("#alert-h2").text("You've been notified"), 
        "Test alert", 
        "OK"
    );
}
function testConfirm() {
    const cc = c => {
        if (c === 1) {
            $("#confirm-h2").html("VAMOS MESSI");
        } else {
            $("#confirm-h2").html("Respuesta incorrecta");
        }
    }

    navigator.notification.confirm(
        "vamos messi?",         // Dialog message
        c => {cc(c)},           // Dialog callback
        "Messi?",               // Dialog title
        ["Messi", "NoMessi"]    // Dialog button labels
    );
}

function testPrompt() {
    navigator.notification.prompt(
        "Type whatever below", 
        c => c.buttonIndex === 1 
            ? $("#prompt-h2").text(c.input1)
            : $("#prompt-h2").text("No input"), 
        "Prompt test", 
        ["OK", "Cancel"], 
        "Type here"
    );
}
function testBeep() {
    navigator.notification.beep(1);
    navigator.vibrate([500, 100, 500]);
    // Vibrate 500ms, stop 100ms, then go for 500ms more
}
```

To test the beep even while the phone is in silence mode I've added a vibration pattern which will make the device vibrate twice apart from playing the default notification sound.
### Vibration test
<img align="right" src="https://user-images.githubusercontent.com/48962891/208535229-a3957466-8bf0-4131-91c0-901176b0d173.jpeg" alt="drawing" width="150"/>

This simple test uses the vibration plugin to make the phone go *brrr*. For this it calls the function `startVibration()` which every second it will play a one second vibration with `navigator.vibrate(1000)`, and then to stop it we can call `stopVibration()`, there isn't much more about it, here's the code of these two methods:
```
var v = false

function startVibration() {
    v = true;

    navigator.vibrate(1000);
    setTimeout(() => {
        v? startVibration(): navigator.vibrate(0);
    }, 1000);
}

function stopVibration() {
    v = false;
}
```

### Network test
<img align="middle" src="https://user-images.githubusercontent.com/48962891/208535244-6651c8af-f850-4a9f-aa66-71108044bf1f.jpeg" alt="drawing" width="150"/>
<img align="middle" src="https://user-images.githubusercontent.com/48962891/208535260-f8a9d86b-f338-47a0-bc0b-b08ff73644e4.jpeg" alt="drawing" width="150"/>

This last test uses the network information plugin to see if the device is connected to the internet, and if it is, it will prompt the type of the connection.

network.js
```
function checkConnection() {
    const networkState = navigator.connection.type;

    const states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    navigator.notification.alert(
        'Connection type: ' + states[networkState],
        c => cc(states[networkState]),
        "Connection info",
        "Thank you, nerd"
    );
    
    const cc = c => {
        $("#con-span").text( c)
        if (networkState === Connection.UNKNOWN ||
            networkState === Connection.NONE) {
                $("#con-span").removeClass('connected');
                $("#con-span").addClass('unconnected');
            } else {
                $("#con-span").removeClass('unconnected');
                $("#con-span").addClass('connected');
            }
    }
}

checkConnection()
```

<hr>

## Navigators

For this demo I've made two really simple navigators using JQuery.

Both work by loading a html file using the `.html()` method and replacing the content with it like the example below.
```
function handleTabChange(i, tab) {
    $("#tab-bar>button.active").removeClass("active");
    $("#tab-content").load(tab+".html")
    $("#tab-bar").children().eq(i).addClass("active")
}
```
This function will remove the `activa` CSS class from all the buttons on the tab bar, load the content of the requested page, and then add the `active` class to the pressed button.

Next on the "Other" tab, we have another navigator that's even simpler, but with the difference that it'll go back to the initial page when pressing the back button.

```
document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() {
    $("#nav-wrapper").load("other.html")
}

function handleNavigation(page) {
    $("#nav-wrapper").load(page+".html")
}
```

That is it for this demo, I really enjoyed playing around with Cordova and getting to understand how the plugins work and interact with the native side.
And thank you for your time for reading this, if you actually read all that you're a legend ❤.

P.D.:
 VAMOS MESSI ⭐⭐⭐ DALE CAMPEON
