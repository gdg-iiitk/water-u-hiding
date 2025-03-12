'use client';
import Image from "next/image";
import { useAuth } from "@/context/authprovider";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import { sign } from "crypto";
import toast from "react-hot-toast";

import {
  Link,
  Loader,
  Loader2,
  LoaderCircle,
  LoaderPinwheel,
} from "lucide-react";
import {redirect, useRouter} from "next/navigation";

export default function Home() {
  const { user, setUser } = useAuth();
  const [signInDisabled, setSignInDisabled] = useState(false);
  const router = useRouter();
  const login = async () => {
    try {
      setSignInDisabled(true);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result?.user);
      const token = await result?.user?.getIdToken();
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.status === 200) {
        toast.success(`Signing in`);
        router.replace("/forum");
      }

    } catch (error) {
      console.error(error);
      // throw error;
    } finally {
      setSignInDisabled(false);
    }
  };
  return (
    <div className="w-screen h-[90vh] bg-background flex flex-col items-center justify-between p-4">
      <Image src="/gdgLogo.png" alt="gdg logo" width={150} height={300} />
      <div className="title text-primary text-7xl flex flex-col items-center ">
        <div className="">Water</div>
        <div className="">You</div>
        <div className="">hiding?</div>
      </div>
      {signInDisabled ? (
        <div className="px-6 py-4 bg-primary text-white  hover:bg-primary-dark transition hover:cursor-pointer text-3xl rounded-lg">
          <LoaderCircle className=" animate-spin" />
        </div>
      ) : (
        <button
          onClick={login}
          disabled={signInDisabled}
          className="px-6 py-4 bg-primary text-white  hover:bg-primary-dark transition hover:cursor-pointer text-3xl rounded-lg"
        >
          Login
        </button>
      )}
      <div className="footer text-primary text-xl text-center">
        No Escape, No Excuses Only Answers or Water!
      </div>
    </div>
  );
}
