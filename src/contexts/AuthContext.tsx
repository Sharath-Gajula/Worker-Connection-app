import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type UserRole = 'customer' | 'worker';

export interface User {
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  location?: string;
  profilePicture?: string;

  // Additional fields
  dateOfBirth?: string;
  gender?: string;
  address?: string;

  // Worker-specific fields
  workerId?: string;
  profession?: string;
  experience?: number;
  bio?: string;
  skills?: string[];
  designation?: string;
  department?: string;
  workLocation?: string;
  joiningDate?: string;
  shiftTiming?: string;
  supervisor?: string;
  workStatus?: string;
  lastLogin?: string;
  salary?: string;
  paymentCycle?: string;
  rating?: number;
  totalReviews?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void; // ✅ Added here
  register: (data: Partial<User>) => Promise<boolean>; // <-- Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('workerConnect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    const validCredentials = [
      { email: 'admin', password: '12345678', role: 'customer' },
      { email: 'worker', password: '12345678', role: 'worker' },
      { email: 'sharath', password: '12345678', role: 'customer' },
      { email: 'sharath', password: '12345678', role: 'worker' }
    ];

    const isValid = validCredentials.some(
      cred =>
        cred.email === email && cred.password === password && cred.role === role
    );

    if (isValid) {
      const baseUser: User = {
        email,
        role,
        name: role === 'customer' ? 'Sharath Kumar' : 'Sharath Singh',
        phone: '+91 9876543210',
        location: role === 'customer' ? 'Hyderabad' : 'Delhi',
        profilePicture:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };

      const workerFields =
        role === 'worker'
          ? {
              workerId: 'WK001',
              profession: 'Plumber',
              experience: 5,
              bio: 'Experienced plumber with 5+ years in residential and commercial work.',
              skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Installation'],
              designation: 'Senior Plumber',
              department: 'Home Services',
              workLocation: 'Service Center',
              joiningDate: '2022-01-15',
              shiftTiming: '9 AM - 6 PM',
              supervisor: 'Mike Johnson',
              workStatus: 'Active',
              lastLogin: new Date().toLocaleString(),
              salary: '$55,000/year',
              paymentCycle: 'Monthly',
              rating: 4.8,
              totalReviews: 127
            }
          : {};

      const finalUser = { ...baseUser, ...workerFields };

      setUser(finalUser);
      localStorage.setItem('workerConnect_user', JSON.stringify(finalUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workerConnect_user');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('workerConnect_user', JSON.stringify(updatedUser));
  };
   
  // Register function to handle user registration
  const register = async (data: Partial<User>): Promise<boolean> => {
    // Example: Save user data and log them in
    setUser(data as User);
    localStorage.setItem('workerConnect_user', JSON.stringify(data));
    return true; // Return true if registration is successful
  };
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateProfile, // ✅ Passed to context
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
