export default function Home() {
  const jsonLines = [
    `[`,
    `  {`,
    `    "location": {`,
    `      "available_count_offset": 0,`,
    `      "counts": {`,
    `        "location_name": "Garage A",`,
    `        "api_location_id": 134,`,
    `        "parking_location_id": 3,`,
    `        "available": 1625,`,
    `        "occupied": 22,`,
    `        "out_of_service": false,`,
    `        "display_on_web": true,`,
    `        "reserved": 0,`,
    `        "event_reserved": 0,`,
    `        "event_id": 0,`,
    `        "event_name": null,`,
    `        "timestamp": "12/17/2025 23:55:16.362",`,
    `        "total": 1647,`,
    `        "vacant": 1603,`,
    `        "timeStampDate": "12/17/2025",`,
    `        "timeStampTime": "6:55 PM"`,
    `      },`,
    `      "extended_properties": {`,
    `        "entry_lane_ids": null,`,
    `        "exit_lane_ids": null,`,
    `        "last_contact_timestamp": "...",`,
    `        "next_scheduled_reset_limit": null,`,
    `        "reset_time": null,`,
    `        "reset_value": "0"`,
    `      },`,
    `      "id": 134,`,
    `      "is_out_of_service": true,`,
    `      "name": "Garage A",`,
    `      "plugin": null`,
    `    }`,
    `  },`,
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-12 font-sans">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            24/7/365. Garages A through I.
            <br />
            <span className="text-gray-400">At your fingertips.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-lg">
            AI-powered predictions and insights based on months of parking garage data to help you find a spot at UCF without the loop.
          </p>
        </div>

        {/* Right side - Code block with line numbers and fade */}
        <div className="relative">
          <div className="rounded-lg overflow-hidden max-h-[500px] border border-gray-800 bg-[#1a1a1a]">
            <pre className="text-sm font-mono">
              <code className="grid grid-cols-[auto_1fr]">
                {jsonLines.map((line, index) => (
                  <div key={index} className="contents">
                    {/* Line number */}
                    <div className="select-none text-right text-gray-500 bg-[#141414] px-3 py-0.5 min-h-[1.5rem] leading-6">
                      {index + 1}
                    </div>
                    {/* Code content */}
                    <div className="text-gray-100 px-4 py-0.5 min-h-[1.5rem] leading-6 whitespace-pre">
                      {line}
                    </div>
                  </div>
                ))}
              </code>
            </pre>
          </div>
          {/* Fading gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent rounded-b-lg pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
