import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import ChartDeferred from 'chartjs-plugin-deferred';
import { useRef, useEffect } from 'react';

export default function LogChart (props: {garage: string}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let myChart: Chart | null = null;
            fetch(`https://parkucf-hsbpefgpekhph5fv.centralus-01.azurewebsites.net/api/daily_log`)
                .then(response => response.json())
                .then(data => {
                    // Sort data by x value (timestamp)
                    const sortedData = [...data].sort((a, b) => {
                        const aTime = new Date(a.timestamp).getTime();
                        const bTime = new Date(b.timestamp).getTime();
                        return aTime - bTime;
                    });

                    const ctx = canvasRef.current;
                    if (!ctx) return;
                    // Destroy any existing chart on this canvas before creating a new one
                    const existingChart = Chart.getChart(ctx);
                    if (existingChart) existingChart.destroy();
                    const garageLetters = ['A','B','C','D','G','H','I'];
                    const selectedGarages = props.garage !== 'All'
                        ? [props.garage]
                        : garageLetters;

                    myChart = new Chart(ctx, {
                        options: {
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'hour',
                                        displayFormats: {
                                            hour: 'h a',
                                            day: 'MMM d',
                                        },
                                    },
                                    adapters: {
                                        date: {
                                            zone: 'America/New_York'
                                        }
                                    },
                                },
                                y: {
                                    ticks: {
                                        callback: function(value: any) {
                                            return value + '%';
                                        }
                                    }
                                }
                            },
                            elements: {
                                point: {
                                    pointStyle: false
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        boxWidth: 20
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        title: function(context: any) {
                                            const date = new Date(context[0].parsed.x);
                                            // Use America/New_York for EST/EDT
                                            const options = { hour: 'numeric', minute: '2-digit', hour12: true, weekday: 'short', timeZone: 'America/New_York' };
                                            return date.toLocaleString(undefined, options);
                                        }
                                    }
                                }
                            }
                        },
                        plugins: [ChartDeferred],
                        type: 'line',
                        data: {
                            datasets: [
                                ...selectedGarages.map((letter: string) => ({
                                    label: letter.toUpperCase(),
                                    data: sortedData
                                        .filter((row: any) => row.name[7] === letter)
                                        .map((row: any) => ({
                                            x: row.timestamp,
                                            y: row.occupancyRate * 100,
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
    }, [props.garage]);

    return (
        <div style={{height: 350, width: '100%'}}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}