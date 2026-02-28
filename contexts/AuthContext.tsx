"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  phone: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string) => void;
  logout: () => void;
  updateProfile: (data: { name?: string; avatar?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (phone: string) => {
    // TODO: Implement actual login with API
    setUser({
      phone,
      name: "User",
      avatar: undefined,
    });
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
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
