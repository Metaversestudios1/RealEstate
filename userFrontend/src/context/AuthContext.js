import React, { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import getUserFromToken from "../components/utils/getUserFromToken";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });
  const [loading, setLoading] = useState(true);

  // const fetchAuth = async () => {
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}//protected`, {
  //       method: 'GET',
  //       credentials: 'include', // Include cookies for authentication
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       if (!data.success) { // Ensure checking the success field correctly
  //         console.log("You haven't access for the Dashboard");
  //         setAuth({ isAuthenticated: false, user: null }); // Reset auth state
  //         return;
  //       }
  //       setAuth({ isAuthenticated: true, user: data.user }); // Set auth data
  //     } else {
  //       setAuth({ isAuthenticated: false, user: null }); // Token invalid or not present
  //     }
  //   } catch (error) {
  //     console.error('Failed to check auth status:', error);
  //     setAuth({ isAuthenticated: false, user: null });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const token = Cookies.get("jwt");
  const user = getUserFromToken()
  useEffect(() => {
    // fetchAuth();
    if (token) {
      setAuth({ isAuthenticated: true, user });
    } else {
      setAuth({ isAuthenticated: false, user: null });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth,setLoading, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
