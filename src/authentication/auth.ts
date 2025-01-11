import { 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    NextOrObserver

 } from "firebase/auth";

 import { app } from "../firebase/firebaseConfig";


 const auth = getAuth(app);

export const login = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw new Error('Error al iniciar sesión');
    }
}

export const register = async (email: string, password: string) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw new Error('Error al registrar usuario');
    }
}

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw new Error('Error al cerrar sesión');
    }
}
 
export const onAuthSatateChanged = (observer: NextOrObserver<User>) => {
    onAuthStateChanged(auth, observer);
    }


