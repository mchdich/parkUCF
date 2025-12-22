import Chart from 'chart.js/auto';
import ChartDeferred from 'chartjs-plugin-deferred';
import { useRef, useEffect } from 'react';

export default function DynamicChart (props: {type: string}) {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        fetch('https://parkucf-hsbpefgpekhph5fv.centralus-01.azurewebsites.net/api/weekly')
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error fetching data', error));
        
        const ctx = canvasRef.current;
        
        const myChart = new Chart(ctx, {
            plugins: [ChartDeferred],
            type: 'line',
            data: {

            }
        });
        
        return () => {
            myChart.destroy()
        };
    }, [props.type]);
    return <canvas ref={canvasRef}></canvas>
}