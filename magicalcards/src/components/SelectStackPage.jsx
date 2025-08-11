import React, { useEffect, useState } from "react";
import "./SelectStackPage.css";

// Load and sort all 54 card images
const modules = import.meta.glob("./images/SVG/card*.svg", { eager: true });
const cardImages = Object.entries(modules)
  .sort(([a], [b]) => {
    const numA = parseInt(a.match(/card(\d+)\.svg/)[1], 10);
    const numB = parseInt(b.match(/card(\d+)\.svg/)[1], 10);
    return numA - numB;
  })
  .map(([_, mod]) => mod.default);

// Shuffle helper
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Bottom-up cyclic deal
const dealIntoStacksReversePositions = (cards, numStacks) => {
  const stacks = Array.from({ length: numStacks }, () => []);
  cards.forEach((card, idx) => {
    stacks[idx % numStacks].unshift(card);
  });
  return stacks;
};

export default function SelectStackPage() {
  const [deck, setDeck] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectionCount, setSelectionCount] = useState(0);
  const [finalDeck, setFinalDeck] = useState([]);
  const [revealCard, setRevealCard] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isAnimatingShuffle, setIsAnimatingShuffle] = useState(false);
  const [stage, setStage] = useState("chooseMood"); // chooseMood → imagineCards → stackSelection → preReveal → revealCard
  const [moodSelection, setMoodSelection] = useState(null);

  useEffect(() => {
    let shuffled = shuffleArray(cardImages);
    while (shuffled.length < 54) {
      shuffled.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
    }
    setDeck(shuffled);
  }, []);

  const startTrick = () => {
    setStacks(dealIntoStacksReversePositions(deck, 3));
    setStage("stackSelection");
    setSelectionCount(0);
    setSelectedIndex(null);
    setFinalDeck([]);
    setRevealCard(false);
  };

  const handleStackClick = (idx) => {
    if (selectionCount >= 3) return;
    setSelectedIndex(idx);
  };

  const handleConfirmSelection = () => {
    if (selectedIndex === null) return;

    const leftIndex = (selectedIndex + 2) % 3;
    const rightIndex = (selectedIndex + 1) % 3;
    const combined = [
      ...stacks[leftIndex],
      ...stacks[selectedIndex],
      ...stacks[rightIndex],
    ];

    if (selectionCount === 2) {
      // 3rd selection completed
      setFinalDeck(combined);
      setStage("preReveal");
      return;
    }

    const newStacks = dealIntoStacksReversePositions(combined, 3);
    setStacks(newStacks);
    setSelectionCount((c) => c + 1);
    setSelectedIndex(null);
  };

  const handleMagicReveal = () => {
    // Start shuffle animation effect
    setIsAnimatingShuffle(true);
    setTimeout(() => {
      setIsAnimatingShuffle(false); // stop shuffle
      setRevealCard(true);
      setStage("revealCard");
    }, 1000); // shuffle duration
  };

  // Mood-based reveal index
  const revealIndex = moodSelection === "red" ? 26 : 27;

  return (
    <div className="page-container">
      {/* Mood selection */}
      {stage === "chooseMood" && (
        <>
          <h2>Choose Your Mood</h2>
          <div className="mood-buttons">
            <button
              onClick={() => {
                setMoodSelection("green");
                setStage("imagineCards");
              }}
              className="btn mood-btn green-btn"
            >
              😊 Happy (Green)
            </button>
            <button
              onClick={() => {
                setMoodSelection("red");
                setStage("imagineCards");
              }}
              className="btn mood-btn red-btn"
            >
              😠 Angry (Red)
            </button>
          </div>
        </>
      )}

      {/* Imagine stage */}
      {stage === "imagineCards" && (
        <>
          <h2>Imagine a card from your chosen colour</h2>
          <div className="full-deck-grid-responsive">
            {deck.map((src, i) => {
              const isGreen = i < 27;
              const show = moodSelection === "green" ? isGreen : !isGreen;
              return show ? (
                <img
                  key={i}
                  src={src}
                  alt={`Card ${i + 1}`}
                  className="card-img"
                  style={{
                    backgroundColor: isGreen
                      ? "rgba(0, 255, 0, 0.25)"
                      : "rgba(255, 0, 0, 0.25)",
                    borderRadius: "4px",
                    padding: "2px",
                  }}
                />
              ) : null;
            })}
          </div>
          <button onClick={startTrick} className="btn" style={{ marginTop: 20 }}>
            Start Trick
          </button>
        </>
      )}

      {/* Stack selection */}
      {stage === "stackSelection" && !revealCard && (
        <>
          <h2>Select a Card Stack</h2>
          <p>{`Round ${selectionCount + 1} of 3`}</p>
          <div className={`stacks-container ${isShuffling ? "shuffling" : ""}`}>
            {stacks.map((stack, idx) => (
              <div
                key={idx}
                onClick={() => handleStackClick(idx)}
                className={`stack-box ${
                  selectedIndex === idx ? "selected" : ""
                }`}
              >
                <h4>Stack {idx + 1}</h4>
                <div className="cards-grid">
                  {stack.map((src, i) => (
                    <img key={i} src={src} alt="Card" className="card-img" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleConfirmSelection}
            disabled={selectedIndex === null}
            className="btn"
            style={{ marginTop: 20 }}
          >
            Confirm Selection
          </button>
        </>
      )}

      {/* Pre-reveal stage */}
      {stage === "preReveal" && (
        <>
          <h2>All Cards</h2>
          <div
            className={`full-deck-grid-responsive ${
              isAnimatingShuffle ? "shuffle-animate" : ""
            }`}
          >
            {finalDeck.map((src, idx) => (
              <img key={idx} src={src} alt={`Card ${idx + 1}`} className="card-img" />
            ))}
          </div>
          <button
            onClick={handleMagicReveal}
            className="btn reveal-btn"
            style={{ marginTop: 20 }}
          >
            🎩 Reveal the Card
          </button>
        </>
      )}

      {/* Final reveal stage */}
      {stage === "revealCard" && (
        <div style={{ marginTop: 30, width: "100%" }}>
          <div className="focus-text">Focus on the selected card</div>
          <div className="full-deck-grid-responsive">
            {finalDeck.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Card ${idx + 1}`}
                className={`card-img ${
                  idx === revealIndex ? "selected-reveal" : ""
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
