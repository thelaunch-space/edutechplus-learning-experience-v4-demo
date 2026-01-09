// =================
// App Setup
// =================
const T = window.APP_TEXTS;
if (!T) {
    console.error("Error: Text data not found. Ensure texts.js is loaded.");
}

// Global DOM Elements
let appletContainer, equipmentArea, activityArea, contextBox, characterImageEl, nextButton, handFtue, handFtueImg;

// App State
let currentStep = 0;
let selectedTool = null;
let selectedPaper = null;
let isAnimating = false;
let selectedColor = T.gameConfig.colors[1];
const PAPER_SIZE = 40;

// Action definitions for interactions
const actionMap = {
    'cut_one_to_2': { config: { tool: 'scissor-2', pieces: 2, cutDirection: 'horizontal' }, finalStep: 3, failKey: 'step_1_fail' },
    'cut_one_to_3': { config: { tool: 'scissor-3', pieces: 3, cutDirection: 'horizontal' }, finalStep: 11, failKey: 'step_10_fail_2' },
    'initial_cut_to_2': { config: { tool: 'scissor-2', pieces: 2, cutDirection: 'vertical' }, finalStep: 10, failKey: 'step_1_fail' }
};

// =================
// Initialization
// =================
function initApp() {
    appletContainer = document.querySelector(".applet-container");
    equipmentArea = document.getElementById("equipment-area");
    activityArea = document.getElementById("activity-area");
    contextBox = document.getElementById("contextBox");
    characterImageEl = document.getElementById("characterImageElement");
    nextButton = document.getElementById("nextButton");
    handFtue = document.getElementById("hand-ftue");
    handFtueImg = document.getElementById("hand-ftue-img");

    document.documentElement.style.setProperty('--paper-stroke', T.gameConfig.paperStroke);
    document.getElementById("html_title").textContent = T.html_title;
    handFtueImg.src = T.item_images.ftue_cursor;

    nextButton.addEventListener("click", () => {
        if (isAnimating) return;
        audioPlay("click");

        if (nextButton.textContent === T.button_texts.reset) {
            renderStep(currentStep); // Re-render the current step to reset it
            return;
        }

        if (nextButton.textContent === T.button_texts.start_over) {
            renderStep(0);
            return;
        }
        renderStep(currentStep + 1);
    });

    renderStep(0);
}

