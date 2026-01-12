"use client";
import { useEffect, useState, useRef } from 'react';

const garageOrder = ['A', 'B', 'C', 'D', 'G', 'H', 'I'];

// Returns a color from green (0%) -> yellow (50%) -> red (100%)
function getOccupancyColor(rate: number): string {
    const clamped = Math.max(0, Math.min(1, rate));
    if (clamped <= 0.5) {
        // Green to Yellow: interpolate from #22c55e to #eab308
        const t = clamped / 0.5;
        const r = Math.round(34 + t * (234 - 34));
        const g = Math.round(197 + t * (179 - 197));
        const b = Math.round(94 + t * (8 - 94));
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        // Yellow to Red: interpolate from #eab308 to #ef4444
        const t = (clamped - 0.5) / 0.5;
        const r = Math.round(234 + t * (239 - 234));
        const g = Math.round(179 + t * (68 - 179));
        const b = Math.round(8 + t * (68 - 8));
        return `rgb(${r}, ${g}, ${b})`;
    }
}

type GarageData = {
    name: string;
    letter: string;
    occupancyRate: number;
    timestamp: string;
    hourAgoRate?: number; // occupancy rate from ~1 hour ago
};

export default function OccupancyTracker() {
    const [garages, setGarages] = useState<GarageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver to trigger animation on scroll
    useEffect(() => {
        if (loading || !containerRef.current) return;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [loading]);

    useEffect(() => {
        fetch('https://parkucf-hsbpefgpekhph5fv.centralus-01.azurewebsites.net/api/daily_log')
            .then(response => response.json())
            .then(data => {
                // Sort by timestamp descending to get latest first
                const sorted = [...data].sort((a, b) => {
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                });

                const now = new Date();
                const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

                // Get the latest record for each garage letter
                const latestByGarage: Record<string, GarageData> = {};
                // Get the record closest to 1 hour ago for each garage
                const hourAgoByGarage: Record<string, { rate: number; diff: number }> = {};

                for (const row of sorted) {
                    const letter = row.name?.[7];
                    if (letter && garageOrder.includes(letter)) {
                        // Latest record
                        if (!latestByGarage[letter]) {
                            latestByGarage[letter] = {
                                name: row.name,
                                letter,
                                occupancyRate: row.occupancyRate,
                                timestamp: row.timestamp,
                            };
                        }
                        // Find record closest to 1 hour ago
                        const rowTime = new Date(row.timestamp).getTime();
                        const diff = Math.abs(rowTime - oneHourAgo.getTime());
                        if (!hourAgoByGarage[letter] || diff < hourAgoByGarage[letter].diff) {
                            hourAgoByGarage[letter] = { rate: row.occupancyRate, diff };
                        }
                    }
                }

                // Attach hourAgoRate to each garage
                for (const letter of garageOrder) {
                    if (latestByGarage[letter] && hourAgoByGarage[letter]) {
                        latestByGarage[letter].hourAgoRate = hourAgoByGarage[letter].rate;
                    }
                }

                // Order by garageOrder
                const result = garageOrder
                    .map(letter => latestByGarage[letter])
                    .filter(Boolean);

                setGarages(result);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching occupancy data', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="mt-6 text-gray-400 text-center text-sm">Loading real-time data...</div>
        );
    }

    return (
        <div ref={containerRef} className="mt-6 space-y-4">
            {garages.map(g => {
                const pct = Math.round(g.occupancyRate * 100);
                const color = getOccupancyColor(g.occupancyRate);
                const hourAgoPct = g.hourAgoRate !== undefined ? Math.round(g.hourAgoRate * 100) : null;
                const change = hourAgoPct !== null ? pct - hourAgoPct : null;
                return (
                    <div key={g.letter} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-md">
                            <span className="text-gray-300 font-medium">Garage {g.letter}</span>
                            <span className="flex items-center gap-2">
                                {change !== null && change !== 0 && (
                                    <span className={`flex items-center text-sm ${change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {change > 0 ? (
                                            <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L5.707 9.707a1 1 0 01-1.414-1.414l5-5A1 1 0 0110 3z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L9 13.586V4a1 1 0 112 0v9.586l3.293-3.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z" clipRule="evenodd" /></svg>
                                        )}
                                        {Math.abs(change)}% past hour
                                    </span>
                                )}
                                {change === 0 && (
                                    <span className="text-gray-500 text-sm">0% past hour</span>
                                )}
                                <span className="text-white font-semibold">{pct}%</span>
                            </span>
                        </div>
                        <div className="w-full h-2 bg-[#232323] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: isVisible ? `${Math.min(100, pct)}%` : '0%',
                                    backgroundColor: color,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
