import Navbar from '../components/Navbar';
import Backdrop from '../components/Backdrop';
import Prediction from '../components/Prediction';
import Metrics from '../components/Metrics';

type ChartPoint = {
  id: string;
  x: string;
  y: number;
};

type MetricsRecord = {
  time: string;
  timeval: string;
  garage: string;
  garageval: string;
  maxsum: string;
  maxval: string;
  poc: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: 300 } });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const revalidate = 300;

export default async function Dashboard() {
  const apiBase = 'https://parkucf-hsbpefgpekhph5fv.centralus-01.azurewebsites.net/api';
  const [weeklyData, dailyData, metricsData] = await Promise.all([
    fetchJson<ChartPoint[]>(`${apiBase}/weekly`),
    fetchJson<ChartPoint[]>(`${apiBase}/daily`),
    fetchJson<MetricsRecord[]>(`${apiBase}/metrics`),
  ]);

  const metrics = metricsData[0] ?? {
    time: '',
    timeval: '',
    garage: '',
    garageval: '',
    maxsum: '',
    maxval: '',
    poc: '',
  };

  return (
    <div id="smooth-wrapper" className="relative min-h-screen font-sans">
      <Navbar />
      <div id="smooth-content" className="relative min-h-screen">
        <div className="absolute inset-0 -z-10">
          <Backdrop />
        </div>
        <section className="relative z-10 px-6 md:px-12 lg:px-15 py-15 bg-transparent">
          <div className="max-w-4xl mx-auto space-y-6">
            <Prediction weeklyData={weeklyData} dailyData={dailyData} />
            <Metrics metrics={metrics} />
          </div>
        </section>
        <footer className="text-sm text-gray-400 text-center relative z-10">
          © 2025 Mehdi Chraibi. All rights reserved.
        </footer>
      </div>
    </div>
  );
}