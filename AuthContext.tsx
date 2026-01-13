import React, { createContext, useContext, useEffect, useState } from "react";
import { hashPassword, verifyPassword, getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_PASSWORD_HASH = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"; // hash of "123"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authToken = getFromLocalStorage<string>("authToken");
      if (authToken) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const passwordHash = await hashPassword(password);
      const storedHash = getFromLocalStorage<string>(
        "passwordHash",
        DEFAULT_PASSWORD_HASH
      );

      if (passwordHash === storedHash) {
        const token = Math.random().toString(36).substring(2);
        saveToLocalStorage("authToken", token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const oldPasswordHash = await hashPassword(oldPassword);
      const storedHash = getFromLocalStorage<string>(
        "passwordHash",
        DEFAULT_PASSWORD_HASH
      );

      if (oldPasswordHash !== storedHash) {
        return false;
      }

      const newPasswordHash = await hashPassword(newPassword);
      saveToLocalStorage("passwordHash", newPasswordHash);
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
