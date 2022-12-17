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