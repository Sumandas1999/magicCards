// src/components/CardsPage.jsx
import React, { useEffect, useState } from 'react';

// Import all card svg images dynamically with Vite import.meta.glob
const modules = import.meta.glob('./images/SVG/card*.svg', { eager: true });

const cardImages = Object.entries(modules)
  .sort(([a], [b]) => {
    const numA = parseInt(a.match(/card(\d+)\.svg/)[1], 10);
    const numB = parseInt(b.match(/card(\d+)\.svg/)[1], 10);
    return numA - numB;
  })
  .map(([_, mod]) => mod.default);

// Fisher-Yates Shuffle
const shuffleArray = (array) => {
  const shuffled = [...array]; // make a copy
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const CardsPage = () => {
  const [shuffledCards, setShuffledCards] = useState([]);

  // Shuffle on mount
  useEffect(() => {
    setShuffledCards(shuffleArray(cardImages));
  }, []);

  // Handler for Shuffle button
  const handleShuffle = () => {
    setShuffledCards(shuffleArray(shuffledCards));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Shuffled Deck</h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {shuffledCards.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Card ${index + 1}`}
            style={{ width: '80px', height: '120px' }}
          />
        ))}
        
        <button onClick={handleShuffle} style={{ marginBottom: '15px' }}>
        Shuffle Cards
      </button>
      </div>
    </div>
  );
};

export default CardsPage;
