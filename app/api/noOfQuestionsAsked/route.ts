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
                const qSnap = await qRef.get();
                const userRef = db.collection("users");
                const userSnap = await userRef.where("uid", "==", status?.uid).get();
                if (!userSnap.empty) {
                    qSnap.docs.forEach((doc) => {
                        if (doc.data()['createdBy'] === status?.uid) {
                            questions++;
                        }
                    })
                    return NextResponse.json({msg: 'ok', number: 0}, {status:200});
                }
                else {
                    return NextResponse.json({
                        msg: "user not found"
                    }, {
                        status: 400
                    })
                }
                // return NextResponse.json({msg: 'ok', questions: qSnap.docs.map(doc =>
                //     {
                //         const question = doc.data();
                //         console.log("question", question?.qid);
                //         return {
                //             hasUpvoted: upVoted.includes(question?.qid),
                //             id: question?.qid,
                //             name: question?.displayName,
                //             totalVotes: question?.upvotes,
                //             question: question?.text,
                //         }
                //     })}, {status: 200})
            }
    }
}