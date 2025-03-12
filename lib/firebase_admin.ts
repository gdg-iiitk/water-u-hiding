import admin from "firebase-admin";
import {NextRequest, NextResponse} from "next/server";

const serviceAccount = require('./service.json');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();
const authAdmin = admin.auth();

const verifyUser = async (token :string | undefined) => {
    if (!token) {
        return 401
    }
    try {
        return await authAdmin.verifyIdToken(token);
    } catch (error) {
        return 403
    }
}


export {
    authAdmin,
    db,
    verifyUser
}
