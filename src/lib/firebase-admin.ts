import { initializeApp, getApps, applicationDefault, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | undefined;
let adminDbInstance;
let adminAuthInstance;

try {
  if (!getApps().length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project';

    adminApp = initializeApp(
      process.env.NEXT_PHASE === 'phase-production-build'
        ? { projectId }
        : {
            credential: applicationDefault(),
            projectId,
          }
    );
  } else {
    adminApp = getApps()[0];
  }

  adminDbInstance = getFirestore(adminApp);
  adminAuthInstance = getAuth(adminApp);
} catch (error) {
  console.warn('Firebase Admin initialization skipped during build:', error);
}

export const adminDb = adminDbInstance;
export const adminAuth = adminAuthInstance;
