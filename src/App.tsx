import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { UserContext } from './contexts/UserContext';
import Map from './pages/Map';
import EditPointPage from "./pages/EditPointPage";
import FormComponent from './components/PointsForm'


const App = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/form" element={<FormComponent />} />
          <Route
            path="/map"
            element={
              <ProtectedRoute loggedInUser={loggedInUser}>
                <Map />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/edit" 
            element={
              <ProtectedRoute loggedInUser={loggedInUser}>
                <EditPointPage />
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
