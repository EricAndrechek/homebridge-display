let devices;

function iot_toggle(e) {
    let aid = e.id;
    let state = $(e).attr("class");
    if (state === "true") {
        state = false;
    } else if (state === "false") {
        state = true;
    }
    let device = [aid, state];
    socket.emit("switch", device);
}

socket.on("iot", function (msg) {
    let new_devices = JSON.parse(msg);
    if (!_.isEqual(new_devices, devices)) {
        devices = new_devices;
        $("#row_one").empty();
        $("#row_two").empty();
        $("#row_three").empty();
        let r1_full = 0;
        let r2_full = 0;
        let r3_full = 0;
        for (let device = 0; device < devices.length; device++) {
            let iconid = devices[device].name;
            if (
                iconid.toLowerCase().includes("lamp") ||
                iconid.toLowerCase().includes("light")
            ) {
                iconid = "emoji_objects";
            } else if (iconid.toLowerCase().includes("fan")) {
                iconid = "toys";
            } else if (iconid.toLowerCase().includes("outlet")) {
                iconid = "outlet";
            } else {
                iconid = "error";
            }
            let fancystate = devices[device].state;
            if (fancystate) {
                fancystate = "On";
            } else {
                fancystate = "Off";
            }
            if (r1_full < 3) {
                $("#row_one").append(
                    "<div id='" +
                        devices[device].aid +
                        "' class='" +
                        devices[device].state +
                        "' onclick='iot_toggle(this)'><span class='material-icons'>" +
                        iconid +
                        "</span><span class='name'>" +
                        devices[device].name +
                        "</span><span class='state'>" +
                        fancystate +
                        "</span></div>"
                );
                r1_full += 1;
            } else if (r2_full < 3) {
                $("#row_two").append(
                    "<div id='" +
                        devices[device].aid +
                        "' class='" +
                        devices[device].state +
                        "' onclick='iot_toggle(this)'><span class='material-icons'>" +
                        iconid +
                        "</span><span class='name'>" +
                        devices[device].name +
                        "</span><span class='state'>" +
                        fancystate +
                        "</span></div>"
                );
                r2_full += 1;
            } else if (r3_full < 3) {
                $("#row_three").append(
                    "<div id='" +
                        devices[device].aid +
                        "' class='" +
                        devices[device].state +
                        "' onclick='iot_toggle(this)'><span class='material-icons'>" +
                        iconid +
                        "</span><span class='name'>" +
                        devices[device].name +
                        "</span><span class='state'>" +
                        fancystate +
                        "</span></div>"
                );
                r3_full += 1;
            }
        }
    }
});

socket.emit("iot");

window.setInterval(function () {
    socket.emit("iot");
}, 200);
