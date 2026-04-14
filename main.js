import {
  createInitialState,
  createFoodCharacters,
  createFoodPositions,
  queueDirection,
  stepGame,
} from "./snake-logic.js";

const GRID_SIZE = 16;
const TICK_MS = 150;
const DEFAULT_LANGUAGE = "ja";
const DEFAULT_MODE = "basic";
const currentPage = document.body.dataset.page ?? "language";
const speechSynthesisApi = window.speechSynthesis;

const LANGUAGE_CONFIG = {
  ja: {
    code: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    speechLang: "ja-JP",
    title: "Snake Kana Trainer",
    glyphName: "Hiragana",
    idleHint: "Hit a Hiragana block to see its English sound.",
    advancedStatus: "Collect only the matching Hiragana and avoid the wrong one.",
    basicCopy: "Basic: one Hiragana food block at a time.",
    advancedCopy: "Advanced: hear one target sound, then collect only the matching Hiragana.",
    characters: [
      "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
      "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
      "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
      "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り",
      "る", "れ", "ろ", "わ", "を", "ん",
    ],
    translations: {
      あ: "a",
      い: "i",
      う: "u",
      え: "e",
      お: "o",
      か: "ka",
      き: "ki",
      く: "ku",
      け: "ke",
      こ: "ko",
      さ: "sa",
      し: "shi",
      す: "su",
      せ: "se",
      そ: "so",
      た: "ta",
      ち: "chi",
      つ: "tsu",
      て: "te",
      と: "to",
      な: "na",
      に: "ni",
      ぬ: "nu",
      ね: "ne",
      の: "no",
      は: "ha",
      ひ: "hi",
      ふ: "fu",
      へ: "he",
      ほ: "ho",
      ま: "ma",
      み: "mi",
      む: "mu",
      め: "me",
      も: "mo",
      や: "ya",
      ゆ: "yu",
      よ: "yo",
      ら: "ra",
      り: "ri",
      る: "ru",
      れ: "re",
      ろ: "ro",
      わ: "wa",
      を: "wo",
      ん: "n",
    },
  },
  ta: {
    code: "ta",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    speechLang: "ta-IN",
    title: "Snake Tamil Trainer",
    glyphName: "Tamil letter",
    idleHint: "Hit a Tamil letter block to see its sound.",
    advancedStatus: "Collect only the matching Tamil letter and avoid the wrong one.",
    basicCopy: "Basic: one Tamil letter food block at a time.",
    advancedCopy: "Advanced: hear one target sound, then collect only the matching Tamil letter.",
    characters: [
      "அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ",
      "ஓ", "ஔ", "க", "ங", "ச", "ஞ", "ட", "ண", "த", "ந",
      "ப", "ம", "ய", "ர", "ல", "வ", "ழ", "ள", "ற", "ன",
    ],
    translations: {
      அ: "a",
      ஆ: "aa",
      இ: "i",
      ஈ: "ii",
      உ: "u",
      ஊ: "uu",
      எ: "e",
      ஏ: "ee",
      ஐ: "ai",
      ஒ: "o",
      ஓ: "oo",
      ஔ: "au",
      க: "ka",
      ங: "nga",
      ச: "ca",
      ஞ: "nya",
      ட: "tta",
      ண: "nna",
      த: "tha",
      ந: "na",
      ப: "pa",
      ம: "ma",
      ய: "ya",
      ர: "ra",
      ல: "la",
      வ: "va",
      ழ: "zha",
      ள: "lla",
      ற: "rra",
      ன: "na",
    },
  },
  hi: {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    speechLang: "hi-IN",
    title: "Snake Hindi Trainer",
    glyphName: "Devanagari letter",
    idleHint: "Hit a Devanagari block to see its sound.",
    advancedStatus: "Collect only the matching Devanagari letter and avoid the wrong one.",
    basicCopy: "Basic: one Devanagari food block at a time.",
    advancedCopy: "Advanced: hear one target sound, then collect only the matching Devanagari letter.",
    characters: [
      "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ",
      "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ",
      "ड", "ढ", "त", "थ", "द", "ध", "न", "प", "फ", "ब",
      "भ", "म", "य", "र", "ल", "व", "श", "स", "ह",
    ],
    translations: {
      अ: "a",
      आ: "aa",
      इ: "i",
      ई: "ii",
      उ: "u",
      ऊ: "uu",
      ए: "e",
      ऐ: "ai",
      ओ: "o",
      औ: "au",
      क: "ka",
      ख: "kha",
      ग: "ga",
      घ: "gha",
      च: "cha",
      छ: "chha",
      ज: "ja",
      झ: "jha",
      ट: "ta",
      ठ: "tha",
      ड: "da",
      ढ: "dha",
      त: "ta",
      थ: "tha",
      द: "da",
      ध: "dha",
      न: "na",
      प: "pa",
      फ: "pha",
      ब: "ba",
      भ: "bha",
      म: "ma",
      य: "ya",
      र: "ra",
      ल: "la",
      व: "va",
      श: "sha",
      स: "sa",
      ह: "ha",
    },
  },
};

