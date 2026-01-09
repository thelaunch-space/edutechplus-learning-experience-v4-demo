// =================
// App Setup
// =================
const T = window.APP_TEXTS;
if (!T) {
  console.error("Error: Text data not found. Ensure texts.js is loaded.");
}

// Global DOM Elements
let appletContainer,
  mainLayout,
  equipmentArea,
  rightPanel,
  contextBox,
  characterImageEl;
let activityArea, nextButton, handFtue, handFtueImg;

// App State
let currentStep = 0;
let selectedTool = null;
let selectedColor = null;
let usedColors = [];
let colorCount = 0;
let cutCount = 0;
let cutsMade = [];
let isAnimating = false;
let PaperSize = 40;

// Challenge Configuration
const challenges = [
  { name: "2/5", denominator: 5, numerator: 2, requiredCuts: ["scissor-5"] },
  { name: "2/3", denominator: 3, numerator: 2, requiredCuts: ["scissor-3"] },
  {
    name: "2/4",
    denominator: 4,
    numerator: 2,
    requiredCuts: ["scissor-2", "scissor-2"],
  },
  { name: "3/5", denominator: 5, numerator: 3, requiredCuts: ["scissor-5"] },
  {
    name: "4/6",
    denominator: 6,
    numerator: 4,
    requiredCuts: ["scissor-2", "scissor-3"],
  },
];
let currentChallengeIndex = -1;

// =================
// Initialization
// =================
function initApp() {
  // DOM Element Assignments
  appletContainer = document.querySelector(".applet-container");
  mainLayout = document.querySelector(".main-layout");
  equipmentArea = document.getElementById("equipment-area");
  rightPanel = document.querySelector(".right-panel-content");
  contextBox = document.getElementById("contextBox");
  characterImageEl = document.getElementById("characterImageElement");
  activityArea = document.getElementById("activity-area");
  nextButton = document.getElementById("nextButton");
  handFtue = document.getElementById("hand-ftue");
  handFtueImg = document.getElementById("hand-ftue-img");

  document.getElementById("html_title").textContent = T.html_title;
  document.getElementById("main_title_text").textContent = T.main_title_text;
  document.getElementById("subtitle_text").textContent = T.subtitle_text;
  handFtueImg.src = T.item_images.ftue_cursor;

  nextButton.addEventListener("click", () => {
    if (isAnimating) return;
    audioPlay("click");

    const challenge = challenges[currentChallengeIndex];

    if (nextButton.textContent === T.button_texts.check) {
      handleColorCheck();
      return;
    }
    if (nextButton.textContent === T.button_texts.reset) {
      if (challenge.name === "2/4") renderStep(9);
      else if (challenge.name === "2/3") renderStep(6);
      else if (challenge.name === "3/5") renderStep(12);
      else if (challenge.name === "4/6") renderStep(15);
      else renderStep(1);
      return;
    }
    if (nextButton.textContent === T.button_texts.recolor) {
      if (challenge.name === "2/5") renderStep(2);
      else if (challenge.name === "2/3") renderStep(7);
      else if (challenge.name === "2/4") renderStep(10);
      else if (challenge.name === "3/5") renderStep(13);
      else if (challenge.name === "4/6") renderStep(16);
      return;
    }
    if (currentStep === 18) {
      location.reload();
      return;
    }
    renderStep(currentStep + 1);
  });
  renderStep(0);
}

