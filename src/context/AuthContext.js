import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { app } from "../services/firebaseConfig";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, [auth]);

  const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
  };

  const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const value = {
    user,
    signUp,
    signIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
