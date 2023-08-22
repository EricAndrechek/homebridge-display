document.addEventListener("DOMContentLoaded", function () {
    const videoElement = document.getElementById("webcam");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function (stream) {
                videoElement.srcObject = stream;
            })
            .catch(function (error) {
                console.error("Error accessing webcam:", error);
            });
    } else {
        console.error("Webcam not available.");
    }
});
