import React, { useState, useEffect, useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

import getDjango, { DjangoClient, RequestStatus } from "../api/django";
import { LoadStates } from "../constants/constants";
import LoadingPage from "../pages/LoadingPage";

type AuthProviderProps = {
  children: React.ReactNode;
};
const AuthContext = React.createContext<DjangoClient>(getDjango());

export function useApi() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const location = useLocation();
  const token = useAppSelector((state) => state.user.token);
  const [django, setDjango] = useState<DjangoClient>(getDjango());
  const [authState, setAuthState] = useState<LoadStates>(LoadStates.Loading);

  useEffect(() => {
    const djangoClient: DjangoClient = getDjango();
    djangoClient.validateToken(token).then((response) => {
      if (response.status === RequestStatus.Success) {
        setDjango(getDjango(token));
        setAuthState(LoadStates.Success);
      } else {
        setAuthState(LoadStates.Failure);
      }
    });
  }, [token]);

  return (
    <AuthContext.Provider value={django}>
      {authState === LoadStates.Loading && <LoadingPage />}
      {authState === LoadStates.Failure && (
        <Navigate to="/signin" state={{ from: location }} />
      )}
      {authState === LoadStates.Success && children}
    </AuthContext.Provider>
  );
}
