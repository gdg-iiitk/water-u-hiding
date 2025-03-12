import admin from "firebase-admin";
const serviceAccount = require('./service.json');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();
const authAdmin = admin.auth();

export {
    authAdmin,
    db
}
