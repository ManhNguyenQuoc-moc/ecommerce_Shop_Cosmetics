"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authStorage, AuthUser } from "@/src/@core/utils/authStorage";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { useCartStore } from "@/src/stores/useCartStore";
import { useWishlistStore } from "@/src/stores/useWishlistStore";
import { supabase } from "@/src/@core/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { getProfile } from "@/src/services/customer/user/user.service";
import { useRouter } from "next/navigation";

type AuthContextType = {
  currentUser: AuthUser | null;
  session: Session | null;
  isInitializing: boolean;
  isUploadingAvatar: boolean;
  login: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
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
  const router = useRouter();

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

    // Gán token tạm để call API
    authStorage.login(supabaseSession.access_token, {} as any);

    try {
      const profile = await getProfile();
      // Removed duplicate is_banned check - SignInForm handles banned accounts properly now
      console.log("[AuthContext] User profile fetched:", profile);
      if (profile) {
        const authUser: AuthUser = {
          id: supabaseSession.user.id,
          name: profile.full_name || supabaseSession.user.user_metadata.full_name || "User",
          full_name: profile.full_name,
          email: supabaseSession.user.email,
          avatar: profile.avatar || supabaseSession.user.user_metadata.avatar_url,
          username: supabaseSession.user.email || "",
          role: profile.role || "CUSTOMER",
          phone: profile.phone,
          is_banned: profile.is_banned || false,
        };

        authStorage.setUser(authUser);
        setCurrentUser(authUser);
        
        // Redirect to appropriate page after successful authentication
        const isLoggingIn = typeof window !== "undefined" && sessionStorage.getItem("is_logging_in") === "true";
        const isOnLoginPage = window.location.pathname === "/login" && !window.location.search.includes("error=banned");

        if ((isOnLoginPage || isLoggingIn) && profile.role === "ADMIN") {
          // One-time redirect for ADMIN after login
          sessionStorage.removeItem("is_logging_in");
          router.push("/admin");
        } else if (isOnLoginPage) {
          // Regular user on login page
          router.push("/");
        }
      }
    } catch (err: any) {
      // Check if this is a banned account error
      const isBannedError = err?.status === 403 || err?.message?.includes("bị khóa") || err?.message?.includes("khóa") || profile?.is_banned;
      
      if (isBannedError) {
        console.error("[AuthContext] Banned account detected during sync");
        await supabase.auth.signOut();
        authStorage.logout();
        resetUserStores();
        
        // Show notification on current page
        const { showNotificationError } = await import("@/src/@core/utils/message");
        showNotificationError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin để được hỗ trợ.");

        // Only redirect to login if we are on a protected page
        const protectedRoutes = ["/profile", "/admin", "/wishlist"];
        const isProtected = protectedRoutes.some((route) => window.location.pathname.startsWith(route));
        
        if (isProtected) {
          router.push("/login?error=banned");
        }
        return;
      }
      
      // Other errors - let session exist without full enrichment
      console.warn("[AuthContext] Profile enrichment failed:", err.message);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      syncUserWithBackend(session).finally(() => {
        setIsInitializing(false);
      });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // For PKCE flow, the session may already have user data
        // Wait a bit for callback processing then sync
        await new Promise(resolve => setTimeout(resolve, 100));
        await syncUserWithBackend(session);
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
        authStorage.logout();
        resetUserStores();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (token: string, user: AuthUser) => {
    authStorage.login(token, user);
    setCurrentUser(user);
  };

  const logout = async () => {
    // Dọn dẹp tất cả dấu vết
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
    if (session) await syncUserWithBackend(session);
  };

  return (
    <AuthContext.Provider value={{ currentUser, session, isInitializing, isUploadingAvatar, login, logout, updateUser, setIsUploadingAvatar, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};