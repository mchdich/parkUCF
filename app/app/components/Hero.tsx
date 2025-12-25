"use client";
import { useEffect, useRef, useState } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

export default function Hero() {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 py-12">
      <div className="relative flex flex-col items-center justify-center w-full max-w-3xl mx-auto" style={{ minHeight: 500 }}>
        {/* Hero text overlayed and centered */}
        <div id="hero-text" className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="space-y-6 text-center px-4" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white/90">
              The UCF Parking Dashboard.
            </h1>
            <p className="tracking-tight text-lg md:text-xl text-gray-200/80 max-w-lg mx-auto">
              AI-powered predictions and insights based on months of garage data to make parking less frustrating.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}