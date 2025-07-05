import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { createInitialGame, WordlingGame } from "./game.logic";
import { getWordList, WordListKey } from "./wordlist";

type GameEndModalProps = {
  game: WordlingGame;
  setGame: React.Dispatch<React.SetStateAction<WordlingGame>>;
  gameOver: boolean;
  selectedWordList: WordListKey | "All Lists";
};

export default function GameEndModal({
  game,
  setGame,
  gameOver,
  selectedWordList,
}: GameEndModalProps) {
  const [isOpen, setIsOpen] = useState(gameOver);

  useEffect(() => {
    setIsOpen(gameOver);
  }, [gameOver]);

  const reset = () => {
    setIsOpen(false);
    setTimeout(() => {
      setGame(createInitialGame(getWordList(selectedWordList)));
    }, 500);
  };

  return (
    <Dialog open={isOpen} onClose={reset} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              {game.hasWon && game.gameOver ? (
                <div className="mx-auto flex size-16 text-4xl items-center justify-center rounded-full bg-green-100">
                  🎉
                </div>
              ) : (
                <div className="mx-auto flex size-16 text-4xl items-center justify-center rounded-full bg-red-100">
                  ❌
                </div>
              )}
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900"
                >
                  {game.hasWon && game.gameOver ? (
                    <span className="text-green-500">
                      You won!
                      <br /> The word was "{game.correctWord.join("")}".
                    </span>
                  ) : (
                    <>
                      <p className="text-red-500">Game Over!</p>
                      <p className="text-gray-800">
                        The word was "{game.correctWord.join("")}".
                      </p>
                    </>
                  )}
                </DialogTitle>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={reset}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Play again!
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
