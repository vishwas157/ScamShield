import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TokenResponse } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('scamshield_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await apiService.getMe();
          setUser(userData);
        } catch (err) {
          console.error("Token verification failed, clearing session.", err);
          localStorage.removeItem('scamshield_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response: TokenResponse = await apiService.login(email, password);
    localStorage.setItem('scamshield_token', response.access_token);
    setToken(response.access_token);
    setUser(response.user);
  };

  const register = async (email: string, password: string, fullName?: string) => {
    const response: TokenResponse = await apiService.register(email, password, fullName);
    localStorage.setItem('scamshield_token', response.access_token);
    setToken(response.access_token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('scamshield_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
