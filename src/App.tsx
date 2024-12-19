import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import MapPage from './pages/Map';
import { UserContext } from './contexts/UserContext';

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/map"
            element={
              <ProtectedRoute loggedInUser={loggedInUser}>
                <MapPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ loggedInUser: string | null; children: React.ReactNode }> = ({
  loggedInUser,
  children,
}) => {
  if (!loggedInUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default App;
