import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;

const SnakeGame = () => {
  const { user, updateUserScore } = useAuth();
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [gameState, setGameState] = useState("stopped"); // 'playing', 'paused', 'stopped', 'gameOver'
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameSpeed, setGameSpeed] = useState(150);
  const [showGameOver, setShowGameOver] = useState(false);

  // Generate random food position
  const generateFood = useCallback((currentSnake = []) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    // Clear any existing game loop
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    const initialSnake = [{ x: Math.floor((CANVAS_SIZE / GRID_SIZE) / 2), y: Math.floor((CANVAS_SIZE / GRID_SIZE) / 2) }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection({ x: 0, y: 0 });
    setScore(0);
    setGameState("stopped");
    setShowGameOver(false);
    setGameSpeed(150);
  }, [generateFood]);

  // Start game
  const startGame = () => {
    // Clear any existing game loop
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    // Always reset the game when starting, regardless of current state
    const initialSnake = [{ x: Math.floor((CANVAS_SIZE / GRID_SIZE) / 2), y: Math.floor((CANVAS_SIZE / GRID_SIZE) / 2) }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection({ x: 0, y: 0 }); // Start with no movement
    setScore(0);
    setShowGameOver(false);
    setGameSpeed(150);
    setGameState("playing");
  };

  // Pause/Resume game
  const togglePause = () => {
    if (gameState === "playing") {
      setGameState("paused");
    } else if (gameState === "paused") {
      setGameState("playing");
    }
  };

  // Handle game over
  const handleGameOver = useCallback(async () => {
    // Prevent multiple calls by checking if game is already over
    if (gameState === "gameOver") {
      return;
    }
    
    setGameState("gameOver");
    setShowGameOver(true);

    // Save score to backend
    try {
      await axios.post("/api/game/score", { score });
      updateUserScore(score);
      toast.success(`Game Over! Score: ${score}`);
    } catch (error) {
      toast.error("Failed to save score");
    }
  }, [score, updateUserScore, gameState]);

  // Game logic
  const moveSnake = useCallback(() => {
    // Don't move if no direction is set (game just started)
    if (direction.x === 0 && direction.y === 0) {
      return;
    }

    // Don't move if game is already over
    if (gameState === "gameOver") {
      return;
    }

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (
        head.x < 0 ||
        head.x >= CANVAS_SIZE / GRID_SIZE ||
        head.y < 0 ||
        head.y >= CANVAS_SIZE / GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      // Check self collision
      if (
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        handleGameOver();
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => prevScore + 10);
        setFood(generateFood(newSnake));
        // Increase game speed slightly
        setGameSpeed((prevSpeed) => Math.max(80, prevSpeed - 2));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, handleGameOver, gameState]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setDirection((prev) => (prev.y !== 1 ? { x: 0, y: -1 } : prev));
          break;
        case "ArrowDown":
          e.preventDefault();
          setDirection((prev) => (prev.y !== -1 ? { x: 0, y: 1 } : prev));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setDirection((prev) => (prev.x !== 1 ? { x: -1, y: 0 } : prev));
          break;
        case "ArrowRight":
          e.preventDefault();
          setDirection((prev) => (prev.x !== -1 ? { x: 1, y: 0 } : prev));
          break;
        case " ":
          e.preventDefault();
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = setInterval(moveSnake, gameSpeed);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameState, gameSpeed, moveSnake]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.fillStyle = "#1a202c";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = "#2d3748";
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#48bb78" : "#38a169";
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = "#f56565";
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [snake, food]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-effect rounded-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Snake Game</h1>
          <div className="flex justify-center items-center space-x-6 mb-4">
            <div className="text-white">
              <span className="text-lg font-semibold">Score: </span>
              <span className="text-2xl font-bold text-green-400">{score}</span>
            </div>
            <div className="text-white">
              <span className="text-lg font-semibold">Best: </span>
              <span className="text-2xl font-bold text-yellow-400">
                {user?.bestScore || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="game-container rounded-lg p-4">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="border-2 border-gray-600 rounded"
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {gameState === "stopped" && (
            <button
              onClick={startGame}
              className="btn-primary px-6 py-3 rounded-lg text-white font-semibold"
            >
              Start Game
            </button>
          )}

          {(gameState === "playing" || gameState === "paused") && (
            <>
              <button
                onClick={togglePause}
                className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg text-white font-semibold transition-colors"
              >
                {gameState === "playing" ? "Pause" : "Resume"}
              </button>
              <button
                onClick={resetGame}
                className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white font-semibold transition-colors"
              >
                Reset
              </button>
            </>
          )}

          {gameState === "gameOver" && (
            <button
              onClick={startGame}
              className="btn-primary px-6 py-3 rounded-lg text-white font-semibold"
            >
              Play Again
            </button>
          )}
        </div>

        <div className="text-center text-gray-300 text-sm">
          {gameState === "playing" && direction.x === 0 && direction.y === 0 ? (
            <p className="text-yellow-400 font-semibold">Press an arrow key to start moving!</p>
          ) : (
            <p>Use arrow keys to move, spacebar to pause</p>
          )}
          <p className="mt-1">
            Game Status:
            <span
              className={`ml-2 font-semibold ${
                gameState === "playing"
                  ? "text-green-400"
                  : gameState === "paused"
                  ? "text-yellow-400"
                  : gameState === "gameOver"
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {gameState.charAt(0).toUpperCase() + gameState.slice(1)}
            </span>
          </p>
        </div>

        {/* Game Over Modal */}
        {showGameOver && (
          <div className="fixed inset-0 game-over-modal flex items-center justify-center z-50">
            <div className="glass-effect rounded-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Game Over!
                </h2>
                <p className="text-xl text-gray-300 mb-2">Final Score:</p>
                <p className="text-4xl font-bold text-green-400 mb-6">
                  {score}
                </p>
                {score > (user?.bestScore || 0) && (
                  <p className="text-yellow-400 font-semibold mb-4">
                    🎉 New Best Score!
                  </p>
                )}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowGameOver(false);
                      // Reset and start a completely new game
                      startGame();
                    }}
                    className="btn-primary px-6 py-3 rounded-lg text-white font-semibold"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => {
                      setShowGameOver(false);
                      resetGame();
                    }}
                    className="bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
