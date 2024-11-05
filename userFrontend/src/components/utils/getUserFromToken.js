import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const getUserFromToken = () => {
  const token = Cookies.get('jwt'); // Assuming you stored the token in cookies
  if (!token) {
    return null;
  }
  
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken // This contains user details
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export default getUserFromToken;