"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, User, Bot, Trophy, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import confetti from "canvas-confetti";

type GameMode = "pvp" | "pve";

const SNAKES = [
    { from: 17, to: 7 },
    { from: 54, to: 34 },
    { from: 62, to: 19 },
    { from: 64, to: 60 },
    { from: 87, to: 36 },
    { from: 93, to: 73 },
    { from: 95, to: 75 },
    { from: 98, to: 79 },
];

const LADDERS = [
    { from: 4, to: 14 },
    { from: 9, to: 31 },
    { from: 21, to: 42 },
    { from: 28, to: 84 },
    { from: 51, to: 67 },
    { from: 72, to: 91 },
    { from: 80, to: 99 },
];

const DiceIcons = [Dice1, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]; // 1-based indexing

const getCellNumber = (index: number) => {
    const row = Math.floor(index / 10);
    const col = index % 10;
    const isEvenRow = row % 2 === 0;
    if (isEvenRow) {
        return 100 - (row * 10) - col;
    } else {
        return 100 - (row * 10) - 9 + col;
    }
};

const getCellCenterNumeric = (cell: number) => {
    if (cell < 1) cell = 1;
    if (cell > 100) cell = 100;
    const idx = cell - 1;
    const yRow = Math.floor(idx / 10);
    const xCol = (yRow % 2 === 0) ? (idx % 10) : (9 - (idx % 10));
    return { x: xCol * 10 + 5, y: (9 - yRow) * 10 + 5 };
};