// =================
// Game Flow Control
// =================
function renderStep(step) {
  currentStep = step;
  resetStepState();

  const challenge = challenges[currentChallengeIndex];

  switch (step) {
    case 0:
      appletContainer.classList.add("initial-state");
      updateInstructions("step_0_intro");
      nextButton.textContent = T.button_texts.start;
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    // --- Challenge 1: 2/5 ---
    case 1:
      currentChallengeIndex = 0;
      setupChallengeUI("step_1_cut_5");
      break;
    case 2:
      currentChallengeIndex = 0; // Ensure context is maintained on Recolor
      updateInstructions("step_2_color_2", {
        numerator: challenge.numerator,
      });
      setInteractivity({ tools: false, paper: true, palette: true });
      nextButton.textContent = T.button_texts.check;
      nextButton.disabled = false;
      setupColorInteraction();
      break;
    case 3:
      updateInstructions("step_3_confirm_2_5");
      setInteractivity({ tools: false, paper: false, palette: false });
      nextButton.disabled = false;
      showFtue(nextButton);
      break;
    case 4:
      setupFinalLayout();
      updateInstructions("step_4_final_2_5");
      createFinalFractionDisplay();
      createFinalPaperDisplay();
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    // --- Transition ---
    case 5:
      currentChallengeIndex = -1;
      appletContainer.classList.add("initial-state");
      updateInstructions("step_5_transition");
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    // --- All other challenges follow the same pattern ---
    case 6: // 2/3 Cut
      currentChallengeIndex = 1;
      setupChallengeUI("step_6_cut_3");
      break;
    case 7: // 2/3 Color
      currentChallengeIndex = 1;
      updateInstructions("step_7_color_2_from_3", {
        numerator: challenge.numerator,
      });
      setInteractivity({ tools: false, paper: true, palette: true });
      nextButton.textContent = T.button_texts.check;
      nextButton.disabled = false;
      setupColorInteraction();
      break;
    case 8: // 2/3 Confirm
      updateInstructions("step_8_confirm_2_3");
      setInteractivity({ tools: false, paper: false, palette: false });
      nextButton.disabled = false;
      showFtue(nextButton);
      break;
    case 9: // 2/4 Cut
      currentChallengeIndex = 2;
      setupChallengeUI("step_9_cut_4");
      break;
    case 10: // 2/4 Color
      currentChallengeIndex = 2;
      updateInstructions("step_10_color_2_from_4", {
        numerator: challenge.numerator,
      });
      setInteractivity({ tools: false, paper: true, palette: true });
      nextButton.textContent = T.button_texts.check;
      nextButton.disabled = false;
      setupColorInteraction();
      break;
    case 11: // 2/4 Confirm
      updateInstructions("step_11_confirm_2_4");
      setInteractivity({ tools: false, paper: false, palette: false });
      nextButton.disabled = false;
      showFtue(nextButton);
      break;
    case 12: // 3/5 Cut
      currentChallengeIndex = 3;
      setupChallengeUI("step_12_cut_5_again");
      break;
    case 13: // 3/5 Color
      currentChallengeIndex = 3;
      updateInstructions("step_13_color_3_from_5", {
        numerator: challenge.numerator,
      });
      setInteractivity({ tools: false, paper: true, palette: true });
      nextButton.textContent = T.button_texts.check;
      nextButton.disabled = false;
      setupColorInteraction();
      break;
    case 14: // 3/5 Confirm
      updateInstructions("step_14_confirm_3_5");
      setInteractivity({ tools: false, paper: false, palette: false });
      nextButton.disabled = false;
      showFtue(nextButton);
      break;
    case 15: // 4/6 Cut
      currentChallengeIndex = 4;
      setupChallengeUI("step_15_cut_6");
      break;
    case 16: // 4/6 Color
      currentChallengeIndex = 4;
      updateInstructions("step_16_color_4_from_6", {
        numerator: challenge.numerator,
      });
      setInteractivity({ tools: false, paper: true, palette: true });
      nextButton.textContent = T.button_texts.check;
      nextButton.disabled = false;
      setupColorInteraction();
      break;
    case 17: // 4/6 Confirm
      updateInstructions("step_17_confirm_4_6");
      setInteractivity({ tools: false, paper: false, palette: false });
      nextButton.disabled = false;
      showFtue(nextButton);
      break;

    // --- Final Screen ---
    case 18:
      currentChallengeIndex = -1;
      appletContainer.classList.add("initial-state");
      updateInstructions("step_18_final");
      nextButton.textContent = T.button_texts.start_over;
      nextButton.disabled = false;
      showFtue(nextButton);
      // Signal completion to parent React app after 2.5 seconds
      setTimeout(() => {
        showCompletionLoader();
      }, 2500);
      break;
  }
}

