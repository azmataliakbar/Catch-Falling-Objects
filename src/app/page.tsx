"use client";

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const FallingObjectsGame = () => {
  const [score, setScore] = useState(0);
  const [objects, setObjects] = useState<
    { id: number; x: number; y: number; type: string }[]
  >([]);
  const [playerX, setPlayerX] = useState(50); // Player position (percentage of the screen)

  // Add falling objects
  useEffect(() => {
    const interval = setInterval(() => {
      setObjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 90,
          y: 0,
          type: Math.random() > 0.5 ? "fruit" : "obstacle",
        },
      ]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Move objects down
  useEffect(() => {
    const interval = setInterval(() => {
      setObjects((prev) =>
        prev
          .map((obj) => ({ ...obj, y: obj.y + 5 }))
          .filter((obj) => obj.y <= 100) // Remove objects that fall off the screen
      );
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Move bucket left and right for keyboard
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPlayerX((prev) => Math.max(0, prev - 5));
    if (e.key === "ArrowRight") setPlayerX((prev) => Math.min(90, prev + 5));
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle bucket movement for mobile buttons
  const moveLeft = () => {
    setPlayerX((prev) => Math.max(0, prev - 5));
  };

  const moveRight = () => {
    setPlayerX((prev) => Math.min(90, prev + 5));
  };

  // Check for collisions
  useEffect(() => {
    setObjects((prev) =>
      prev.filter((obj) => {
        const isCaught = obj.y > 90 && Math.abs(obj.x - playerX) < 10;
        if (isCaught) {
          setScore((prevScore) =>
            prevScore + (obj.type === "fruit" ? 10 : -5)
          );
        }
        return !isCaught;
      })
    );
  }, [playerX]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Game Title */}
      <h1 className="heading text-center text-white text-2xl lg:text-5xl font-bold pt-4">
        Hit the Falling Objects
      </h1>
      <p className="heading  text-center text-white font-bold text-2xl mt-2">Score: {score}</p>

      {/* Game Area */}
      <div className="body-2  relative w-full h-[80%] ">
        {/* Falling Objects */}
        {objects.map((obj) => (
          <div
            key={obj.id}
            className={`absolute transition-all duration-150 ${
              obj.type === "fruit" ? "bg-blue-500" : "bg-orange-500"
            } rounded-full w-6 h-6 lg:w-12 lg:h-12`}
            style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
          />
        ))}

        {/* Player (Bucket) */}
        <div
          className="absolute bottom-20 w-16 h-4 lg:w-32 lg:h-6 bg-green-500 rounded-full shadow-md "
          style={{ left: `${playerX}%`, transform: "translateX(-50%)" }}
        />
      </div>

      {/* Buttons for Mobile */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between gap-4 sm:hidden">
  <button
    type="button" // Specifies that this is not a submit button
    title="Move left" // Provides accessible text for screen readers
    aria-label="Move left" // Alternative text for assistive technologies
    className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-md"
    onClick={moveLeft}
  >
    <FaArrowLeft className="text-2xl" />
  </button>
  <button
    type="button" // Specifies that this is not a submit button
    title="Move right" // Provides accessible text for screen readers
    aria-label="Move right" // Alternative text for assistive technologies
    className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-md"
    onClick={moveRight}
  >
    <FaArrowRight className="text-2xl" />
  </button>
</div>

    </div>
  );
};

export default FallingObjectsGame;

