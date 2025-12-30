import { useState, useEffect, useCallback } from 'react';
import { User, Agent, UserRole } from '../types';
import { mockAgent } from '../utils/mockData';
export function useAuth() {
  const [user, setUser] = useState<User | Agent | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Simulate checking auth status
    const checkAuth = () => {
      const stored = localStorage.getItem('vilanow_user');
      if (stored) {
        setUser(JSON.parse(stored));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);
  const clearError = useCallback(() => setError(null), []);
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo account credentials
    const demoAccounts = {
      'seeker@demo.com': {
        role: 'seeker' as UserRole,
        password: 'demo123'
      },
      'agent@demo.com': {
        role: 'agent' as UserRole,
        password: 'demo123'
      },
      'admin@demo.com': {
        role: 'admin' as UserRole,
        password: 'demo123'
      }
    };

    // Check for demo accounts
    const demoAccount = demoAccounts[email as keyof typeof demoAccounts];
    if (demoAccount) {
      if (password !== demoAccount.password) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Create appropriate user based on demo account type
      if (demoAccount.role === 'admin') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@demo.com',
          phone: '+234 800 000 0000',
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=D4AF37'
        };
        setUser(adminUser);
        localStorage.setItem('vilanow_user', JSON.stringify(adminUser));
      } else if (demoAccount.role === 'agent') {
        setUser(mockAgent);
        localStorage.setItem('vilanow_user', JSON.stringify(mockAgent));
      } else {
        const seekerUser: User = {
          id: 'seeker-demo',
          name: 'Demo Seeker',
          email: 'seeker@demo.com',
          phone: '+234 803 123 4567',
          role: 'seeker',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seeker&backgroundColor=D4AF37'
        };
        setUser(seekerUser);
        localStorage.setItem('vilanow_user', JSON.stringify(seekerUser));
      }
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Mock validation for non-demo accounts
    if (password === 'wrong') {
      setError('Invalid email or password');
      setIsLoading(false);
      return;
    }
    if (role === 'agent') {
      // Check if this is a new agent (unverified)
      const isNewAgent = email.includes('new');
      const agentData = isNewAgent ? {
        ...mockAgent,
        kycStatus: 'unverified' as const,
        verified: false
      } : mockAgent;
      setUser(agentData);
      localStorage.setItem('vilanow_user', JSON.stringify(agentData));
    } else {
      const seeker: User = {
        id: 'seeker-1',
        name: 'John Doe',
        email,
        phone: '+234 803 123 4567',
        role: 'seeker'
      };
      setUser(seeker);
      localStorage.setItem('vilanow_user', JSON.stringify(seeker));
    }
    setIsAuthenticated(true);
    setIsLoading(false);
  };
  const signup = async (email: string, password: string, role: UserRole, userData: any) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock unique email check
    if (email.includes('taken')) {
      setError('This email is already registered');
      setIsLoading(false);
      return;
    }
    const newUser = {
      id: `${role}-${Date.now()}`,
      email,
      role,
      ...userData,
      // Default fields
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      ...(role === 'agent' ? {
        credits: 0,
        kycStatus: 'unverified',
        verified: false,
        tier: 'street-scout',
        territories: [],
        challenges: []
      } : {})
    };
    setUser(newUser);
    localStorage.setItem('vilanow_user', JSON.stringify(newUser));
    setIsAuthenticated(true);
    setIsLoading(false);
  };
  const sendPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Always succeed for security (don't reveal if email exists)
    setIsLoading(false);
  };
  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vilanow_user');
  };
  const updateUser = (updates: Partial<User | Agent>) => {
    if (user) {
      const updated = {
        ...user,
        ...updates
      };
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
    needsKYC
  };
}