function resetStepState() {
  isAnimating = false;
  selectedTool = null;
  hideFtue();
  setContextBoxState("normal");
  setJaxPose("normal");
  nextButton.disabled = true;
  nextButton.textContent = T.button_texts.next;

  const lowerControls = document.querySelector(
    ".left-panel-anchor .lowerControls"
  );
  if (lowerControls && !lowerControls.contains(nextButton)) {
    lowerControls.appendChild(nextButton);
  }

  // Always clean up layout classes at the start of a step.
  appletContainer.classList.remove("initial-state", "final-phase-layout");

  // Replace innerHTML to clear old listeners robustly.
  const activityAreaHTML = activityArea.innerHTML;
  activityArea.innerHTML = activityAreaHTML;
  const equipmentAreaHTML = equipmentArea.innerHTML;
  equipmentArea.innerHTML = equipmentAreaHTML;

  // Reset state variables for new challenges
  const isNewChallenge = [1, 6, 9, 12, 15].includes(currentStep);
  if (isNewChallenge) {
    if (activityArea) activityArea.innerHTML = "";
    if (equipmentArea) equipmentArea.innerHTML = "";
    cutCount = 0;
    cutsMade = [];
  }

  // Reset coloring state for coloring steps
  const isColoringStep = [2, 7, 10, 13, 16].includes(currentStep);
  if (isColoringStep) {
    colorCount = 0;
    usedColors = [];
    selectedColor = null;
    document.querySelectorAll(".paper-piece").forEach((p) => {
      p.style.backgroundColor = T.gameConfig.paperColor;
      p.classList.remove("colored");
    });
  }
}

// =========================
// UI & Layout Management
// =========================

function setInteractivity({ tools, paper, palette }) {
  const equipmentAreaEl = document.getElementById("equipment-area");
  if (equipmentAreaEl) {
    equipmentAreaEl.style.pointerEvents = tools ? "auto" : "none";
    equipmentAreaEl.style.opacity = tools ? "1" : "0.9";
  }
  const paperContainer = document.querySelector(".paper-container");
  if (paperContainer) {
    paperContainer.style.pointerEvents = paper ? "auto" : "none";
  }
  const paletteContainer = document.querySelector(".color-palette-container");
  if (paletteContainer) {
    paletteContainer.style.pointerEvents = palette ? "auto" : "none";
    paletteContainer.style.opacity = palette ? "1" : "0.9";
  }
}

function setupChallengeUI(instructionKey) {
  updateInstructions(instructionKey);

  createTool("scissor-2", T.item_images.scissor_2, "15%", "50%");
  createTool("scissor-3", T.item_images.scissor_3, "40%", "50%");
  createTool("scissor-5", T.item_images.scissor_5, "65%", "50%");
  createTool("glue_gun", T.item_images.glue_gun, "90%", "50%").classList.add(
    "disabled"
  );
  equipmentArea.style.display = "flex";

  createPaper(`${PaperSize}vw`, `${PaperSize}vw`);
  createColorPalette();

  setInteractivity({ tools: true, paper: true, palette: false });
  setupCutInteraction();
}

function setupFinalLayout() {
  setInteractivity({ tools: false, paper: false, palette: false });
  appletContainer.classList.add("final-phase-layout");
  setJaxPose("speaking_head");
  document.getElementById("equipment-area").style.display = "none";
  activityArea.innerHTML = "";
  const builderArea = document.createElement("div");
  builderArea.className = "fraction-builder-area";
  const paperDisplay = document.createElement("div");
  paperDisplay.className = "paper-display";
  activityArea.append(builderArea, paperDisplay);
  appletContainer.querySelector(".workingArea-container").append(nextButton);
}

// =========================
// Element Creation
// =========================

function createTool(toolName, imgSrc, top, left) {
  const tool = document.createElement("div");
  tool.className = "tool-item";
  tool.dataset.tool = toolName;
  tool.innerHTML = `<img src="${imgSrc}" alt="${toolName}">`;
  tool.style.top = top;
  tool.style.left = left;
  tool.style.transform = "translate(-50%, -50%)";
  document.getElementById("equipment-area").appendChild(tool);
  return tool;
}

function createPaper(width, height) {
  const container = document.createElement("div");
  container.className = "paper-container";
  container.style.width = width;
  container.style.height = height;
  const piece = document.createElement("div");
  piece.className = "paper-piece";
  piece.style.width = "100%";
  piece.style.height = "100%";
  piece.style.backgroundColor = T.gameConfig.paperColor;
  container.appendChild(piece);
  activityArea.prepend(container);
  return container;
}

function createColorPalette() {
  const paletteContainer = document.createElement("div");
  paletteContainer.className = "color-palette-container";
  T.gameConfig.colors.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = color.value;
    swatch.dataset.colorName = color.name;
    swatch.dataset.colorValue = color.value;
    paletteContainer.appendChild(swatch);
  });
  activityArea.appendChild(paletteContainer);
}

