export type WordlingGame = {
  correctWord: string[];
  history: { guess: (string | undefined)[]; feedback: string[] }[];
  attempts: number;
  gameOver: boolean;
  hasWon: boolean;
  triedLetters: Set<string>;
  guess: (string | undefined)[];
  feedback: string[];
  maxAttempts: number;
};

enum LetterFeedback {
  Correct = "bg-green-400",
  Almost = "bg-yellow-400",
  Incorrect = "bg-gray-400",
}

export function getRandomWord(wordList: string[]): string[] {
  return wordList[Math.floor(Math.random() * wordList.length)].split("");
}

export function createInitialGame(
  wordList: string[],
  maxAttempts = 4,
): WordlingGame {
  const correctWord = getRandomWord(wordList);
  return {
    correctWord,
    history: [],
    attempts: 0,
    gameOver: false,
    hasWon: false,
    triedLetters: new Set(),
    guess: Array(correctWord.length).fill(undefined),
    feedback: Array(correctWord.length).fill(""),
    maxAttempts,
  };
}

export function addLetter(
  letter: string,
  gameState: WordlingGame,
): WordlingGame {
  // Don't allow extra input
  if (!gameState.guess.includes(undefined)) return gameState;

  const nextBlankSpot = gameState.guess.findIndex((char) => char === undefined);
  // This will be -1 if there are no more blank spots
  if (nextBlankSpot === -1) return gameState;

  const newGuess = [...gameState.guess];
  newGuess[nextBlankSpot] =
    letter.toLowerCase() === "i" && gameState.correctWord.length === 1
      ? letter.toUpperCase()
      : letter.toLowerCase();
  return { ...gameState, guess: newGuess };
}

export function removeLastLetter(gameState: WordlingGame): WordlingGame {
  const lastFilledIndex = gameState.guess.lastIndexOf(undefined) - 1;
  const newGuess = [...gameState.guess];

  if (lastFilledIndex < 0) {
    newGuess[newGuess.length - 1] = undefined;
  } else {
    newGuess[lastFilledIndex] = undefined;
  }

  return { ...gameState, guess: newGuess };
}

export function submitGuess(gameState: WordlingGame): WordlingGame {
  if (gameState.guess.includes(undefined) || gameState.gameOver)
    return gameState;

  const newTriedLetters = new Set([
    ...gameState.triedLetters,
    ...gameState.guess.filter((l) => l !== undefined),
  ]);

  const newFeedback = gameState.guess.map((letter, index) => {
    if (letter === gameState.correctWord[index]) return LetterFeedback.Correct;
    if (gameState.correctWord.includes(letter!)) return LetterFeedback.Almost;
    return LetterFeedback.Incorrect;
  });

  const newHistory = [
    ...gameState.history,
    { guess: gameState.guess, feedback: newFeedback },
  ];
  const hasWon = gameState.guess.every(
    (letter, index) => letter === gameState.correctWord[index],
  );
  const gameOver = hasWon || gameState.attempts + 1 >= gameState.maxAttempts;
  return {
    ...gameState,
    history: newHistory,
    triedLetters: newTriedLetters,
    feedback: newFeedback,
    attempts: gameState.attempts + 1,
    gameOver,
    hasWon,
    guess: Array(gameState.correctWord.length).fill(undefined),
  };
}

export function handleKeyPress(
  key: string,
  gameState: WordlingGame,
): WordlingGame {
  if (gameState.gameOver) return gameState;

  if (key.toLowerCase() === "enter" || key.toLowerCase() === "{enter}") {
    return submitGuess(gameState);
  }

  if (key.toLowerCase() === "backspace" || key.toLowerCase() === "{bksp}") {
    return removeLastLetter(gameState);
  }

  if (/^[a-zA-Z]$/.test(key)) {
    return addLetter(key, gameState);
  }

  return gameState;
}
