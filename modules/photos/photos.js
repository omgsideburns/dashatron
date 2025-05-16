// photos.js

import config from "../js/client-config.js";
const PHOTO_SETTINGS = config.MODULE_DEFAULTS.photos;

let photoList = [];
let currentPhotoIndex = 0;
const photoEl = document.getElementById("slideshow-image");

// grab list of photos from the server, new ones go first, old ones shuffled after
function fetchPhotoList() {
  fetch("/api/photos")
    .then(res => res.json())
    .then(photos => {
      // If photoList is empty (initial load or hard refresh), shuffle the entire list
      if (photoList.length === 0) {
        photoList = photos.slice();
        shuffleArray(photoList);
      } else {
        const newPhotos = photos.filter(p => !photoList.includes(p));
        const existingPhotos = photos.filter(p => photoList.includes(p));
        shuffleArray(existingPhotos);
        photoList = [...newPhotos, ...existingPhotos];
      }
      currentPhotoIndex = 0;
      if (photoList.length) {
        rotatePhoto(); // kick it off right away
      }
    });
}

// basic fisher-yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

let photoReady = true;

// handles the actual photo swap, with preload and delay built in
function rotatePhoto() {
  if (!photoReady || photoList.length === 0) return;

  const next = photoList[currentPhotoIndex];
  currentPhotoIndex = (currentPhotoIndex + 1) % photoList.length;
  photoEl.classList.remove("show");
  photoReady = false;

  const img = new Image();
  img.onload = () => {
    setTimeout(() => {
      photoEl.src = img.src;
      photoEl.classList.add("show");
      photoReady = true;
    }, PHOTO_SETTINGS.fadeDuration); // let it fade in nicely
  };
  img.src = `/uploads/${next}`;
}

// hit the ping endpoint to see if new stuff was uploaded
let knownUploadTime = 0;

function checkForNewUploads() {
  fetch("/api/uploader/ping")
    .then(res => res.json())
    .then(data => {
      if (data.lastUploadTime > knownUploadTime) {
        knownUploadTime = data.lastUploadTime;
        fetchPhotoList(); // force a fresh list if uploads happened
      }
    });
}

// run it all
fetchPhotoList();
setInterval(rotatePhoto, PHOTO_SETTINGS.transitionTime); // step through the list on a loop
setInterval(checkForNewUploads, PHOTO_SETTINGS.pollingInterval || 1 * 60 * 1000); // check for updates every so often