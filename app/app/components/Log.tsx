import DynamicChart from "./DynamicChart"

export default function Log() {
    return (
        <div className="mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Real-time occupancy</h3>
            <div className="rounded-2xl bg-[#181818] text-white px-8 py-10 md:py-8 md:px-8 shadow-lg border border-[#232323] flex flex-col gap-4 max-w-4xl mx-auto" style={{fontFamily: 'inherit'}}>
            <DynamicChart type="daily_log" />
            </div>
        </div>
    )
}