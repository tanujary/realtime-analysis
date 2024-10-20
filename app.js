// Function to preview the uploaded image
function previewImage(event) {
  var preview = document.getElementById("preview");
  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function () {
    preview.src = reader.result;
    showNextButton(); // Show 'Next' button after image is uploaded
    hideCaptureAndRetakeButtons(); // Hide capture/retake buttons on image upload
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Function to open the camera and start the video stream
function openCamera() {
  var video = document.getElementById("camera");
  var captureButton = document.getElementById("captureButton");
  var retakeButton = document.getElementById("retakeButton");
  var preview = document.getElementById("preview");
  var nextButton = document.getElementById("nextButton");

  preview.style.display = "none"; // Hide image preview while using camera
  video.style.display = "block"; // Show the video feed
  captureButton.style.display = "inline-block"; // Show "Take Photo" button
  retakeButton.style.display = "none"; // Hide "Retake Photo" button
  nextButton.style.display = "none"; // Hide "Next" button during camera retake

  // Access the camera
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err) {
      console.error("Error accessing the camera: " + err);
    });
}

// Function to capture the image from the camera
function captureImage() {
  var video = document.getElementById("camera");
  var canvas = document.getElementById("canvas");
  var preview = document.getElementById("preview");
  var context = canvas.getContext("2d");
  var retakeButton = document.getElementById("retakeButton");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert canvas to image data URL and set it to the preview
  var imageUrl = canvas.toDataURL("image/png");
  preview.src = imageUrl;

  // Stop the video stream after capturing
  let stream = video.srcObject;
  let tracks = stream.getTracks();
  tracks.forEach((track) => track.stop());

  video.style.display = "none"; // Hide the video feed
  preview.style.display = "block"; // Show the captured image preview
  retakeButton.style.display = "inline-block"; // Show 'Retake' button
  showNextButton(); // Show 'Next' button after capturing the image
  hideCaptureButton(); // Hide "Take Photo" button
}

// Function to retake the image by restarting the camera
function retakeImage() {
  openCamera(); // Restart the camera feed
  hideNextButton(); // Hide the 'Next' button when retaking the photo
}

// Function to show the "Next" button
function showNextButton() {
  var nextButton = document.getElementById("nextButton");
  nextButton.style.display = "inline-block"; // Display the "Next" button
}

// Function to hide the "Next" button
function hideNextButton() {
  var nextButton = document.getElementById("nextButton");
  nextButton.style.display = "none"; // Hide the "Next" button
}

// Function to hide "Take Photo" and "Retake" buttons
function hideCaptureAndRetakeButtons() {
  var captureButton = document.getElementById("captureButton");
  var retakeButton = document.getElementById("retakeButton");
  captureButton.style.display = "none";
  retakeButton.style.display = "none";
}

// Function to hide "Take Photo" button
function hideCaptureButton() {
  var captureButton = document.getElementById("captureButton");
  captureButton.style.display = "none";
}

// Function to handle "Next" button action
function proceed() {
  var preview = document.getElementById("preview");
  var imageDataUrl = preview.src;

  // Check if an image is available (from upload or capture)
  if (imageDataUrl) {
    uploadImage(imageDataUrl); // Proceed with image upload
  } else {
    alert("Please upload or capture an image first.");
  }
}

// Function to send image data to server using AJAX (same as before)
function uploadImage(imageDataUrl) {
  // Convert the base64 image data URL to a Blob object
  var imageBlob = dataURLtoBlob(imageDataUrl);

  // Prepare the form data
  var formData = new FormData();
  formData.append("image", imageBlob, "captured_image.png"); // Attach the image blob to the form data

  // Send AJAX request
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true); // Update the endpoint URL as needed

  xhr.onload = function () {
    if (xhr.status === 200) {
      alert("Image uploaded successfully!");
      // You can handle further actions here, like navigating to another page
    } else {
      alert("Error uploading image.");
    }
  };

  xhr.onerror = function () {
    alert("An error occurred during the request.");
  };

  xhr.send(formData); // Send the form data with the image blob
}

// Helper function to convert base64 data URL to Blob
function dataURLtoBlob(dataUrl) {
  var arr = dataUrl.split(",");
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
