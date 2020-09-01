let lastupdate = (new Date(0)).getTime();
let titlescroll = setInterval(function () { }, 100);
let artistscroll = setInterval(function () { }, 100);
let lastdata;
let isplaying = false;

document.getElementById('shuffle').onclick = function () {
    socket.emit('shuffle', !lastdata.shuffle_state);
};

document.getElementById('heart-box').onclick = function () {
    if (lastdata.liked == true) {
        socket.emit('unlike', lastdata.song_id);
    } else {
        socket.emit('like', lastdata.song_id);
    }
};

document.getElementById('repeat').onclick = function () {
    if (lastdata.repeat_state === "off") {
        socket.emit('repeat', 'track');
    } else {
        socket.emit('repeat', 'off');
    }
};

document.getElementById('back').onclick = function () {
    socket.emit('back');
};

document.getElementById('next').onclick = function () {
    socket.emit('next');
};

document.getElementById('toggle').onclick = function () {
    if (isplaying == true) {
        socket.emit('pause');
    } else {
        socket.emit('resume');
    }
};

function seekTime() {
    let desired_ms = Math.round(($('#progress').val() / 100) * lastdata.duration_ms);
    socket.emit('seek', desired_ms);
}

function titlescroller(title) {
    clearInterval(titlescroll);
    titlescroll = false;
    let allchars = title + " --- ";
    let charend = allchars.length;
    titlescroll = setInterval(function () {
        $('#song_title').html(allchars);
        allchars = allchars.substring(2, charend) + allchars.substring(0, 2);
    }, 600);
}

function artistscroller(artist) {
    clearInterval(artistscroll);
    artistscroll = false;
    let allchars = artist + " --- ";
    let charend = allchars.length;
    artistscroll = setInterval(function () {
        $('#artist').html(allchars);
        allchars = allchars.substring(2, charend) + allchars.substring(0, 2);
    }, 600);
}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    if (secs == 0) {
        secs = '00';
    } else if (secs < 10) {
        secs = '0' + secs;
    }

    return mins + ':' + secs;
}

socket.on('update', function (msg) {
    let newdata = JSON.parse(msg);
    if (newdata.error == undefined) {
        if (newdata.is_playing) {
            lastupdate = (new Date()).getTime();

            if (lastdata == false) {
                $('#toggle').html('pause');
            }
            if (isplaying == false) {
                $('#toggle').html('pause');
            }

            isplaying = true;

            if (lastdata == undefined || lastdata.avaliable_devices !== newdata.avaliable_devices || lastdata.device !== newdata.device) {
                $("#device_selection").empty();
                Object.entries(newdata.avaliable_devices).forEach(([key, value]) => {
                    if (key === newdata.device) {
                        $('#device_selection').append(
                            "<option selected value='" + value + "'>" + key + "</value>"
                        );
                    } else {
                        $('#device_selection').append(
                            "<option value='" + value + "'>" + key + "</value>"
                        );
                    }
                });
            }

            if (lastdata == undefined || lastdata.volume !== newdata.volume) {
                if (newdata.volume > 55) {
                    $('#speaker').html('volume_up');
                } else if (newdata.volume > 10) {
                    $('#speaker').html('volume_down');
                } else if (newdata.volume > 0) {
                    $('#speaker').html('volume_mute');
                } else if (newdata.volume == 0) {
                    $('#speaker').html('volume_off');
                }
            }

            if (lastdata == undefined || lastdata.shuffle_state !== newdata.shuffle_state) {
                if (newdata.shuffle_state == true) {
                    $('#shuffle').css('color', '#1DB954');
                } else {
                    $('#shuffle').css('color', 'white');
                }
            }

            if (lastdata == undefined || lastdata.liked !== newdata.liked) {
                if (newdata.liked == true) {
                    $('#heart').html('favorite');
                } else {
                    $('#heart').html('favorite_border');
                }
            }

            if (lastdata == undefined || lastdata.repeat_state !== newdata.repeat_state) {
                if (newdata.repeat_state == "off") {
                    $('#repeat').css('color', 'white');
                } else {
                    $('#repeat').css('color', '#1DB954');
                }
            }
            if (lastdata == undefined || lastdata.title !== newdata.title) { // check for change and modify this data:
                socket.emit("lyrics", "https://api.textyl.co/api/lyrics?q=" + newdata.title + "+" + newdata.artists);
                $('#spotify_uri').attr('src', newdata.img_url)
                clearInterval(titlescroll)
                titlescroll = false;
                clearInterval(artistscroll)
                artistscroll = false;
                $('#duration_ms').html(msToTime(newdata.duration_ms));
                if ($('#song_title').prop('scrollWidth') > $('#song_title').width()) {
                    titlescroller(newdata.title);
                } else {
                    $('#song_title').html(newdata.title);
                }
                if ($('#artist').prop('scrollWidth') > $('#artist').width()) {
                    artistscroller(newdata.artists);
                } else {
                    $('#artist').html(newdata.artists);
                }
                
            } else if (lastdata == undefined || lastdata.img_url !== newdata.url) {
                $('#spotify_uri').attr('src', newdata.img_url)
            }

            $('#progress').val(Math.round((newdata.progress_ms / newdata.duration_ms) * 100));
            $('#progress_ms').html(msToTime(newdata.progress_ms));

            if ($('#song_title').prop('scrollWidth') > $('#song_title').width() && titlescroll == false) {
                titlescroller(newdata.title);
            }
            if ($('#artist').prop('scrollWidth') > $('#artist').width() && artistscroll == false) {
                artistscroller(newdata.artists);
            }

            lastdata = newdata;
        } else {
            let current_time = (new Date()).getTime();
            isplaying = false;
            let elapsed = current_time - lastupdate;
            if (elapsed > 300000) { // if no update in 5 minutes
                $('#spotify').html('No music is currently playing');
                if ($('#spotify_uri').attr('src') !== '/static/placeholder.png') {
                    $('#spotify_uri').attr('src', '/static/placeholder.png');
                }
                clearInterval(titlescroll)
                titlescroll = false;
                clearInterval(artistscroll)
                artistscroll = false;
                $('#song_title').html('Nothing Playing')
                $('#artist').html('Nothing Playing')
                $('#shuffle').css('color', 'white');
                $('#repeat').css('color', 'white');
                $('#progress').val(0);
                $('#progress_ms').html('0:00');
                $('#duration_ms').html('0:00');
            } else {// else keep the current info on-screen
                clearInterval(titlescroll)
                titlescroll = false;
                clearInterval(artistscroll)
                artistscroll = false;
                $('#song_title').html(lastdata.title)
                $('#artist').html(lastdata.artists)
                $('#toggle').html('play_arrow');
            }
        }
    } else {
        isplaying = false;
    }
});