// =================
// Game Flow Control
// =================
async function renderStep(step, state = {}) {
    const isResetting = nextButton.textContent === T.button_texts.reset && currentStep === step;
    currentStep = step;
    const previousHTML = activityArea.innerHTML;
    resetStepState();

    const preservedSteps = [2, 3, 4, 5, 6, 9, 10, 11, 12, 12.5, 13];
    if (preservedSteps.includes(currentStep) && !isResetting) {
        activityArea.innerHTML = state.html || previousHTML;
    }

    switch (step) {
        case 0:
            appletContainer.classList.add("initial-state");
            updateInstructions("step_0_intro");
            nextButton.textContent = T.button_texts.next;
            nextButton.disabled = false;
            showFtue(nextButton);
            break;

        case 1:
            updateInstructions("step_1_setup");
            createPreCutPaper(2, 'vertical');
            createTools();
            createColorPalette(true);
            nextButton.disabled = false;
            showFtue(nextButton);
            break;

        case 2:
            // If resetting or coming from a non-preserved step, ensure paper is correct
            if (isResetting || !activityArea.querySelector('.paper-container')) {
                createPreCutPaper(2, 'vertical');
            }
            updateInstructions("step_2_second_cut");
            createTools();
            createColorPalette(true);
            setupInteraction('cut_one_to_2');
            showFtue(document.querySelector('[data-tool="scissor-2"]'));
            break;

        case 3:
            updateInstructions("step_3_color");
            createColorPalette(false);
            document.getElementById('equipment-area').style.opacity = 0;
            setupColoringInteraction(4);
            showFtue(document.querySelector('.color-palette-container'));
            break;

        case 4:
            updateInstructions("step_4_mcq_how_many", { paperStroke: T.gameConfig.paperStroke });
            const stepInfo4 = T.instructions.step_4_mcq_how_many;
            createMcq(stepInfo4.options, stepInfo4.correctAnswer, () => {
                setFeedbackState(true);
                delay(1500).then(() => renderStep(5, { html: activityArea.innerHTML }));
            });
            break;

        case 5:
            updateInstructions("step_5_observe");
            await delay(500);
            await animateNumbering();
            delay(1000).then(() => renderStep(6, { html: activityArea.innerHTML }));
            break;

        case 6:
            updateInstructions("step_6_fraction_intro");
            nextButton.disabled = false;
            showFtue(nextButton);
            break;

        case 7:
            appletContainer.classList.add("initial-state");
            updateInstructions("step_7_transition");
            nextButton.disabled = false;
            showFtue(nextButton);
            break;

        case 8:
            updateInstructions("step_8_setup_1_6");
            createPaper();
            createTools();
            createColorPalette(true);
            nextButton.disabled = false;
            showFtue(nextButton);
            break;

        case 9:
            // FIX: Re-create the initial paper state if resetting this step.
            if (isResetting || !activityArea.querySelector('.paper-container')) {
                createPaper();
            }
            updateInstructions("step_9_cut_for_1_6");
            createTools();
            createColorPalette(true);
            setupInteraction('initial_cut_to_2');
            showFtue(document.querySelector('[data-tool="scissor-2"]'));
            break;

        case 10:
            // If resetting or coming from a non-preserved step, ensure paper is correct
            if (isResetting || !activityArea.querySelector('.paper-container')) {
                createPreCutPaper(2, 'vertical');
            }
            updateInstructions("step_10_cut_for_1_6_p2");
            createTools();
            createColorPalette(true);
            setupInteraction('cut_one_to_3');
            showFtue(document.querySelector('[data-tool="scissor-3"]'));
            break;

        case 11:
            updateInstructions("step_11_color_1_6");
            createColorPalette(false);
            document.getElementById('equipment-area').style.opacity = 0;
            setupColoringInteraction(12);
            showFtue(document.querySelector('.color-palette-container'));
            break;

        case 12:
            updateInstructions("step_12_mcq_1_6", { paperStroke: T.gameConfig.paperStroke });
            const stepInfo12 = T.instructions.step_12_mcq_1_6;
            createMcq(stepInfo12.options, stepInfo12.correctAnswer, () => {
                setFeedbackState(true);
                delay(1500).then(() => renderStep(12.5, { html: activityArea.innerHTML }));
            });
            break;

        case 12.5:
            updateInstructions("step_12_5_observe");
            await delay(500);
            await animateNumbering();
            delay(1000).then(() => renderStep(13, { html: activityArea.innerHTML }));
            break;

        case 13:
            appletContainer.classList.add("initial-state");
            updateInstructions("step_13_conclusion");
            nextButton.textContent = T.button_texts.start_over;
            nextButton.disabled = false;
            showFtue(nextButton);

            // Signal completion to parent React app after 2.5 seconds with loading indicator
            setTimeout(() => {
                showCompletionLoader();
            }, 2500);
            break;
    }
}

function resetStepState() {
    activityArea.innerHTML = "";
    equipmentArea.innerHTML = "";
    document.querySelector(".context-section .mcq-option-container")?.remove();

    appletContainer.classList.remove("initial-state");
    nextButton.disabled = true;
    nextButton.textContent = T.button_texts.next;

    hideFtue();
    setFeedbackState(null);
    selectedTool = null;
    selectedPaper = null;
    isAnimating = false;
}

// =========================
// Element Creation
// =========================
function createPaper() {
    const container = document.createElement("div");
    container.className = "paper-container";
    container.style.width = `${PAPER_SIZE}vw`;
    container.style.height = `${PAPER_SIZE}vw`;

    const piece = document.createElement('div');
    piece.className = 'paper-piece';
    piece.style.width = '100%';
    piece.style.height = '100%';
    piece.style.backgroundColor = T.gameConfig.paperColor;

    container.appendChild(piece);
    activityArea.appendChild(container);
}

function createPreCutPaper(pieces, direction) {
    const container = document.createElement("div");
    container.className = "paper-container";
    container.style.width = `${PAPER_SIZE}vw`;
    container.style.height = `${PAPER_SIZE}vw`;
    container.style.display = 'grid';
    container.style.gap = '0.5vw';

    if (direction === 'vertical') {
        container.style.gridTemplateColumns = `repeat(${pieces}, 1fr)`;
    } else {
        container.style.gridTemplateRows = `repeat(${pieces}, 1fr)`;
    }

    for (let i = 0; i < pieces; i++) {
        const p = document.createElement('div');
        p.className = 'paper-piece';
        p.style.backgroundColor = T.gameConfig.paperColor;
        container.appendChild(p);
    }
    activityArea.appendChild(container);
}

