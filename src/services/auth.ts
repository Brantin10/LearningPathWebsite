import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AppUser } from '../types';

export async function signUp(
  email: string,
  password: string,
  role: 'seeker' | 'employer' = 'seeker',
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  const newUser: AppUser = {
    uid: user.uid,
    email: user.email || email,
    username: email.split('@')[0],
    currentJob: '',
    desiredJob: '',
    skills: '',
    education: '',
    birthDate: '',
    avatar: 0,
    age: '',
    profileCompleted: false,
    createdAt: Date.now(),
    chosenCareer: '',
    role,
    visibleToEmployers: false,
  };

  // Write user profile to Firestore — don't block signup if this fails
  // (e.g. due to Firestore rules). Profile will be created/retried later.
  try {
    await setDoc(doc(db, 'users', user.uid), newUser);
  } catch (firestoreErr) {
    console.warn('[signUp] Firestore profile write failed:', firestoreErr);
  }

  return user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