socket.emit('update');

window.setInterval(function () {
    socket.emit('update');
}, 500);

const container = document.getElementById("spotify_uri");

container.addEventListener("touchstart", startTouch, false);
container.addEventListener("touchend", endTouch, false);

let startX, startY, endX, endY;

function startTouch(e) {
    let touchobj = e.changedTouches[0];
    startX = touchobj.pageX;
    startY = touchobj.pageY;
}

function endTouch(e) {
    let touchobj = e.changedTouches[0];
    endX = touchobj.pageX;
    endY = touchobj.pageY;
    let totalY = Math.abs(endY - startY);
    let difY = endY - startY;
    let totalX = Math.abs(endX - startX);
    let difX = endX - startX;
    // socket.emit('debugger', '(' + startX + ', ' + startY + ') to (' + endX + ', ' + endY + ')');
    if (totalX > totalY) { // x movement greater than y so either left or right
        if (difX > 0) { // swipe left to right
            // alert('Right swipe');
            spot_swipe('b');
        } else if (difX < 0) { // swipe right to left
            // alert('Left swipe');
            spot_swipe('n');
        } else {
            // alert('Horizontal swipe');
        }
    } else if (totalY > totalX) {
        if (difY > 0) { // swipe top to bottom
            // alert('Down swipe');
            spot_swipe('d');
        } else if (difY < 0) { // swipe bottom to top
            // alert('Up swipe');
            spot_swipe('u');
        } else {
            // alert('Vertical swipe');
        }
    } else {
        // alert('Unknown swipe');
    }
}

function spot_swipe(d) {
    if (d === "b") {
        socket.emit('back');
    } else if (d === "n") {
        socket.emit('next');
    } else if (d === "u") {
        let curvol = lastdata.volume;
        curvol += 10;
        if (curvol > 100) {
            curvol = 100;
        }
        socket.emit('volume', curvol);
    } else if (d === "d") {
        let curvol = lastdata.volume;
        curvol -= 10;
        if (curvol < 0) {
            curvol = 0;
        }
        socket.emit('volume', curvol);
    }
}

document.getElementById("spotify_uri").addEventListener("click", function () {
    if (isplaying == true) {
        socket.emit('pause');
    } else {
        socket.emit('resume');
    }
});

document.getElementById("heart").addEventListener("click", function () {
    if (lastdata.liked == true) {
        // socket.emit('like', false);
    } else {
        // socket.emit('like', true);
    }
});

document.getElementById("device_selection").addEventListener("change", function () {
    socket.emit('transfer', this.value)
});