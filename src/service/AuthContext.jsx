import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("ws_auth");
    return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null, token: null };
  });

  useEffect(() => {
    localStorage.setItem("ws_auth", JSON.stringify(auth));
  }, [auth]);

  const login = (user, token = null) => setAuth({ isAuthenticated: true, user, token });
  const logout = () => {
    setAuth({ isAuthenticated: false, user: null, token: null });
    localStorage.removeItem("ws_auth");
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
