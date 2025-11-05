
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const branches = [
//     { id: 1, name: 'Branch 1' },
//     { id: 2, name: 'Branch 2' },
//     { id: 3, name: 'Branch 3' },
//     { id: 4, name: 'Branch 4' },
//     { id: 5, name: 'Branch 5' },
//     { id: 6, name: 'Branch 6' }
//   ];

//   useEffect(() => {
//     const savedUser = localStorage.getItem('user');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const API_BASE_URL = 'https://gms.kmgarage.com';
      
//       console.log('Sending login request...');
      
//       const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({
//           username: email,
//           password: password
//         }),
//       });

//       console.log('Response status:', response.status);

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('Invalid email or password');
//         }
//         throw new Error(`Login failed: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('FULL API RESPONSE:', data);
      
//       // Let's check what properties actually exist in the response
//       console.log('Response properties:', Object.keys(data));
      
//       // Try different possible response structures
//       let userData;

//       // Structure 1: { token, user: { id, username, email, role, branch_id } }
//       if (data.user) {
//         console.log('Using structure 1: data.user exists');
//         userData = {
//           id: data.user.id,
//           name: data.user.username,
//           email: data.user.email,
//           username: data.user.username,
//           role: data.user.role,
//           branchId: data.user.branch_id,
//           branchName: branches.find(branch => branch.id === data.user.branch_id)?.name || 'Unknown Branch'
//         };
//       }
//       // Structure 2: Direct user properties { token, id, username, email, role, branch_id }
//       else if (data.id || data.username) {
//         console.log('Using structure 2: direct user properties');
//         userData = {
//           id: data.id,
//           name: data.username,
//           email: data.email,
//           username: data.username,
//           role: data.role,
//           branchId: data.branch_id,
//           branchName: branches.find(branch => branch.id === data.branch_id)?.name || 'Unknown Branch'
//         };
//       }
//       // Structure 3: Something else entirely
//       else {
//         console.log('Unexpected structure, using fallback');
//         // Create a basic user object with available data
//         userData = {
//           id: data.id || 0,
//           name: data.username || 'User',
//           email: data.email || email,
//           username: data.username || email,
//           role: data.role || 'service_advisor',
//           branchId: data.branch_id || 0,
//           branchName: 'Unknown Branch'
//         };
//       }

//       console.log('Final user data:', userData);

//       // Store in state and localStorage
//       setUser(userData);
//       localStorage.setItem('user', JSON.stringify(userData));
//       localStorage.setItem('token', data.token);

//       return { success: true, user: userData };
//     } catch (error) {
//       console.error('Login error:', error);
//       return { 
//         success: false, 
//         error: error.message || 'Login failed. Please try again.' 
//       };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     branches
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
// src/contexts/AuthContext.js


// src/contexts/AuthContext.js
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
  const [token, setToken] = useState(null);
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
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('🔄 AuthContext initializing:', { savedToken, savedUser });
    
    if (savedToken && savedUser && savedToken !== 'undefined') {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        console.log('✅ Restored user from localStorage');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Starting login process for:', email);
      
      const API_BASE_URL = 'https://gms.kmgarage.com';
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password
        }),
      });

      console.log('📡 Login response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        }
        throw new Error(`Login failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('🔍 FULL LOGIN API RESPONSE:', result);
      
      // Check if response has the expected structure
      if (!result.status) {
        throw new Error('Authentication failed: Invalid response from server');
      }

      if (!result.data) {
        throw new Error('Authentication failed: No user data received');
      }

      // Extract data from the nested structure
      const data = result.data;
      console.log('🔍 User data from API:', data);

      // Look for token in various possible locations
      let authToken = data.token || data.access_token || data.jwt;
      
      if (!authToken) {
        console.error('❌ No token found in data object. Available fields:', Object.keys(data));
        throw new Error('Authentication failed: No token received from server');
      }

      console.log('✅ Token found:', authToken);

      // Transform API response to match your app's user structure
      const userData = {
        id: data.id || data.user?.id || 0,
        name: data.username || data.user?.username || data.name || 'User',
        email: data.email || data.user?.email || email,
        username: data.username || data.user?.username || email,
        role: data.role || data.user?.role || 'service_advisor',
        branchId: data.branch_id || data.user?.branch_id || data.branchId || 0,
        branchName: branches.find(branch => branch.id === (data.branch_id || data.user?.branch_id || data.branchId || 0))?.name || 'Unknown Branch'
      };

      console.log('✅ Transformed user data:', userData);

      // Store in state and localStorage
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);

      console.log('🎉 Login successful!');
      console.log('💾 Stored in localStorage - token:', localStorage.getItem('token'));
      console.log('💾 Stored in localStorage - user:', localStorage.getItem('user'));

      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    branches,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};