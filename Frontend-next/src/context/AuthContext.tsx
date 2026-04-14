"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authStorage, AuthUser } from "@/src/@core/utils/authStorage";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { useCartStore } from "@/src/stores/useCartStore";
import { useWishlistStore } from "@/src/stores/useWishlistStore";
import { supabase } from "@/src/@core/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { getProfile } from "@/src/services/customer/user.service";

type AuthContextType = {
  currentUser: AuthUser | null;
  session: Session | null;
  isInitializing: boolean;
  isUploadingAvatar: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
  setIsUploadingAvatar: (loading: boolean) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const resetUserStores = () => {
    useCheckoutStore.getState().reset();
    useCartStore.getState().reset();
    useWishlistStore.getState().reset();
  };

  const syncUserWithBackend = async (supabaseSession: Session | null) => {
    if (!supabaseSession?.user) {
      setCurrentUser(null);
      authStorage.logout();
      resetUserStores();
      return;
    }


    const user: AuthUser = {
      id: supabaseSession.user.id,
      name: supabaseSession.user.user_metadata.full_name || "User",
      full_name: supabaseSession.user.user_metadata.full_name,
      email: supabaseSession.user.email,
      avatar: supabaseSession.user.user_metadata.avatar_url,
      username: supabaseSession.user.email || "",
      role: supabaseSession.user.user_metadata.role || "CUSTOMER"
    };
    console.log("Syncing user with backend:", user);

    authStorage.login(supabaseSession.access_token, user);

    try {
      const profile = await getProfile();
      if (profile) {
        user.full_name = profile.full_name || user.full_name;
        user.name = profile.full_name || user.name;
        user.avatar = profile.avatar || user.avatar;
        user.phone = profile.phone || user.phone;
        user.role = profile.role || user.role;
        authStorage.setUser(user);
      }
    } catch (err) {
      console.warn("Failed to enrichment user profile from backend:", err);
    }
    setCurrentUser(user);
  };

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      syncUserWithBackend(session).finally(() => {
        setIsInitializing(false);
      });
    });

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      await syncUserWithBackend(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (token: string, user: AuthUser) => {
    // We already have the session from Supabase, but we can enrichment it here too
    try {
        const profile = await getProfile();
        if (profile) {
            user.avatar = profile.avatar || user.avatar;
            user.full_name = profile.full_name || user.full_name;
            user.name = profile.full_name || user.name;
            user.phone = profile.phone || user.phone;
        }
    } catch (err) {}
    
    authStorage.login(token, user);
    setCurrentUser(user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    authStorage.logout();
    setCurrentUser(null);
    setSession(null);
    resetUserStores();
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      authStorage.setUser(updatedUser);
    }
  };

  const refreshUser = async () => {
    if (session) {
        await syncUserWithBackend(session);
    }
  };

  return (
    <AuthContext.Provider value={{ 
        currentUser, 
        session,
        isInitializing,
        isUploadingAvatar, 
        login, 
        logout, 
        updateUser, 
        setIsUploadingAvatar,
        refreshUser
    }}>
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