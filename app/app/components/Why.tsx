import Image from 'next/image';

export default function Why() {
    return (
        <>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                          Why parkUCF?
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                          Parking at UCF is by far the most frequent complaint from students; with only about 8000 parking spots at a university attended by almost 9x the amount of students, garages inevitably get full by midday.
                        </p>
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                          Currently the only resource available to students trying to navigate this issue is UCF’s <u><a href="https://parking.ucf.edu/resources/garage-availability/">Garage Status</a></u> page, which displays garage occupancy in real time. But what’s going on in the moment only tells you so much - what if you could see the broader, repeating trend? 
                        </p>
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                          For months, we have been gathering occupancy data (from the same source that Garage Status uses) and built a solid record. This culminated in parkUCF, which provides you with resources like: 
                        </p>
                        <ul className="list-disc list-inside text-lg md:text-xl text-gray-400 space-y-2 pl-4">
                          <li><span className="text-white"><strong>AI-powered predictions.</strong></span> An AI model learns from past patterns and forecasts the future.</li>
                          <li><span className="text-white"><strong>Real time data and charts.</strong></span> Now, not only can you see what’s happening in the moment, but also daily occupancy history.</li>
                          <li><span className="text-white"><strong>Metrics and insights.</strong></span> Busiest garage on average, busiest day, etc.</li>
                        </ul>
                        <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                          Whether you start choosing less busy garages, start coming an hour before the rush, or even planning your arrival as people start to leave, it's all up to you!
                        </p>
                        <a
            className="mx-auto my-10 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[260px] min-w-[260px]"
            href="/dashboard"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Go to Dashboard
          </a>
        </>
    )
}