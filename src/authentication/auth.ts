import { 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from "firebase/auth";

import { app } from "../firebase/firebaseConfig";


export const auth = getAuth(app);

export const login = async (email: string, password: string) => {
   
      return await signInWithEmailAndPassword(auth, email, password);
  
};

export const register = async (email: string, password: string) => {
   
     return  await createUserWithEmailAndPassword(auth, email, password);
   
};

export const logout = async () => {
    
     return await signOut(auth);
    
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };
