import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'worker';
  phone?: string;
  location?: string;
  profilePicture?: string;
  // Worker specific fields
  profession?: string;
  experience?: number;
  bio?: string;
  skills?: string[];
  aadharNumber?: string;
  workPortfolio?: string[];
  rating?: number;
  totalReviews?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'customer' | 'worker') => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('workerConnect_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: 'customer' | 'worker'): Promise<boolean> => {
    // Static login credentials for testing
    const validCredentials = [
      { email: 'admin', password: '12345678', role: 'customer' },
      { email: 'worker', password: '12345678', role: 'worker' }
    ];

    const isValid = validCredentials.some(
      cred => cred.email === email && cred.password === password && cred.role === role
    );

    if (isValid) {
      const userData: User = {
        id: role === 'customer' ? '1' : '2',
        name: role === 'customer' ? 'John Customer' : 'Mike Worker',
        email: email,
        role: role,
        phone: role === 'customer' ? '+91 9876543210' : '+91 8765432109',
        location: role === 'customer' ? 'Mumbai, Maharashtra' : 'Delhi, India',
        profilePicture: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        ...(role === 'worker' && {
          profession: 'Plumber',
          experience: 5,
          bio: 'Experienced plumber with 5+ years in residential and commercial work.',
          skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Installation'],
          rating: 4.8,
          totalReviews: 127
        })
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('workerConnect_user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('workerConnect_user');
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    // Simulate registration - in real app this would call an API
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'customer',
      phone: userData.phone,
      location: userData.location,
      profilePicture: userData.profilePicture,
      ...userData
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('workerConnect_user', JSON.stringify(newUser));
    return true;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};