const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Usage: node scripts/seed-admin.js <username> <email> <password>

async function seedAdmin() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.error("Usage: node scripts/seed-admin.js <username> <email> <password>");
        process.exit(1);
    }

    const [username, email, password] = args;

    // Load env vars if needed, or rely on system env
    // For local dev, we might need to load .env.local manually or assume they are set.
    // Here we try to load .env.local if dotenv is available, otherwise assume env vars are set.
    try {
        require('dotenv').config({ path: '.env.local' });
    } catch (e) {
        console.log("dotenv not found or .env.local not loaded, assuming env vars are set.");
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined;

    if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.error("Error: Missing Firebase Admin environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).");
        process.exit(1);
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            })
        });
    }

    const auth = admin.auth();
    const db = admin.firestore();

    try {
        console.log(`Creating/Updating Auth user: ${email}...`);
        let uid;
        try {
            const userRecord = await auth.getUserByEmail(email);
            uid = userRecord.uid;
            await auth.updateUser(uid, { password });
            console.log(`User exists (uid: ${uid}), password updated.`);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                const userRecord = await auth.createUser({
                    email,
                    password,
                    emailVerified: true
                });
                uid = userRecord.uid;
                console.log(`User created (uid: ${uid}).`);
            } else {
                throw error;
            }
        }

        console.log(`Creating/Updating Firestore admin_users document for username: ${username}...`);
        const normalizedUsername = username.trim().toLowerCase();
        
        await db.collection('admin_users').doc(normalizedUsername).set({
            username: normalizedUsername,
            email: email,
            uid: uid,
            role: 'admin',
            isActive: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log("✅ Admin user seeded successfully!");
        console.log(`Username: ${normalizedUsername}`);
        console.log(`Email: ${email}`);
        console.log(`Password: [hidden]`);
        process.exit(0);

    } catch (error) {
        console.error("Error seeding admin user:", error);
        process.exit(1);
    }
}

seedAdmin();
