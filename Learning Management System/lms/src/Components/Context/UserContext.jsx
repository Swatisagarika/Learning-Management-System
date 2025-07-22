import React, { createContext, useContext, useState } from 'react';
 
 
const UserContext = createContext();
export { UserContext };
 
 
export function useUser() {
  return useContext(UserContext);
}
 
 
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    photo: 'https://i.pravatar.cc/100',
  });
 
  const updateUser = (updatedUser) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUser,
    }));
  };
 
  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
 