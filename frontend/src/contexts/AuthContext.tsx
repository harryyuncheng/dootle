'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Configuration: Set to true to be logged in by default
const LOGGED_IN_BY_DEFAULT = false;

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(LOGGED_IN_BY_DEFAULT);
  const [username] = useState('Lucas');

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
