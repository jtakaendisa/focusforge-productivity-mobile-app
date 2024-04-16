import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  initializeAuth,
  getAuth,
  //@ts-ignore
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthUser } from '../entities';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MSG_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app, auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

const db = getFirestore();
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',
});

const createAuthUser = async (email: string, password: string) => {
  if (!email || !password) return;

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    throw error;
  }
};

const createUserDocument = async (userAuth: User, username: string = '') => {
  if (!userAuth) return;

  try {
    const userDocRef = doc(db, 'users', userAuth.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();

      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        username,
      });
    }

    return userDocRef;
  } catch (error) {
    throw error;
  }
};

const signInAuthUser = async (email: string, password: string) => {
  if (!email || !password) return;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    return user;
  } catch (error) {
    throw error;
  }
};

const signOutAuthUser = async () => await signOut(auth);

const authStateChangeListener = (callback: any) => onAuthStateChanged(auth, callback);

const formatAuthUserData = async (user: User) => {
  // Fetch additional user data
  const userDocRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    // Merge additional user data with userCredential.user object
    const userData = userSnapshot.data();
    const formattedAuthUser = {
      ...user,
      ...userData,
    } as AuthUser;

    return formattedAuthUser;
  }

  return null;
};

export {
  createAuthUser,
  createUserDocument,
  signInAuthUser,
  signOutAuthUser,
  authStateChangeListener,
  formatAuthUserData,
};
