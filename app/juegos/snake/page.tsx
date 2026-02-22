import { SnakeGame } from "@/components/SnakeGame";

export const metadata = {
    title: "Snake - Digiand Games",
    description: "Juega al clásico Snake (La Viborita).",
};

export default function SnakePage() {
    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center py-10 px-4 overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center flex-1">
                <div className="text-center mb-6 sm:mb-8 mt-4 md:mt-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500 dark:from-emerald-400 dark:to-lime-400 inline-block drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] tracking-tight">
                        Snake Neón
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-base sm:text-lg px-4 gap-2">
                        Cómete las manzanas brillantes para crecer y evita chocar contra los muros o tu propia cola.
                    </p>
                </div>

                <SnakeGame />
            </div>
        </div>
    );
}
