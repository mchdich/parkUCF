"use client";
import { useEffect, useRef, useState } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

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

export default function Hero() {
    useGSAP(() => {
      gsap.registerPlugin(ScrollTrigger);
  
      // Create the pinned scroll animation for the hero section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero-pin-section',
          start: 'top top',
          end: '+=300%', // 3 scroll units
          pin: true,
          scrub: 1,
        }
      });
  
      // Stage 1 (0-33%): Hero fades 50%, moves up slightly, backdrop zooms out a bit, TV opens horizontally
      tl.to('#hero-text', { opacity: 0.5, y: -30, duration: 1 }, 0)
        .to('#backdrop-image', { scale: 1.2, duration: 1 }, 0)
        .to('#tv-container', { width: '100%', opacity: 1, duration: 1 }, 0);
  
      // Stage 2 (33-66%): Hero completely fades, backdrop zooms more, TV expands upward partially
      tl.to('#hero-text', { opacity: 0, y: -60, duration: 1 }, 1)
        .to('#backdrop-image', { scale: 1.1, duration: 1 }, 1)
        .to('#tv-container', { height: '350px', overflow: 'auto', duration: 1 }, 1);
  
      // Stage 3 (66-100%): Backdrop fits screen, TV fully opens
      tl.to('#backdrop-image', { scale: 1, duration: 1 }, 2)
        .to('#tv-container', { height: '500px', duration: 1 }, 2);

      // Fade out scroll indicator as animation progresses (starts fading at 50%, fully gone by 80%)
      tl.to('#scroll-indicator', { opacity: 0, duration: 0.2 }, 3);
    }, []);
  
  
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

  // TV turn-on animation state
  const [tvOn, setTvOn] = useState(false);
  useEffect(() => {
    // Trigger TV turn-on animation after mount
    const timeout = setTimeout(() => setTvOn(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-12">
      <div className="relative flex flex-col items-center justify-center w-full max-w-3xl mx-auto" style={{ minHeight: 500 }}>
        {/* Code block with TV turn-on animation and smooth auto-scroll */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .auto-scroll-vertical {
            display: flex;
            flex-direction: column;
            animation: scroll-vertical 400s linear infinite;
            will-change: transform;
          }
          @keyframes scroll-vertical {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .tv-closed {
            width: 0%;
            height: 2px;
            opacity: 0;
            overflow: hidden;
            transition: width 0.7s cubic-bezier(.4,2,.6,1), height 0.5s cubic-bezier(.4,2,.6,1), opacity 0.3s;
          }
          .tv-open {
            width: 100%;
            height: 350px;
            opacity: 1;
            overflow: hidden;
            transition: width 0.7s cubic-bezier(.4,2,.6,1), height 0.5s cubic-bezier(.4,2,.6,1), opacity 0.3s;
          }
          #tv-container {
            pointer-events: none;
            -ms-overflow-style: none;
            scrollbar-width: none;
            overscroll-behavior: contain;
            touch-action: none;
          }
          @keyframes bounce-arrow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .bounce-arrow {
            animation: bounce-arrow 1.5s ease-in-out infinite;
          }
        `}</style>
        <div
          id="tv-container"
          className={`rounded-xl border border-black/10 dark:border-white/10 bg-black/60 backdrop-blur-md shadow-lg scrollbar-hide ${tvOn ? 'tv-open' : 'tv-closed'}`}
          style={{
            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {jsonLines.length > 0 && (
            <pre style={{ margin: 0, padding: 0, height: '100%' }}>
              <code className="font-mono text-gray-300 auto-scroll-vertical" style={{ display: 'block' }}>
                {/* Duplicate lines for seamless infinite scroll */}
                {[...jsonLines, ...jsonLines].map((line, index) => (
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
          )}
        </div>
        {/* Hero text overlayed and centered */}
        <div id="hero-text" className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="space-y-6 text-center px-4" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white/90">
              The UCF Parking Dashboard.
            </h1>
            <p className="tracking-tight text-lg md:text-xl text-gray-200/80 max-w-lg mx-auto">
              AI-powered predictions and insights based on months of parking garage data to make parking less frustrating.
            </p>
          </div>
        </div>
      </div>
      {/* Scroll down indicator */}
      <div
        id="scroll-indicator"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 pointer-events-none"
      >
        <span className="text-sm tracking-wide">scroll down</span>
        <svg
          className="w-6 h-6 bounce-arrow"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}