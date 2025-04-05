import React, { createContext, useContext, useState, useEffect } from "react";
import Api from "../utils/Api";
import Auth from "../utils/Auth";

interface User {
  username: string;
  email: string;
  is_staff: boolean;
  groups: string[];
  permissions: string[];
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    if (!Auth.isAuthenticated()) return;

    const res = await Api.fetch("/me");
    setUser(res.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
