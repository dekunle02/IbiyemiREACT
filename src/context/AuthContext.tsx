import React, { useState, useEffect, useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setBusinessInfo } from "../redux/userSlice";

import getDjango, { DjangoClient, RequestStatus } from "../api/django";
import { LoadStates } from "../constants/constants";
import LoadingPage from "../pages/LoadingPage";
import { BusinessInfo } from "../api/interfaces";

type AuthProviderProps = {
  children: React.ReactNode;
};
const AuthContext = React.createContext<DjangoClient>(getDjango());

export function useApi() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);
  const [django, setDjango] = useState<DjangoClient>(getDjango());
  const [authState, setAuthState] = useState<LoadStates>(LoadStates.Loading);

  useEffect(() => {
    const djangoClient: DjangoClient = getDjango();
    Promise.all([
      djangoClient.validateToken(token),
      djangoClient.getBusinessInfo(),
    ]).then((responseArr) => {
      if (responseArr.some((resp) => resp.status === RequestStatus.Failure)) {
        setAuthState(LoadStates.Failure);
      } else {
        setDjango(getDjango(token));
        setAuthState(LoadStates.Success);
        const businessInfo: BusinessInfo = responseArr[1].data;
        dispatch(setBusinessInfo(businessInfo));
      }
    });
    // djangoClient.validateToken(token).then((response) => {
    //   if (response.status === RequestStatus.Success) {
    //     setDjango(getDjango(token));
    //     setAuthState(LoadStates.Success);
    //   } else {
    //     setAuthState(LoadStates.Failure);
    //   }
    // });
  }, [token, dispatch]);

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
