// import { createContext, useContext, useState } from "react";
// import { signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { auth } from "../authentication/auth";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [password, setPassword] = useState<string | null>(null); // 🔹 Guardamos la contraseña temporalmente

//   const login = async (email, pass) => {
//     const userCredential = await signInWithEmailAndPassword(auth, email, pass);
//     setUser(userCredential.user);
//     setPassword(pass); // 🔹 Guardamos la contraseña para su posterior uso
//   };

//   const logout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setPassword(null); // 🔹 Limpiar contraseña al cerrar sesión
//   };

//   return (
//     <AuthContext.Provider value={{ user, password, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