function createFinalFractionDisplay() {
  const area = activityArea.querySelector(".fraction-builder-area");
  if (!area) return;
  const challenge = challenges[currentChallengeIndex];

  const numLabel = `<b style="color:${selectedColor.value}">${T.instructions.labels.numerator}</b>`;
  const denLabel = `<b style="color:${T.gameConfig.paperStroke}">${T.instructions.labels.denominator}</b>`;

  area.innerHTML = `
        <div class="fraction-display-area final-form">
            <div class="fraction-column">
                <div class="fraction-label">${numLabel}</div>
                <div class="fraction-line"></div>
                <div class="fraction-label">${denLabel}</div>
            </div>
            <div class="equals-sign">=</div>
            <div class="fraction-column">
                <div class="fraction-number-box filled" style="color: ${selectedColor.value};">${challenge.numerator}</div>
                <div class="fraction-line"></div>
                <div class="fraction-number-box filled" style="color: ${T.gameConfig.paperStroke};">${challenge.denominator}</div>
            </div>
        </div>`;
}

function createFinalPaperDisplay() {
  const paperDisplay = activityArea.querySelector(".paper-display");
  const challenge = challenges[currentChallengeIndex];
  paperDisplay.style.width = `${PaperSize}vw`;

  const isHorizontalCut =
    cutsMade.length > 1 &&
    (challenge.name === "2/4" || challenge.name === "4/6");

  let containerStyle = `display: flex; gap: 0.5vw; width: 100%; height: ${PaperSize}vw; flex-direction: ${isHorizontalCut ? "column" : "row"
    };`;

  paperDisplay.innerHTML = `<div style="${containerStyle}"></div>`;
  const container = paperDisplay.querySelector("div");

  if (!isHorizontalCut) {
    for (let i = 0; i < challenge.denominator; i++) {
      const bgColor =
        i < challenge.numerator ? selectedColor.value : T.gameConfig.paperColor;
      container.innerHTML += `<div class="paper-piece" style="width: ${100 / challenge.denominator
        }%; height: 100%; background-color: ${bgColor}; border-color: ${T.gameConfig.paperStroke
        };"></div>`;
    }
  } else {
    const rows = cutsMade.includes("scissor-3")
      ? 3
      : cutsMade.includes("scissor-2")
        ? 2
        : 1;
    const cols =
      cutsMade.includes("scissor-2") && rows !== 2
        ? 2
        : cutsMade.includes("scissor-3") && rows === 2
          ? 3
          : 2;
    container.style.gap = "0.4vw";
    let coloredCount = 0;
    for (let r = 0; r < rows; r++) {
      let rowHTML = `<div style="display:flex; flex-direction: row; height: ${100 / rows
        }%; width:100%; gap: 0.4vw;">`;
      for (let c = 0; c < cols; c++) {
        const bgColor =
          coloredCount < challenge.numerator
            ? selectedColor.value
            : T.gameConfig.paperColor;
        rowHTML += `<div class="paper-piece" style="width: ${100 / cols
          }%; height: 100%; background-color: ${bgColor}; border-color: ${T.gameConfig.paperStroke
          };"></div>`;
        coloredCount++;
      }
      rowHTML += `</div>`;
      container.innerHTML += rowHTML;
    }
  }
}

// =========================
// Interaction Logic
// =========================

function setupCutInteraction() {
  const scissors = document.querySelectorAll('[data-tool^="scissor-"]');
  const paperContainer = document.querySelector(".paper-container");

  if (!paperContainer || scissors.length === 0) return;

  scissors.forEach((s) =>
    s.addEventListener("click", () => {
      if (isAnimating) return;
      selectedTool = s;
      scissors.forEach((sc) => sc.classList.remove("selected"));
      showFtue(paperContainer);
      s.classList.add("selected");
      audioPlay("click");
    })
  );

  paperContainer.addEventListener("click", () => {
    if (isAnimating || !selectedTool) return;
    isAnimating = true;
    hideFtue();
    setInteractivity({ tools: false, paper: false, palette: false });
    audioPlay("click");
    animateAndPerformCut(selectedTool, paperContainer);
  });
}

