"use client";

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // For arrow icons

const FallingObjectsGame = () => {
  const [score, setScore] = useState(0);
  const [objects, setObjects] = useState<
    { id: number; x: number; y: number; type: string }[]
  >([]);
  const [playerX, setPlayerX] = useState(50); // Player position (percentage of the screen)

  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new falling object every 1.5 seconds
      setObjects((prev) => [
        ...prev,
        { id: Date.now(), x: Math.random() * 90, y: 0, type: Math.random() > 0.5 ? "fruit" : "obstacle" },
      ]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Move objects down
      setObjects((prev) =>
        prev
          .map((obj) => ({ ...obj, y: obj.y + 5 }))
          .filter((obj) => obj.y <= 100) // Remove objects that fall off the screen
      );
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check for collisions
    setObjects((prev) => {
      return prev.filter((obj) => {
        const isCaught = obj.y > 90 && Math.abs(obj.x - playerX) < 10;
        if (isCaught) {
          setScore((prevScore) => prevScore + (obj.type === "fruit" ? 10 : -5));
        }
        return !isCaught;
      });
    });
  }, [playerX]);

  // Mobile Touch Controls
  const moveLeft = () => setPlayerX((prev) => Math.max(0, prev - 5));
  const moveRight = () => setPlayerX((prev) => Math.min(90, prev + 5));

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <h1 className="heading  text-center text-xl lg:text-4xl font-bold pt-4">Catch the Falling Objects</h1>
      <p className="heading text-center text-xl font-bold mt-2">Score: {score}</p>

      {/* Game Area */}
      <div className="relative w-full h-[80%] background-1">
        {/* Falling Objects */}
        {objects.map((obj) => (
          <div
            key={obj.id}
            className={`absolute transition-all duration-150 ${
              obj.type === "fruit" ? "bg-blue-500" : "bg-orange-600"
            } rounded-full w-8 h-8`}
            style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
          />
        ))}

        {/* Player (Bucket) */}
        <div
          className="absolute bottom-6 sm:bottom-2 md:bottom-0 lg:bottom-0 w-20 h-6 sm:w-32 sm:h-8 md:w-32 md:h-8 lg:w-24 lg:h-8 bg-green-500 rounded-b-full shadow-md"
          style={{ left: `${playerX}%`, transform: "translateX(-50%)" }}
        />
      </div>

      {/* Mobile Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between gap-4 sm:hidden">
        <button
          onClick={moveLeft}
          className="bg-white text-black font-extrabold p-2 rounded-full shadow-md flex items-center justify-center w-10 h-10"
        >
          <FaArrowLeft />.
        </button>
        <button
          onClick={moveRight}
          className="bg-white text-black font-extrabold p-2 rounded-full shadow-md flex items-center justify-center w-10 h-10"
        >
          .<FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default FallingObjectsGame;
