"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, User, Bot, Zap, Brain, Flame } from "lucide-react";
import confetti from "canvas-confetti";

type Player = "X" | "O" | null;
type GameMode = "pvp" | "pve";
type Difficulty = "easy" | "medium" | "hard";

export function TicTacToe() {
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [gameMode, setGameMode] = useState<GameMode>("pvp");
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    const [isAITurn, setIsAITurn] = useState<boolean>(false);

    // Cargar puntajes de localStorage al iniciar
    useEffect(() => {
        const savedScores = localStorage.getItem("tictactoe-scores");
        if (savedScores) {
            try {
                setScores(JSON.parse(savedScores));
            } catch (e) {
                console.error("Error al cargar localStorage", e);
            }
        }
    }, []);

    const updateScores = (newScores: { X: number, O: number }) => {
        setScores(newScores);
        localStorage.setItem("tictactoe-scores", JSON.stringify(newScores));
    };

    const winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const getWinningInfo = (squares: Player[]): { winner: Player; line: number[] } => {
        for (let i = 0; i < winLines.length; i++) {
            const [a, b, c] = winLines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line: winLines[i] };
            }
        }
        return { winner: null, line: [] };
    };

    const { winner, line: winningLine } = getWinningInfo(board);
    const isDraw = !winner && board.every(square => square !== null);

    // Efecto confeti al ganar
    useEffect(() => {
        if (winner) {
            const end = Date.now() + 2 * 1000;
            const colors = winner === "X" ? ["#22d3ee", "#ffffff"] : ["#e879f9", "#ffffff"];

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }, [winner]);

    // Algoritmo Minimax perfecto
    const minimax = (squares: Player[], depth: number, isMaximizing: boolean): number => {
        const winInfo = getWinningInfo(squares);
        if (winInfo.winner === "O") return 10 - depth; // IA gana
        if (winInfo.winner === "X") return depth - 10; // IA pierde
        if (squares.every(s => s !== null)) return 0;  // Empate

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (squares[i] === null) {
                    squares[i] = "O";
                    const score = minimax(squares, depth + 1, false);
                    squares[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (squares[i] === null) {
                    squares[i] = "X";
                    const score = minimax(squares, depth + 1, true);
                    squares[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const getAIMove = (squares: Player[]): number => {
        const availableMoves = squares.map((sq, i) => sq === null ? i : null).filter(val => val !== null) as number[];

        let useMinimax = false;
        if (difficulty === "hard") useMinimax = true;
        if (difficulty === "medium") {
            // 60% probabilidad algoritmo perfecto
            useMinimax = Math.random() < 0.6;
        }
        // easy = useMinimax is false (random)

        if (useMinimax) {
            let bestScore = -Infinity;
            let move = availableMoves[0];
            for (let i = 0; i < 9; i++) {
                if (squares[i] === null) {
                    squares[i] = "O";
                    const score = minimax(squares, 0, false);
                    squares[i] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        move = i;
                    }
                }
            }
            return move;
        } else {
            const randomIndex = Math.floor(Math.random() * availableMoves.length);
            return availableMoves[randomIndex];
        }
    };

    const executeMove = (index: number, player: Player) => {
        const newBoard = [...board];
        newBoard[index] = player;
        setBoard(newBoard);

        const { winner: newWinner } = getWinningInfo(newBoard);
        if (newWinner) {
            updateScores({
                ...scores,
                [newWinner]: scores[newWinner as 'X' | 'O'] + 1
            });
            setIsAITurn(false);
            return;
        }

        const nextPlayer = player === "X" ? "O" : "X";
        setIsXNext(nextPlayer === "X");
    };

    const handleCellClick = (index: number) => {
        if (board[index] || winner || (gameMode === "pve" && isAITurn)) return;
        const currentPlayer = isXNext ? "X" : "O";
        executeMove(index, currentPlayer);
    };

    // Efecto de Turno de la IA
    useEffect(() => {
        if (gameMode === "pve" && !isXNext && !winner && !isDraw) {
            setIsAITurn(true);
            const timer = setTimeout(() => {
                const move = getAIMove(board);
                if (move !== undefined) {
                    executeMove(move, "O");
                }
                setIsAITurn(false);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [isXNext, gameMode, winner, isDraw, board]);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setIsAITurn(false);
    };

    const resetScores = () => {
        updateScores({ X: 0, O: 0 });
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto">

            {/* Controles de Modo de Juego */}
            <div className="flex flex-col sm:flex-row w-full gap-4 mb-6 relative z-10">
                <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/10 dark:border-white/10 w-full backdrop-blur-md shadow-sm">
                    <button
                        onClick={() => { setGameMode("pvp"); resetGame(); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-bold transition-all ${gameMode === "pvp" ? "bg-white dark:bg-white/20 text-cyan-600 dark:text-cyan-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                    >
                        <User className="w-4 h-4" /> 1 vs 1
                    </button>
                    <button
                        onClick={() => { setGameMode("pve"); resetGame(); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-bold transition-all ${gameMode === "pve" ? "bg-white dark:bg-white/20 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                    >
                        <Bot className="w-4 h-4" /> vs CPU
                    </button>
                </div>

                <AnimatePresence>
                    {gameMode === "pve" && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="flex bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/10 dark:border-white/10 overflow-hidden backdrop-blur-md sm:min-w-[150px] shadow-sm justify-center"
                        >
                            <button onClick={() => { setDifficulty("easy"); resetGame(); }} className={`flex-1 px-3 flex justify-center items-center transition-colors ${difficulty === "easy" ? "text-green-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`} title="Fácil">
                                <Zap className={`w-5 h-5 ${difficulty === "easy" ? "fill-green-500/20" : ""}`} />
                            </button>
                            <button onClick={() => { setDifficulty("medium"); resetGame(); }} className={`flex-1 px-3 flex justify-center items-center transition-colors ${difficulty === "medium" ? "text-yellow-600 dark:text-yellow-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`} title="Medio">
                                <Brain className={`w-5 h-5 ${difficulty === "medium" ? "fill-yellow-500/20" : ""}`} />
                            </button>
                            <button onClick={() => { setDifficulty("hard"); resetGame(); }} className={`flex-1 px-3 flex justify-center items-center transition-colors ${difficulty === "hard" ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] dark:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`} title="Imposible">
                                <Flame className={`w-5 h-5 ${difficulty === "hard" ? "fill-red-500/20" : ""}`} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Score Board */}
            <div className="flex w-full justify-between items-center mb-6 sm:mb-8 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-black/10 dark:border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none" />
                <div className="absolute right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-[40px] pointer-events-none" />

                {/* Reset Score button shown on hover */}
                <button
                    onClick={resetScores}
                    className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                    Borrar Rating
                </button>

                <div className={`flex flex-col items-center p-3 sm:px-6 rounded-2xl transition-all duration-500 relative z-10 ${isXNext && !winner && !isDraw ? 'bg-cyan-500/10 shadow-[inner_0_0_20px_rgba(34,211,238,0.2)] scale-105' : 'opacity-50 grayscale-[50%]'}`}>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1 tracking-widest uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                        {gameMode === "pve" ? "Humano (X)" : "Jugador (X)"}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{scores.X}</span>
                </div>

                <div className="flex flex-col items-center px-2 sm:px-4 relative z-10 pt-4">
                    <motion.div
                        animate={winner ? { rotateY: 360, scale: 1.2 } : { rotateY: 0, scale: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mb-1 sm:mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] dark:drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                    </motion.div>
                </div>

                <div className={`flex flex-col items-center p-3 sm:px-6 rounded-2xl transition-all duration-500 relative z-10 ${!isXNext && !winner && !isDraw ? 'bg-fuchsia-500/10 shadow-[inner_0_0_20px_rgba(232,121,249,0.2)] scale-105' : 'opacity-50 grayscale-[50%]'}`}>
                    <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold text-sm sm:text-base mb-1 tracking-widest uppercase drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]">
                        {gameMode === "pve" ? "CPU (O)" : "Jugador (O)"}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{scores.O}</span>
                </div>
            </div>

            {/* Game Board Container */}
            <div className={`relative p-6 sm:p-10 rounded-[2.5rem] bg-gray-100/80 dark:bg-[#0f0f0f]/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.1),inset_0_0_2px_rgba(255,255,255,0.5)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_2px_rgba(255,255,255,0.2)] w-full overflow-hidden flex flex-col items-center transition-opacity duration-300 ${isAITurn ? "pointer-events-none" : ""}`}>
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Status Message */}
                <div className="w-full text-center mb-8 h-10 flex items-center justify-center relative z-10">
                    <AnimatePresence mode="wait">
                        {!winner && !isDraw && (
                            <motion.div
                                key="turn"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-3 text-lg font-medium text-gray-600 dark:text-gray-400"
                            >
                                {isAITurn ? <span className="animate-pulse">CPU pensando...</span> : "Turno de:"}
                                {!isAITurn && (
                                    <span className={`flex items-center justify-center w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 text-2xl font-black shadow-inner border border-black/10 dark:border-white/10 ${isXNext ? 'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]' : 'text-fuchsia-600 dark:text-fuchsia-400 drop-shadow-[0_0_8px_#e879f9]'}`}>
                                        {isXNext ? "X" : "O"}
                                    </span>
                                )}
                            </motion.div>
                        )}
                        {winner && (
                            <motion.div
                                key="win"
                                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", bounce: 0.6 }}
                                className={`text-3xl font-black tracking-wide ${winner === "X" ? "text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] dark:drop-shadow-[0_0_30px_rgba(34,211,238,1)]" : "text-fuchsia-600 dark:text-fuchsia-400 drop-shadow-[0_0_20px_rgba(232,121,249,0.5)] dark:drop-shadow-[0_0_30px_rgba(232,121,249,1)]"}`}
                            >
                                ¡GANADOR {winner}!
                            </motion.div>
                        )}
                        {isDraw && (
                            <motion.div
                                key="draw"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-3xl font-black text-yellow-600 dark:text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] dark:drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]"
                            >
                                ¡EMPATE!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Board */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10 mb-10">
                    {board.map((cell, index) => {
                        const isWinningCell = winningLine.includes(index);

                        return (
                            <motion.button
                                key={index}
                                whileHover={!cell && !winner && (!isAITurn) ? { scale: 1.05, backgroundColor: "rgba(128,128,128,0.1)" } : {}}
                                whileTap={!cell && !winner && (!isAITurn) ? { scale: 0.95 } : {}}
                                onClick={() => handleCellClick(index)}
                                disabled={isAITurn}
                                className={`
                  w-[4.5rem] h-[4.5rem] sm:w-[6rem] sm:h-[6rem]
                  flex items-center justify-center text-4xl sm:text-6xl font-black rounded-2xl
                  transition-all duration-300 touch-manipulation relative
                  ${cell ? 'bg-black/5 dark:bg-white/5' : 'bg-white dark:bg-[#1a1a1a] hover:bg-black/5 dark:hover:bg-white/5'}
                  border border-black/10 dark:border-white/5 shadow-sm dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]
                  ${isWinningCell ? (winner === "X" ? 'bg-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.6),inset_0_0_15px_rgba(34,211,238,0.5)] dark:shadow-[0_0_40px_rgba(34,211,238,0.8),inset_0_0_15px_rgba(34,211,238,0.5)] border-cyan-400/50 scale-105 z-20' : 'bg-fuchsia-500/20 shadow-[0_0_30px_rgba(232,121,249,0.6),inset_0_0_15px_rgba(232,121,249,0.5)] dark:shadow-[0_0_40px_rgba(232,121,249,0.8),inset_0_0_15px_rgba(232,121,249,0.5)] border-fuchsia-400/50 scale-105 z-20') : ''}
                `}
                            >
                                <AnimatePresence>
                                    {cell && (
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0, rotate: -90 }}
                                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className={`absolute ${cell === "X" ? "text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" : "text-fuchsia-600 dark:text-fuchsia-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.6)]"}`}
                                        >
                                            {cell}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        );
                    })}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(128,128,128,0.15)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="mx-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-bold transition-all duration-300 relative z-10 group sm:min-w-[240px] shadow-sm dark:shadow-none"
                >
                    <RotateCcw className={`w-5 h-5 transition-transform duration-500 ${winner || isDraw ? 'animate-spin group-hover:animate-none text-yellow-600 dark:text-yellow-500' : 'group-hover:-rotate-180'}`} />
                    Jugar de Nuevo
                </motion.button>
            </div>
        </div>
    );
}
