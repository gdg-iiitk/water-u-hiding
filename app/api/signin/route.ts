import {NextRequest, NextResponse} from "next/server";
import {db, verifyUser} from "@/lib/firebase_admin";
import {doc, getDoc} from "firebase/firestore"
export async function POST(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    const cookies = req.cookies;
    const status = await verifyUser(token);
    console.log(status);

    switch(status) {
        case 401:
            return NextResponse.json({msg: "Unauthorized request"}, {status: 401});
        case 403:
            return NextResponse.json({msg: "Invalid Credentials"}, {status: 403});
        default:
            if ("uid" in status) {
                const userRef = db.collection("users");
                const userSnap = await userRef.where("uid", "==", status?.uid).get();
                if (userSnap.empty) {
                    await db.collection("users").add({
                        uid: status?.uid,
                        upVotedQuestions: []
                    })
                }
            }
            return NextResponse.json({msg: 'ok'}, {status: 200})
    }
}