function createTools() {
    equipmentArea.innerHTML = '';
    document.getElementById('equipment-area').style.opacity = 1;
    createTool("scissor-2", T.item_images.scissor, "25%", "50%");
    createTool("scissor-3", T.item_images.scissor_3, "55%", "50%");
    createTool("glue_gun", T.item_images.glue_gun, "85%", "50%").classList.add('disabled');
}

function createTool(toolName, imgSrc, top, left) {
    const tool = document.createElement("div");
    tool.className = "tool-item";
    tool.dataset.tool = toolName;
    tool.innerHTML = `<img src="${imgSrc}" alt="${toolName}">`;
    tool.style.top = top;
    tool.style.left = left;
    tool.style.transform = "translate(-50%, -50%)";
    equipmentArea.appendChild(tool);
    return tool;
}

function createColorPalette(disabled = false) {
    document.querySelector('.color-palette-container')?.remove();
    const paletteContainer = document.createElement("div");
    paletteContainer.className = "color-palette-container";
    if (disabled) paletteContainer.classList.add('disabled');
    T.gameConfig.colors.forEach(color => {
        const swatch = document.createElement("div");
        swatch.className = "color-swatch";
        swatch.style.backgroundColor = color.value;
        swatch.dataset.colorValue = color.value;
        paletteContainer.appendChild(swatch);
    });
    activityArea.appendChild(paletteContainer);
}

function createMcq(options, correctAnswer, onSuccess) {
    const container = document.createElement("div");
    container.className = "mcq-option-container";
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'btn mcq-btn';
        btn.innerHTML = option.display;
        btn.dataset.value = option.value;
        btn.addEventListener("click", () => {
            audioPlay("click");
            container.querySelectorAll(".mcq-btn").forEach(b => b.disabled = true);
            if (btn.dataset.value === correctAnswer) {
                btn.classList.add("correct");
                onSuccess();
            } else {
                btn.classList.add("incorrect");
                setFeedbackState(false);
                setTimeout(() => {
                    btn.classList.remove("incorrect");
                    setFeedbackState(null);
                    container.querySelectorAll(".mcq-btn").forEach(b => b.disabled = false);
                }, 1500);
            }
        });
        container.appendChild(btn);
    });
    document.querySelector(".context-section").appendChild(container);
}

// =========================
// Interaction Logic
// =========================
function setupInteraction(action) {
    const tools = document.querySelectorAll('.tool-item:not(.disabled)');
    const papers = document.querySelectorAll(".paper-piece");

    tools.forEach(tool => tool.style.pointerEvents = 'auto');
    papers.forEach(paper => paper.style.pointerEvents = 'auto');

    const handleToolClick = (e) => {
        if (isAnimating) return;
        selectedTool = e.currentTarget;
        tools.forEach((t) => t.classList.remove("selected"));
        selectedTool.classList.add("selected");
        audioPlay("click");
        const targetPaper = activityArea.querySelector(".paper-piece");
        hideFtue();
        showFtue(targetPaper);
    };

    const handlePaperClick = (e) => {
        if (isAnimating || !selectedTool) return;
        selectedPaper = e.currentTarget;
        isAnimating = true;
        hideFtue();
        audioPlay("click");
        animateAndPerformAction(action, selectedTool, selectedPaper);
    };

    tools.forEach((tool) => tool.addEventListener("click", handleToolClick));
    papers.forEach((paper) => {
        if (!paper.querySelector('.paper-piece')) {
            paper.addEventListener("click", handlePaperClick);
        }
    });
}

