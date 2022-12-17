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
