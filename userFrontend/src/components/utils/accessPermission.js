import Cookies from "js-cookie";
import getUserFromToken from "./getUserFromToken";

const fetchPermissionsSync = (id) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${process.env.REACT_APP_BACKEND_URL}//api/getesinglepermission`, false); // `false` makes the request synchronous
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ id }));

  if (xhr.status === 200) {
    const perm = JSON.parse(xhr.responseText);
    return perm.success ? perm.data[0]?.permission : "Unknown";
  } else {
    console.error("Error fetching permissions:", xhr.statusText);
    return "Unknown";
  }
};

const fetchRoleSync = (role_id) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${process.env.REACT_APP_BACKEND_URL}//api/getSingleRole`, false); // `false` makes the request synchronous
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ id: role_id }));

  if (xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);
    if (response.success) {
      const rolesWithPermissions = response.data.map((role) => {
        const permissions = role.permission.map((perm) => fetchPermissionsSync(perm));
        return { ...role, permissions };
      });

      // Extract permissions from the roles and return them
      const allPermissions = rolesWithPermissions.flatMap((role) => role.permissions);
      return allPermissions;
    } else {
      console.error("Error fetching roles:", response.message);
    }
  } else {
    console.error("Error fetching roles:", xhr.statusText);
  }

  return []; // Return empty array if there is an error or no data
};

const accessPermission = (requiredPermission) => {
  // Get token from cookies
  const token = Cookies.get("jwt");

  if (!token) {
    console.error("No token found."); // If no token, exit
    return false;
  }

  // Get user info from the token
  const { role_id } = getUserFromToken();

  if (!role_id) {
    return false;
  }

  // Fetch roles and permissions synchronously
  const permissions = fetchRoleSync(role_id);

  // Check if the required permission is included in the fetched permissions
  if (permissions && Array.isArray(permissions) && permissions.includes(requiredPermission)) {
    return true;  // Return true if permission is found
  } else {
    
    return false;  // Return false if permission is not found
  }
};

export default accessPermission;
