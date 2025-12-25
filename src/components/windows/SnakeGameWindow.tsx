import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 15;
const INITIAL_SPEED = 150;

export function SnakeGame({ onClose }: { onClose: () => void }) {
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 7, y: 7 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    setGameOver(false);
    setIsPaused(true);
    setScore(0);
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead: Position;

      switch (direction) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        setHighScore((prev) => Math.max(prev, score));
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setHighScore((prev) => Math.max(prev, score));
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [direction, food, gameOver, generateFood, isPaused, score]);

  useEffect(() => {
    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  // Mobile controls
  const handleDirection = (newDir: Direction) => {
    if (gameOver) return;
    if (
      (newDir === 'UP' && direction !== 'DOWN') ||
      (newDir === 'DOWN' && direction !== 'UP') ||
      (newDir === 'LEFT' && direction !== 'RIGHT') ||
      (newDir === 'RIGHT' && direction !== 'LEFT')
    ) {
      setDirection(newDir);
      if (isPaused) setIsPaused(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-semibold flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          Snake Game
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">High: {highScore}</span>
          <span className="text-sm font-medium text-primary">Score: {score}</span>
        </div>
      </div>

      {gameOver ? (
        <div className="text-center py-6 animate-fade-in">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <p className="text-foreground text-lg font-medium mb-1">Game Over!</p>
          <p className="text-muted-foreground text-sm mb-4">Score: {score}</p>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 mx-auto px-5 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </div>
      ) : (
        <>
          {/* Game Board */}
          <div
            ref={gameRef}
            className="relative mx-auto bg-muted/50 rounded-lg border border-border overflow-hidden"
            style={{
              width: `min(100%, ${GRID_SIZE * 18}px)`,
              aspectRatio: '1',
            }}
          >
            <div
              className="grid w-full h-full"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE;
                const y = Math.floor(i / GRID_SIZE);
                const isSnakeHead = snake[0].x === x && snake[0].y === y;
                const isSnakeBody = snake.slice(1).some((s) => s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;

                return (
                  <div
                    key={i}
                    className={cn(
                      'transition-all duration-75',
                      isSnakeHead && 'bg-primary rounded-sm scale-110 shadow-md',
                      isSnakeBody && 'bg-primary/70 rounded-sm',
                      isFood && 'bg-destructive rounded-full scale-90 animate-pulse'
                    )}
                  />
                );
              })}
            </div>

            {/* Pause overlay */}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
                <button
                  onClick={() => setIsPaused(false)}
                  className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
                >
                  <Play className="w-8 h-8" />
                </button>
                <p className="text-muted-foreground text-sm mt-3">Tap to start</p>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="grid grid-cols-3 gap-1 max-w-[160px] mx-auto sm:hidden">
            <div />
            <button
              onClick={() => handleDirection('UP')}
              className="p-3 bg-muted rounded-lg active:bg-primary active:text-primary-foreground transition-colors"
            >
              ▲
            </button>
            <div />
            <button
              onClick={() => handleDirection('LEFT')}
              className="p-3 bg-muted rounded-lg active:bg-primary active:text-primary-foreground transition-colors"
            >
              ◀
            </button>
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="p-3 bg-muted rounded-lg active:bg-primary active:text-primary-foreground transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4 mx-auto" /> : <Pause className="w-4 h-4 mx-auto" />}
            </button>
            <button
              onClick={() => handleDirection('RIGHT')}
              className="p-3 bg-muted rounded-lg active:bg-primary active:text-primary-foreground transition-colors"
            >
              ▶
            </button>
            <div />
            <button
              onClick={() => handleDirection('DOWN')}
              className="p-3 bg-muted rounded-lg active:bg-primary active:text-primary-foreground transition-colors"
            >
              ▼
            </button>
            <div />
          </div>

          {/* Desktop Controls Info */}
          <p className="text-xs text-muted-foreground text-center hidden sm:block">
            Use arrow keys or WASD to move • Space to pause
          </p>

          {/* Reset button */}
          <div className="flex justify-center">
            <button
              onClick={resetGame}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}
