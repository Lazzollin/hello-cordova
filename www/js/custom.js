function testCustom() {
    console.log("Click");
    const ss = (s) => {
        $("#test").text(s);
        console.log(s);
    }
    const ee = (e) => {
        $("#test").text(e);
    }
    console.log($("#custom-input").text());
    cordova.plugins.PluginCustom.coolMethod($("#custom-input").val(), ss, ee);
}

function ss(s) {
    // $("#test").text(s)
    console.log(s);

    var i = 0;

    for (const e of s) {
        $.get("custom-list-item.html", data => {
            $("#list-container").append(data);
            console.log(e["Name"])

            const cont = $("#list-container").children().eq(i)
            cont.children("#sensor-name").children("#sensor-name-span").text(e["Name"])
            cont.children("#sensor-type").children("#sensor-type-span").text(e["Type"])

            i += 1;
        });
    }

    $('#sensor-test-btn').prop('disabled', true);
}

function testGyro() {
    console.log("Click");
    const ee = (e) => {
        // $("#test").text(e)
        console.log(e);
    }
    cordova.plugins.PluginCustom.getGyroData(ss, ee);
}
