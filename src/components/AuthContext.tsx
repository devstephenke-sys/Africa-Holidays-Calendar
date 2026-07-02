import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSession } from '../types.ts';

interface AuthContextType {
  user: { email: string; displayName: string } | null;
  dbUser: UserSession | null;
  loading: boolean;
  signIn: () => Promise<any>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  isDevAdmin: boolean;
  setIsDevAdmin: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(null);
  const [dbUser, setDbUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDevAdmin, setIsDevAdmin] = useState<boolean>(true);

  // Check if current path or previous token indicates admin session
  useEffect(() => {
    const checkAuth = () => {
      const path = window.location.pathname;
      const savedToken = localStorage.getItem('admin_session_token');

      if (path === '/admin' || savedToken === 'admin-token') {
        // Automatically authenticate as admin
        localStorage.setItem('admin_session_token', 'admin-token');
        setUser({
          email: 'admin@africaholidays.com',
          displayName: 'Admin',
        });
        setDbUser({
          uid: 'admin-uid',
          email: 'admin@africaholidays.com',
          role: 'admin',
        });
      } else {
        setUser(null);
        setDbUser(null);
      }
      setLoading(false);
    };

    checkAuth();
    
    // Listen for path changes
    window.addEventListener('popstate', checkAuth);
    return () => window.removeEventListener('popstate', checkAuth);
  }, []);

  const signIn = async () => {
    // Standard mock sign in, direct link is used instead
    localStorage.setItem('admin_session_token', 'admin-token');
    setUser({
      email: 'admin@africaholidays.com',
      displayName: 'Admin',
    });
    setDbUser({
      uid: 'admin-uid',
      email: 'admin@africaholidays.com',
      role: 'admin',
    });
    return { email: 'admin@africaholidays.com', displayName: 'Admin' };
  };

  const signOut = async () => {
    localStorage.removeItem('admin_session_token');
    setUser(null);
    setDbUser(null);
    window.location.href = '/';
  };

  const getToken = async () => {
    return localStorage.getItem('admin_session_token') || 'admin-token';
  };

  return (
    <AuthContext.Provider value={{
      user,
      dbUser,
      loading,
      signIn,
      signOut,
      getToken,
      isDevAdmin,
      setIsDevAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
