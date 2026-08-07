// ===============================
// API URL (Ensure this matches your live Node.js backend Render URL)
// ===============================
const API_BASE_URL = "https://emotions-detector-backend.onrender.com";

// Check authentication token on load
const token = localStorage.getItem("token");
if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
}

// ===============================
// WEBCAM & EMOTION DETECTION
// ===============================
const video = document.getElementById("videoElement"); // Make sure your video tag has this ID
const scanBtn = document.getElementById("initiateScanBtn"); // Make sure your button has this ID
const resultDisplay = document.getElementById("emotionResult"); // Element to show result

// Start webcam automatically
async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (video) {
            video.srcObject = stream;
        }
    } catch (err) {
        console.error("Webcam access error:", err);
        alert("Could not access webcam. Please allow camera permissions.");
    }
}

startWebcam();

if (scanBtn) {
    scanBtn.addEventListener("click", async () => {
        try {
            if (!video) return;

            // Create a canvas to capture frame from video
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert frame to base64 image string
            const imageBase64 = canvas.toDataURL("image/jpeg");

            scanBtn.innerText = "Scanning...";
            scanBtn.disabled = true;

            // Send to Node.js backend
            const response = await fetch(`${API_BASE_URL}/detect-emotion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ image: imageBase64 })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(`Detected Emotion: ${data.emotion} 🎉`);
                if (resultDisplay) {
                    resultDisplay.innerText = data.emotion;
                }
            } else {
                alert(data.message || "Emotion detection failed ❌");
            }

        } catch (error) {
            console.error("Detection error:", error);
            alert("Server Error! Please check if your Render backend is active.");
        } finally {
            scanBtn.innerText = "INITIATE NEURAL SCAN";
            scanBtn.disabled = false;
        }
    });
}
