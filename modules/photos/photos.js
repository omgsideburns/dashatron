// photos.js

let photoList = [];
let currentPhotoIndex = 0;
const photoEl = document.getElementById("slideshow-image");

fetch("/api/photos")
  .then(res => res.json())
  .then(photos => {
    photoList = photos;
    if (photoList.length) {
      rotatePhoto(); // Start immediately
      setInterval(rotatePhoto, 5000); // Change every 5 seconds
    }
  });

function rotatePhoto() {
  const next = photoList[Math.floor(Math.random() * photoList.length)];
  photoEl.classList.remove("show");
  setTimeout(() => {
    photoEl.src = `/uploads/${next}`;
    photoEl.classList.add("show");
  }, 600); // Wait for fade out before changing image
}
