import {NextResponse} from "next/server";
import {db, verifyUser} from "@/lib/firebase_admin";


export async function GET(req: Request) {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    const status = await verifyUser(token);
    switch (status) {
        case 401:
            return NextResponse.json({msg: "Unauthorized request"}, {status: 401});
        case 403:
            return NextResponse.json({msg: "Invalid Credentials"}, {status: 403});
        default:
            if ("uid" in status) {
                let questions = 0;
                const qRef = db.collection("question");
                const qSnap = await qRef.where("createdBy", '==', status?.uid).count().get();
                return NextResponse.json({msg: 'ok', number: qSnap.data().count}, {status: 200});
            }
    }
}