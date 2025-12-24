import React, { useState, useEffect, useCallback } from 'react';
import { Gamepad2, Trophy, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple Memory Game Component
export function MemoryGame({ onClose }: { onClose: () => void }) {
  const emojis = ['🚀', '💻', '⚡', '🎯', '🔥', '💡', '🎨', '⭐'];
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initGame = useCallback(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => prev.map((card, i) =>
          i === first || i === second ? { ...card, matched: true } : card
        ));
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, i) =>
            i === first || i === second ? { ...card, flipped: false } : card
          ));
        }, 800);
      }
      setFlippedCards([]);
      setMoves(m => m + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameWon(true);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;
    setCards(prev => prev.map((card, i) => i === index ? { ...card, flipped: true } : card));
    setFlippedCards(prev => [...prev, index]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-800 font-semibold flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-[hsl(207,100%,32%)]" />
          Memory Game
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {gameWon ? (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-800 text-xl font-medium mb-2">You Won! 🎉</p>
          <p className="text-gray-500 text-sm mb-6">Completed in {moves} moves</p>
          <button
            onClick={initGame}
            className="flex items-center gap-2 mx-auto px-6 py-2.5 bg-[hsl(207,100%,32%)] rounded-lg text-white hover:bg-[hsl(207,100%,28%)] transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={cn(
                  'aspect-square rounded-lg text-2xl flex items-center justify-center transition-all duration-300 font-medium',
                  card.flipped || card.matched
                    ? 'bg-[hsl(207,100%,32%)] text-white shadow-md scale-100'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-400 scale-95'
                )}
              >
                {(card.flipped || card.matched) ? card.emoji : '?'}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-gray-500 text-sm pt-2">
            <span>Moves: {moves}</span>
            <button onClick={initGame} className="hover:text-gray-800 flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}
