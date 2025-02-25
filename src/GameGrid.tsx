import { WordlingGame } from "./game.logic";

type GameGridProps = {
  gameState: WordlingGame;
};

export default function GameGrid({ gameState }: GameGridProps) {
  const rows = [];

  for (let i = 0; i < gameState.maxAttempts; i++) {
    const isCurrentRow = i === gameState.history.length;
    const rowHistoryGuess = gameState.history[i]?.guess;

    const rowGuess = rowHistoryGuess
      ? rowHistoryGuess
      : isCurrentRow
        ? gameState.guess
        : Array(gameState.correctWord.length).fill(undefined);

    const rowFeedback =
      gameState.history[i]?.feedback ||
      Array(gameState.correctWord.length).fill("");

    rows.push({ rowGuess, rowFeedback });
  }

  return (
    <div className="grid grid-rows-4 gap-2">
      {rows.map(({ rowGuess, rowFeedback }, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {rowGuess.map((letter, index) => (
            <div key={index} className="relative w-20 h-20">
              <div
                className={`text-4xl absolute w-full h-full flex items-center justify-center border-2 border-gray-500 rounded-md ${rowFeedback[index] || "bg-gray-50"}`}
              >
                {letter}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