function handleColorCheck() {
  const challenge = challenges[currentChallengeIndex];
  if (colorCount === 0) return; // Don't check if nothing is colored

  hideFtue();

  const uniqueColorValues = new Set(usedColors.map((c) => c.value));

  if (uniqueColorValues.size > 1) {
    // Incorrect: Multiple colors used
    audioPlay("wrong");
    setContextBoxState("incorrect");
    setJaxPose("wrong");
    updateInstructions("step_2_color_wrong");
    nextButton.textContent = T.button_texts.recolor;
    nextButton.disabled = false;
    showFtue(nextButton);
    setInteractivity({ tools: false, paper: false, palette: false }); // FIX: Disable paper
    return;
  }

  if (colorCount !== challenge.numerator) {
    // Incorrect: Wrong number of pieces colored
    audioPlay("wrong");
    setContextBoxState("incorrect");
    setJaxPose("wrong");
    updateInstructions("feedback_color_wrong_count", {
      count: colorCount,
      numerator: challenge.numerator,
    });
    nextButton.textContent = T.button_texts.recolor;
    nextButton.disabled = false;
    showFtue(nextButton);
    setInteractivity({ tools: false, paper: false, palette: false }); // FIX: Disable paper
    return;
  }

  // Correct
  selectedColor = usedColors[0]; // Set the official color for the next step
  audioPlay("correct");
  setJaxPose("correct");
  setContextBoxState("correct");
  isAnimating = true;
  setInteractivity({ tools: false, paper: false, palette: false });
  setTimeout(() => renderStep(currentStep + 1), 3000);
}

function setupColorInteraction() {
  const swatches = document.querySelectorAll(".color-swatch");
  swatches.forEach((el) => el.classList.remove("selected"));
  const pieces = document.querySelectorAll(".paper-piece");

  if (pieces.length === 0 || swatches.length === 0) return;

  swatches.forEach((s) =>
    s.addEventListener("click", () => {
      if (isAnimating) return;
      selectedTool = s;
      swatches.forEach((el) => el.classList.remove("selected"));
      s.classList.add("selected");
      showFtue(pieces[0]);
      audioPlay("click");
    })
  );

  pieces.forEach((p) =>
    p.addEventListener("click", () => {
      if (
        isAnimating ||
        !selectedTool ||
        p.classList.contains("colored") ||
        !selectedTool.classList.contains("color-swatch")
      )
        return;

      const pieceColorValue = selectedTool.dataset.colorValue;
      const pieceColorName = selectedTool.dataset.colorName;
      hideFtue();

      usedColors.push({ value: pieceColorValue, name: pieceColorName });

      p.style.backgroundColor = pieceColorValue;
      p.classList.add("colored");
      colorCount++;
      audioPlay("paint");
    })
  );
}