function setupColoringInteraction(nextStep) {
    const allPieces = Array.from(document.querySelectorAll('.paper-piece'));
    const leafPieces = allPieces.filter(p => !p.querySelector('.paper-piece'));
    const colorablePieces = [];

    if (leafPieces.length > 1) {
        const areas = leafPieces.map(p => p.getBoundingClientRect().width * p.getBoundingClientRect().height);
        const minArea = Math.min(...areas);
        leafPieces.forEach(piece => {
            const area = piece.getBoundingClientRect().width * piece.getBoundingClientRect().height;
            if (Math.abs(area - minArea) < 20) {
                colorablePieces.push(piece);
                piece.classList.remove('disabled');
                piece.style.pointerEvents = 'auto';
            } else {
                piece.classList.add('disabled');
                piece.style.pointerEvents = 'none';
            }
        });
    } else {
        colorablePieces.push(...leafPieces);
    }

    document.querySelector('.color-palette-container')?.classList.remove('disabled');

    let selectedSwatch = null;
    document.querySelectorAll(".color-swatch").forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            if (isAnimating) return;
            audioPlay('click');
            selectedSwatch = e.currentTarget;
            selectedColor = { value: selectedSwatch.dataset.colorValue };
            document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove('selected'));
            selectedSwatch.classList.add('selected');
            hideFtue();
            if (colorablePieces.length > 0) {
                showFtue(colorablePieces[0]);
            }
        });
    });

    colorablePieces.forEach((piece) => {
        piece.addEventListener('click', (e) => {
            if (isAnimating || !selectedSwatch) return;
            e.stopPropagation();
            hideFtue();
            isAnimating = true;
            audioPlay('paint');
            e.currentTarget.style.backgroundColor = selectedColor.value;
            setFeedbackState(true);
            document.querySelector('.color-palette-container').classList.add('disabled');
            document.querySelectorAll('.paper-piece').forEach(p => p.classList.add('disabled'));
            delay(1000).then(() => renderStep(nextStep, { html: activityArea.innerHTML }));
        });
    });
}

// =========================
// Animations & Main Action
// =========================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function animateAndPerformAction(action, tool, paper) {
    document.querySelectorAll(".tool-item, .paper-piece").forEach((el) => el.style.pointerEvents = "none");

    const originalTop = tool.style.top;
    const originalLeft = tool.style.left;

    const selectedToolName = tool.dataset.tool;
    const isScissor3 = selectedToolName === 'scissor-3';
    const piecesToMake = isScissor3 ? 3 : 2;

    const currentAction = actionMap[action];
    const { cutDirection } = currentAction.config;
    const isCorrectTool = selectedToolName === currentAction.config.tool;

    const toolRect = tool.getBoundingClientRect();
    const paperRect = paper.getBoundingClientRect();
    const equipmentAreaRect = equipmentArea.getBoundingClientRect();
    const isVertical = cutDirection === 'vertical';
    const numberOfCuts = piecesToMake - 1;

    tool.style.transition = "all 0.5s ease-in-out";

    for (let i = 1; i <= numberOfCuts; i++) {
        const pos = i / piecesToMake;
        let startX, startY, endX, endY;

        if (isVertical) {
            const cutLineX = paperRect.left + paperRect.width * pos;
            startX = cutLineX - toolRect.width / 2;
            endX = startX;
            startY = paperRect.bottom - toolRect.height / 2;
            endY = paperRect.top - toolRect.height / 4;
        } else { // Horizontal
            const cutLineY = paperRect.top + paperRect.height * pos;
            startY = cutLineY - toolRect.height / 2;
            endY = startY;
            startX = paperRect.left - toolRect.width / 2;
            endX = paperRect.right - toolRect.width / 2;
        }

        tool.style.transform = `translate(0, 0) rotate(${isVertical ? 0 : 90}deg)`;
        tool.style.left = `${startX - equipmentAreaRect.left}px`;
        tool.style.top = `${startY - equipmentAreaRect.top}px`;
        await delay(400);

        audioPlay("cut");
        tool.style.left = `${endX - equipmentAreaRect.left}px`;
        tool.style.top = `${endY - equipmentAreaRect.top}px`;
        await delay(500);
    }

    tool.style.transition = "top 0.4s ease-in-out, left 0.4s ease-in-out, transform 0.3s ease";
    tool.style.transform = "translate(-50%, -50%) rotate(0deg)";
    tool.style.top = originalTop;
    tool.style.left = originalLeft;
    await delay(400);

    paper.innerHTML = '';
    paper.style.display = 'grid';
    paper.style.padding = '0';
    paper.style.cursor = 'default';
    paper.style.backgroundColor = 'transparent';
    paper.style.border = 'none';
    paper.style.filter = 'none';

    if (isVertical) {
        paper.style.gridTemplateColumns = `repeat(${piecesToMake}, 1fr)`;
        paper.style.gridTemplateRows = '1fr';
    } else {
        paper.style.gridTemplateRows = `repeat(${piecesToMake}, 1fr)`;
        paper.style.gridTemplateColumns = '1fr';
    }
    paper.style.gap = '0.5vw';

    for (let i = 0; i < piecesToMake; i++) {
        const p = document.createElement('div');
        p.className = 'paper-piece';
        p.style.backgroundColor = T.gameConfig.paperColor;
        paper.appendChild(p);
    }

    if (!isCorrectTool) {
        handleIncorrectTool(currentAction.failKey);
        document.querySelectorAll(".tool-item:not(.disabled)").forEach(t => t.classList.add('disabled'));
        isAnimating = false;
        return;
    }

    renderStep(currentAction.finalStep, { html: activityArea.innerHTML });
}

