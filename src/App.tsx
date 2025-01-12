import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { UserContext } from './contexts/UserContext';
import Map from './pages/Map';
import { onAuthStateChange } from './authentication/auth';


const App = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {

      if(user){
        setLoggedInUser(user.email)
        console.log(`Usuario activo ${user.email}`);
        console.log(user)
      }else{
        setLoggedInUser(null)
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };

  }, [])

  if (loading) {
    return <div>Loading...</div>; 
  }

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
                <Map />
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
