import { 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from "firebase/auth";

import { app } from "../firebase/firebaseConfig";
import axios from "axios";
import { backendUrlBase } from "../utils/environment";


export const auth = getAuth(app);

export const login = async (email: string, password: string) => {

      return await signInWithEmailAndPassword(auth, email, password);

};

export const register = async (
  email: string, 
  password: string, 
  name: string = email.split('@')[0], 
  roles: string = 'user',
) => {
  try {
    // 1. Guardar la sesión actual (si existe)
    const currentUserEmail = email;
    const currentUserPassword = password; 
    
    // 2. Crear el nuevo usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    console.log('newUser:', newUser);
    
    // 3. Crear el usuario en la base de datos
    const formattedUser = {
      name: name,  
      email: email,
      roles: roles,
      userId: newUser.uid, 
    };

    await signOut(auth);
    // Llamada a la API para crear el usuario en tu base de datos
    await axios.post(`${backendUrlBase}/user`, formattedUser);

    // 4. Cerrar sesión del nuevo usuario
    
    // 5. Restaurar la sesión del usuario anterior (si existía)
    if (currentUserEmail && currentUserPassword) {
      await signInWithEmailAndPassword(auth, currentUserEmail, currentUserPassword);
    }
    
    // 6. Devolver el nuevo usuario creado (opcional)
    return newUser;
  } catch (error) {
    console.error('Error de registro:', error);
    throw error;
  }
 
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };
