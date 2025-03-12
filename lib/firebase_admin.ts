import admin from "firebase-admin";
const serviceAccount = require('./service.json');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const authAdmin = admin.auth();