async function createAndAnimateNumber(piece, number, position = { top: '50%', left: '50%' }) {
    if (!piece) {
        console.error("createAndAnimateNumber called with an undefined piece for number:", number);
        return;
    }
    const numberOverlay = document.createElement('div');
    numberOverlay.className = 'number-overlay';
    numberOverlay.textContent = number;
    piece.style.position = 'relative';
    Object.assign(numberOverlay.style, position);
    piece.appendChild(numberOverlay);
    await delay(100);
    audioPlay('count');
    numberOverlay.style.opacity = 1;
    await delay(1000);
}

function addDashedLines(piece, count) {
    if (!piece) return [];
    piece.classList.add('has-lines');
    const lines = [];
    for (let i = 1; i <= count; i++) {
        const line = document.createElement('div');
        line.className = 'dashed-line';
        const position = (100 * i) / (count + 1);
        line.style.top = `${position}%`;
        piece.appendChild(line);
        lines.push(line);
    }
    // Animate them to appear
    setTimeout(() => {
        lines.forEach(l => l.style.opacity = 0.7);
    }, 100);
    return lines;
}

function handleIncorrectTool(instructionKey) {
    updateInstructions(instructionKey);
    setFeedbackState(false);
    nextButton.textContent = T.button_texts.reset;
    nextButton.disabled = false;
    showFtue(nextButton);
}

async function animateNumbering() {
    isAnimating = true;
    const allPieces = Array.from(activityArea.querySelectorAll('.paper-piece'));
    const leafPieces = allPieces.filter(p => !p.querySelector('.paper-piece'));

    // Sort pieces deterministically: top-to-bottom, then left-to-right
    const sortedPieces = leafPieces.sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        if (Math.abs(rectA.top - rectB.top) > 5) return rectA.top - rectB.top;
        return rectA.left - rectB.left;
    });

    const areas = sortedPieces.map(p => p.getBoundingClientRect().width * p.getBoundingClientRect().height);
    const maxArea = Math.max(...areas);
    const uncutPiece = sortedPieces.find(p => (p.getBoundingClientRect().width * p.getBoundingClientRect().height) >= maxArea * 0.95);
    const cutPieces = sortedPieces.filter(p => p !== uncutPiece);

    // This array will hold the final, ordered list of animations to perform
    const animationSteps = [];
    let dashedLines = [];

    // Scenario for 1/4 (creates 3 physical pieces)
    if (cutPieces.length === 2 && uncutPiece) {
        // Add one horizontal dashed line to show the virtual cut
        dashedLines = addDashedLines(uncutPiece, 1);

        const uncutIsOnTheRight = uncutPiece.getBoundingClientRect().left > cutPieces[0].getBoundingClientRect().left;

        // Define the 4 clockwise slots {piece, position}
        const topLeft = { piece: null, position: { top: '50%', left: '50%' } };
        const topRight = { piece: null, position: { top: '50%', left: '50%' } };
        const bottomRight = { piece: null, position: { top: '50%', left: '50%' } };
        const bottomLeft = { piece: null, position: { top: '50%', left: '50%' } };

        if (uncutIsOnTheRight) {
            // Left column was cut, right one is intact
            topLeft.piece = cutPieces[0];
            bottomLeft.piece = cutPieces[1];
            topRight.piece = uncutPiece;
            topRight.position = { top: '25%', left: '50%' };
            bottomRight.piece = uncutPiece;
            bottomRight.position = { top: '75%', left: '50%' };
        } else {
            // Right column was cut, left one is intact
            topRight.piece = cutPieces[0];
            bottomRight.piece = cutPieces[1];
            topLeft.piece = uncutPiece;
            topLeft.position = { top: '25%', left: '50%' };
            bottomLeft.piece = uncutPiece;
            bottomLeft.position = { top: '75%', left: '50%' };
        }

        // Push animation steps in clockwise order: 1.TL, 2.TR, 3.BR, 4.BL
        animationSteps.push(topLeft, topRight, bottomRight, bottomLeft);

        // Scenario for 1/6 (creates 4 physical pieces after a vertical and a horizontal cut)
    } else if (cutPieces.length === 3 && uncutPiece) {
        // Add two horizontal dashed lines to show the virtual cuts
        dashedLines = addDashedLines(uncutPiece, 2);

        const uncutIsOnTheRight = uncutPiece.getBoundingClientRect().left > cutPieces[0].getBoundingClientRect().left;

        const topLeft = { piece: null, position: { top: '50%', left: '50%' } };
        const midLeft = { piece: null, position: { top: '50%', left: '50%' } };
        const bottomLeft = { piece: null, position: { top: '50%', left: '50%' } };
        const topRight = { piece: null, position: { top: '50%', left: '50%' } };
        const midRight = { piece: null, position: { top: '50%', left: '50%' } };
        const bottomRight = { piece: null, position: { top: '50%', left: '50%' } };

        if (uncutIsOnTheRight) {
            // Left column was cut into 3 pieces
            topLeft.piece = cutPieces[0];
            midLeft.piece = cutPieces[1];
            bottomLeft.piece = cutPieces[2];
            // Right column (uncut) represents 3 virtual pieces
            topRight.piece = uncutPiece;
            topRight.position = { top: '16.6%', left: '50%' };
            midRight.piece = uncutPiece;
            midRight.position = { top: '50%', left: '50%' };
            bottomRight.piece = uncutPiece;
            bottomRight.position = { top: '83.3%', left: '50%' };
        } else {
            // Right column was cut into 3 pieces
            topRight.piece = cutPieces[0];
            midRight.piece = cutPieces[1];
            bottomRight.piece = cutPieces[2];
            // Left column (uncut) represents 3 virtual pieces
            topLeft.piece = uncutPiece;
            topLeft.position = { top: '16.6%', left: '50%' };
            midLeft.piece = uncutPiece;
            midLeft.position = { top: '50%', left: '50%' };
            bottomLeft.piece = uncutPiece;
            bottomLeft.position = { top: '83.3%', left: '50%' };
        }

        // Push animation steps in a clockwise cycle
        animationSteps.push(topLeft, topRight, midRight, bottomRight, bottomLeft, midLeft);
    }

    // Execute the animation steps sequentially
    for (let i = 0; i < animationSteps.length; i++) {
        const step = animationSteps[i];
        if (step && step.piece) {
            await createAndAnimateNumber(step.piece, i + 1, step.position);
        }
    }

    isAnimating = false;
}

