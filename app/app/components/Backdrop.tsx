import Image from "next/image";

export default function Backdrop() {
    return(
        <div
            id="backdrop-container"
            className="absolute inset-x-0 top-0 h-screen z-0 overflow-hidden"
            style={{
                backgroundImage: 'url(/ucf.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.25)'
            }}
        >
            {/* Overlay Next.js Image for optimization, but CSS background ensures instant display */}
            <Image
                id="backdrop-image"
                src="/ucf.jpg"
                alt="UCF Campus"
                fill
                className="object-cover brightness-25 opacity-0"
                priority
                sizes="100vw"
            />
            <style>{`
                @media (max-width: 640px) {
                    #backdrop-container {
                        background-position: 90% center !important;
                    }
                }
            `}</style>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>
    )
}