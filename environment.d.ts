declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FIREBASE_API_KEY: string;
      FIREBASE_AUTH_DOMAIN: string;
      FIREBASE_DATABASE_URL: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_STORAGE_BUCKET: string;
      FIREBASE_MESSAGING_SENDER_ID: string;
      FIREBASE_APP_ID: string;
      FIREBASE_MEASUREMENT_ID: string;

      FIREBASE_ADMIN_CLIENT_EMAIL: string;
      FIREBASE_ADMIN_PRIVATE_KEY: string;
    }
  }
}

export { global };
