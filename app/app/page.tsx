"use client";
import Navbar from './components/Navbar';
import Backdrop from './components/Backdrop';
import Hero from './components/Hero';
import Why from './components/Why';
import Prediction from './components/Prediction';

export default function Home() {
  return (
    <div id="smooth-wrapper" className="relative min-h-screen font-sans bg-black">
      <Navbar />
        <div id="hero-pin-section" className="relative min-h-screen">
          <Backdrop />
          <Hero />
        </div>
        <section className="relative z-10 px-6 md:px-12 lg:px-24 py-24 bg-black">
          <div className="max-w-3xl mx-auto space-y-6">
            <Why />
            <Prediction />
          </div>
        </section>
        <footer className="text-sm text-gray-400 text-center">
          © 2025 Mehdi Chraibi. All rights reserved.
        </footer>
    </div>
  );
}
