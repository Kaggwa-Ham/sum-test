const form = document.getElementById("form");
const title = document.getElementById("title");
const description = document.getElementById("description");
const date = document.getElementById("date");
const image = document.getElementById("image");
const video = document.getElementById("video");

const titleError = document.querySelector(".title-error");
const descriptionError = document.querySelector(".description-error");
const dateError = document.querySelector(".date-error");
const imageError = document.querySelector(".image-error");
const videoError = document.querySelector(".video-error");

const video_preview = document.getElementById("video-preview");
const video_placeholder = document.getElementById("video-placeholder");
const image_preview = document.getElementById("image-preview");
const image_placeholder = document.getElementById("image-placeholder");
const submitBtn = document.querySelector('button[type="submit"]');

// 🌟 CLOUDINARY CONFIGURATION
const CLOUD_NAME = "djn8ppnt3"; 
const UPLOAD_PRESET = "parkease_preset"; // Confirmed preset name matching your dashboard configuration

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop standard form submission completely

    let isValid = true;
    
    // Clear and reset error displays before evaluation
    // 1. Clear and reset error displays defensively (Fixes the line 36 crash)
    if (titleError) { titleError.style.display = "none"; title.classList.remove("error"); }
    if (descriptionError) { descriptionError.style.display = "none"; description.classList.remove("error"); }
    if (dateError) { dateError.style.display = "none"; date.classList.remove("error"); }
    if (imageError) { imageError.style.display = "none"; image.classList.remove("error"); }
    if (videoError) { videoError.style.display = "none"; video.classList.remove("error"); }

    // 1. Run Input Field Validations
    if (!title.value.trim()) {
        title.classList.add("error");
        titleError.style.display = "block";
        titleError.textContent = "Enter title.";
        isValid = false;
    }
    if (!description.value.trim()) {
        description.classList.add("error");
        descriptionError.style.display = "block";
        descriptionError.textContent = "Enter description.";
        isValid = false;
    }
    if (!date.value.trim()) {
        date.classList.add("error");
        dateError.style.display = "block";
        dateError.textContent = "Enter the date.";
        isValid = false;
    }
    
    // Fix: Validate against the .files array instead of text strings
    if (!image.files || !image.files[0]) {
        image.classList.add("error");
        imageError.style.display = "block";
        imageError.textContent = "Upload image.";
        isValid = false;
    }
    if (!video.files || !video.files[0]) {
        video.classList.add("error");
        videoError.style.display = "block";
        videoError.textContent = "Required field.";
        isValid = false;
    }

    // 2. If valid, execute client-side upload pipeline
    if (isValid) {
        title.classList.remove("error");
        title.classList.add("success");
        
        // Update user interface button feedback status
        submitBtn.innerText = "UPLOADING MEDIA... PLEASE WAIT ⏳";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.6";

        try {
            // A. Upload Thumbnail Image
            const imageFormData = new FormData();
            imageFormData.append('file', image.files[0]);
            imageFormData.append('upload_preset', UPLOAD_PRESET);

            const imageResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: imageFormData
            });
            const imageData = await imageResponse.json();
            const finalImageUrl = imageData.secure_url;

            // B. Upload Video File
            const videoFormData = new FormData();
            videoFormData.append('file', video.files[0]);
            videoFormData.append('upload_preset', UPLOAD_PRESET);

            const videoResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
                method: 'POST',
                body: videoFormData
            });
            const videoData = await videoResponse.json();
            const finalVideoUrl = videoData.secure_url;

            // C. Bundle data fields together into a lightweight URLSearchParams payload
            const formDataPayload = new URLSearchParams();
            formDataPayload.append('title', title.value);
            formDataPayload.append('description', description.value);
            formDataPayload.append('quality', document.getElementById('quality').value);
            formDataPayload.append('date', date.value);
            formDataPayload.append('video', finalVideoUrl); // Live URL string from Cloudinary
            formDataPayload.append('image', finalImageUrl); // Live URL string from Cloudinary

            // D. Send lightweight payload directly to your Vercel Express Route
            const backendResponse = await fetch('/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formDataPayload
            });

            if (backendResponse.ok) {
                // Success! Redirect to refresh view
                window.location.href = "/form";
            } else {
                throw new Error("Failed to create database entry.");
            }

        } catch (error) {
            console.error("Upload process failed:", error);
            alert("Something went wrong during upload sync. Please try again.");
            submitBtn.innerText = "UPLOAD";
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }
    }
});

// Media preview management blocks
video.addEventListener("change", function() {
    if (this.files && this.files[0]) {
        video_preview.src = URL.createObjectURL(this.files[0]);
        video_preview.hidden = false;
        video_placeholder.hidden = true;
    }
});

image.addEventListener("change", function() {
    if (this.files && this.files[0]) {
        image_preview.src = URL.createObjectURL(this.files[0]);
        image_preview.hidden = false;
        image_placeholder.hidden = true;
        
        const imageLabel = document.getElementById("image-label");
        if (imageLabel) {
            imageLabel.style.border = "none";
            imageLabel.style.padding = "0";
        }
    }
});