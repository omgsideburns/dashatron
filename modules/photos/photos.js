// photos.js

import config from "../js/client-config.js";
const PHOTO_SETTINGS = config.MODULE_DEFAULTS.photos;

let photoList = [];
let currentPhotoIndex = 0;
const photoEl = document.getElementById("slideshow-image");

fetch("/api/photos")
  .then(res => res.json())
  .then(photos => {
    photoList = photos;
    if (photoList.length) {
      rotatePhoto(); // Start immediately
      setInterval(rotatePhoto, PHOTO_SETTINGS.transitionTime); // Change every transitionTime ms
    }
  });

function rotatePhoto() {
  const next = photoList[currentPhotoIndex];
  currentPhotoIndex = (currentPhotoIndex + 1) % photoList.length;
  photoEl.classList.remove("show");
  setTimeout(() => {
    photoEl.src = `/uploads/${next}`;
    photoEl.classList.add("show");
  }, PHOTO_SETTINGS.fadeDuration); // Wait for fade out before changing image
}
