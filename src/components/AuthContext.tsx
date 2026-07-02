import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as fbSignOut, signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { UserSession } from '../types.ts';

interface AuthContextType {
  user: User | null;
  dbUser: UserSession | null;
  loading: boolean;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  isDevAdmin: boolean;
  setIsDevAdmin: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  
  // A helper state that lets developers bypass the devstephen.ke@gmail.com requirement
  // to fully test all Admin Dashboard CRUD operations locally in AI Studio!
  const [isDevAdmin, setIsDevAdmin] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const res = await fetch('/api/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setDbUser(data);
          } else {
            setDbUser({
              uid: currentUser.uid,
              email: currentUser.email || '',
              role: 'user'
            });
          }
        } catch (err) {
          console.error("Error fetching db user role:", err);
          setDbUser({
            uid: currentUser.uid,
            email: currentUser.email || '',
            role: 'user'
          });
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      return result.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setLoading(false);
      return null;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fbSignOut(auth);
      setUser(null);
      setDbUser(null);
    } catch (error) {
      console.error("Sign Out Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
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
