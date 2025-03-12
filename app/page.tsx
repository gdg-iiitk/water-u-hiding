'use client';
import Image from "next/image";

export default function Home() {
    const login = () => {
    };

    return (
        <div className="w-screen h-[80vh] bg-background flex flex-col items-center justify-around p-4">
            <Image src="/gdgLogo.png" alt="gdg logo" width={150} height={300}/>
            <div className="title text-primary text-7xl flex flex-col items-center ">
                <div className="">Water</div>
                <div className="">You</div>
                <div className="">hiding?</div>
            </div>
            <button
                onClick={login}
                className="px-6 py-4 bg-primary text-white  hover:bg-primary-dark transition hover:cursor-pointer text-3xl rounded-lg"
            >
                Login
            </button>
        </div>
    );
}
