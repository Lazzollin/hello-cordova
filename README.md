# Cordova test app

This is an app I've made to test out cordova and some of it's available plugins, as well as making my own to list all sensors availabe in an android phone

The app has a bottom tab navigator that's used to separate 4 different tests

## Camera test

<img align="right" src="https://user-images.githubusercontent.com/48962891/208433529-a7859b82-cfcd-49f6-bddc-af94bcf8e425.png" alt="drawing" width="200"/>

This test uses <a href="https://github.com/apache/cordova-plugin-camera" target="_blank">cordova-plugin-camera</a> to use the phone's camera.
 
The `Open camera` button, calls the `camera.getPicture(successCallback, errorCallback, options)` method, which takes a CameraOptions object as parameter to determine its behavior. In this case the object's `Camera.sourceType` variable defaults to `Camera.PictureSourceType.CAMERA`, which opens the default camera app, let's you take a picture, and then returns the result with the `cameraSuccess` as a String.
This string is passed to the given `onCameraSuccess(imgURL)` method below to set the src attribute of the `img` tag at the top usign JQuery.

onCameraSuccess method:
```
function onCameraSuccess(imgURL) {
    console.log('Camera success, image saved on: ' + imgURL)

    $("#camera-img").attr("src", imgURL)
}
```
The Open galery button, also calls the `camera.getPicture(successCallback, errorCallback, options)` method, but passes an object `{sourceType: Camera.PictureSourceType.PHOTOLIBRARY}` as parameter to override the default `Camera.sourceType` to `Camera.PictureSourceType.PHOTOLIBRARY`, so instead of the camera, it opens up the phone's galery and lets you pick a picture from it, this will end up with a similar result as the Open camera button, with this method returning a String with the `cameraSuccess` method to be passed to `onCameraSuccess(imgURL)` to show it in the `img` tag on the top.
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

Usign the [cordova-plugin-android-permissions](https://github.com/NeoLSN/cordova-plugin-android-permissions) plugin, it'll check if `ACCESS_FINE_LOCATION` permission is granted, this will return its status to a callback function, with which we'll check if `status.hasPermission` equals to `true`, then using JQuery, we can add the `geo-enabled` class to the Geo permission `p` tag above the map, which will turn its background-color to green, to let us know that we're ready to go.

In the case that `status.hasPermission` equals to `false`, we'll call `permissions.requestPermission` to prompt the user with the option to give the app access to our location.

## Custom test
<img align="right" src="https://user-images.githubusercontent.com/48962891/208433549-776ad815-f331-42b3-b7df-4c3ed58600b2.png" alt="drawing" width="250"/>


<img align="right" src="https://user-images.githubusercontent.com/48962891/208433551-2f9dc707-db8e-4c59-8d3b-51ba3813d38a.png" alt="drawing" width="250"/>

## Other tests
<img align="right" src="https://user-images.githubusercontent.com/48962891/208433557-c42d213d-a88b-4702-8f92-35be018543cd.png" alt="drawing" width="250"/>


<img align="right" src="https://user-images.githubusercontent.com/48962891/208433560-37425a38-a18f-4f8a-aece-f39c5ec38d79.png" alt="drawing" width="250"/>


<img align="right" src="https://user-images.githubusercontent.com/48962891/208438352-dcf7f548-0487-4b18-b52b-5b0f142fbedc.gif" alt="drawing" width="250"/>

