import { 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
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



export const loginAdmin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Verificamos que userCredential y user existan antes de acceder a sus propiedades
    if (!userCredential || !userCredential.user) {
      throw new Error("No se pudo obtener el usuario.");
    }
    console.log(sessionStorage.setItem) // Guardar la contraseña temporalmente

    return userCredential.user; // Retornamos el usuario autenticado
  } catch (error) {
    console.error("Error de inicio de sesión:", error);
    throw error; // Para que el frontend pueda manejar el error correctamente
  }
};



export const register = async (
  email: string, 
  password: string, 
  name: string = email.split('@')[0], 
  roles: string = 'user',
) => {
  try {
    // 1. Guardar la sesión actual (si existe)
    const currentUserEmail = auth.currentUser?.email;
    const currentUserPassword = sessionStorage.getItem('userPassword'); 
    
    // 2. Crear el nuevo usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    
    
    // 3. Crear el usuario en la base de datos
    const formattedUser = {
      name: name,  
      email: email,
      roles: roles,
      userId: newUser.uid, 
    };

    // await signOut(auth);
    // Llamada a la API para crear el usuario en tu base de datos
    await axios.post(`${backendUrlBase}/user`, formattedUser);

    // 4. Cerrar sesión del nuevo usuario
    
    // 5. Restaurar la sesión del usuario anterior (si existía)
    if (currentUserEmail && currentUserPassword) {
      await signInWithEmailAndPassword(auth, currentUserEmail, currentUserPassword);
    }

    sessionStorage.removeItem('userPassword');
    
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