export function SnakesLadders() {
    const [p1Pos, setP1Pos] = useState(1);
    const [p2Pos, setP2Pos] = useState(1);
    const [diceVal, setDiceVal] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [gameMode, setGameMode] = useState<GameMode>("pvp");
    const [isP1Turn, setIsP1Turn] = useState(true);
    const [winner, setWinner] = useState<1 | 2 | null>(null);
    const [isAITurn, setIsAITurn] = useState(false);
    const [scores, setScores] = useState({ 1: 0, 2: 0 });

    // Prevents issues with strict mode or overlapping renders
    const isMovingRef = useRef(false);

    useEffect(() => {
        const savedScores = localStorage.getItem("snakes-scores");
        if (savedScores) {
            try {
                setScores(JSON.parse(savedScores));
            } catch (e) {
                console.error("Error loading localStorage", e);
            }
        }
    }, []);

    const updateScores = (newScores: { 1: number, 2: number }) => {
        setScores(newScores);
        localStorage.setItem("snakes-scores", JSON.stringify(newScores));
    };

    const triggerConfetti = (winnerNum: 1 | 2) => {
        const end = Date.now() + 2 * 1000;
        const colors = winnerNum === 1 ? ["#22d3ee", "#ffffff"] : ["#e879f9", "#ffffff"];

        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    };

    const rollDice = async (): Promise<number> => {
        setIsRolling(true);
        let finalVal = 1;
        for (let i = 0; i < 15; i++) {
            finalVal = Math.floor(Math.random() * 6) + 1;
            setDiceVal(finalVal);
            await new Promise(r => setTimeout(r, 60)); // Fast rolling animation
        }
        setIsRolling(false);
        return finalVal;
    };

    const movePlayer = async (player: 1 | 2, spaces: number) => {
        let current = player === 1 ? p1Pos : p2Pos;
        let dir = 1;

        // Animate step by step
        for (let i = 0; i < spaces; i++) {
            if (current === 100) dir = -1;
            current += dir;
            if (player === 1) setP1Pos(current); else setP2Pos(current);
            await new Promise(r => setTimeout(r, 200)); // Delay between steps
        }

        // Check Snakes / Ladders
        const snake = SNAKES.find(s => s.from === current);
        const ladder = LADDERS.find(l => l.from === current);
        let target = current;

        if (snake) {
            await new Promise(r => setTimeout(r, 400));
            target = snake.to;
            if (player === 1) setP1Pos(target); else setP2Pos(target);
            await new Promise(r => setTimeout(r, 400));
        } else if (ladder) {
            await new Promise(r => setTimeout(r, 400));
            target = ladder.to;
            if (player === 1) setP1Pos(target); else setP2Pos(target);
            await new Promise(r => setTimeout(r, 400));
        }

        if (target === 100) {
            setWinner(player);
            triggerConfetti(player);
            updateScores({
                ...scores,
                [player]: scores[player] + 1
            });
            setTimeout(() => isMovingRef.current = false, 500);
            return;
        }

        setIsP1Turn(prev => !prev);
        isMovingRef.current = false;
    };

    const handleAction = async () => {
        if (winner || isRolling || isAITurn || isMovingRef.current) return;
        isMovingRef.current = true;

        const val = await rollDice();
        const player = isP1Turn ? 1 : 2;
        await movePlayer(player, val);
    };

    // AI Turn Hook
    useEffect(() => {
        if (gameMode === "pve" && !isP1Turn && !winner && !isMovingRef.current) {
            setIsAITurn(true);
            const timer = setTimeout(async () => {
                isMovingRef.current = true;
                const val = await rollDice();
                await movePlayer(2, val);
                setIsAITurn(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isP1Turn, gameMode, winner]);

    const resetGame = () => {
        setP1Pos(1);
        setP2Pos(1);
        setIsP1Turn(true);
        setWinner(null);
        setDiceVal(1);
        setIsAITurn(false);
        isMovingRef.current = false;
    };

    const resetScores = () => updateScores({ 1: 0, 2: 0 });

    const DiceIcon = DiceIcons[diceVal];

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 max-w-6xl mx-auto pb-10">
            {/* Controles y UI lateral */}
            <div className="flex flex-col items-center w-full max-w-sm gap-6 order-2 lg:order-1">
                {/* Mode Selector */}
                <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/10 dark:border-white/10 w-full backdrop-blur-md shadow-sm">
                    <button
                        onClick={() => { setGameMode("pvp"); resetGame(); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-bold transition-all ${gameMode === "pvp" ? "bg-white dark:bg-white/20 text-cyan-600 dark:text-cyan-400 shadow-xl" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                    >
                        <User className="w-4 h-4" /> 1 vs 1
                    </button>
                    <button
                        onClick={() => { setGameMode("pve"); resetGame(); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-bold transition-all ${gameMode === "pve" ? "bg-white dark:bg-white/20 text-fuchsia-600 dark:text-fuchsia-400 shadow-xl" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                    >
                        <Bot className="w-4 h-4" /> vs CPU
                    </button>
                </div>

                {/* Score Board */}
                <div className="flex w-full justify-between items-center bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-black/10 dark:border-white/10 shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    <button
                        onClick={resetScores}
                        className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                        Borrar Wins
                    </button>

                    <div className={`flex flex-col items-center p-2 sm:px-4 rounded-2xl transition-all duration-500 relative z-10 ${isP1Turn && !winner ? 'bg-cyan-500/10 shadow-[inner_0_0_20px_rgba(34,211,238,0.2)] scale-105' : 'opacity-70'}`}>
                        <div className="w-3 h-3 rounded-full bg-cyan-500 dark:bg-cyan-400 mb-2 shadow-[0_0_8px_cyan]"></div>
                        <span className="text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest">
                            {gameMode === "pve" ? "Humano" : "P1"}
                        </span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">{scores[1]}</span>
                    </div>

                    <div className="flex flex-col items-center px-1 pt-4 relative z-10">
                        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                    </div>

                    <div className={`flex flex-col items-center p-2 sm:px-4 rounded-2xl transition-all duration-500 relative z-10 ${!isP1Turn && !winner ? 'bg-fuchsia-500/10 shadow-[inner_0_0_20px_rgba(232,121,249,0.2)] scale-105' : 'opacity-70'}`}>
                        <div className="w-3 h-3 rounded-full bg-fuchsia-500 dark:bg-fuchsia-400 mb-2 shadow-[0_0_8px_fuchsia]"></div>
                        <span className="text-fuchsia-700 dark:text-fuchsia-400 font-bold text-xs uppercase tracking-widest">
                            {gameMode === "pve" ? "CPU" : "P2"}
                        </span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">{scores[2]}</span>
                    </div>
                </div>

                {/* Dice Action Area */}
                <div className="w-full flex flex-col items-center bg-white/50 dark:bg-[#0f0f0f]/80 p-6 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_2px_rgba(255,255,255,0.2)] relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-[80px]" />

                    <AnimatePresence mode="wait">
                        {winner && (
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className={`text-2xl font-black tracking-wide mb-4 ${winner === 1 ? "text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" : "text-fuchsia-600 dark:text-fuchsia-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.8)]"}`}
                            >
                                ¡GANADOR P{winner}!
                            </motion.div>
                        )}
                        {!winner && (
                            <motion.div
                                key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 h-8 flex items-center justify-center text-center"
                            >
                                {isAITurn ? <span className="animate-pulse">CPU tirando dados...</span> : `Turno: ${isP1Turn ? 'Jugador 1' : 'Jugador 2'}`}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        animate={{ rotate: isRolling ? [0, 90, 180, 270, 360] : 0, scale: isRolling ? 1.2 : 1 }}
                        transition={{ duration: 0.3, repeat: isRolling ? Infinity : 0, ease: "linear" }}
                        className={`mb-6 flex items-center justify-center w-24 h-24 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-lg ${isRolling ? "shadow-purple-500/40" : ""}`}
                    >
                        <DiceIcon className={`w-14 h-14 ${isP1Turn ? 'text-cyan-600 dark:text-cyan-400' : 'text-fuchsia-600 dark:text-fuchsia-400'} drop-shadow-sm dark:drop-shadow-[0_0_8px_currentColor]`} />
                    </motion.div>

                    <div className="flex gap-2 w-full">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAction}
                            disabled={!!winner || isRolling || isAITurn}
                            className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-md ${!!winner || isRolling || isAITurn
                                    ? "bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                    : "bg-purple-600/10 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] dark:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                }`}
                        >
                            {isRolling ? "Tirando..." : "Lanzar Dado"}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetGame}
                            title="Reiniciar Juego"
                            className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shadow-sm"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Board */}
            <div className="order-1 lg:order-2 w-full max-w-[500px] aspect-square relative p-1.5 sm:p-3 bg-white/50 dark:bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[1.5rem] sm:rounded-[2.5rem] border border-black/10 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col items-center justify-center mx-auto">
                <div className="w-full h-full relative">
                    {/* SVG LADDERS AND SNAKES OVERLAY */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ filter: "drop-shadow(0 0 5px rgba(0,0,0,0.3))" }}>
                        <defs>
                            <linearGradient id="ladderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                            </linearGradient>
                            <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#d946ef" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>

                        {LADDERS.map((l, i) => {
                            const start = getCellCenterNumeric(l.from);
                            const end = getCellCenterNumeric(l.to);
                            return (
                                <g key={`ladder-${i}`}>
                                    <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="url(#ladderGrad)" strokeWidth="1.2" strokeDasharray="1.5 1" strokeLinecap="round" opacity="0.9" className="dark:opacity-100" />
                                </g>
                            );
                        })}

                        {SNAKES.map((s, i) => {
                            const start = getCellCenterNumeric(s.from); // head
                            const end = getCellCenterNumeric(s.to);   // tail
                            return (
                                <path
                                    key={`snake-${i}`}
                                    d={`M ${start.x} ${start.y} Q ${Math.max(start.x, end.x) + 10} ${(start.y + end.y) / 2} ${end.x} ${end.y}`}
                                    stroke="url(#snakeGrad)"
                                    fill="none"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    opacity="0.9"
                                    className="dark:opacity-100"
                                />
                            );
                        })}
                    </svg>

                    {/* Grid */}
                    <div className="grid grid-cols-10 grid-rows-10 w-full h-full gap-0.5 sm:gap-1 relative z-20">
                        {Array.from({ length: 100 }).map((_, i) => {
                            const num = getCellNumber(i);
                            const isStart = num === 1;
                            const isEnd = num === 100;
                            // Add slight highlight to stairs and snakes
                            const isLadderStart = LADDERS.some(l => l.from === num);
                            const isSnakeStart = SNAKES.some(s => s.from === num);

                            return (
                                <div
                                    key={num}
                                    className={`relative flex items-center justify-center rounded-sm sm:rounded-md text-[0.55rem] sm:text-[0.65rem] font-bold transition-all overflow-hidden
                                        ${(num % 2 === 0) ? 'bg-black/5 dark:bg-white/[0.03]' : 'bg-black/[0.02] dark:bg-white/[0.05]'}
                                        ${isStart ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30' : ''}
                                        ${isEnd ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30 drop-shadow-sm dark:shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border border-black/5 dark:border-white/5'}
                                        ${!isStart && !isEnd ? (isLadderStart ? 'text-green-700 dark:text-green-500' : isSnakeStart ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-600') : ''}
                                    `}
                                >
                                    <span className={isLadderStart || isSnakeStart || isStart || isEnd ? "opacity-100" : "opacity-40"}>{num}</span>

                                    <div className="absolute inset-0 flex items-center justify-center flex-wrap gap-0.5 pointer-events-none p-0.5">
                                        {p1Pos === num && (
                                            <motion.div
                                                layoutId="player1"
                                                className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_0_8px_#22d3ee] z-30"
                                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                            />
                                        )}
                                        {p2Pos === num && (
                                            <motion.div
                                                layoutId="player2"
                                                className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 shadow-[0_0_8px_#e879f9] z-30"
                                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
