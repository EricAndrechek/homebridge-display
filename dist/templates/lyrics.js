function totalSeconds(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    return s;
}

function update_lyrics() {
    if (lyrics !== undefined && lyrics.error === undefined && lastdata !== undefined && isplaying === true) {
        let seconds = totalSeconds(lastdata.progress_ms);
        for (let i = 0; i < lyrics.length; i++) {
            let current_distance = Math.abs(lyrics[i].seconds - seconds);
            if (current_distance < 1) {
                if (i === 0) {
                    $('#last-lyrics').html('');
                    $('#lyrics').html(lyrics[i].lyrics);
                    $('#next-lyrics').html(lyrics[i + 1].lyrics);
                } else if (i === lyrics.length - 1) {
                    $('#last-lyrics').html(lyrics[i - 1].lyrics);
                    $('#lyrics').html(lyrics[i].lyrics);
                    $('#next-lyrics').html('');
                } else if (i === lyrics.length - 2) {
                    $('#last-lyrics').html(lyrics[i - 1].lyrics);
                    $('#lyrics').html(lyrics[i].lyrics);
                    $('#next-lyrics').html(lyrics[i + 1].lyrics);
                } else if (i === 1) {
                    $('#last-lyrics').html(lyrics[i - 1].lyrics);
                    $('#lyrics').html(lyrics[i].lyrics);
                    $('#next-lyrics').html(lyrics[i + 1].lyrics);
                } else {
                    $('#last-lyrics').html(lyrics[i - 1].lyrics);
                    $('#lyrics').html(lyrics[i].lyrics);
                    $('#next-lyrics').html(lyrics[i + 1].lyrics);
                }
                return true;
            }
        }
    } else {
        $('#last-lyrics').html("");
        $('#lyrics').html("");
        $('#next-lyrics').html("");
        return false;
    }
}

let lyrics;
let lyric_updater = setInterval(update_lyrics, 100);

socket.on("lyrics", function (msg) {
    lyrics = JSON.parse(msg);
})