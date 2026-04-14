export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTION = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export const DEFAULT_CHARACTERS = [
  "あ",
  "い",
  "う",
  "え",
  "お",
  "か",
  "き",
  "く",
  "け",
  "こ",
  "さ",
  "し",
  "す",
  "せ",
  "そ",
  "た",
  "ち",
  "つ",
  "て",
  "と",
  "な",
  "に",
  "ぬ",
  "ね",
  "の",
  "は",
  "ひ",
  "ふ",
  "へ",
  "ほ",
  "ま",
  "み",
  "む",
  "め",
  "も",
  "や",
  "ゆ",
  "よ",
  "ら",
  "り",
  "る",
  "れ",
  "ろ",
  "わ",
  "を",
  "ん",
];

export function createInitialState(config = {}) {
  const width = config.width ?? 16;
  const height = config.height ?? 16;
  const snake = config.snake ?? [
    { x: 2, y: 8 },
    { x: 1, y: 8 },
    { x: 0, y: 8 },
  ];
  const direction = config.direction ?? "right";
  const queuedDirection = config.queuedDirection ?? direction;
  const randomIndex = config.randomIndex ?? 0;
  const foods =
    config.foods ??
    (config.food
      ? [config.food]
      : createFoodPositions(width, height, snake, config.foodCount ?? 1, randomIndex));
  const foodCharacters =
    config.foodCharacters ??
    (config.foodCharacter
      ? [config.foodCharacter]
      : createFoodCharacters(foods.length, randomIndex, config.characters));
  const targetFoodIndex = config.targetFoodIndex ?? 0;

  return {
    width,
    height,
    snake,
    direction,
    queuedDirection,
    foods,
    foodCharacters,
    targetFoodIndex,
    score: config.score ?? 0,
    status: config.status ?? "idle",
    consumedFoodIndex: null,
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTIONS[nextDirection]) {
    return state;
  }

  if (state.snake.length > 1 && OPPOSITE_DIRECTION[state.direction] === nextDirection) {
    return state;
  }

  return { ...state, queuedDirection: nextDirection };
}

export function stepGame(state, randomIndex = 0) {
  if (state.status !== "running") {
    return state;
  }

  const nextDirection = state.queuedDirection;
  const movement = DIRECTIONS[nextDirection];
  const nextHead = wrapPosition(
    {
    x: state.snake[0].x + movement.x,
    y: state.snake[0].y + movement.y,
    },
    state.width,
    state.height,
  );

  const consumedFoodIndex = state.foods.findIndex((food) => positionsEqual(nextHead, food));
  const willEatFood = consumedFoodIndex >= 0;
  const nextSnake = [nextHead, ...state.snake];

  if (!willEatFood) {
    nextSnake.pop();
  }

  const bodyToCheck = nextSnake.slice(1);
  if (bodyToCheck.some((segment) => positionsEqual(segment, nextHead))) {
    return { ...state, direction: nextDirection, status: "game-over" };
  }

  return {
    ...state,
    direction: nextDirection,
    snake: nextSnake,
    foods: willEatFood
      ? state.foods.filter((_, index) => index !== consumedFoodIndex)
      : state.foods,
    foodCharacters: willEatFood
      ? state.foodCharacters.filter((_, index) => index !== consumedFoodIndex)
      : state.foodCharacters,
    score: willEatFood ? state.score + 1 : state.score,
    consumedFoodIndex: willEatFood ? consumedFoodIndex : null,
  };
}

export function createFoodPosition(width, height, snake, randomIndex = 0) {
  return createFoodPositions(width, height, snake, 1, randomIndex)[0] ?? null;
}

export function createFoodPositions(width, height, snake, count = 1, randomIndex = 0) {
  const openCells = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!snake.some((segment) => segment.x === x && segment.y === y)) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return [];
  }

  const selectedCells = [];
  const remainingCells = [...openCells];

  for (let index = 0; index < Math.min(count, remainingCells.length); index += 1) {
    const safeIndex = Math.abs(randomIndex + index * 11) % remainingCells.length;
    selectedCells.push(remainingCells.splice(safeIndex, 1)[0]);
  }

  return selectedCells;
}

export function createFoodCharacter(randomIndex = 0) {
  return createFoodCharacters(1, randomIndex)[0];
}

export function createFoodCharacters(count = 1, randomIndex = 0, characters = DEFAULT_CHARACTERS) {
  const availableCharacters = [...characters];
  const selectedCharacters = [];

  for (let index = 0; index < Math.min(count, availableCharacters.length); index += 1) {
    const safeIndex = Math.abs(randomIndex + index * 13) % availableCharacters.length;
    selectedCharacters.push(availableCharacters.splice(safeIndex, 1)[0]);
  }

  return selectedCharacters;
}

export function isOutOfBounds(position, width, height) {
  return position.x < 0 || position.y < 0 || position.x >= width || position.y >= height;
}

export function wrapPosition(position, width, height) {
  return {
    x: ((position.x % width) + width) % width,
    y: ((position.y % height) + height) % height,
  };
}

export function positionsEqual(a, b) {
  if (!a || !b) {
    return false;
  }

  return a.x === b.x && a.y === b.y;
}
