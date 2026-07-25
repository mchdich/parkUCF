type MetricsData = {
    time: string;
    timeval: string;
    garage: string;
    garageval: string;
    maxsum: string;
    maxval: string;
    poc: string;
};

type MetricsProps = {
    metrics: MetricsData;
};

export default function Metrics({ metrics }: MetricsProps) {

    return (
        <div className="mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Metrics</h3>
            <div className="rounded-2xl bg-[#181818] text-white px-8 py-10 md:py-8 md:px-8 shadow-lg border border-[#232323] flex flex-col gap-4 max-w-4xl mx-auto" style={{fontFamily: 'inherit'}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-4">
                    <div className="rounded-xl bg-[#232323] p-6 flex flex-col items-start shadow-md w-full">
                        <span className="text-sm text-gray-300 mb-2">Busiest time</span>
                        <span className="text-3xl font-bold text-white">{metrics.time}</span>
                        <span className="text-xs text-gray-400 mt-1">{metrics.timeval} full across all garages on average</span>
                    </div>
                    <div className="rounded-xl bg-[#232323] p-6 flex flex-col items-start shadow-md w-full">
                        <span className="text-sm text-gray-300 mb-2">Busiest garage</span>
                        <span className="text-3xl font-bold text-white">{metrics.garage}</span>
                        <span className="text-xs text-gray-400 mt-1">{metrics.garageval} full on average</span>
                    </div>
                    <div className="rounded-xl bg-[#232323] p-6 flex flex-col items-start shadow-md w-full">
                        <span className="text-sm text-gray-300 mb-2">Highest ever occupancy</span>
                        <span className="text-3xl font-bold text-white">{metrics.maxval}</span>
                        <span className="text-xs text-gray-400 mt-1">{metrics.maxsum}</span>
                    </div>
                    <div className="rounded-xl bg-[#232323] p-6 flex flex-col items-start shadow-md w-full">
                        <span className="text-sm text-gray-300 mb-2">% of time more cars in garage than capacity</span>
                        <span className="text-3xl font-bold text-white">{metrics.poc}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}