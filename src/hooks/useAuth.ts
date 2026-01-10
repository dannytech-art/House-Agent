import { useState, useEffect, useCallback } from 'react';
import { User, Agent, UserRole } from '../types';
import apiClient from '../lib/api-client';

// Simple internal event bus so all useAuth consumers stay in sync
// This avoids needing a provider and ensures immediate cross-component updates

type AuthListener = (payload: {
  user?: User | Agent | null;
  isAuthenticated?: boolean;
  error?: string | null;
}) => void;

const authListeners = new Set<AuthListener>();

function subscribeAuth(listener: AuthListener): () => void {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}

function emitAuth(payload: {
  user?: User | Agent | null;
  isAuthenticated?: boolean;
  error?: string | null;
}) {
  authListeners.forEach((listener) => {
    try {
      listener(payload);
    } catch {
      // Ignore errors from listeners
    }
  });
}

export function useAuth() {
  const [user, setUser] = useState<User | Agent | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // OTP verification state
  const [pendingVerification, setPendingVerification] = useState<{
    email: string;
    type: 'email_verification' | 'password_reset';
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = apiClient.getToken();

      if (token) {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData as User | Agent);
          setIsAuthenticated(true);
          emitAuth({ user: userData as User | Agent, isAuthenticated: true, error: null });
        } catch {
          apiClient.setToken(null);
          localStorage.removeItem('vilanow_user');
        }
      } else {
        const stored = localStorage.getItem('vilanow_user');
        if (stored) {
          try {
            const parsedUser = JSON.parse(stored);
            setUser(parsedUser);
            setIsAuthenticated(true);
            emitAuth({ user: parsedUser, isAuthenticated: true, error: null });
          } catch {
            localStorage.removeItem('vilanow_user');
          }
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Subscribe to global auth changes so all hook consumers stay in sync
  useEffect(() => {
    const unsubscribe = subscribeAuth(({ user, isAuthenticated, error }) => {
      if (user !== undefined) setUser(user as User | Agent | null);
      if (isAuthenticated !== undefined) setIsAuthenticated(!!isAuthenticated);
      if (error !== undefined) setError(error);
    });
    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, password: string, role?: UserRole): Promise<{
    requiresVerification?: boolean;
    email?: string;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(email, password);
      
      // Check if email verification is required
      if (response.requiresVerification) {
        setPendingVerification({ email: response.email || email, type: 'email_verification' });
        setIsLoading(false);
        return { requiresVerification: true, email: response.email || email };
      }
      
      const userData = response.user;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('vilanow_user', JSON.stringify(userData));
      emitAuth({ user: userData, isAuthenticated: true, error: null });

      return {};
    } catch (err: any) {
      // Check if error response includes requiresVerification
      if (err.message?.includes('verify your email')) {
        setPendingVerification({ email, type: 'email_verification' });
        setIsLoading(false);
        throw err;
      }
      setError(err.message || 'Invalid email or password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: UserRole, userData: any): Promise<{
    requiresVerification?: boolean;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.register({
        email,
        password,
        name: userData.name,
        phone: userData.phone,
        role,
        agentType: userData.agentType,
      });

      // Check if email verification is required
      if (response.requiresVerification) {
        setPendingVerification({ email, type: 'email_verification' });
        setIsLoading(false);
        return { requiresVerification: true };
      }

      // Ensure token is set immediately after signup if provided by API
      if (response.token) {
        apiClient.setToken(response.token);
      }

      const newUser = response.user;
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('vilanow_user', JSON.stringify(newUser));
      emitAuth({ user: newUser, isAuthenticated: true, error: null });

      return {};
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP for verification
  const sendOtp = async (email: string, type: 'email_verification' | 'password_reset' = 'email_verification') => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.sendOtp(email, type);
      setPendingVerification({ email, type });
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (email: string, otp: string, type: 'email_verification' | 'password_reset' = 'email_verification'): Promise<{
    resetToken?: string;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.verifyOtp(email, otp, type);
      
      if (type === 'email_verification' && response.user && response.token) {
        // Email verified - user is now logged in
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('vilanow_user', JSON.stringify(response.user));
        emitAuth({ user: response.user, isAuthenticated: true, error: null });
        setPendingVerification(null);
      }
      
      if (type === 'password_reset' && response.resetToken) {
        setPendingVerification(null);
        return { resetToken: response.resetToken };
      }
      
      return {};
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (!pendingVerification) return;
    
    try {
      await sendOtp(pendingVerification.email, pendingVerification.type);
    } catch (err: any) {
      // Error already handled in sendOtp
    }
  };

  // Clear pending verification
  const clearPendingVerification = useCallback(() => {
    setPendingVerification(null);
  }, []);

  const sendPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.requestPasswordReset(email);
      setPendingVerification({ email, type: 'password_reset' });
    } catch {
      // ignore to avoid exposing if email exists
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.resetPassword(resetToken, newPassword);
      setPendingVerification(null);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // ignore
    }

    setUser(null);
    setIsAuthenticated(false);
    setPendingVerification(null);
    localStorage.removeItem('vilanow_user');
    emitAuth({ user: null, isAuthenticated: false, error: null });
  };

  // Google OAuth
  const loginWithGoogle = (role: 'seeker' | 'agent' = 'seeker') => {
    const googleUrl = apiClient.getGoogleAuthUrl(role);
    window.location.href = googleUrl;
  };

  // Set auth state from external source (e.g., OAuth callback)
  const setAuthFromCallback = (userData: User | Agent, token: string) => {
    apiClient.setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('vilanow_user', JSON.stringify(userData));
    emitAuth({ user: userData, isAuthenticated: true, error: null });
  };

  const updateUser = async (updates: Partial<User | Agent>) => {
    if (!user) return;

    try {
      const updatedUser = await apiClient.updateUser(user.id, updates) as Partial<User | Agent>;
      const mergedUser: User | Agent = { ...user, ...(updatedUser || {}) } as User | Agent;
      setUser(mergedUser);
      localStorage.setItem('vilanow_user', JSON.stringify(mergedUser));
      emitAuth({ user: mergedUser });
    } catch (err) {
      console.error('Failed to update user:', err);
      const updated: User | Agent = { ...user, ...updates } as User | Agent;
      setUser(updated);
      localStorage.setItem('vilanow_user', JSON.stringify(updated));
      emitAuth({ user: updated });
    }
  };

  const isAgent = user?.role === 'agent';
  const needsKYC = isAgent && (user as Agent).kycStatus === 'unverified';

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    login,
    signup,
    logout,
    updateUser,
    // OTP verification
    sendOtp,
    verifyOtp,
    resendOtp,
    pendingVerification,
    clearPendingVerification,
    // Password reset
    sendPasswordReset,
    resetPassword,
    // Google OAuth
    loginWithGoogle,
    setAuthFromCallback,
    // Role checks
    isAgent,
    isSeeker: user?.role === 'seeker',
    needsKYC,
  };
}
