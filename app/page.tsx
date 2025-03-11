'use client';
import Signin from "@/components/singin_btn";
import {useAuth} from "@/context/authprovider";
import Signout from "@/components/signout";

export default function Home() {
    const {user, setUser} = useAuth();
    return (
        <>
            <Signin/>
            {
                user ? <p>Welcome, {user.displayName}!</p> : <p>You are not logged in.</p>
            }
            <Signout/>
        </>
    );
}
