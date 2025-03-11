"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

interface AuthContextType {
    user: User | null,
    setUser: (user: User) => void,
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode })=> {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
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