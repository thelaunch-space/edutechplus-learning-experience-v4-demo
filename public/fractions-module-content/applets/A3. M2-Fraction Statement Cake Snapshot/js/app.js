// =================
// App Setup
// =================
const T = window.APP_TEXTS;
if (!T) {
  console.error("Error: Text data not found. Ensure texts.js is loaded.");
}
// Global DOM Elements
let wholeCakeButton, equalPartsButton, unitFractionButton, representButton;
let fractionImage, imageText, handFtue, handFtueImg;
// App State
let currentStep = 0; // 0: initial, 1: whole cake, 2: equal parts, 3: unit fraction, 4: represent
let isAnimating = false;
// =================
// Initialization
// =================
function initApp() {
  // DOM Element Assignments
  wholeCakeButton = document.getElementById("wholeCakeButton");
  equalPartsButton = document.getElementById("equalPartsButton");
  unitFractionButton = document.getElementById("unitFractionButton");
  representButton = document.getElementById("representButton");
  fractionImage = document.getElementById("fractionImage");
  imageText = document.getElementById("imageText");
  handFtue = document.getElementById("hand-ftue");
  handFtueImg = document.getElementById("hand-ftue-img");
  // Set initial texts from texts.js
  document.getElementById("html_title").textContent = T.html_title;
  document.getElementById("fractions_text").textContent = T.title_parts.fractions;
  document.getElementById("help_text").textContent = T.title_parts.help;
  document.getElementById("parts_text").textContent = T.title_parts.parts;
  document.getElementById("period_text").textContent = T.title_parts.period;

  // Set statement texts
  document.getElementById("statement1_text").textContent = T.statements.statement1;
  document.getElementById("whole_cake_text").textContent = T.button_texts.whole_cake;
  document.getElementById("statement2_text").textContent = T.statements.statement2;
  document.getElementById("equal_parts_text").textContent = T.button_texts.equal_parts;
  document.getElementById("statement3_text").textContent = T.statements.statement3;
  document.getElementById("unit_fraction_text").textContent = T.button_texts.unit_fraction;
  document.getElementById("statement4_text").textContent = T.statements.statement4;
  document.getElementById("represent_text").textContent = T.button_texts.represent;
  document.getElementById("statement4_end").textContent = T.statements.statement4_end;

  // Set initial image and hand cursor
  fractionImage.src = T.images.initial;
  imageText.textContent = T.image_texts.initial;
  handFtueImg.src = T.item_images.ftue_cursor;
  // Event Listeners
  wholeCakeButton.addEventListener("click", () => handleButtonClick(1, "whole_cake"));
  equalPartsButton.addEventListener("click", () => handleButtonClick(2, "equal_parts"));
  unitFractionButton.addEventListener("click", () => handleButtonClick(3, "unit_fraction"));
  representButton.addEventListener("click", () => handleButtonClick(4, "represent"));
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
    showFtue(wholeCakeButton);
  }, 1000);
}
function updateButtonStates() {
  // Enable only the current step button, disable others
  wholeCakeButton.disabled = currentStep > 1;
  equalPartsButton.disabled = currentStep < 1 || currentStep > 2;
  unitFractionButton.disabled = currentStep < 2 || currentStep > 3;
  representButton.disabled = currentStep < 3;

  // Mark completed buttons
  if (currentStep >= 1) wholeCakeButton.classList.add('completed');
  if (currentStep >= 2) equalPartsButton.classList.add('completed');
  if (currentStep >= 3) unitFractionButton.classList.add('completed');
  if (currentStep >= 4) representButton.classList.add('completed');
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
    if (step < 4) {
      const nextButtons = [null, equalPartsButton, unitFractionButton, representButton];
      const nextButton = nextButtons[step];
      if (nextButton) {
        showFtue(nextButton);
      }
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
    fractionImage.alt = `Unit fraction visualization: ${imageKey}`;

    // Fade in new image
    fractionImage.classList.remove('fade-out');
    fractionImage.classList.add('fade-in');

    // Add highlight animation
    fractionImage.classList.add('image-highlight');
    setTimeout(() => {
      fractionImage.classList.remove('image-highlight');
    }, 2000);

  }, 250);

  // Change text as well
  changeText(imageKey);
}

function changeText(textKey) {
  if (!T.image_texts[textKey]) return;

  // Fade out current text
  imageText.classList.remove('fade-in');
  imageText.classList.add('fade-out');

  // Change text after fade out
  setTimeout(() => {
    imageText.textContent = T.image_texts[textKey];

    // Fade in new text
    imageText.classList.remove('fade-out');
    imageText.classList.add('fade-in');

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