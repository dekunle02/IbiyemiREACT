import { Navigate } from "react-router-dom";

import { useAppDispatch } from "../redux/hooks";
import { signOut } from "../redux/userSlice";

function SignOutPage() {
  const dispatch = useAppDispatch();
  dispatch(signOut());
  return <Navigate to="/signin" />;
}

export default SignOutPage;
