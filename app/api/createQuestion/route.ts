import {NextRequest, NextResponse} from "next/server";
import {db, verifyUser} from "@/lib/firebase_admin";
import {v4} from 'uuid';


export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];
  const cookies = req.cookies;
  const body = await req.json();
  console.log(body);
  if (!body.question) {
    return NextResponse.json({msg: "Question Required"}, {status: 400});
  }
  const status = await verifyUser(token);
  switch(status) {
    case 401:
      return NextResponse.json({msg: "Unauthorized request"}, {status: 401});
    case 403:
      return NextResponse.json({msg: "Invalid Credentials"}, {status: 403});
      default:
        if ("uid" in status) {
          await db.collection("question").add({
            qid: v4(),
            text: body.question,
            createdAt: new Date().toISOString(),
            createdBy: status?.uid,
            upvotes: 0
          })
        }
      return NextResponse.json({msg: 'ok'}, {status: 200})
  }
}