const INITIAL_SNAKE = [
  { x: 2, y: 8 },
  { x: 1, y: 8 },
  { x: 0, y: 8 },
];

let randomCursor = 0;
let availableVoices = [];
let preferredVoice = null;
let hasUnlockedSpeech = false;
let speechTimeoutId = null;

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function getLanguageFromParams() {
  const params = getSearchParams();
  const language = params.get("language");
  return LANGUAGE_CONFIG[language] ? language : DEFAULT_LANGUAGE;
}

function getModeFromParams() {
  const params = getSearchParams();
  const mode = params.get("mode");
  return mode === "advanced" || mode === "basic" ? mode : DEFAULT_MODE;
}

function buildPageUrl(path, params) {
  const url = new URL(path, window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

function navigateToLanguagePage() {
  window.location.href = buildPageUrl("./index.html", {});
}

function navigateToModePage(language) {
  window.location.href = buildPageUrl("./mode.html", { language });
}

function navigateToGamePage(language, mode) {
  window.location.href = buildPageUrl("./game.html", { language, mode });
}

function selectPreferredVoice(voices, language) {
  const matchingVoices = voices.filter((voice) =>
    voice.lang?.toLowerCase().startsWith(language.code),
  );

  if (matchingVoices.length === 0) {
    return null;
  }

  const preferredNameHints = [
    "female",
    "woman",
    "kyoko",
    "haruka",
    "sakura",
    "naomi",
    "yui",
    "lekha",
    "heera",
    "swara",
  ];

  return (
    matchingVoices.find((voice) =>
      preferredNameHints.some((hint) => voice.name.toLowerCase().includes(hint)),
    ) ?? matchingVoices[0]
  );
}

function loadVoices(language) {
  if (!speechSynthesisApi) {
    return;
  }

  availableVoices = speechSynthesisApi.getVoices();
  preferredVoice = selectPreferredVoice(availableVoices, language);
}

function unlockSpeech(language) {
  if (!speechSynthesisApi || hasUnlockedSpeech) {
    return;
  }

  hasUnlockedSpeech = true;
  loadVoices(language);
  speechSynthesisApi.cancel();
  speechSynthesisApi.resume();
}

function speakCharacter(character, language) {
  if (!speechSynthesisApi || !character) {
    return;
  }

  loadVoices(language);

  const utterance = new SpeechSynthesisUtterance(character);
  utterance.lang = language.speechLang;
  utterance.rate = 0.9;
  utterance.pitch = 1.1;

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (speechTimeoutId) {
    window.clearTimeout(speechTimeoutId);
  }

  speechSynthesisApi.cancel();
  speechTimeoutId = window.setTimeout(() => {
    speechSynthesisApi.resume();
    speechSynthesisApi.speak(utterance);
    speechTimeoutId = null;
  }, 80);
}

function nextRandomIndex() {
  randomCursor += 7;
  return randomCursor;
}

function cloneChallenge(challenge) {
  return {
    foods: challenge.foods.map((food) => ({ ...food })),
    foodCharacters: [...challenge.foodCharacters],
    targetFoodIndex: challenge.targetFoodIndex,
  };
}

function getAdjacentPositions(position) {
  const positions = [];

  for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
    for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
      positions.push({
        x: position.x + xOffset,
        y: position.y + yOffset,
      });
    }
  }

  return positions;
}

