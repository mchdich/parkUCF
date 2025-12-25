import Navbar from '../components/Navbar';
import Backdrop from '../components/Backdrop';

export default function HowItWorks() {
    return (
        <div className="relative min-h-screen font-sans bg-black">
         <Navbar />
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
          </div>
         </section>
        </div>
    )
}