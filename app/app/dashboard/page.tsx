"use client";

import Navbar from '../components/Navbar';
import Backdrop from '../components/Backdrop';
import Prediction from '../components/Prediction';
import Metrics from '../components/Metrics';
import Log from '../components/Log';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollSmoother, ScrollTrigger } from 'gsap/all';
import { useState } from 'react';

export default function Dashboard() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
    ScrollSmoother.create({
      smooth: 1,
      effects: true
    });
  }, []);

  return (
    <div id="smooth-wrapper" className="relative min-h-screen font-sans">
      <Navbar />
      <div id="smooth-content" className="relative min-h-screen">
        {/* Backdrop absolutely positioned behind content */}
        <div className="absolute inset-0 -z-10">
          <Backdrop />
        </div>
        <section className="relative z-10 px-6 md:px-12 lg:px-15 py-15 bg-transparent">
          <div className="max-w-4xl mx-auto space-y-6">
            <Log />
            <Prediction />
            <Metrics />
          </div>
        </section>
        <footer className="text-sm text-gray-400 text-center relative z-10">
          © 2025 Mehdi Chraibi. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
