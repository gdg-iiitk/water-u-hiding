import {NextRequest, NextResponse} from "next/server";
import {db, admin, verifyUser} from "@/lib/firebase_admin";
import {doc, getDoc} from "firebase/firestore"
import {getFirestore, writeBatch, increment, serverTimestamp, updateDoc} from "firebase/firestore";

interface votesInterface {
    votes: { string: boolean }
}

export async function POST(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    const cookies = req.cookies;
    const data = await req.json();
    const votes = data?.votes;
    if (!votes) {
        return NextResponse.json({msg: "bad request"}, {status: 400});
    }
    const status = await verifyUser(token);
    switch (status) {
        case 401:
            return NextResponse.json({msg: "Unauthorized request"}, {status: 401});
        case 403:
            return NextResponse.json({msg: "Invalid Credentials"}, {status: 403});
        default:
            if ("uid" in status) {
                const userRef = db.collection("users");
                await batchVoteUpdate(status?.uid, votes);
            }
    }
    return NextResponse.json({msg: 'ok'}, {status: 200})
}

const batchVoteUpdate = async (userId: string, votes: Record<string, boolean>) => {
    try {
        const batch = db.batch();
        const userRef = db.collection("users");
        const userSnap = await userRef.where("uid", "==", userId).get();
        const upVoted = userSnap.docs[0].data()['upVotedQuestions'];
        let new_upVoted = [...upVoted];
        const qRef = db.collection("question");
        for (const [questionId, isUpvoting] of Object.entries(votes)) {
            const qSnap = await qRef.where("qid", "==", questionId).get();
            let current_votes = qSnap.docs[0]?.data()['upvotes'];
            if (isUpvoting && !upVoted.includes(questionId)) {
                new_upVoted.push(questionId);
                batch.update(qSnap.docs[0].ref, {upvotes: current_votes + 1});
            } else if (!isUpvoting && upVoted.includes(questionId)) {
                new_upVoted = new_upVoted.filter((upvote: string) => upvote != questionId);
                batch.update(qSnap.docs[0].ref, {upvotes: current_votes - 1});
            }
        }
        batch.update(userSnap.docs[0].ref, {
            upVotedQuestions: new_upVoted,
        });
        await batch.commit();
    } catch (error) {
        console.error(error);
    }
};
