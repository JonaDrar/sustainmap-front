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
import AdminLogin from "./pages/AdminLogin";
          
const App = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setLoggedInUser(user.email);
        console.log(`Usuario activo ${user.email}`);
      } else {
        setLoggedInUser(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Router>
        <ErrorBoundary>
        <Navbar />
        </ErrorBoundary>
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/AdminLogin"
            element={
              <ProtectedRoute loggedInUser={loggedInUser}>
                <AdminLogin/>
              </ProtectedRoute>
            }
          />
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
