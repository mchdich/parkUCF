import Link from 'next/link';

export default function Navbar() {
    return(
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="relative backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 dark:supports-[backdrop-filter]:bg-black/50 dark:bg-black/80 border border-black/10 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-8">
                <Link href="/" className="font-sm text-sm sm:text-base hover:opacity-80 transition-opacity">
                    parkUCF
                </Link>
                <Link href="/how" className="font-sm text-sm sm:text-base hover:opacity-80 transition-opacity whitespace-nowrap">
                    How it works
                </Link>
                <Link href="/about" className="text-sm sm:text-base hover:opacity-80 transition-opacity">
                    About
                </Link>
            </div>
        </nav>
    )
}