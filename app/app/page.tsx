import Image from "next/image";
import Link from "next/link";

// Helper to add syntax highlighting to JSON
function highlightJson(line: string) {
  const parts: { text: string; color: string }[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    // Match keys (strings followed by colon)
    const keyMatch = remaining.match(/^(\s*)("[\w_]+")(:\s*)/);
    if (keyMatch) {
      if (keyMatch[1]) parts.push({ text: keyMatch[1], color: "text-gray-100" });
      parts.push({ text: keyMatch[2], color: "text-purple-300" }); // pastel purple for keys
      parts.push({ text: keyMatch[3], color: "text-gray-100" });
      remaining = remaining.slice(keyMatch[0].length);
      continue;
    }

    // Match string values
    const stringMatch = remaining.match(/^("[^"]*")/);
    if (stringMatch) {
      parts.push({ text: stringMatch[1], color: "text-green-300" }); // pastel green for strings
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    // Match numbers
    const numberMatch = remaining.match(/^(\d+)/);
    if (numberMatch) {
      parts.push({ text: numberMatch[1], color: "text-blue-300" }); // pastel blue for numbers
      remaining = remaining.slice(numberMatch[0].length);
      continue;
    }

    // Match booleans and null
    const boolMatch = remaining.match(/^(true|false|null)/);
    if (boolMatch) {
      parts.push({ text: boolMatch[1], color: "text-pink-300" }); // pastel pink for booleans/null
      remaining = remaining.slice(boolMatch[0].length);
      continue;
    }

    // Match punctuation
    const punctMatch = remaining.match(/^([{}\[\],])/);
    if (punctMatch) {
      parts.push({ text: punctMatch[1], color: "text-gray-400" });
      remaining = remaining.slice(punctMatch[0].length);
      continue;
    }

    // Default: take one character
    parts.push({ text: remaining[0], color: "text-gray-100" });
    remaining = remaining.slice(1);
  }

  return parts;
}

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
    <div className="relative min-h-screen font-sans bg-black">
      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="relative backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 dark:supports-[backdrop-filter]:bg-black/50 dark:bg-black/80 border border-black/10 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-8">
          <Link href="/" className="font-semibold text-sm sm:text-base hover:opacity-80 transition-opacity">
            parkUCF
          </Link>
          <Link href="/about" className="text-sm sm:text-base hover:opacity-80 transition-opacity">
            About
          </Link>
        </div>
      </nav>

      {/* Hero background image with fade */}
      <div className="absolute inset-x-0 top-0 h-[33vh] z-0">
        <Image
          src="/ucf.jpg"
          alt="UCF Campus"
          fill
          className="object-cover brightness-25"
          priority
        />
        {/* Gradient overlay to fade image into background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </div>

      {/* Main content */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Garages A through I.
              <br />
              <span className="text-gray-400">At your fingertips.</span>
            </h1>
            <p className="tracking-tight text-lg md:text-xl text-gray-400 max-w-lg">
              AI-powered predictions and insights based on months of parking garage data to help you find a spot at UCF without the loop.
            </p>
          </div>

          {/* Right side - Code block with line numbers and fade */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden max-h-[500px] border border-gray-600 bg-[#0d0d0d]">
              <pre className="">
                <code className="grid grid-cols-[auto_1fr] font-mono">
                  {jsonLines.map((line, index) => (
                    <div key={index} className="contents">
                      {/* Line number */}
                      <div className="select-none text-right text-gray-300 bg-[#1a1a1a] px-3 py-0.5 min-h-[1.5rem] leading-6">
                        {index + 1}
                      </div>
                      {/* Code content with syntax highlighting */}
                      <div className="px-4 py-0.5 min-h-[1.5rem] leading-6 whitespace-pre">
                        {highlightJson(line).map((part, i) => (
                          <span key={i} className={part.color}>
                            {part.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
            {/* Fading gradient at bottom - matches bg-black */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Why parkUCF section */}
      <section className="relative z-10 px-6 md:px-12 lg:px-24 py-24 bg-black">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Why parkUCF?
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Everyone at the University of Central Florida knows parking is the most frustrating part of going here: try going a day without hearing about it! parkUCF is the unified hub for all things parking at UCF. It allows you to view:
          </p>
          <ul className="list-disc list-inside text-lg md:text-xl text-gray-400 space-y-2 pl-4">
            <li>Past historical parking data</li>
            <li>The real-time status of garages</li>
            <li>Predicted occupancy rates</li>
            <li>Useful metrics</li>
          </ul>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            This is helpful for students in many ways. Whether you use these features to register for classes on less busy days or to come a bit before the rush starts, you can rest easy knowing you're no longer in the dark!
          </p>
        </div>
      </section>
    </div>
  );
}
