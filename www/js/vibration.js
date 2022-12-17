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