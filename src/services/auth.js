import {
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const errorMessages = {
  "auth/email-already-in-use": "An account already exists for this email. Try signing in instead.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/invalid-login-credentials": "The email or password is incorrect.",
  "auth/user-not-found": "The email or password is incorrect.",
  "auth/wrong-password": "The email or password is incorrect.",
  "auth/user-disabled": "This account has been disabled. Contact support for help.",
  "auth/weak-password": "Choose a stronger password and try again.",
  "auth/too-many-requests": "There have been too many attempts. Wait a little and try again.",
  "auth/network-request-failed": "A network error interrupted the request. Check your connection and try again.",
  "auth/popup-closed-by-user": "The Google sign-in window was closed before sign-in finished.",
  "auth/cancelled-popup-request": "Another sign-in request is already in progress.",
  "auth/popup-blocked": "Your browser blocked the Google sign-in window. Allow popups and try again.",
  "auth/account-exists-with-different-credential": "An account already exists with this email. Sign in using its original method.",
  "auth/operation-not-allowed": "This sign-in method is not enabled in Firebase Authentication.",
  "auth/unauthorized-domain": "This site domain is not authorized for Firebase Authentication.",
  "auth/invalid-api-key": "Firebase configuration is invalid. Check the public Firebase environment variables.",
  "auth/expired-action-code": "This link has expired. Request a new email and try again.",
  "auth/invalid-action-code": "This link is invalid or has already been used. Request a new email and try again.",
};

export const getAuthErrorMessage = (error) =>
  errorMessages[error?.code] ??
  "We couldn't complete that request. Please try again.";

export const signUp = async (fullName, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  await updateProfile(userCredential.user, {
    displayName: fullName.trim(),
  });
  await sendEmailVerification(userCredential.user);

  return userCredential.user;
};

export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    if (
      error?.code === "auth/user-not-found" ||
      error?.code === "auth/invalid-email"
    ) {
      return;
    }

    throw error;
  }
};

export const sendCurrentUserPasswordResetEmail = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser?.emailVerified || !currentUser.email) {
    throw new Error("Sign in with a verified account to request a password reset.");
  }

  await sendPasswordResetEmail(auth, currentUser.email);
};

export const resendVerificationEmail = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Sign in again to request a verification email.");
  }

  await sendEmailVerification(currentUser);
};

export const refreshCurrentUser = async () => {
  if (!auth.currentUser) return null;

  await reload(auth.currentUser);
  return auth.currentUser;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const updateAccountDisplayName = async (displayName) => {
  const currentUser = auth.currentUser;
  if (!currentUser?.emailVerified) {
    throw new Error("Sign in with a verified account to update your profile.");
  }

  const name = displayName.trim();
  if (name.length < 2 || name.length > 100) {
    throw new Error("Name must be between 2 and 100 characters.");
  }

  await updateProfile(currentUser, { displayName: name });
  return currentUser;
};
