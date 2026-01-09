// =================
// App Setup
// =================
const T = window.APP_TEXTS;
if (!T) {
  console.error("Error: Text data not found. Ensure texts.js is loaded.");
}

// Global DOM Elements
let halfButton, quarterButton, sixthButton;
let fractionImage, handFtue, handFtueImg;

// App State
let currentStep = 0; // 0: initial, 1: 1/2, 2: 1/4, 3: 1/6
let isAnimating = false;

// =================
// Initialization
// =================
function initApp() {
  // DOM Element Assignments
  halfButton = document.getElementById("halfButton");
  quarterButton = document.getElementById("quarterButton");
  sixthButton = document.getElementById("sixthButton");
  fractionImage = document.getElementById("fractionImage");
  handFtue = document.getElementById("hand-ftue");
  handFtueImg = document.getElementById("hand-ftue-img");

  // Set initial texts from texts.js
  document.getElementById("html_title").textContent = T.html_title;
  document.getElementById("fractions_text").textContent = T.title_parts.fractions;
  document.getElementById("represent_text").textContent = T.title_parts.represent;
  document.getElementById("whole_text").textContent = T.title_parts.whole;
  document.getElementById("interested_text").textContent = T.title_parts.interested;

  // Set initial image and hand cursor
  fractionImage.src = T.images.initial;
  handFtueImg.src = T.item_images.ftue_cursor;

  // Event Listeners
  halfButton.addEventListener("click", () => handleButtonClick(1, "half"));
  quarterButton.addEventListener("click", () => handleButtonClick(2, "quarter"));
  sixthButton.addEventListener("click", () => handleButtonClick(3, "sixth"));

  // Initial setup
  setupInitialState();
}

// =================
// Initial State Setup
// =================
function setupInitialState() {
  // Disable all buttons except the first one initially
  updateButtonStates();

  // Show FTUE on first button after a delay
  setTimeout(() => {
    showFtue(halfButton);
  }, 1000);
}

function updateButtonStates() {
  // Enable only the current step button, disable others
  halfButton.disabled = currentStep > 1;
  quarterButton.disabled = currentStep < 1 || currentStep > 2;
  sixthButton.disabled = currentStep < 2;

  // Mark completed buttons
  if (currentStep >= 1) halfButton.classList.add('completed');
  if (currentStep >= 2) quarterButton.classList.add('completed');
  if (currentStep >= 3) sixthButton.classList.add('completed');
}

// =================
// Button Interaction Logic
// =================
function handleButtonClick(step, imageKey) {
  if (isAnimating || currentStep + 1 !== step) return;

  isAnimating = true;
  hideFtue();
  audioPlay('click');

  currentStep = step;
  updateButtonStates();

  // Change the image
  changeImage(imageKey);

  // Show next FTUE after animation completes
  setTimeout(() => {
    isAnimating = false;
    if (step < 3) {
      const nextButton = step === 1 ? quarterButton : sixthButton;
      showFtue(nextButton);
    } else {
      // All steps completed
      audioPlay('success');
      // Signal completion to parent React app after 2.5 seconds
      setTimeout(() => {
        showCompletionLoader();
      }, 2500);
    }
  }, 1000);
}

// =================
// Image Management Functions
// =================
function changeImage(imageKey) {
  if (!T.images[imageKey]) return;

  // Fade out current image
  fractionImage.classList.remove('fade-in');
  fractionImage.classList.add('fade-out');

  // Change image after fade out
  setTimeout(() => {
    fractionImage.src = T.images[imageKey];
    fractionImage.alt = `Fraction visualization: ${imageKey}`;

    // Fade in new image
    fractionImage.classList.remove('fade-out');
    fractionImage.classList.add('fade-in');

    // Add highlight animation
    fractionImage.classList.add('image-highlight');
    setTimeout(() => {
      fractionImage.classList.remove('image-highlight');
    }, 2000);

  }, 250);
}

// =================
// FTUE Functions
// =================
function showFtue(element) {
  if (!element || !handFtue || element.disabled) return;

  setTimeout(() => {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    handFtue.style.left = `${rect.left + rect.width / 2}px`;
    handFtue.style.top = `${rect.top + rect.height / 2}px`;
    handFtue.classList.add("hand-animating");
  }, 500);
}

function hideFtue() {
  if (handFtue) handFtue.classList.remove("hand-animating");
}

// =================
// Audio Functions
// =================
function audioPlay(type) {
  if (T.audio && T.audio[type]) {
    new Audio(T.audio[type]).play().catch((e) => console.warn("Audio play failed:", e));
  }
}

function showCompletionLoader() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  const message = document.createElement('div');
  message.textContent = 'Great job! Moving to next activity...';
  message.style.cssText = `
    color: white;
    font-size: 20px;
    margin-bottom: 20px;
    font-family: Arial, sans-serif;
  `;

  const loaderContainer = document.createElement('div');
  loaderContainer.style.cssText = `
    width: 80%;
    max-width: 300px;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    overflow: hidden;
  `;

  const loaderBar = document.createElement('div');
  loaderBar.style.cssText = `
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    border-radius: 4px;
    transition: width 2.5s ease-in-out;
  `;

  loaderContainer.appendChild(loaderBar);
  overlay.appendChild(message);
  overlay.appendChild(loaderContainer);
  document.body.appendChild(overlay);

  setTimeout(() => {
    loaderBar.style.width = '100%';
  }, 50);

  setTimeout(() => {
    window.parent.postMessage({ type: 'ASSET_COMPLETE' }, '*');
  }, 2500);
}

// =================
// Initialize App
// =================
document.addEventListener("DOMContentLoaded", initApp);