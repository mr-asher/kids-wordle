import { useState, useEffect } from "react";
import { GOLDEN_WORDS } from "./wordlist";
import { createInitialGame, handleKeyPress, WordlingGame } from "./game.logic";
import GameGrid from "./GameGrid";
import GameEndModal from "./GameEndModal";
import { WordHints } from "./WordHints";

export default function Wordling() {
  const [game, setGame] = useState<WordlingGame>(() =>
    createInitialGame(GOLDEN_WORDS),
  );

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const newGameState = handleKeyPress(event.key, game);
      setGame(newGameState);
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [game]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl mt-4">Remy & Jules</h1>
      <h2 className="text-4xl mt-8">Guess the word</h2>
      <div className="mt-8">
        <GameGrid gameState={game} />
      </div>
      <WordHints
        wordList={GOLDEN_WORDS}
        triedLetters={game.triedLetters}
        correctWord={game.correctWord}
      />
      <GameEndModal game={game} setGame={setGame} gameOver={game.gameOver} />
    </div>
  );
}
