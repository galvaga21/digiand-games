"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play } from "lucide-react";
import confetti from "canvas-confetti";

type Position = { x: number; y: number; id: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 15;
const INITIAL_SPEED = 160;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 50;

let nextId = 1;

const getCenterPos = (): Position => ({
    x: Math.floor(GRID_SIZE / 2),
    y: Math.floor(GRID_SIZE / 2),
    id: nextId++
});

const generateFoodErrorHandled = (snakeBody: Position[]): Position => {
    let newFood: Position;
    let isOccupied = true;
    while (isOccupied) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
            id: Date.now()
        };
        isOccupied = snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
};

export function SnakeGame() {
    const [snake, setSnake] = useState<Position[]>([getCenterPos()]);
    const [dir, setDir] = useState<Direction>("UP");
    const [food, setFood] = useState<Position>({ x: 2, y: 2, id: 0 });
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [score, setScore] = useState<number>(0);
    const [highScore, setHighScore] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
    const [justAte, setJustAte] = useState<boolean>(false);

    const dirRef = useRef<Direction>("UP");
    const lastRenderedDirRef = useRef<Direction>("UP");

    useEffect(() => {
        const saved = localStorage.getItem("snake-highscore");
        if (saved) {
            setHighScore(parseInt(saved, 10));
        }
        setFood(generateFoodErrorHandled([getCenterPos()]));
    }, []);

    const triggerConfetti = () => {
        const end = Date.now() + 1.5 * 1000;
        const colors = ["#10b981", "#a3e635", "#ffffff"];
        (function frame() {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    };

    const gameOver = () => {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snake-highscore", score.toString());
            triggerConfetti();
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }

        if (isGameOver && e.key === " ") {
            resetGame();
            return;
        }

        if (isGameOver) return;

        switch (e.key) {
            case "ArrowUp":
            case "w":
            case "W":
                if (lastRenderedDirRef.current !== "DOWN") dirRef.current = "UP";
                break;
            case "ArrowDown":
            case "s":
            case "S":
                if (lastRenderedDirRef.current !== "UP") dirRef.current = "DOWN";
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                if (lastRenderedDirRef.current !== "RIGHT") dirRef.current = "LEFT";
                break;
            case "ArrowRight":
            case "d":
            case "D":
                if (lastRenderedDirRef.current !== "LEFT") dirRef.current = "RIGHT";
                break;
            case " ":
                setIsPaused(prev => !prev);
                break;
        }
    }, [isGameOver]);

    const handleControlClick = (newDir: Direction) => {
        if (isGameOver || isPaused) return;

        switch (newDir) {
            case "UP":
                if (lastRenderedDirRef.current !== "DOWN") dirRef.current = "UP";
                break;
            case "DOWN":
                if (lastRenderedDirRef.current !== "UP") dirRef.current = "DOWN";
                break;
            case "LEFT":
                if (lastRenderedDirRef.current !== "RIGHT") dirRef.current = "LEFT";
                break;
            case "RIGHT":
                if (lastRenderedDirRef.current !== "LEFT") dirRef.current = "RIGHT";
                break;
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isPaused || isGameOver) return;

        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                const newHead = { ...head, id: nextId++ };

                const currentDir = dirRef.current;
                lastRenderedDirRef.current = currentDir;
                setDir(currentDir);

                if (currentDir === "UP") newHead.y -= 1;
                if (currentDir === "DOWN") newHead.y += 1;
                if (currentDir === "LEFT") newHead.x -= 1;
                if (currentDir === "RIGHT") newHead.x += 1;

                // Wall Collision
                if (
                    newHead.x < 0 || newHead.x >= GRID_SIZE ||
                    newHead.y < 0 || newHead.y >= GRID_SIZE
                ) {
                    gameOver();
                    return prevSnake;
                }

                // Self Collision
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    gameOver();
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Eating Food
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore(s => s + 10);
                    setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
                    setJustAte(true);
                    setTimeout(() => setJustAte(false), 200);
                    setFood(generateFoodErrorHandled(newSnake));
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, speed);
        return () => clearInterval(interval);
    }, [isPaused, isGameOver, food, speed]);

    const resetGame = () => {
        nextId = 1;
        setSnake([getCenterPos()]);
        dirRef.current = "UP";
        lastRenderedDirRef.current = "UP";
        setDir("UP");
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setIsGameOver(false);
        setIsPaused(false);
        setFood(generateFoodErrorHandled([getCenterPos()]));
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto pb-10">

            {/* Score Board */}
            <div className="flex w-full justify-between items-center mb-6 sm:mb-8 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-black/10 dark:border-white/10 shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
                <div className="absolute right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-[40px] pointer-events-none" />

                <div className={`flex flex-col items-center p-3 sm:px-6 rounded-2xl transition-all duration-300 relative z-10 ${justAte ? 'scale-110 shadow-[inner_0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500/10 border border-emerald-500/20' : 'border border-transparent'}`}>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-widest drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                        Puntos
                    </span>
                    <span className={`text-3xl sm:text-4xl font-black transition-colors ${justAte ? 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'text-gray-900 dark:text-white'}`}>
                        {score}
                    </span>
                </div>

                <div className="flex flex-col items-center px-2 sm:px-4 relative z-10 pt-2">
                    <motion.div animate={score > 0 && score >= highScore ? { rotateY: 360, scale: 1.2 } : { rotateY: 0, scale: 1 }} transition={{ duration: 0.8, type: "spring" }}>
                        <Trophy className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 ${score > 0 && score >= highScore ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,1)]' : 'text-gray-400 dark:text-gray-600'}`} />
                    </motion.div>
                </div>

                <div className="flex flex-col items-center p-3 sm:px-6 rounded-2xl transition-all duration-500 relative z-10">
                    <span className="text-lime-700 dark:text-lime-500 font-bold text-xs sm:text-sm uppercase tracking-widest drop-shadow-[0_0_5px_rgba(163,230,53,0.3)]">
                        Récord
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                        {highScore}
                    </span>
                </div>
            </div>

            {/* Game Board Container */}
            <div className="relative p-1.5 sm:p-3 rounded-[2rem] sm:rounded-[3rem] bg-gray-100/80 dark:bg-[#0a0a0a]/80 backdrop-blur-3xl border border-black/5 dark:border-white/5 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_2px_rgba(255,255,255,0.2)] w-full max-w-[480px] aspect-square overflow-hidden flex flex-col items-center justify-center">

                {/* Background glow ambient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_100%)] pointer-events-none" />

                {/* Overlays (Game Over / Start) */}
                <AnimatePresence>
                    {(isGameOver || (isPaused && score === 0 && !isGameOver)) && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/40 dark:bg-black/60 rounded-[1.5rem]"
                        >
                            <h2 className={`text-4xl sm:text-5xl font-black mb-6 tracking-tight ${isGameOver ? 'text-red-600 dark:text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'text-emerald-600 dark:text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]'}`}>
                                {isGameOver ? "¡COLISIÓN!" : "SNAKE"}
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={resetGame}
                                className={`flex items-center gap-2 px-8 py-4 rounded-full font-black tracking-wider shadow-xl transition-all ${isGameOver
                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/40 border border-red-400/50'
                                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/40 border border-emerald-400/50'
                                    }`}
                            >
                                {isGameOver ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                                {isGameOver ? "REINTENTAR" : "INICIAR"}
                            </motion.button>
                            {isGameOver && <p className="mt-8 text-black dark:text-white font-medium animate-pulse">Presiona Espacio para reiniciar</p>}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grid & Entity Canvas */}
                <div className="w-full h-full relative z-20 border border-black/10 dark:border-white/10 rounded-xl sm:rounded-2xl overflow-hidden bg-black/[0.03] dark:bg-[#111]">
                    {/* Render implicit grid lines for modern arcade feel */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(128,128,128,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.5) 1px, transparent 1px)`,
                            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
                        }}
                    />

                    {/* Food Element - Absolute Positioned */}
                    <motion.div
                        key={food.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute flex items-center justify-center z-10"
                        style={{
                            left: `${(food.x / GRID_SIZE) * 100}%`,
                            top: `${(food.y / GRID_SIZE) * 100}%`,
                            width: `${100 / GRID_SIZE}%`,
                            height: `${100 / GRID_SIZE}%`
                        }}
                    >
                        <div className="w-[70%] h-[70%] bg-lime-500 rounded-full shadow-[0_0_15px_rgba(132,204,22,1)] border-2 border-white/40" />
                    </motion.div>

                    {/* Snake Elements - Absolute Positioned */}
                    {snake.map((segment, index) => {
                        const isHead = index === 0;
                        const isTail = index === snake.length - 1;

                        let radiusClasses = "rounded-[4px]"; // Default small rounding

                        // We use the CSS transitioning for incredibly smooth sliding
                        const isMoving = speed < INITIAL_SPEED || score > 0;
                        const transitionStyle = isMoving ? `all ${Math.max(speed - 10, 30)}ms linear` : 'none';

                        if (isHead) {
                            if (dir === "UP") radiusClasses = "rounded-t-full rounded-b-[4px]";
                            else if (dir === "DOWN") radiusClasses = "rounded-b-full rounded-t-[4px]";
                            else if (dir === "LEFT") radiusClasses = "rounded-l-full rounded-r-[4px]";
                            else if (dir === "RIGHT") radiusClasses = "rounded-r-full rounded-l-[4px]";
                        } else if (isTail && snake.length > 1) {
                            const prev = snake[index - 1];
                            if (prev.y < segment.y) radiusClasses = "rounded-b-full rounded-t-[4px]";
                            else if (prev.y > segment.y) radiusClasses = "rounded-t-full rounded-b-[4px]";
                            else if (prev.x < segment.x) radiusClasses = "rounded-r-full rounded-l-[4px]";
                            else if (prev.x > segment.x) radiusClasses = "rounded-l-full rounded-r-[4px]";
                            else radiusClasses = "rounded-full"; // fallback
                        }

                        // Gradient fade along the snake body
                        const opacity = isHead ? 1 : Math.max(0.4, 1 - (index / (snake.length * 2)));

                        return (
                            <div
                                key={segment.id}
                                className={`absolute z-20 flex justify-center items-center`}
                                style={{
                                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                                    width: `${100 / GRID_SIZE}%`,
                                    height: `${100 / GRID_SIZE}%`,
                                    transition: transitionStyle,
                                }}
                            >
                                <div
                                    className={`w-[95%] h-[95%] bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.3)] ${radiusClasses} relative overflow-hidden`}
                                    style={{ opacity }}
                                >
                                    {isHead && (
                                        <div className={`absolute inset-0 flex items-center justify-center ${dir === "UP" || dir === "DOWN" ? "flex-row gap-1" : "flex-col gap-1"}`}>
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black/80 rounded-full shadow-inner relative">
                                                <div className="absolute top-[1px] right-[1px] w-[2px] h-[2px] bg-white rounded-full" />
                                            </div>
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black/80 rounded-full shadow-inner relative">
                                                <div className="absolute top-[1px] right-[1px] w-[2px] h-[2px] bg-white rounded-full" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Controls */}
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-[240px] sm:max-w-[280px]">
                <div />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleControlClick("UP")} className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center shadow-lg active:shadow-inner transition-colors focus:outline-none">
                    <ChevronUp className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                </motion.button>
                <div />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleControlClick("LEFT")} className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center shadow-lg active:shadow-inner transition-colors focus:outline-none">
                    <ChevronLeft className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleControlClick("DOWN")} className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center shadow-lg active:shadow-inner transition-colors focus:outline-none">
                    <ChevronDown className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleControlClick("RIGHT")} className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center shadow-lg active:shadow-inner transition-colors focus:outline-none">
                    <ChevronRight className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                </motion.button>
            </div>

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-500 text-center uppercase tracking-widest font-bold">
                Usa WASD, Flechas o los botones
            </p>
        </div>
    );
}
