import { useState, useEffect, useCallback } from 'react';
import { User, Agent, UserRole } from '../types';
import apiClient from '../lib/api-client';

export function useAuth() {
  const [user, setUser] = useState<User | Agent | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated via token
    const checkAuth = async () => {
      const token = apiClient.getToken();
      if (token) {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData as User | Agent);
          setIsAuthenticated(true);
        } catch {
          // Token invalid, clear it
          apiClient.setToken(null);
          localStorage.removeItem('vilanow_user');
        }
      } else {
        // Fallback to localStorage user data
        const stored = localStorage.getItem('vilanow_user');
        if (stored) {
          try {
            const parsedUser = JSON.parse(stored);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch {
            localStorage.removeItem('vilanow_user');
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = async (email: string, password: string, _role?: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(email, password);
      const userData = response.user;
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('vilanow_user', JSON.stringify(userData));
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: UserRole, userData: any) => {
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
      
      const newUser = response.user;
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('vilanow_user', JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.requestPasswordReset(email);
    } catch (err: any) {
      // Don't show error for security (don't reveal if email exists)
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.resetPassword(token, newPassword);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // Ignore errors during logout
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vilanow_user');
  };

  const updateUser = async (updates: Partial<User | Agent>) => {
    if (!user) return;

    try {
      const updatedUser = await apiClient.updateUser(user.id, updates);
      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser as User | Agent);
      localStorage.setItem('vilanow_user', JSON.stringify(mergedUser));
    } catch (err: any) {
      console.error('Failed to update user:', err);
      // Still update locally even if API fails
      const updated = { ...user, ...updates };
      setUser(updated as User | Agent);
      localStorage.setItem('vilanow_user', JSON.stringify(updated));
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
    sendPasswordReset,
    resetPassword,
    isAgent,
    isSeeker: user?.role === 'seeker',
    needsKYC,
  };
}
