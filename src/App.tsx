import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GOLDEN_WORDS = [
  "a",
  "and",
  "be",
  "I",
  "in",
  "is",
  "it",
  "of",
  "that",
  "the",
  "to",
  "was",
];
const MAX_ATTEMPTS = 6;

const getRandomWord = (wordList: string[]) =>
  wordList[Math.floor(Math.random() * wordList.length)].split("");

const App = () => {
  const [correctWord, setCorrectWord] = useState<string[]>(
    getRandomWord(GOLDEN_WORDS),
  );
  const [wordLength, setWordLength] = useState(correctWord.length);
  const [guess, setGuess] = useState<(string | undefined)[]>(
    Array(wordLength).fill(undefined),
  );
  const [feedback, setFeedback] = useState<string[]>(
    Array(wordLength).fill(""),
  );
  const [history, setHistory] = useState<
    { guess: string[]; feedback: string[] }[]
  >([]);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [triedLetters, setTriedLetters] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (gameOver || flipping) return;

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;

      if (key.toUpperCase() === "ENTER") {
        handleSubmit();
        return;
      }

      setGuess((prevGuess) => {
        const newGuess = [...prevGuess];
        console.log("hello?", guess);

        if (/^[a-zA-Z]$/.test(key)) {
          if (!newGuess.includes(undefined)) return prevGuess; // Prevent extra input

          const index = newGuess.findIndex((char) => char === undefined);
          if (index !== -1)
            newGuess[index] =
              key.toLowerCase() === "i" && wordLength === 1
                ? key.toUpperCase()
                : key.toLowerCase();
        } else if (key === "Backspace") {
          const lastFilledIndex = newGuess.lastIndexOf(undefined) - 1;
          if (lastFilledIndex < 0) {
            newGuess[newGuess.length - 1] = undefined;
          } else {
            newGuess[lastFilledIndex] = undefined;
          }
        }

        return newGuess;
      });
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [gameOver, flipping]);

  const handleSubmit = () => {
    if (guess.includes(undefined) || flipping) return;

    setFlipping(true);

    setTriedLetters(
      (prev) =>
        new Set([
          ...prev,
          ...(guess.filter((l) => l !== undefined) as string[]),
        ]),
    );

    const newFeedback = guess.map((letter, index) => {
      if (letter === correctWord[index]) return "bg-green-500";
      if (correctWord.includes(letter!)) return "bg-yellow-500";
      return "bg-gray-500";
    });

    newFeedback.forEach((_, index) => {
      setTimeout(() => {
        setFeedback((prev) => {
          const updated = [...prev];
          updated[index] = newFeedback[index];
          return updated;
        });
      }, index * 300);
    });

    setTimeout(
      () => {
        if (guess.every((letter, index) => letter === correctWord[index])) {
          setWon(true);
          setGameOver(true);
          return;
        }

        setHistory((prev) => [
          ...prev,
          { guess: [...guess] as string[], feedback: newFeedback },
        ]);

        setFeedback(Array(wordLength).fill(""));
        setAttempts((prev) => prev + 1);
        if (attempts + 1 >= MAX_ATTEMPTS) {
          setGameOver(true);
          return;
        }

        setGuess(Array(wordLength).fill(undefined));
        setFlipping(false);
      },
      wordLength * 300 + 500,
    );
  };

  const handleRestart = () => {
    const newWord = getRandomWord(GOLDEN_WORDS);
    setCorrectWord(newWord);
    setWordLength(newWord.length);
    setGuess(Array(newWord.length).fill(undefined));
    setFeedback(Array(newWord.length).fill(""));
    setHistory([]);
    setAttempts(0);
    setGameOver(false);
    setWon(false);
    setFlipping(false);
    setTriedLetters(new Set());
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>Wordle Clone</h1>

      {/* Wordle-style Grid */}
      <div className="grid grid-rows-6 gap-2">
        {[...Array(MAX_ATTEMPTS)].map((_, rowIndex) => {
          const isCurrentRow = rowIndex === history.length;
          const currentGuess =
            history[rowIndex]?.guess ||
            (isCurrentRow ? guess : Array(wordLength).fill(undefined));
          const currentFeedback =
            history[rowIndex]?.feedback ||
            (isCurrentRow ? feedback : Array(wordLength).fill(""));

          return (
            <div key={rowIndex} className="flex gap-2 text-xl font-bold">
              {currentGuess.map((letter, index) => (
                <div key={index} className="relative w-10 h-10">
                  <motion.div
                    className={`absolute w-full h-full flex items-center justify-center border-2 border-gray-400 text-white ${
                      currentFeedback[index] || "bg-gray-200 text-black"
                    }`}
                    initial={{ rotateY: 0 }}
                    animate={currentFeedback[index] ? { rotateY: 180 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.3 }}
                  ></motion.div>

                  {/* Letter that stays upright */}
                  <motion.div
                    className="absolute w-full h-full flex items-center justify-center text-black font-bold"
                    initial={{ opacity: 1 }}
                    animate={
                      currentFeedback[index] ? { opacity: [1, 0, 1] } : {}
                    }
                    transition={{ duration: 0.5, delay: index * 0.3 }}
                  >
                    {letter}
                  </motion.div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div className="text-lg font-bold">
          {won ? (
            <span className="text-green-500">🎉 You guessed it right!</span>
          ) : (
            <span className="text-red-500">
              ❌ Game Over! The word was "{correctWord.join("")}".
            </span>
          )}
          <button
            onClick={handleRestart}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Restart Game
          </button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={guess.includes(undefined) || gameOver || flipping}
      >
        Submit
      </button>

      {/* Display Golden Words List with Highlighted Tried Letters */}
      <div className="mt-12">
        <h2 className="mb-8 text-lg font-bold">Words to guess</h2>
        <div className="grid grid-cols-3 gap-12">
          {GOLDEN_WORDS.map((word) => (
            <div key={word} className="text-lg">
              {word.split("").map((letter, index) => (
                <span
                  key={index}
                  className={`mx-0 ${triedLetters.has(letter) ? "text-blue-600 font-bold" : "text-gray-600"}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
