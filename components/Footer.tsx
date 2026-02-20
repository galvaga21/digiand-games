"use client";

export function Footer() {
    return (
        <footer className="w-full py-10 text-center border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md relative z-10">
            <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    © {new Date().getFullYear()} Digiand Games. Todos los derechos reservados.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">
                    Creado con <span className="text-black dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_5px_currentColor]">Next.js</span>, <span className="text-cyan-600 dark:text-cyan-400 drop-shadow-sm dark:drop-shadow-[0_0_5px_currentColor]">React</span> y <span className="text-fuchsia-600 dark:text-cyan-500 drop-shadow-sm dark:drop-shadow-[0_0_5px_currentColor]">Tailwind CSS v4</span>
                </p>
            </div>
        </footer>
    );
}
