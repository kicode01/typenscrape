import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [render, setRender] = useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setRender(true);
    } else {
      const timeout = setTimeout(() => setRender(false), 200); // Wait for animate-out duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!render) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        onClose();
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          toast.error("Passwords don't match!");
          setIsLoading(false);
          return;
        }
        await signUpWithEmail(email, password);
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMode('signin');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 w-full h-[100dvh] z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      <div 
        className={`w-full max-w-sm max-h-[85dvh] flex flex-col overflow-y-auto overflow-x-hidden scrollbar-none neo-card transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        style={{ transition: 'opacity 0.25s ease-out, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative pt-6 px-6 pb-2 text-center">
          <button 
            onClick={() => {
              setTimeout(() => onClose(), 150);
            }}
            className="absolute top-4 right-4 p-2 btn-neo-sm flex items-center justify-center text-theme-icon hover:text-theme-text transition-colors z-10"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
          
          <div className="w-12 h-12 mx-auto bg-theme-panel flex items-center justify-center mb-4 neo-shape-sm" style={{ borderRadius: 'calc(var(--theme-radius) / 2)' }}>
            <Lock className="w-6 h-6 text-theme-primary stroke-[2.5]" />
          </div>
          
          <h2 className="text-2xl font-black text-theme-text tracking-tight">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-sm font-bold text-theme-icon mt-1">
            {mode === 'signin' && 'Sign in to sync your recipes'}
            {mode === 'signup' && 'Join to save your AI masterpieces'}
            {mode === 'forgot' && 'Enter your email to get a reset link'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-theme-text ml-1 opacity-90">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-icon" />
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="chef@example.com"
                    className="pl-9 h-11 bg-theme-panel border-[length:var(--theme-border-width)] border-theme-border neo-shape-sm focus-visible:ring-0 focus-visible:border-theme-primary font-bold text-theme-text placeholder:text-theme-icon"
                    required
                  />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-theme-text opacity-90">Password</label>
                  {mode === 'signin' && (
                    <button 
                      type="button" 
                      onClick={() => setMode('forgot')}
                      className="text-[10px] font-bold text-theme-primary hover:text-theme-primary-hover"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-icon" />
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-11 bg-theme-panel border-[length:var(--theme-border-width)] border-theme-border neo-shape-sm focus-visible:ring-0 focus-visible:border-theme-primary font-bold text-theme-text placeholder:text-theme-icon"
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-theme-text ml-1 opacity-90">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-icon" />
                  <Input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-11 bg-theme-panel border-[length:var(--theme-border-width)] border-theme-border neo-shape-sm focus-visible:ring-0 focus-visible:border-theme-primary font-bold text-theme-text placeholder:text-theme-icon"
                    required
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 bg-theme-primary hover:bg-theme-primary-hover text-theme-panel font-black btn-neo border-[length:var(--theme-border-width)] border-theme-border"
            >
              {isLoading ? 'Processing...' : (
                <span className="flex items-center">
                  {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          </form>

          {mode !== 'forgot' && (
            <>
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-theme-border opacity-30"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-semibold text-theme-icon">OR</span>
                <div className="flex-grow border-t border-theme-border opacity-30"></div>
              </div>

              <button 
                type="button"
                onClick={() => {
                  setTimeout(() => {
                    signInWithGoogle();
                    onClose();
                  }, 150);
                }}
                className="w-full h-11 font-black bg-theme-panel hover:bg-theme-bg border-[length:var(--theme-border-width)] border-theme-border text-theme-text btn-neo-sm flex items-center justify-center"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Continue with Google
              </button>
            </>
          )}

          {/* Footer toggle */}
          <div className="mt-6 text-center text-sm font-semibold">
            {mode === 'signin' ? (
              <p className="text-theme-icon">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-theme-primary hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-theme-icon">
                Back to{' '}
                <button onClick={() => setMode('signin')} className="text-theme-primary hover:underline">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
