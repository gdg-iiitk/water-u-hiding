import { authAdmin } from "@/lib/firebase_admin";
import {NextRequest, NextResponse} from "next/server";
import {db, verifyUser} from "@/lib/firebase_admin";
import {doc, getDoc} from "firebase/firestore"
//TODO: refactor the return data.
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
        const userRef = db.collection("question");
        const userSnap = await userRef.get();
        console.log(userSnap.docs);
        return NextResponse.json({msg: 'ok', questions: userSnap.docs.map(doc => doc?._fieldsProto)}, {status: 200})

      }
    }
}