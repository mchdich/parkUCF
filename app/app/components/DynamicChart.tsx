import Chart from 'chart.js/auto';
import ChartDeferred from 'chartjs-plugin-deferred';
import { useRef, useEffect } from 'react';

export default function DynamicChart (props: {type: string}) {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const ctx = canvasRef.current;
        
        const myChart = new Chart(ctx, {
            plugins: [ChartDeferred],
            type: 'line',
            
        });
        
        return () => {
            myChart.destroy()
        };
    }, [props.type]);
    return <canvas ref={canvasRef}></canvas>
}