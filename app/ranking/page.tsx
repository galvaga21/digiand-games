export const metadata = {
    title: "Ranking - Digiand Games",
    description: "Ranking global de jugadores.",
};

export default function RankingPage() {
    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
            {/* Glow Effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-yellow-500/10 dark:bg-yellow-500/10 rounded-[100%] blur-[120px] pointer-events-none" />

            <div className="text-center mb-12 relative z-10 mt-10">
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight">
                    Ranking Global
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg px-4">
                    Compite con jugadores de todo el mundo y sube en la clasificación.
                </p>
            </div>

            <div className="w-full max-w-2xl bg-white/80 dark:bg-[#111] backdrop-blur-xl rounded-3xl border border-black/10 dark:border-white/10 p-8 sm:p-12 text-center shadow-lg dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 transition-colors duration-300">
                <div className="animate-pulse space-y-6">
                    <div className="h-16 bg-gray-200 dark:bg-white/10 rounded-2xl w-full"></div>
                    <div className="h-16 bg-gray-100 dark:bg-white/5 rounded-2xl w-full"></div>
                    <div className="h-16 bg-gray-100 dark:bg-white/5 rounded-2xl w-full"></div>
                </div>
                <div className="mt-12 inline-flex px-8 py-3 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 uppercase tracking-widest text-sm font-bold shadow-sm dark:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                    Próximamente Disponible
                </div>
            </div>
        </div>
    );
}
