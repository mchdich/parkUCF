import { useState, useEffect, useRef } from 'react';
import LogChart from './LogChart';
import OccupancyTracker from './OccupancyTracker';

const garages = ["A", "B", "C", "D", "G", "H", "I"];

export default function Log() {
        const [open, setOpen] = useState(false);
        const [selected, setSelected] = useState("All");
        const [showRotateHint, setShowRotateHint] = useState(false);
        const menuRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                    setOpen(false);
                }
            }
            if (open) {
                document.addEventListener("mousedown", handleClickOutside);
            } else {
                document.removeEventListener("mousedown", handleClickOutside);
            }
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [open]);

        useEffect(() => {
            if (typeof window === "undefined") return;
            const isMobilePortrait = () => window.innerWidth < 640 && window.innerHeight > window.innerWidth;

            // Show on page load if mobile portrait
            if (isMobilePortrait()) setShowRotateHint(true);

            const handleResize = () => {
                if (!isMobilePortrait()) setShowRotateHint(false);
                else setShowRotateHint(true);
            };
            window.addEventListener("resize", handleResize);
            window.addEventListener("orientationchange", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
                window.removeEventListener("orientationchange", handleResize);
            };
        }, []);
    return (
        <div className="mt-16">
            {showRotateHint && (
                <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-lg bg-[#232323] text-white text-sm font-semibold animate-pulse border border-[#444]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Rotate your phone for a better view
                </div>
            )}
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Real-time occupancy</h3>
            <div className="rounded-2xl bg-[#181818] text-white px-8 py-10 md:py-8 md:px-8 shadow-lg border border-[#232323] flex flex-col gap-4 max-w-4xl mx-auto" style={{fontFamily: 'inherit'}}>
                <div className="flex items-center gap-2">
                    <span>Choose a garage:</span>
                    <div className="relative inline-block text-left" ref={menuRef}>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center gap-x-1.5 rounded-md px-4 py-2 text-sm font-semibold text-white border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 min-w-[90px]"
                            onClick={() => setOpen((o) => !o)}
                            aria-haspopup="true"
                            aria-expanded={open}
                        >
                            {selected}
                            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="-mr-1 ml-2 h-5 w-5 text-gray-400">
                                <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" fillRule="evenodd" />
                            </svg>
                        </button>
                        {open && (
                            <div className="absolute right-0 mt-2 w-56 rounded-md bg-black shadow-lg ring-1 ring-black/10 focus:outline-none z-50 border border-[#232323]">
                                <div className="py-1">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-t-md focus:outline-none"
                                        onClick={() => { setSelected("All"); setOpen(false); }}
                                    >
                                        All
                                    </button>
                                    <div className="border-t border-[#232323] my-1" />
                                    {garages.map((g, i) => (
                                        <button
                                            key={g}
                                            className={`block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white ${i === garages.length - 1 ? 'rounded-b-md' : ''} focus:outline-none`}
                                            onClick={() => { setSelected(g); setOpen(false); }}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center text-gray-300 text-sm mb-2 mt-4">Garages today</div>
                <LogChart garage={selected} />
                <OccupancyTracker />
            </div>
        </div>
    )
}