import Link from "next/link";
import { Gamepad2, ArrowUpRight } from "lucide-react";

export const metadata = {
    title: "Catálogo de Juegos - Digiand Games",
    description: "Selecciona el clásico que quieres jugar.",
};

export default function JuegosDashboard() {
    const games = [
        {
            id: "michi",
            title: "Tres en Raya",
            description: "El clásico enfrentamiento mental de cruces y círculos. Ahora con IA Imposible.",
            path: "/juegos/michi",
            gradient: "from-cyan-500 to-purple-600",
            iconColor: "text-cyan-400",
            glowBg: "bg-cyan-500/20",
        },
        {
            id: "serpientes",
            title: "Serpientes y Escaleras",
            description: "Tira los dados y alcanza las estrellas evitando la caída libre.",
            path: "/juegos/serpientes",
            gradient: "from-green-500 to-red-600",
            iconColor: "text-green-400",
            glowBg: "bg-green-500/20",
        }
    ];

    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center flex-1">
                <div className="text-center mb-12 sm:mb-16 mt-4 md:mt-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-500 inline-block drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(232,121,249,0.3)] tracking-tight">
                        Catálogo de Juegos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base sm:text-lg px-4 gap-2">
                        Selecciona tu aventura clásica y compite en solitario o multijugador.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full px-4 max-w-4xl">
                    {games.map((game) => (
                        <Link key={game.id} href={game.path} className="group relative">
                            {/* Background Ambient Glow */}
                            <div className={`absolute -inset-1 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500 ${game.glowBg}`}></div>

                            <div className="relative h-full flex flex-col justify-between p-8 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl dark:group-hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                                {/* Decorational diagonal lines in background */}
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transform rotate-12 bg-white" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)" }} />

                                <div className="relative z-10">
                                    <div className="p-3 bg-black/5 dark:bg-white/5 inline-flex rounded-xl mb-6 shadow-sm dark:shadow-inner border border-black/5 dark:border-white/5">
                                        <Gamepad2 className={`w-8 h-8 ${game.iconColor} drop-shadow-sm`} />
                                    </div>

                                    <h2 className="text-2xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-400 transition-all duration-300">
                                        {game.title}
                                    </h2>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                                        {game.description}
                                    </p>
                                </div>

                                <div className="relative z-10 flex items-center text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mt-auto">
                                    Jugar Ahora
                                    <ArrowUpRight className="ml-2 w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>

                                {/* Hover Gradient Line at bottom */}
                                <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${game.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}