function updateInstructions(key, params = {}) {
    const instruction = T.instructions[key];
    if (instruction) {
        const text = typeof instruction.text === "function" ? instruction.text(params) : instruction.text;
        document.querySelector(".context-section").innerHTML = `<h2>${instruction.title}</h2><div><p>${text}</p></div>`;
    }
}

function showFtue(element) {
    if (!element || !handFtue) return;
    setTimeout(() => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 1) return;
        handFtue.style.left = `${rect.left + rect.width / 2}px`;
        handFtue.style.top = `${rect.top + rect.height / 2}px`;
        handFtue.classList.add("hand-animating");
    }, 500);
}

function hideFtue() {
    if (handFtue) handFtue.classList.remove("hand-animating");
}

function setFeedbackState(isCorrect) {
    contextBox.classList.remove("correct", "incorrect");
    if (isCorrect === true) {
        contextBox.classList.add("correct");
        setJaxPose('correct');
        audioPlay('correct');
    } else if (isCorrect === false) {
        contextBox.classList.add("incorrect");
        setJaxPose('wrong');
        audioPlay('wrong');
    } else {
        setJaxPose('normal');
    }
}

function setJaxPose(pose) {
    if (T.character_images[pose]) {
        characterImageEl.src = T.character_images[pose];
    }
}

function audioPlay(type) {
    if (T.audio[type]) {
        new Audio(T.audio[type]).play().catch(() => { });
    }
}

function showCompletionLoader() {
    // Create overlay with loading bar
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

    // Animate loading bar
    setTimeout(() => {
        loaderBar.style.width = '100%';
    }, 50);

    // Send completion message to parent after 2.5 seconds
    setTimeout(() => {
        window.parent.postMessage({ type: 'ASSET_COMPLETE' }, '*');
    }, 2500);
}

document.addEventListener("DOMContentLoaded", initApp);