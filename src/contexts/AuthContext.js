
// import React, { createContext, useContext, useState, useEffect } from 'react';
// const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';



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
//   const [token, setToken] = useState(null);
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
//     const savedToken = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
    
//     console.log('🔄 AuthContext initializing:', { savedToken, savedUser });
    
//     if (savedToken && savedUser && savedToken !== 'undefined') {
//       try {
//         setToken(savedToken);
//         setUser(JSON.parse(savedUser));
//         console.log('✅ Restored user from localStorage');
//       } catch (error) {
//         console.error('Error parsing saved user data:', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       console.log('🔐 Starting login process for:', email);
      
 
      
//       const response = await fetch(`${BASE_URL}/api/auth/login`, {
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

//       console.log('📡 Login response status:', response.status);
      
//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('Invalid email or password');
//         }
//         throw new Error(`Login failed: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('🔍 FULL LOGIN API RESPONSE:', result);
      
//       // Check if response has the expected structure
//       if (!result.status) {
//         throw new Error('Authentication failed: Invalid response from server');
//       }

//       if (!result.data) {
//         throw new Error('Authentication failed: No user data received');
//       }

//       // Extract data from the nested structure
//       const data = result.data;
//       console.log('🔍 User data from API:', data);

//       // Look for token in various possible locations
//       let authToken = data.token || data.access_token || data.jwt;
      
//       if (!authToken) {
//         console.error('❌ No token found in data object. Available fields:', Object.keys(data));
//         throw new Error('Authentication failed: No token received from server');
//       }

//       console.log('✅ Token found:', authToken);

//       // Transform API response to match your app's user structure
//       const userData = {
//         id: data.id || data.user?.id || 0,
//         name: data.username || data.user?.username || data.name || 'User',
//         email: data.email || data.user?.email || email,
//         username: data.username || data.user?.username || email,
//         role: data.role || data.user?.role || 'service_advisor',
//         branchId: data.branch_id || data.user?.branch_id || data.branchId || 0,
//         branchName: branches.find(branch => branch.id === (data.branch_id || data.user?.branch_id || data.branchId || 0))?.name || 'Unknown Branch'
//       };

//       console.log('✅ Transformed user data:', userData);

//       // Store in state and localStorage
//       setUser(userData);
//       setToken(authToken);
//       localStorage.setItem('user', JSON.stringify(userData));
//       localStorage.setItem('token', authToken);

//       console.log('🎉 Login successful!');
//       console.log('💾 Stored in localStorage - token:', localStorage.getItem('token'));
//       console.log('💾 Stored in localStorage - user:', localStorage.getItem('user'));

//       return { success: true, user: userData };
//     } catch (error) {
//       console.error('❌ Login error:', error);
//       return { 
//         success: false, 
//         error: error.message || 'Login failed. Please try again.' 
//       };
//     }
//   };

//   const logout = () => {
//     console.log('🚪 Logging out user');
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   };

//   const value = {
//     user,
//     token,
//     login,
//     logout,
//     loading,
//     branches,
//     isAuthenticated: !!user && !!token
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gms-api.kmgarage.com';

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

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Instead of using navigate directly, we'll use window.location
    // This works outside of Router context
    window.location.href = '/login';
  };

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

  // Global fetch interceptor for 401 handling
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [resource, config] = args;
      
      // Only intercept calls to our API
      if (typeof resource === 'string' && resource.includes(BASE_URL)) {
        try {
          // Add authorization header if token exists
          const enhancedConfig = {
            ...config,
            headers: {
              ...config?.headers,
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          };

          const response = await originalFetch(resource, enhancedConfig);

          // Handle 401 globally
          if (response.status === 401) {
            console.log('🛑 401 Unauthorized - Auto logging out');
            logout(); // This will redirect to login
            throw new Error('Session expired. Please login again.');
          }

          return response;
        } catch (error) {
          if (error.message.includes('Session expired')) {
            throw error;
          }
          throw error;
        }
      }
      
      // For non-API calls, use original fetch
      return originalFetch(resource, config);
    };

    // Cleanup on unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      console.log('🔐 Starting login process for:', email);
      
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
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
      
      if (!result.status) {
        throw new Error('Authentication failed: Invalid response from server');
      }

      if (!result.data) {
        throw new Error('Authentication failed: No user data received');
      }

      const data = result.data;
      console.log('🔍 User data from API:', data);

      let authToken = data.token || data.access_token || data.jwt;
      
      if (!authToken) {
        console.error('❌ No token found in data object. Available fields:', Object.keys(data));
        throw new Error('Authentication failed: No token received from server');
      }

      console.log('✅ Token found:', authToken);

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

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);

      console.log('🎉 Login successful!');

      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
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