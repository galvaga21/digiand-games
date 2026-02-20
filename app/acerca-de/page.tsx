export const metadata = {
    title: "Acerca De - Digiand Games",
    description: "Conoce más sobre nuestra plataforma de juegos.",
};

export default function AcercaDePage() {
    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center py-24 px-4 overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-600/5 dark:to-purple-900/10 pointer-events-none" />

            <div className="text-center mb-12 max-w-3xl mx-auto relative z-10 flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-500 drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] tracking-tight">
                    Acerca de la Plataforma
                </h1>

                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-[2.5rem] p-10 sm:p-16 shadow-xl dark:shadow-2xl relative w-full transition-colors duration-300">
                    {/* Pequeños resplandores en las esquinas */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/10 dark:bg-purple-500/20 blur-[50px] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-600/10 dark:bg-cyan-500/20 blur-[50px] pointer-events-none" />

                    <div className="relative z-10 space-y-6 text-left">
                        <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-2xl leading-relaxed">
                            <span className="font-bold text-gray-900 dark:text-white">Digiand Games</span> es tu destino definitivo para revivir los clásicos de siempre con una capa de modernidad.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl leading-relaxed">
                            Construido sobre una potente <span className="text-purple-600 dark:text-purple-400 font-semibold">Single Page Application (SPA)</span> utilizando:
                        </p>

                        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                            <li className="bg-gray-100/50 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm dark:shadow-inner hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors">
                                <span className="text-2xl font-black text-gray-900 dark:text-white mb-2">Next.js</span>
                                <span className="text-sm text-gray-600 dark:text-gray-500">App Router & Server Components</span>
                            </li>
                            <li className="bg-gray-100/50 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm dark:shadow-inner hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors">
                                <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mb-2">React</span>
                                <span className="text-sm text-gray-600 dark:text-gray-500">Hooks interactivos e interfaces dinámicas</span>
                            </li>
                            <li className="bg-gray-100/50 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm dark:shadow-inner hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors">
                                <span className="text-2xl font-black text-fuchsia-600 dark:text-fuchsia-400 mb-2">Tailwind v4</span>
                                <span className="text-sm text-gray-600 dark:text-gray-500">Glassmorphism y estilos premium</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
