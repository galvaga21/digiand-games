"use client";

import { motion } from "framer-motion";
import { Gamepad2, Play } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden w-full py-10 px-4 pt-24">
            {/* Background Neon Effects */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/20 dark:bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 dark:bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 flex flex-col items-center text-center max-w-4xl w-full"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 p-5 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.2)] dark:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                >
                    <Gamepad2 className="w-16 h-16 text-purple-600 dark:text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] dark:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                </motion.div>

                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-600 to-cyan-600 dark:from-purple-400 dark:via-fuchsia-500 dark:to-cyan-400 pb-2 drop-shadow-sm dark:drop-shadow-lg leading-tight">
                    Revive los Clásicos
                </h1>

                <p className="text-lg sm:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl leading-relaxed mx-auto px-4 font-medium">
                    La plataforma definitiva de juegos clásicos. Sumérgete en
                    experiencias interactivas con diseños de neón y cristal.
                </p>

                <Link href="/juegos" passHref>
                    <motion.div
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-purple-600/10 dark:bg-purple-600/20 backdrop-blur-md text-purple-900 dark:text-white md:text-lg font-bold rounded-full overflow-hidden border border-purple-500/30 dark:border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] dark:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 cursor-pointer"
                    >
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-300" />
                            Comenzar a Jugar
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
                    </motion.div>
                </Link>
            </motion.div>
        </section>
    );
}
