"use client";

import React, { createContext, useContext, useState } from "react";
import { authStorage, AuthUser } from "@/src/@core/utils/authStorage";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { useCartStore } from "@/src/stores/useCartStore";
type AuthContextType = {
  currentUser: AuthUser | null;
  isUploadingAvatar: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
  setIsUploadingAvatar: (loading: boolean) => void;
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
    useCheckoutStore.getState().reset();
    useCartStore.getState().reset();
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      authStorage.setUser(updatedUser);
    }
  };

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  return (
    <AuthContext.Provider value={{ currentUser, isUploadingAvatar, login, logout, updateUser, setIsUploadingAvatar }}>
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