function createChallenge(mode, language, snake = INITIAL_SNAKE) {
  const randomIndex = nextRandomIndex();
  const foodCount = mode === "advanced" ? 2 : 1;
  const foods = createFoodPositions(GRID_SIZE, GRID_SIZE, snake, foodCount, randomIndex);
  const foodCharacters = createFoodCharacters(foodCount, randomIndex, language.characters);

  return {
    foods,
    foodCharacters,
    targetFoodIndex: mode === "advanced" ? Math.abs(randomIndex) % foodCount : 0,
  };
}

function createGameStateFromChallenge(challenge, language) {
  return createInitialState({
    width: GRID_SIZE,
    height: GRID_SIZE,
    characters: language.characters,
    foods: challenge.foods.map((food) => ({ ...food })),
    foodCharacters: [...challenge.foodCharacters],
    targetFoodIndex: challenge.targetFoodIndex,
  });
}

function getCharacterTranslation(language, character) {
  return language.translations[character] ?? "";
}

function initLanguagePage() {
  const languageButtons = document.querySelectorAll("[data-language]");

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const languageCode = button.dataset.language;
      const language = LANGUAGE_CONFIG[languageCode] ?? LANGUAGE_CONFIG[DEFAULT_LANGUAGE];
      unlockSpeech(language);
      navigateToModePage(languageCode);
    });
  });
}

function initModePage() {
  const selectedLanguage = getLanguageFromParams();
  const language = LANGUAGE_CONFIG[selectedLanguage];
  const modeTitleElement = document.querySelector("#mode-title");
  const modeCopyBasicElement = document.querySelector("#mode-copy-basic");
  const modeCopyAdvancedElement = document.querySelector("#mode-copy-advanced");
  const modeButtons = document.querySelectorAll("[data-mode]");
  const backButton = document.querySelector("#back-to-language");

  modeTitleElement.textContent = `${language.title} (${language.nativeLabel})`;
  modeCopyBasicElement.textContent = language.basicCopy;
  modeCopyAdvancedElement.textContent = language.advancedCopy;

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      unlockSpeech(language);
      navigateToGamePage(selectedLanguage, button.dataset.mode);
    });
  });

  backButton.addEventListener("click", navigateToLanguagePage);
}

