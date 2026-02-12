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
  const [showModal, setShowModal] = useState(true);
  useGSAP(() => {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
    ScrollSmoother.create({
      smooth: 1,
      effects: true
    });
  }, []);

  return (
    <div id="smooth-wrapper" className="relative min-h-screen font-sans">
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center relative">
            <h2 className="text-gray-700 text-xl font-semibold mb-4">Notice</h2>
            <p className="mb-6 text-gray-700">
              Unfortunately, UCF has made their live parking data private. Therefore, the 'Real-time occupancy' feature no longer works. We are trying to find a fix.
              <br /><br />
              Sorry for the inconvenience.
            </p>
            <button
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setShowModal(false)}
              autoFocus
            >
              OK
            </button>
          </div>
        </div>
      )}
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
