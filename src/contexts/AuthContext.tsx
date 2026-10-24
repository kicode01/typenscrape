import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  resetPassword: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      toast.error('Authentication is currently offline.');
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Successfully signed in! 🎉');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      toast.error('Failed to sign in. Please try again.');
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error('Offline');
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    toast.success('Account created successfully! 🎉');
    
    // Automatically send verification link
    try {
      await sendEmailVerification(userCredential.user);
      toast.info('Verification link sent to your email.');
    } catch (e) {
      console.warn('Failed to send verification email:', e);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error('Offline');
    await signInWithEmailAndPassword(auth, email, pass);
    toast.success('Successfully signed in! 🎉');
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Offline');
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent. Check your inbox!');
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      toast.success('Signed out successfully.');
    } catch (error) {
      console.error('Sign-out error:', error);
      toast.error('Failed to sign out.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
