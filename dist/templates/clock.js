let DateTime = luxon.DateTime;
let getFormat = "cccc, LLLL d, y\\nh:mm:ss a".split("\\n");
socket.emit("clock");
socket.on("clock", function (settings) {
  settings = JSON.parse(settings);
  getFormat = settings.format.split("\\n");
});

setInterval(function () {
  let toPrint = "";
  for (let format in getFormat) {
    toPrint = toPrint + DateTime.now().toFormat(getFormat[format]) + "<br>";
  }
  $("#datetime").html(toPrint);
}, 1000);
