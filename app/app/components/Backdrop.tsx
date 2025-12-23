import Image from "next/image";

export default function Backdrop() {
    return(
        <div id="backdrop-container" className="absolute inset-x-0 top-0 h-screen z-0 overflow-hidden">
            <Image
            id="backdrop-image"
            src="/ucf.jpg"
            alt="UCF Campus"
            fill
            className="object-cover brightness-25"
            style={{ transform: 'scale(1.3)' }}
            priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>
    )
}