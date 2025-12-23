import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'
import ChartDeferred from 'chartjs-plugin-deferred';
import { useRef, useEffect, useState } from 'react';

export default function DynamicChart (props: {type: string}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        let myChart: Chart | null = null;
        fetch(`https://parkucf-hsbpefgpekhph5fv.centralus-01.azurewebsites.net/api/${props.type}`)
            .then(response => response.json())
            .then(data => {
                // Sort data by date ascending
                const sorted = [...data].sort((a, b) => {
                    const aVal = new Date(props.type === 'weekly' ? a.day : a.hour).getTime();
                    const bVal = new Date(props.type === 'weekly' ? b.day : b.hour).getTime();
                    return aVal - bVal;
                });
                setData(sorted);
                const ctx = canvasRef.current;
                if (!ctx) return;
                myChart = new Chart(ctx, {
                    options: {
                        scales: {
                            x: {
                                type: 'time',
                                min: props.type === 'weekly'
                                    ? '2025-12-08'
                                    : '2025-12-11T07:00',
                                max: props.type === 'weekly'
                                    ? '2025-12-15'
                                    : '2025-12-12T19:00',
                                time: {
                                    unit: props.type === 'weekly' ? 'day' : 'hour',
                                },
                                ticks: props.type === 'weekly' ? {
                                    callback: function(value: any) {
                                        // Chart.js passes value as ms timestamp
                                        return new Date(value).toLocaleDateString(undefined, { weekday: 'short' });
                                    }
                                } : undefined
                            }
                        },
                        elements: {
                            point: {
                                pointStyle: false
                            }
                        }
                    },
                    plugins: [ChartDeferred],
                    type: 'line',
                    data: {
                        labels: sorted.map((x: any) => props.type === 'weekly' ? x.day : x.hour),
                        datasets: [
                            ...['a','b','c','d','g','h','i'].map(letter => ({
                                label: letter.toUpperCase(),
                                data: sorted
                                    .filter((row: any) => row.id[0] === letter)
                                    .map((row: any) => ({
                                        x: row.x,
                                        y: row.y,
                                    })),
                                spanGaps: true
                            }))
                        ]
                    }
                });
            })
            .catch(error => console.error('Error fetching data', error));

        return () => {
            if (myChart) myChart.destroy();
        };
    }, [props.type]);

    return <canvas ref={canvasRef}></canvas>
}