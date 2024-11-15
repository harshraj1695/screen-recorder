let btn = document.querySelector(".record-btn");
let video = document.querySelector("video");
let mediaRecorder;
let chunks = [];

// Event listener for the record button
btn.addEventListener("click", async function () {
    // Toggle recording state
    if (btn.textContent === "Record") {
        // Start recording
        let stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        
        // Set the MIME type for better browser support
        const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
            ? "video/webm; codecs=vp9"
            : "video/webm";

        mediaRecorder = new MediaRecorder(stream, { mimeType: mime });
        chunks = [];  // Reset chunks

        // Collect recorded data
        mediaRecorder.addEventListener('dataavailable', function(e) {
            chunks.push(e.data);
        });

        // When the recording stops
        mediaRecorder.addEventListener('stop', function() {
            let blob = new Blob(chunks, { type: chunks[0].type });
            let url = URL.createObjectURL(blob);
            video.src = url;

            // Create a download link for the video file
            let a = document.createElement('a');
            a.href = url;
            a.download = 'video.webm';
            a.click();

            // Stop all tracks in the stream to release the screen
            stream.getTracks().forEach(track => track.stop());
        });

        // Start the recorder and update button text
        mediaRecorder.start();
        btn.textContent = "Stop";
    } else {
        // Stop recording
        mediaRecorder.stop();
        btn.textContent = "Record";
    }
});
