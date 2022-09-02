import admin from 'firebase-admin';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(
    /\\n/g,
    '\n'
  );

  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const adminAuth = admin.auth();

export const { firestore } = admin;
export const { database } = admin;

export const { increment } = admin.firestore.FieldValue;

export type Timestamp = admin.firestore.Timestamp;
export type WithFieldValue<T> = admin.firestore.WithFieldValue<T>;
export type DocumentData = admin.firestore.DocumentData;
export type QueryDocumentSnapshot =
  admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>;
