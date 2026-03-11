"use client";

import React, { createContext, useContext, useState } from "react";
import { authStorage, AuthUser } from "@/src/@core/utils/authStorage";

type AuthContextType = {
  currentUser: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
  return authStorage.getUser();
});
  const login = (token: string, user: AuthUser) => {
    authStorage.login(token, user);
    setCurrentUser(user);
  };

  const logout = () => {
    authStorage.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};