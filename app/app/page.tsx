"use client";
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

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [jsonLines, setJsonLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch JSON file from public/sample.json
  useEffect(() => {
    fetch("/sample.json")
      .then((res) => res.text())
      .then((text) => {
        setJsonLines(text.split("\n"));
      });
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!jsonLines.length) return;
    const scrollDiv = scrollRef.current;
    if (!scrollDiv) return;
    let frame: number;
    let frameCount = 0;
    function step() {
      if (!scrollDiv) return;
      if (scrollDiv.scrollTop + scrollDiv.clientHeight < scrollDiv.scrollHeight) {
        frameCount++;
        if (frameCount % 10 === 0){
          scrollDiv.scrollTop += 0.5;
        }
        frame = requestAnimationFrame(step);
      }
    }
    frame = requestAnimationFrame(step);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [jsonLines]);

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

          {/* Right side - Code block with auto-scroll and fade */}
          <div className="relative">
            <div
              ref={scrollRef}
              className="rounded-lg overflow-y-auto max-h-[500px] border border-gray-600 bg-[#0d0d0d] scrollbar-hide"
              style={{ scrollBehavior: "smooth", msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
              `}</style>
              <pre>
                <code className="font-mono">
                  {jsonLines.map((line, index) => (
                    <div key={index} className="px-4 py-0.5 min-h-[1.5rem] leading-6 whitespace-pre">
                      {highlightJson(line).map((part, i) => (
                        <span key={i} className={part.color}>
                          {part.text}
                        </span>
                      ))}
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
