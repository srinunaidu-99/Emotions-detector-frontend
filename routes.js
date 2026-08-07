// ===============================
// API URLs
// ===============================
// MAKE SURE THIS IS YOUR ACTUAL NODE.JS BACKEND RENDER URL
const API_BASE_URL = "https://emotions-detector-backend.onrender.com"; 

// Automatically wake up the Render backend as soon as the page loads
fetch(API_BASE_URL)
    .then(res => console.log("Backend woken up successfully"))
    .catch(err => console.log("Waking up backend..."));

// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        
        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem("token", data.token);
                alert("Login Successful 🎉");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message || "Login failed ❌");
            }
        } catch(error) {
            console.log(error);
            alert("Server connection failed. If your Render backend was asleep, please wait 30 seconds and try again ❌");
        }
    });
}


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if(registerForm) {
    registerForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        
        if(password !== confirmPassword) {
            alert("Passwords match kavatledu 😅");
            return;
        }
        
        if(password.length < 8) {
            alert("Password minimum 8 characters undali");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await res.json();
            
            if(res.ok) {
                alert("Register Success 🎉");
                window.location.href="login.html";
            } else {
                alert(data.message || "Registration failed ❌");
            }
        } catch(error) {
            console.log(error);
            alert("Server connection failed. If your Render backend was asleep, please wait 30 seconds and try again ❌");
        }
    });
}


// ===============================
// EMOTION SCAN DASHBOARD SCRIPT
// ===============================

const scanBtn = document.getElementById("initiateScanBtn"); // Ensure button has this ID in HTML
const video = document.getElementById("videoElement"); // Ensure video element has this ID

if (scanBtn) {
    scanBtn.addEventListener("click", async () => {
        try {
            if (!video) {
                alert("Webcam not found!");
                return;
            }

            scanBtn.innerText = "Scanning...";
            scanBtn.disabled = true;

            // Compress image to avoid 500 error / timeout issues
            const canvas = document.createElement("canvas");
            canvas.width = 320; // Reduced width for faster processing
            canvas.height = 240; // Reduced height for faster processing
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Use JPEG compression (0.7 quality) to keep Base64 string small
            const imageBase64 = canvas.toDataURL("image/jpeg", 0.7);

            const res = await fetch(`${API_BASE_URL}/detect-emotion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ image: imageBase64 })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                scanBtn.innerText = `EMOTION: ${data.emotion.toUpperCase()} 🎉`;
            } else {
                scanBtn.innerText = "SERVER ERROR";
                console.error("Backend Error:", data.message || "Unknown error");
            }
        } catch (error) {
            console.log(error);
            scanBtn.innerText = "SERVER ERROR";
        } finally {
            setTimeout(() => {
                scanBtn.innerText = "INITIATE NEURAL SCAN";
                scanBtn.disabled = false;
            }, 5000); // Reset button after 5 seconds
        }
    });
}
