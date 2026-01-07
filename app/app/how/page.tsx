"use client";

import Navbar from '../components/Navbar';
import Backdrop from '../components/Backdrop';
import Prediction from '../components/Prediction';
import Metrics from '../components/Metrics';
import Log from '../components/Log';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollSmoother, ScrollTrigger } from 'gsap/all';

export default function Dashboard() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
    ScrollSmoother.create({
      smooth: 1,
      effects: true,
    });
  }, []);

  return (
    <div id="smooth-wrapper" className="relative min-h-screen font-sans">
      <Navbar />

      <div id="smooth-content" className="relative min-h-screen">
        <div className="absolute inset-0 -z-10">
          <Backdrop />
        </div>

        <section className="relative z-10 px-6 md:px-12 lg:px-15 py-20 bg-transparent">
          <div
            className="rounded-2xl bg-[#181818] text-white px-8 py-10 md:py-12 md:px-12 shadow-lg border border-[#232323] flex flex-col gap-4 max-w-4xl mx-auto"
            style={{ fontFamily: 'inherit' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              How does it work?
            </h2>

            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              parkUCF’s architecture is intentionally simple but robust. The system is built on a
                fully automated, cloud-native, end-to-end ELT (extract, transform, load) data
                pipeline designed to continuously ingest, store, and analyze parking occupancy
                data with minimal operational overhead.
            </p>

            <ol className="list-decimal list-inside text-lg md:text-xl text-gray-400 space-y-3 pl-2">
              <li>
                An AWS EventBridge rule triggers a Lambda function every two minutes, matching the
                update interval of the UCF parking API. Each invocation queries the API endpoint
                and inserts the resulting snapshot as a new row into a PostgreSQL database.
              </li>
              <li>
                At the end of each day, the database table is truncated and its contents are exported
                as a single consolidated JSON file to an Amazon S3 bucket. This preserves a
                lightweight historical record while keeping the transactional database small and
                efficient.
              </li>
              <li>
                On a monthly schedule, AWS SageMaker Pipelines triggers a notebook job that trains
                a Facebook Prophet time-series model on the accumulated data. The resulting model
                outputs updated forecasts and summary metrics, which are then surfaced throughout
                the application.
              </li>
            </ol>
          </div>
        </section>

        <footer className="text-sm text-gray-400 text-center relative z-10">
          © 2025 Mehdi Chraibi. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
