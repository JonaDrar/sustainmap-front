import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { UserContext } from "./contexts/UserContext";
import Map from "./pages/Map";
import { onAuthStateChange } from "./authentication/auth";

import EditPointPage from "./pages/EditPoint";
import ErrorBoundary from "./components/ErrorBoundary";
import CreatePoint from "./pages/CreatePoint";
import LogoutSuccess from "./components/LogoutSuccess";
          
const App = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState("/images/imagen-inicio.png"); 

  useEffect(() => {
    const updateImage = () => {
      if (window.innerWidth <= 768) {
        setImageSrc("/images/celular-inicio.png"); 
      } else {
        setImageSrc("/images/imagen-inicio.png"); 
      }
    };

    updateImage(); 
    window.addEventListener("resize", updateImage); 

    return () => {
      window.removeEventListener("resize", updateImage); 
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setTimeout(() => {
        if (user) {
          setLoggedInUser(user.email);
          console.log(`Usuario activo ${user.email}`);
        } else {
          setLoggedInUser(null);
        }
        setLoading(false);
      }, 1500); 
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className=" flex items-center justify-center h-screen w-screen bg-gray-100">
        <img 
          src={imageSrc} 
          alt="Cargando..." 
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
    
  }

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Router>
        <ErrorBoundary>
        <Navbar />
        </ErrorBoundary>
        <ErrorBoundary>
        <Routes>
        <Route path="/mapa" element={<Map />} />
        <Route path="/" element={<Navigate to="/mapa" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout-success" element={<LogoutSuccess />} />
          <Route
            path="/signup"
            element={
              <ProtectedRoute loggedInUser={loggedInUser}>
                <SignupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-point"
            element={
              <ProtectedRoute loggedInUser={loggedInUser}>
                <CreatePoint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-point"
            element={
              <ProtectedRoute loggedInUser={loggedInUser}>
                <EditPointPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        </ErrorBoundary>
      </Router>
    </UserContext.Provider>
  );
};

const ProtectedRoute: React.FC<{
  loggedInUser: string | null;
  children: React.ReactNode;
}> = ({ loggedInUser, children }) => {
  if (!loggedInUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default App;