async function animateAndPerformCut(tool, paperContainer) {
  const toolName = tool.dataset.tool;
  const challenge = challenges[currentChallengeIndex];
  const equipmentAreaEl = document.getElementById("equipment-area");

  const toolRect = tool.getBoundingClientRect();
  const paperRect = paperContainer.getBoundingClientRect();
  const equipmentAreaRect = equipmentAreaEl.getBoundingClientRect();

  const originalTop = tool.style.top;
  const originalLeft = tool.style.left;

  tool.style.transition =
    "top 0.4s ease-in-out, left 0.4s ease-in-out, transform 0.3s ease";

  const numPieces = parseInt(toolName.split("-")[1]);
  const isHorizontal =
    (challenge.name === "2/4" && cutCount > 0) ||
    (challenge.name === "4/6" && cutCount > 0);

  if (!isHorizontal) {
    // Vertical Cut
    for (let i = 1; i < numPieces; i++) {
      const position = (paperRect.width / numPieces) * i;
      let startX =
        paperRect.left + position - toolRect.width / 2 - equipmentAreaRect.left;
      let startY =
        paperRect.bottom - toolRect.height / 2 - equipmentAreaRect.top;
      tool.style.transform = "translate(0, 0) rotate(0deg)";
      tool.style.left = `${startX}px`;
      tool.style.top = `${startY}px`;
      await delay(500);
      const endY = paperRect.top - toolRect.height / 4 - equipmentAreaRect.top;
      tool.style.top = `${endY}px`;
      audioPlay("cut");
      await delay(500);
    }
  } else {
    // Horizontal Cut
    tool.style.transform = "translate(0, 0) rotate(90deg)";
    for (let i = 1; i < numPieces; i++) {
      const position = (paperRect.height / numPieces) * i;
      let startX = paperRect.left - toolRect.width / 2 - equipmentAreaRect.left;
      let startY =
        paperRect.top + position - toolRect.height / 2 - equipmentAreaRect.top;
      tool.style.left = `${startX}px`;
      tool.style.top = `${startY}px`;
      await delay(500);
      const endX = paperRect.right - toolRect.width - equipmentAreaRect.left;
      tool.style.left = `${endX}px`;
      audioPlay("cut");
      await delay(500);
    }
  }
  tool.style.transform = "translate(-50%, -50%) rotate(0deg)";

  const existingPiecesCount =
    paperContainer.querySelectorAll(".paper-piece").length;
  paperContainer.innerHTML = "";

  if (!isHorizontal) {
    paperContainer.style.flexDirection = "row";
    for (let i = 0; i < numPieces; i++) {
      const p = document.createElement("div");
      p.className = "paper-piece";
      p.style.width = `${100 / numPieces}%`;
      p.style.height = "100%";
      p.style.backgroundColor = T.gameConfig.paperColor;
      paperContainer.appendChild(p);
    }
  } else {
    paperContainer.style.flexDirection = "column";
    paperContainer.style.gap = "0.25vw";
    const rows = numPieces;
    const cols = existingPiecesCount;
    for (let r = 0; r < rows; r++) {
      let rowEl = document.createElement("div");
      rowEl.style.cssText = `display:flex; flex-direction:row; height: ${100 / rows
        }%; width:100%; gap: 0.25vw;`;
      for (let c = 0; c < cols; c++) {
        const p = document.createElement("div");
        p.className = "paper-piece";
        p.style.cssText = `width: ${100 / cols
          }%; height: 100%; background-color: ${T.gameConfig.paperColor};`;
        rowEl.appendChild(p);
      }
      paperContainer.appendChild(rowEl);
    }
  }

  await delay(500);
  tool.style.top = originalTop;
  tool.style.left = originalLeft;
  await delay(500);

  cutsMade.push(toolName);
  cutCount++;

  // --- FIX: Improved cutting validation logic ---
  const requiredCutsList = challenge.requiredCuts;
  const madeCounts = cutsMade.reduce((acc, cut) => {
    acc[cut] = (acc[cut] || 0) + 1;
    return acc;
  }, {});
  const requiredCounts = requiredCutsList.reduce((acc, cut) => {
    acc[cut] = (acc[cut] || 0) + 1;
    return acc;
  }, {});

  let isIncorrect = false;
  for (const cut in madeCounts) {
    if (!requiredCounts[cut] || madeCounts[cut] > requiredCounts[cut]) {
      isIncorrect = true;
      break;
    }
  }

  if (isIncorrect) {
    audioPlay("buzzer");
    updateInstructions("feedback_cut_wrong", {
      count: paperContainer.querySelectorAll(".paper-piece").length,
    });
    setContextBoxState("incorrect");
    setJaxPose("wrong");
    nextButton.textContent = T.button_texts.reset;
    nextButton.disabled = false;
    showFtue(nextButton);
    isAnimating = false;
    return;
  }
  // --- END FIX ---

  // Check if all required cuts are made by comparing sorted arrays
  const madeSorted = [...cutsMade].sort().join(",");
  const requiredSorted = [...challenge.requiredCuts].sort().join(",");

  if (madeSorted !== requiredSorted) {
    let key =
      challenge.name === "2/4" ? "step_9_cut_4_again" : "step_15_cut_6_again";
    updateInstructions(key, {
      count: paperContainer.querySelectorAll(".paper-piece").length,
    });
    isAnimating = false;
    setInteractivity({ tools: true, paper: true, palette: false });
    setupCutInteraction(); // Re-add listeners for the next cut
  } else {
    setJaxPose("correct");
    setContextBoxState("correct");
    await delay(2000);
    renderStep(currentStep + 1);
  }
}

// =========================
// Helpers
// =========================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function updateInstructions(key, params = {}) {
  const contextSection = document.querySelector(".context-section");
  let instruction = T.instructions[key];
  if (instruction) {
    let title = instruction.title;
    let text =
      typeof instruction.text === "function"
        ? instruction.text(params)
        : instruction.text;
    contextSection.innerHTML = `<h2>${title}</h2><div><p>${text}</p></div>`;
  }
}

function showFtue(element) {
  if (!element || !handFtue) return;
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

function setContextBoxState(state = "normal") {
  contextBox.classList.remove("correct", "incorrect");
  if (state === "correct" || state === "incorrect") {
    contextBox.classList.add(state);
  }
}

function setJaxPose(pose) {
  if (T.character_images && T.character_images[pose]) {
    characterImageEl.src = T.character_images[pose];
  }
}

function audioPlay(type) {
  if (T.audio && T.audio[type]) {
    new Audio(T.audio[type])
      .play()
      .catch((e) => console.warn("Audio play failed:", e));
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

document.addEventListener("DOMContentLoaded", initApp);
