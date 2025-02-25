type WordHintsProps = {
  wordList: string[];
  triedLetters: Set<string>;
  correctWord: string[];
};

export function WordHints({
  wordList,
  triedLetters,
  correctWord,
}: WordHintsProps) {
  const letterColour = (letter: string, triedLetters: Set<string>) => {
    if (!triedLetters.has(letter)) {
      return "text-gray-600";
    }

    if (triedLetters.has(letter) && correctWord.includes(letter)) {
      return "text-green-600 font-bold";
    }

    return "text-gray-300 font-bold";
  };

  return (
    <div className="mt-4 text-center">
      <h2>Your words</h2>
      <div className="grid grid-cols-6 gap-2 mt-2">
        {wordList.map((word) => (
          <div
            key={word}
            className="text-lg py-2 px-4 border-2 border-gray-100 rounded-md"
          >
            {word.split("").map((letter, index) => (
              <span key={index} className={letterColour(letter, triedLetters)}>
                {letter}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
