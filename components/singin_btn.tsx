'use client';
import { auth, googleProvider } from "@/lib/firebase"
import { signInWithPopup } from "firebase/auth";
import logo from '@/statics/google-logo.svg'
import Image from "next/image";
import {useAuth} from "@/context/authprovider";
import {redirect} from "next/navigation";
export default function Signin() {
    const {user, setUser} = useAuth();
    const signin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log(result);
            setUser(result.user);
            redirect('/');
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    return (
        <>
        {/*<button className={`flex flex-row p-3 gap-2  border border-[#C1D5F6] bg-[#F2F2F2] rounded-4xl`} onClick={signin}>*/}
        {/*    <Image src={logo} alt={'logo'}/>*/}
        {/*    <p className={`font-semibold`}>Sign in with Google</p>*/}
        {/*</button>*/}
            <button
                onClick={signin}
                className="px-6 py-4 bg-primary text-white  hover:bg-primary-dark transition hover:cursor-pointer text-3xl rounded-lg"
            >
                Login
            </button>
        </>
    );
}
