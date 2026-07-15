import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

function decodeUserFromToken() {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  if (!token) return null;
  return { username, role, token };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(decodeUserFromToken());

  const login = useCallback(async (username, password) => {
    const { data } = await authApi.post('/login', { username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    setUser({ username: data.username, role: data.role, token: data.token });
    return data;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const { data } = await authApi.post('/register', { username, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    setUser({ username: data.username, role: data.role, token: data.token });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
