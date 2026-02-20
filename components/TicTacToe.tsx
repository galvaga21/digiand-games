"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";

type Player = "X" | "O" | null;

export function TicTacToe() {
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [scores, setScores] = useState({ X: 0, O: 0 });

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

    const handleClick = (index: number) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);

        const { winner: newWinner } = getWinningInfo(newBoard);
        if (newWinner) {
            setScores(prev => ({ ...prev, [newWinner]: prev[newWinner as 'X' | 'O'] + 1 }));
        }

        setIsXNext(!isXNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto">
            {/* Score Board - Estilo Dashboard */}
            <div className="flex w-full justify-between items-center mb-6 sm:mb-8 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-black/10 dark:border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none" />
                <div className="absolute right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-[40px] pointer-events-none" />

                <div className={`flex flex-col items-center p-3 sm:px-6 rounded-2xl transition-all duration-500 relative z-10 ${isXNext && !winner && !isDraw ? 'bg-cyan-500/10 shadow-[inner_0_0_20px_rgba(34,211,238,0.2)] scale-105' : 'opacity-50 grayscale-[50%]'}`}>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold text-sm sm:text-base mb-1 tracking-widest uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Jugador X</span>
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{scores.X}</span>
                </div>

                <div className="flex flex-col items-center px-2 sm:px-4 relative z-10">
                    <motion.div
                        animate={winner ? { rotateY: 360, scale: 1.2 } : { rotateY: 0, scale: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mb-1 sm:mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] dark:drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                    </motion.div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-widest hidden sm:block">Puntos</span>
                </div>

                <div className={`flex flex-col items-center p-3 sm:px-6 rounded-2xl transition-all duration-500 relative z-10 ${!isXNext && !winner && !isDraw ? 'bg-fuchsia-500/10 shadow-[inner_0_0_20px_rgba(232,121,249,0.2)] scale-105' : 'opacity-50 grayscale-[50%]'}`}>
                    <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold text-sm sm:text-base mb-1 tracking-widest uppercase drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]">Jugador O</span>
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{scores.O}</span>
                </div>
            </div>

            {/* Game Board Container - Consola */}
            <div className="relative p-6 sm:p-10 rounded-[2.5rem] bg-gray-100/80 dark:bg-[#0f0f0f]/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.1),inset_0_0_2px_rgba(255,255,255,0.5)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_2px_rgba(255,255,255,0.2)] w-full overflow-hidden flex flex-col items-center">
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
                                Turno de:
                                <span className={`flex items-center justify-center w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 text-2xl font-black shadow-inner border border-black/10 dark:border-white/10 ${isXNext ? 'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]' : 'text-fuchsia-600 dark:text-fuchsia-400 drop-shadow-[0_0_8px_#e879f9]'}`}>
                                    {isXNext ? "X" : "O"}
                                </span>
                            </motion.div>
                        )}
                        {winner && (
                            <motion.div
                                key="win"
                                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", bounce: 0.6 }}
                                className={`text-3xl font-black tracking-wide ${winner === "X" ? "text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] dark:drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" : "text-fuchsia-600 dark:text-fuchsia-400 drop-shadow-[0_0_20px_rgba(232,121,249,0.5)] dark:drop-shadow-[0_0_20px_rgba(232,121,249,0.8)]"}`}
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
                                whileHover={!cell && !winner ? { scale: 1.05, backgroundColor: "rgba(128,128,128,0.1)" } : {}}
                                whileTap={!cell && !winner ? { scale: 0.95 } : {}}
                                onClick={() => handleClick(index)}
                                className={`
                  w-[4.5rem] h-[4.5rem] sm:w-[6rem] sm:h-[6rem]
                  flex items-center justify-center text-4xl sm:text-6xl font-black rounded-2xl
                  transition-all duration-300 touch-manipulation relative
                  ${cell ? 'bg-black/5 dark:bg-white/5' : 'bg-white dark:bg-[#1a1a1a] hover:bg-black/5 dark:hover:bg-white/5'}
                  border border-black/10 dark:border-white/5 shadow-sm dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]
                  ${isWinningCell ? (winner === "X" ? 'bg-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.3),inset_0_0_15px_rgba(34,211,238,0.3)] dark:shadow-[0_0_30px_rgba(34,211,238,0.5),inset_0_0_15px_rgba(34,211,238,0.5)] border-cyan-400/50 scale-105 z-20' : 'bg-fuchsia-500/20 shadow-[0_0_30px_rgba(232,121,249,0.3),inset_0_0_15px_rgba(232,121,249,0.3)] dark:shadow-[0_0_30px_rgba(232,121,249,0.5),inset_0_0_15px_rgba(232,121,249,0.5)] border-fuchsia-400/50 scale-105 z-20') : ''}
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
