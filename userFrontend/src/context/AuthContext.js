import React, { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import getUserFromToken from "../components/utils/getUserFromToken";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });
  const [loading, setLoading] = useState(true);

  // Get the JWT token from cookies
  const token = Cookies.get("jwt");

  // Logout function to clear cookies and reset state
  const logout = async () => {
    setLoading(true); // Start loading state
    
    try {
      // If token exists, try to decode it and logout
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        if (userId) {
          // Call the backend to logout and reset session
          await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId }),
          });
        }

        // Clear cookies and reset auth state
        Cookies.remove("jwt");
        Cookies.remove("connect.sid");
      }

      setAuth({ isAuthenticated: false, user: null }); // Reset auth state
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the JWT token
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token is expired, call logout
          logout();
        } else {
          // Token is valid, set the auth state with the user info
          const user = getUserFromToken();
          setAuth({ isAuthenticated: true, user });
        }
      } catch (error) {
        // If decoding fails (invalid token), remove cookies and reset auth state
        Cookies.remove("token");
        setAuth({ isAuthenticated: false, user: null });
      }
    } else {
      // If no token is found, reset the auth state
      setAuth({ isAuthenticated: false, user: null });
    }

    setLoading(false); // Stop loading after checking token
  }, [token]); // Dependency on token

  return (
    <AuthContext.Provider value={{ auth, setAuth, setLoading, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
