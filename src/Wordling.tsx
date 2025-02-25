import { useState, useEffect } from "react";
import { GOLDEN_WORDS } from "./wordlist";
import { createInitialGame, handleKeyPress, WordlingGame } from "./game.logic";
import GameGrid from "./GameGrid";
import GameEndModal from "./GameEndModal";
import { WordHints } from "./WordHints";
import Keyboard from "react-simple-keyboard";
import keyboardLayout from "./keyboardLayout";

export default function Wordling() {
  const [game, setGame] = useState<WordlingGame>(() =>
    createInitialGame(GOLDEN_WORDS),
  );
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    const hasTouch = navigator.maxTouchPoints > 0;
    setShowKeyboard(hasTouch);

    const handleKeyUp = (event: KeyboardEvent) => {
      const newGameState = handleKeyPress(event.key, game);
      setGame(newGameState);
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [game, showKeyboard]);

  const keyboardPress = (input: string) => {
    const newGameState = handleKeyPress(input, game);
    setGame(newGameState);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl mt-4">Remy & Jules</h1>
      <h2 className="text-4xl mt-8">Guess the word</h2>
      <div className="mt-8">
        <GameGrid gameState={game} />
      </div>
      {showKeyboard && (
        <Keyboard
          onKeyReleased={keyboardPress}
          layout={keyboardLayout}
          theme={"hg-theme-default hg-layout-default max-w-2xl mt-8"}
          display={{
            "{bksp}": "backspace",
            "{enter}": "enter",
          }}
        />
      )}
      <WordHints
        wordList={GOLDEN_WORDS}
        triedLetters={game.triedLetters}
        correctWord={game.correctWord}
      />
      <GameEndModal game={game} setGame={setGame} gameOver={game.gameOver} />
    </div>
  );
}
