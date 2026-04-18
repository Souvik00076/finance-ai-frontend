"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id?: string;
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
  full_name?: string;
  picture?: string;
  provider?: string;
  email_verified?: boolean;
  created_at?: string;
  is_phone_linked?: boolean;
  can_verify?: boolean;
  chat_number?: string;
  is_telegram_linked?: boolean;
  total_spent?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, userData?: Partial<User>) => void;
  logout: () => void;
  updateProfile: (data: { name?: string; avatar?: string }) => void;
  setUserData: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (identifier: string, userData?: Partial<User>) => {
    // Support both email and phone login
    const isEmail = identifier.includes("@");

    if (userData) {
      // If full user data is provided, use it
      setUser({
        ...(isEmail ? { email: identifier } : { phone: identifier }),
        ...userData,
      });
    } else {
      // Fallback for simple login
      setUser({
        ...(isEmail ? { email: identifier } : { phone: identifier }),
        name: "User",
        avatar: undefined,
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: { name?: string; avatar?: string }) => {
    if (user) {
      setUser({
        ...user,
        ...data,
      });
    }
  };

  const setUserData = (userData: Partial<User>) => {
    setUser((prev) => ({
      ...prev,
      ...userData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
