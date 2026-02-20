import { TicTacToe } from "@/components/TicTacToe";

export const metadata = {
    title: "Juegos - Digiand Games",
    description: "Juega a los mejores clásicos de la web.",
};

export default function JuegosPage() {
    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center py-10 px-4 overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center flex-1">
                <div className="text-center mb-8 sm:mb-12 mt-4 md:mt-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-fuchsia-600 dark:from-cyan-400 dark:to-fuchsia-500 inline-block drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(232,121,249,0.3)] tracking-tight">
                        Tres en Raya Clásico
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base sm:text-lg px-4 gap-2">
                        Demuestra tu estrategia. Un enfrentamiento de ingenio en una consola completamente reimaginada.
                    </p>
                </div>

                <TicTacToe />
            </div>
        </div>
    );
}
