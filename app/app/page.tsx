"use client";
import Navbar from './components/Navbar';
import Backdrop from './components/Backdrop';
import Hero from './components/Hero';
import DynamicChart from './components/DynamicChart';
import { useEffect, useRef, useState } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollSmoother, ScrollTrigger } from 'gsap/all';

export default function Home() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
    ScrollSmoother.create({
      smooth: 1,
      effects: true
    });
  }, []);
  return (
    <div id="smooth-wrapper" className="relative min-h-screen font-sans bg-black">
      <div id="smooth-content">
        <Navbar />
        <Backdrop />
        <Hero />

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
                <DynamicChart type="daily" />
              </div>
            </div>
          </div>
        </section>
        <footer className="text-sm text-gray-400 text-center">
          © 2025 Mehdi Chraibi. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
