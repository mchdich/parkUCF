"use client";
import Navbar from './components/Navbar';
import Backdrop from './components/Backdrop';
import DynamicChart from './components/DynamicChart';
import { useEffect, useRef, useState } from "react";

// Helper to add syntax highlighting to JSON
const highlightJson = (line: string) => {
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
  const [jsonLines, setJsonLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [animationStage, setAnimationStage] = useState<'hidden' | 'horizontal' | 'vertical' | 'done'>('hidden');

  // Fetch JSON file from public/sample.json
  useEffect(() => {
    fetch("/sample.json")
      .then((res) => res.text())
      .then((text) => {
        setJsonLines(text.split("\n"));
        // Start TV turn-on animation once data is ready
        setAnimationStage('horizontal');
        setTimeout(() => setAnimationStage('vertical'), 400);
        setTimeout(() => setAnimationStage('done'), 900);
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
      <Navbar />
      <Backdrop />

      {/* Main content */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-12">
        <div className="relative flex flex-col items-center justify-center w-full max-w-3xl mx-auto" style={{ minHeight: 500 }}>
          {/* Code block with TV turn-on animation */}
          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .tv-off {
              width: 0;
              height: 2px;
              opacity: 0;
            }
            .tv-horizontal {
              width: 100%;
              height: 2px;
              opacity: 1;
              transition: width 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.2s;
            }
            .tv-vertical {
              width: 100%;
              height: 500px;
              opacity: 1;
              transition: height 0.5s cubic-bezier(0.4,0,0.2,1);
            }
            .tv-done {
              width: 100%;
              max-height: 500px;
              height: auto;
              opacity: 1;
              transition: height 0.3s;
            }
          `}</style>
          <div
            ref={scrollRef}
            className={`rounded-xl overflow-y-auto border border-gray-700 bg-black/60 backdrop-blur-md shadow-lg scrollbar-hide ${
              animationStage === 'hidden' ? 'tv-off' :
              animationStage === 'horizontal' ? 'tv-horizontal' :
              animationStage === 'vertical' ? 'tv-vertical' : 'tv-done'
            }`}
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)',
              margin: '0 auto',
              overflow: animationStage === 'done' ? 'auto' : 'hidden',
            }}
          >
            {jsonLines.length > 0 && (
              <pre>
                <code className="font-mono text-gray-300 text-opacity-80">
                  {jsonLines.map((line, index) => (
                    <div key={index} className="px-4 py-0.5 min-h-[1.5rem] leading-6 whitespace-pre">
                      {highlightJson(line).map((part, i) => (
                        <span key={i} className={part.color + ' opacity-80'} style={{ filter: 'brightness(0.85) saturate(0.7)' }}>
                          {part.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </code>
              </pre>
            )}
          </div>
          {/* Hero text overlayed and centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="space-y-6 text-center px-4" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white/90">
                Garages A through I.
                <br />
                <span className="text-gray-300/80">At your fingertips.</span>
              </h1>
              <p className="tracking-tight text-lg md:text-xl text-gray-200/80 max-w-lg mx-auto">
                AI-powered predictions and insights based on months of parking garage data to help you find a spot at UCF without the loop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why parkUCF section */}
      <section className="relative z-10 px-6 md:px-12 lg:px-24 py-24 bg-black">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
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

          {/* Predicted occupancy trends section */}
          <div className="mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Predicted occupancy trends</h3>
            <div className="rounded-2xl bg-[#181818] text-white px-8 py-10 md:py-12 md:px-12 shadow-lg border border-[#232323] flex flex-col gap-4 max-w-4xl mx-auto" style={{fontFamily: 'inherit'}}>
              <i className="text-lg md:text-xl font-semibold text-gray-400 mb-2">From 12/20/25 to 1/31/26</i>
              <DynamicChart type="weekly" />
            </div>
          </div>
        </div>
      </section>
      <footer className="text-sm text-gray-400 text-center">
        © 2025 Mehdi Chraibi. All rights reserved.
      </footer>
    </div>
  );
}
