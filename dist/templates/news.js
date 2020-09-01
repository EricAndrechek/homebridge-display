let current_index = 0;
let feed;

socket.on('news', function (msg) {
    feed = JSON.parse(msg);
    if (current_index == 0) {
        $('#news-title').html(feed[current_index].title);
        $('#news-description').html(feed[current_index].description);
    }
});

socket.emit('news');

window.setInterval(function () {
    current_index++;
    if (current_index >= feed.length) {
        current_index = 0;
    }
    $('#news-title').html(feed[current_index].title);
    $('#news-description').html(feed[current_index].description);
}, 60000);

window.setInterval(function () {
    socket.emit('news');
}, 1800000);