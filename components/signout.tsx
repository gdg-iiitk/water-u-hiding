import {auth, googleProvider} from "@/lib/firebase";
import {signInWithPopup, signOut} from "firebase/auth";
import {useAuth} from "@/context/authprovider";
import Image from "next/image";



export default function Signout() {
    const signout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    return (
        <>
            <button className={`flex flex-row p-3 gap-2  border border-[#C1D5F6] bg-[#F2F2F2] rounded-4xl`} onClick={signout}>
                <p className={`font-semibold`}>Signout</p>
            </button>
        </>
    );
}
