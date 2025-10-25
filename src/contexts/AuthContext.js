import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const branches = [
    { id: 1, name: 'Branch 1' },
    { id: 2, name: 'Branch 2' },
    { id: 3, name: 'Branch 3' },
    { id: 4, name: 'Branch 4' },
    { id: 5, name: 'Branch 5' },
    { id: 6, name: 'Branch 6' }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = [
      {
        id: 1,
        name: 'Service Advisor 1',
        email: 'advisor1@kmgroup.com',
        password: 'password123',
        role: 'service_advisor',
        branchId: 1,
        branchName: 'Branch 1'
      },
      {
        id: 2,
        name: 'Accounts User',
        email: 'accounts@kmgroup.com',
        password: 'password123',
        role: 'accounts',
        branchId: null
      },
      {
        id: 3,
        name: 'Service Advisor 2',
        email: 'advisor2@kmgroup.com',
        password: 'password123',
        role: 'service_advisor',
        branchId: 2,
        branchName: 'Branch 2'
      }
    ];

    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    branches
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};