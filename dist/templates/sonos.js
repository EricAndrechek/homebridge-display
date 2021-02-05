socket.on("sonos-update", function (msg) {
    let update_data = JSON.parse(msg);
    if (update_data.error == undefined) {
        $("#sonos_song_title").html("Check your homebridge debug logs");
    }
});

socket.emit("sonos-update");

window.setInterval(function () {
    socket.emit("sonos-update");
}, 500);
