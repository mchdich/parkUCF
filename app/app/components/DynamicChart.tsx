import Chart from 'chart.js/auto';
// import 'chartjs-adapter-date-fns'
import 'chartjs-adapter-luxon';
import ChartDeferred from 'chartjs-plugin-deferred';
import { useRef, useEffect } from 'react';

export default function DynamicChart (props: {type: string, garage: string}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let myChart: Chart | null = null;
            fetch(`https://parkucf-hsbpefgpekhph5fv.centralus-01.azurewebsites.net/api/${props.type}`)
                .then(response => response.json())
                .then(data => {
                    // Sort data by x value (timestamp)
                    const sortedData = [...data].sort((a, b) => {
                        const aTime = new Date(a.x).getTime();
                        const bTime = new Date(b.x).getTime();
                        return aTime - bTime;
                    });

                    const ctx = canvasRef.current;
                    if (!ctx) return;
                    // Destroy any existing chart on this canvas before creating a new one
                    const existingChart = Chart.getChart(ctx);
                    if (existingChart) existingChart.destroy();
                    const garageLetters = ['a','b','c','d','g','h','i'];
                    const selectedGarages = props.garage !== 'All'
                        ? [props.garage.toLowerCase()]
                        : garageLetters;

                    myChart = new Chart(ctx, {
                        options: {
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    type: 'time',
                                    min: props.type === 'weekly'
                                        ? '2025-12-08T00:00:00Z'
                                        : '2025-12-12T00:00:00Z',
                                    max: props.type === 'weekly'
                                        ? '2025-12-15T00:00:00Z'
                                        : '2025-12-13T00:00:00Z',
                                    time: {
                                        unit: props.type === 'weekly' ? 'day' : 'hour',
                                    },
                                    adapters: {
                                        date: {
                                            zone: 'utc'
                                        }
                                    },
                                    ...(props.type === 'weekly' ? {
                                        ticks: {
                                            callback: function(value: any, index: number, ticks: any[]) {
                                                // Always use UTC for tick labels
                                                const date = new Date(value);
                                                const utcDay = date.getUTCDay();
                                                if (utcDay === 1 && index > 0) return '';
                                                return date.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' });
                                            }
                                        }
                                    } : {})
                                },
                                y: props.type === 'weekly' ? {
                                    ticks: {
                                        callback: function(value: any) {
                                            return value + '%';
                                        }
                                    }
                                } : {
                                    ticks: {
                                        callback: function(value: any) {
                                            return value + '%';
                                        }
                                    }
                                },
                            },
                            elements: {
                                point: {
                                    pointStyle: false
                                }
                            },
                            plugins: {
                                deferred: {
                                    xOffset: 150,
                                    yOffset: '20%',
                                    delay: 200
                                },
                                legend: {
                                    labels: {
                                        boxWidth: 20
                                    }
                                },
                                tooltip: props.type === 'weekly' ? {
                                    callbacks: {
                                        title: function(context: any) {
                                            const date = new Date(context[0].parsed.x);
                                            let hour = date.getUTCHours();
                                            const min = String(date.getUTCMinutes()).padStart(2, '0');
                                            const ampm = hour < 12 ? 'AM' : 'PM';
                                            let displayHour = hour % 12 === 0 ? 12 : hour % 12;
                                            const dayStr = date.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' });
                                            return `${displayHour}:${min} ${ampm} ${dayStr}`;
                                        }
                                    }
                                } : {
                                    callbacks: {
                                        title: function(context: any) {
                                            const date = new Date(context[0].parsed.x);
                                            let hour = date.getUTCHours();
                                            const min = String(date.getUTCMinutes()).padStart(2, '0');
                                            const ampm = hour < 12 ? 'AM' : 'PM';
                                            let displayHour = hour % 12 === 0 ? 12 : hour % 12;
                                            return `${displayHour}:${min} ${ampm}`;
                                        }
                                    }
                                },
                            }
                        },
                        plugins: [ChartDeferred],
                        type: 'line',
                        data: {
                            datasets: [
                                ...selectedGarages.map(letter => ({
                                    label: letter.toUpperCase(),
                                    data: sortedData
                                        .filter((row: any) => row.id[0] === letter)
                                        .map((row: any) => ({
                                            x: row.x,
                                            y: row.y * 100,
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
    }, [props.type, props.garage]);

    return (
        <div style={{height: 350, width: '100%'}}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}