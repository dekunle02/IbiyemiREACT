import { Navigate } from "react-router-dom";

import { useAppDispatch } from "../redux/hooks";
import { signOut } from "../redux/userSlice";
import { clearCartItemArr } from "../redux/cartSlice";

function SignOutPage() {
  const dispatch = useAppDispatch();
  dispatch(signOut());
  dispatch(clearCartItemArr());

  return <Navigate to="/signin" />;
}

export default SignOutPage;
