import Image from "next/image";

export default function Backdrop() {
    return(
        <div className="absolute inset-x-0 top-0 h-[50vh] z-0">
            <Image
            src="/ucf.jpg"
            alt="UCF Campus"
            fill
            className="object-cover brightness-25"
            priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>
    )
}