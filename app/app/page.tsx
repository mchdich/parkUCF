"use client";
import Navbar from './components/Navbar';
import Backdrop from './components/Backdrop';
import Hero from './components/Hero';
import Why from './components/Why';
import Prediction from './components/Prediction';
import Metrics from './components/Metrics';
import Log from './components/Log';
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
          <div id="hero-pin-section" className="relative min-h-screen">
            <Backdrop />
            <Hero />
          </div>
          <section className="relative z-10 px-6 md:px-12 lg:px-15 py-15 bg-black">
            <div className="max-w-4xl mx-auto space-y-6">
              <Why />
              <Prediction />
              <Log />
              <Metrics />
            </div>
          </section>
          <footer className="text-sm text-gray-400 text-center">
            © 2025 Mehdi Chraibi. All rights reserved.
          </footer>
        </div>
    </div>
  );
}
