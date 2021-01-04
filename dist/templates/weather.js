let weather_data;

function add_hour(key) {
    let newtime = weather_data.hourly[key].name;
    if (parseInt(newtime.substring(0, 2)) === 0) {
        newtime = "12" + newtime.substring(2) + "AM";
    } else if (newtime.charAt(0) === "0") {
        newtime = newtime.substring(1) + "AM";
    } else if (newtime.charAt(0) === "1") {
        if (parseInt(newtime.substring(0, 2)) <= 11) {
            newtime = newtime + "AM";
        } else if (parseInt(newtime.substring(0, 2)) === 12) {
            newtime = newtime + "PM";
        } else {
            newtime =
                "" +
                (parseInt(newtime.substring(0, 2)) - 12) +
                newtime.substring(2) +
                "PM";
        }
    } else if (newtime.charAt(0) === "2") {
        newtime =
            "" +
            (parseInt(newtime.substring(0, 2)) - 12) +
            newtime.substring(2) +
            "PM";
    }
    let iconid = weather_data.hourly[key].id;
    if (iconid === 1) {
        iconid = "sunrise";
    } else if (iconid === 2) {
        iconid = "sunset";
    } else {
        iconid = "owm-" + iconid;
    }
    let tempert = weather_data.hourly[key].temp;
    if (tempert !== "Sunrise" && tempert !== "Sunset") {
        tempert = Math.round(tempert) + "<sup>&#8457;</sup>";
    }
    if (key === 0) {
        newtime = "NOW";
    }
    $("#hours48").append(
        "<span class='hour1'><span class='hour'>" +
            newtime +
            "</span><i class='wi wi-" +
            iconid +
            "'></i><span class='tempert'>" +
            tempert +
            "</span></span>"
    );
}

socket.on("weather", function (msg) {
    weather_data = JSON.parse(msg);
    $("#current_weather").removeClass();
    $("#current_weather").addClass("wi");
    $("#current_weather").addClass("wi-owm-" + weather_data.id);
    $("#temp").html(Math.round(weather_data.temp) + "<sup>&#8457;</sup>");
    $("#feels").html(Math.round(weather_data.feels) + "<sup>&#8457;</sup>");
    $("#windspeed").html(weather_data.wind + " mph");
    $("#humid").html(weather_data.humidity + "%");

    $("#hours48").empty();
    $("#weekdays").empty();

    for (let key = 0; key < 7; key++) {
        let day = weather_data.days[key];
        $("#weekdays").append(
            "<span class='weekday'><span class='day'>" +
                day.name +
                "</span><i class='wi wi-owm-" +
                day.id +
                "'></i><span class='tempmax'>" +
                Math.round(day.max) +
                "</span><span class='tempmin'>" +
                Math.round(day.min) +
                "</span></span>"
        );
    }

    for (let key = 0; key < 48; key++) {
        if (weather_data.sunrise < key && weather_data.sunrise > key - 1) {
            add_hour(key - 0.5);
        }
        if (weather_data.sunset < key && weather_data.sunset > key - 1) {
            add_hour(key - 0.5);
        }
        add_hour(key);
    }

    let minute_points = [];
    let time_points = [];
    Object.entries(weather_data.minutes).forEach(([key, value]) => {
        minute_points.push(value);
        time_points.push(key);
    });
    var options = {
        series: [
            {
                name: "Precipitation",
                data: minute_points,
            },
        ],

        chart: {
            height: 100,
            type: "line",
            zoom: {
                enabled: false,
            },
            animations: {
                enabled: false,
            },
        },

        grid: {
            show: false,
        },

        dataLabels: {
            enabled: false,
        },

        stroke: {
            curve: "smooth",
        },

        xaxis: {
            categories: time_points,
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            tickAmount: 0,
        },

        yaxis: {
            show: false,
        },

        tooltip: {
            enabled: false,
        },
    };
    $("#graph_max").html(Math.round(Math.max(...minute_points)) + "mm");
    $("#precipitation_parent").empty();
    var chart = new ApexCharts(
        document.querySelector("#precipitation_parent"),
        options
    );
    chart.render();
});

socket.emit("weather");

window.setInterval(function () {
    socket.emit("weather");
}, 120000);
