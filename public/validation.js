const form = document.getElementById("form");
const title = document.getElementById("title")
const description = document.getElementById("description")
const date = document.getElementById("date")
const image = document.getElementById("image")
const video = document.getElementById("video")
const titleError = document.querySelector(".title-error")
const descriptionError = document.querySelector(".description-error")
const dateError = document.querySelector(".date-error")
const imageError = document.querySelector(".image-error")
const videoError = document.querySelector(".video-error")
const video_preview = document.getElementById("video-preview");
const video_placeholder = document.getElementById("video-placeholder");
const image_preview = document.getElementById("image-preview");
const image_placeholder = document.getElementById("image-placeholder");

form.addEventListener("submit", (event)=> {
    event.preventDefault();

    let isValid = true;
    titleError.style.display = "none";
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
     if (!image.value.trim()) {
        image.classList.add("error");
        imageError.style.display = "block";
        imageError.textContent = "Upload image.";
        isValid = false;
    }
     if (!video.value.trim()) {
        video.classList.add("error");
        videoError.style.display = "block";
        videoError.textContent = "Required field.";
        isValid = false;
    }

    if (isValid) {
        title.classList.remove("error");
        title.classList.add("success");
        form.submit();
    }
});

video.addEventListener("change", function() {
    video_preview.src = URL.createObjectURL(this.files[0]);
    video_preview.hidden = false;
    video_placeholder.hidden = true;
})

image.addEventListener("change", function() {
    image_preview.src = URL.createObjectURL(this.files[0]);
    image_preview.hidden = false;
    image_placeholder.hidden = true;
    document.getElementById("image-label").style.border = "none";
    document.getElementById("image-label").style.padding = "0";
})