function initGamePage() {
  const selectedLanguage = getLanguageFromParams();
  const selectedMode = getModeFromParams();
  const language = LANGUAGE_CONFIG[selectedLanguage];
  const boardElement = document.querySelector("#game-board");
  const scoreElement = document.querySelector("#score");
  const statusElement = document.querySelector("#status");
  const modeSubtitleElement = document.querySelector("#mode-subtitle");
  const startButton = document.querySelector("#start-button");
  const pauseButton = document.querySelector("#pause-button");
  const restartButton = document.querySelector("#restart-button");
  const characterLabelElement = document.querySelector("#character-label");
  const characterSymbolElement = document.querySelector("#character-symbol");
  const characterTranslationElement = document.querySelector("#character-translation");
  const controlButtons = document.querySelectorAll("[data-direction]");

  let tickHandle = null;
  let currentChallenge = createChallenge(selectedMode, language);
  let lastHitCharacter = null;
  let hitEffect = null;
  let hitEffectTimeoutId = null;
  let gameState = createGameStateFromChallenge(currentChallenge, language);

  modeSubtitleElement.textContent =
    selectedMode === "advanced"
      ? `Hear the target sound and collect only the matching ${language.glyphName.toLowerCase()}.`
      : `Classic grid movement with one ${language.glyphName.toLowerCase()} food block at a time.`;

  function triggerHitEffect(position, tone) {
    hitEffect = {
      tone,
      positions: getAdjacentPositions(position),
    };

    if (hitEffectTimeoutId) {
      window.clearTimeout(hitEffectTimeoutId);
    }

    render();
    hitEffectTimeoutId = window.setTimeout(() => {
      hitEffect = null;
      hitEffectTimeoutId = null;
      render();
    }, 500);
  }

  function startAdvancedPrompt() {
    if (selectedMode !== "advanced" || !currentChallenge) {
      return;
    }

    const targetCharacter = currentChallenge.foodCharacters[currentChallenge.targetFoodIndex];
    speakCharacter(targetCharacter, language);
  }

  function buildBoard() {
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("role", "gridcell");
      fragment.append(cell);
    }

    boardElement.append(fragment);
  }

  function drawBoard() {
    const cells = boardElement.children;

    for (let index = 0; index < cells.length; index += 1) {
      cells[index].className = "cell";
      cells[index].textContent = "";
    }

    gameState.foods.forEach((food, index) => {
      const foodIndex = food.y * GRID_SIZE + food.x;
      cells[foodIndex].classList.add("food");
      cells[foodIndex].textContent = gameState.foodCharacters[index] ?? "";
    });

    if (hitEffect) {
      hitEffect.positions.forEach((position) => {
        if (
          position.x < 0 ||
          position.y < 0 ||
          position.x >= GRID_SIZE ||
          position.y >= GRID_SIZE
        ) {
          return;
        }

        const effectIndex = position.y * GRID_SIZE + position.x;
        cells[effectIndex].classList.add("hit-effect", `hit-effect-${hitEffect.tone}`);
      });
    }

    gameState.snake.forEach((segment, index) => {
      const segmentIndex = segment.y * GRID_SIZE + segment.x;
      cells[segmentIndex].classList.add("snake");
      if (index === 0) {
        cells[segmentIndex].classList.add("head");
      }
    });
  }

  function updateStatus() {
    scoreElement.textContent = String(gameState.score);

    if (gameState.status === "idle") {
      statusElement.textContent =
        selectedMode === "advanced"
          ? "Press Start, then collect only the spoken character."
          : "Press Start to play.";
      pauseButton.textContent = "Pause";
      return;
    }

    if (gameState.status === "paused") {
      statusElement.textContent = "Game paused.";
      pauseButton.textContent = "Resume";
      return;
    }

    if (gameState.status === "game-over") {
      statusElement.textContent = "Game over. Press Restart to try again.";
      pauseButton.textContent = "Pause";
      return;
    }

    statusElement.textContent =
      selectedMode === "advanced"
        ? language.advancedStatus
        : "Collect food and avoid yourself.";
    pauseButton.textContent = "Pause";
  }

  function updateCharacterDisplay() {
    if (selectedMode === "advanced" && currentChallenge) {
      const targetCharacter = currentChallenge.foodCharacters[currentChallenge.targetFoodIndex];
      characterLabelElement.textContent = "Find this sound";
      characterSymbolElement.textContent = "";
      characterSymbolElement.classList.add("is-hidden");
      characterTranslationElement.textContent = getCharacterTranslation(language, targetCharacter);
      return;
    }

    characterLabelElement.textContent = "Last character";
    characterSymbolElement.classList.remove("is-hidden");

    if (!lastHitCharacter) {
      characterSymbolElement.textContent = "-";
      characterTranslationElement.textContent = language.idleHint;
      return;
    }

    characterSymbolElement.textContent = lastHitCharacter;
    characterTranslationElement.textContent = getCharacterTranslation(language, lastHitCharacter);
  }

  function render() {
    drawBoard();
    updateStatus();
    updateCharacterDisplay();
  }

  function stopLoop() {
    if (tickHandle) {
      window.clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  function ensureFood(state) {
    if (state.foods.length > 0) {
      return state;
    }

    currentChallenge = createChallenge(selectedMode, language, state.snake);

    return {
      ...createGameStateFromChallenge(currentChallenge, language),
      snake: state.snake,
      direction: state.direction,
      queuedDirection: state.queuedDirection,
      score: state.score,
      status: state.status,
    };
  }

  function runTick() {
    const previousFoods = gameState.foods.map((food) => ({ ...food }));
    const previousCharacters = [...gameState.foodCharacters];
    const previousTargetIndex = gameState.targetFoodIndex;
    const previousScore = gameState.score;
    const steppedState = stepGame(gameState, nextRandomIndex());

    if (steppedState.score > previousScore) {
      const consumedFoodIndex = steppedState.consumedFoodIndex;
      const eatenCharacter = previousCharacters[consumedFoodIndex];

      if (selectedMode === "advanced") {
        const hitCorrectCharacter = consumedFoodIndex === previousTargetIndex;

        if (!hitCorrectCharacter) {
          currentChallenge = cloneChallenge({
            foods: createFoodPositions(
              GRID_SIZE,
              GRID_SIZE,
              steppedState.snake,
              previousCharacters.length,
              nextRandomIndex(),
            ),
            foodCharacters: previousCharacters,
            targetFoodIndex: previousTargetIndex,
          });
          gameState = {
            ...createGameStateFromChallenge(currentChallenge, language),
            snake: [...steppedState.snake.slice(0, -1)],
            direction: steppedState.direction,
            queuedDirection: steppedState.queuedDirection,
            score: previousScore,
            status: "running",
          };
          triggerHitEffect(previousFoods[consumedFoodIndex], "wrong");
          startAdvancedPrompt();
        } else {
          currentChallenge = createChallenge("advanced", language, steppedState.snake);
          gameState = {
            ...createGameStateFromChallenge(currentChallenge, language),
            snake: steppedState.snake,
            direction: steppedState.direction,
            queuedDirection: steppedState.queuedDirection,
            score: previousScore + 1,
            status: "running",
          };
          triggerHitEffect(previousFoods[consumedFoodIndex], "correct");
          startAdvancedPrompt();
        }
      } else {
        lastHitCharacter = eatenCharacter;
        speakCharacter(eatenCharacter, language);
        gameState = ensureFood({
          ...steppedState,
          consumedFoodIndex: null,
        });
      }
    } else {
      gameState = ensureFood(steppedState);
    }

    if (gameState.status === "game-over") {
      stopLoop();
    }

    render();
  }

  function startGame() {
    unlockSpeech(language);

    if (gameState.status === "running") {
      return;
    }

    gameState = { ...ensureFood(gameState), status: "running" };
    stopLoop();
    tickHandle = window.setInterval(runTick, TICK_MS);
    render();

    if (selectedMode === "advanced") {
      startAdvancedPrompt();
    }
  }

  function togglePause() {
    if (gameState.status === "idle" || gameState.status === "game-over") {
      return;
    }

    if (gameState.status === "paused") {
      startGame();
      return;
    }

    gameState = { ...gameState, status: "paused" };
    stopLoop();
    render();
  }

  function restartGame() {
    stopLoop();
    lastHitCharacter = null;
    currentChallenge = createChallenge(selectedMode, language);
    gameState = createGameStateFromChallenge(currentChallenge, language);
    render();
  }

  function handleDirectionInput(direction) {
    unlockSpeech(language);

    const queued = queueDirection(gameState, direction);
    if (queued !== gameState) {
      gameState = queued;
    }

    if (gameState.status === "idle") {
      startGame();
    }
  }

  function handleKeydown(event) {
    const key = event.key.toLowerCase();
    const directionMap = {
      arrowup: "up",
      w: "up",
      arrowdown: "down",
      s: "down",
      arrowleft: "left",
      a: "left",
      arrowright: "right",
      d: "right",
    };

    if (event.code === "Enter" || key === "enter") {
      event.preventDefault();
      startGame();
      return;
    }

    if (event.code === "Space" || key === " ") {
      event.preventDefault();
      togglePause();
      return;
    }

    const direction = directionMap[key];
    if (!direction) {
      return;
    }

    event.preventDefault();
    handleDirectionInput(direction);
  }

  startButton.addEventListener("click", startGame);
  pauseButton.addEventListener("click", togglePause);
  restartButton.addEventListener("click", restartGame);
  document.addEventListener("keydown", handleKeydown);

  controlButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleDirectionInput(button.dataset.direction);
    });
  });

  if (speechSynthesisApi) {
    loadVoices(language);
    speechSynthesisApi.addEventListener("voiceschanged", () => loadVoices(language));
  }

  buildBoard();
  render();
}

if (currentPage === "language") {
  initLanguagePage();
} else if (currentPage === "mode") {
  initModePage();
} else if (currentPage === "game") {
  initGamePage();
}
