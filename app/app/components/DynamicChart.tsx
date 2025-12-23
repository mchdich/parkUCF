import Chart from 'chart.js/auto';
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
                setData(data);
                const ctx = canvasRef.current;
                if (!ctx) return;
                myChart = new Chart(ctx, {
                    plugins: [ChartDeferred],
                    type: 'line',
                    data: {
                        labels: data.map((x: any) => x.day),
                        datasets: [
                            ...['a','b','c','d','g','h','i'].map(letter => ({
                                label: letter.toUpperCase(),
                                data: data
                                    .filter((row: any) => row.id[0] === letter)
                                    .map((row: any) => ({
                                        x: row.x,
                                        y: row.y,
                                    }))
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