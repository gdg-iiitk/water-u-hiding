'use client';
import Image from "next/image";
import Signin from "@/components/singin_btn";
import {useEffect} from "react";
import {useAuth} from "@/context/authprovider";
import {redirect} from "next/navigation";

export default function Home() {
    const {user} = useAuth();
    useEffect(() => {
        if (user) {
            redirect('/forum');
        }
    }, [user])
    return (
        <div className="w-screen h-[80vh] bg-background flex flex-col items-center justify-around p-4">
            <Image src="/gdgLogo.png" alt="gdg logo" width={150} height={300}/>
            <div className="title text-primary text-7xl flex flex-col items-center ">
                <div className="">Water</div>
                <div className="">You</div>
                <div className="">hiding?</div>
            </div>
            <Signin/>
        </div>
    );
}
