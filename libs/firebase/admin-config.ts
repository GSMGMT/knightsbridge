import admin, { AppOptions } from 'firebase-admin';
import {} from 'firebase-admin/firestore';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(
    /\\n/g,
    '\n'
  );

  const options: AppOptions = {
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  };
  admin.initializeApp(options);
  admin.firestore().settings({ ignoreUndefinedProperties: true });
}

export const adminAuth = admin.auth();

export const { firestore } = admin;
export const { database } = admin;
export const { storage } = admin;

export const { increment } = admin.firestore.FieldValue;

export type Timestamp = admin.firestore.Timestamp;
export type WithFieldValue<T> = admin.firestore.WithFieldValue<T>;
export type DocumentData = admin.firestore.DocumentData;
export type QueryDocumentSnapshot =
  admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>;

export type Query<T> = admin.firestore.Query<T>;
