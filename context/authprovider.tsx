"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import {redirect} from "next/navigation";

interface AuthContextType {
    user: User | null,
    setUser: (user: User) => void,
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode })=> {
    const setToken = async (user:any) => {
        const token = await user?.getIdToken();
        localStorage.setItem("token", token);
    }
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                redirect('/');
            }
            else {
                redirect('/forum');
            }
            setUser(currentUser);
            setToken(currentUser).then(r => {});
        });
        return () => unsubscribe();
    }, []);
    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}


const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Context not initialized properly.");
    }
    return context;
};
export {
    AuthProvider,
    useAuth
}