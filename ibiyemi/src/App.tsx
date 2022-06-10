import { useState, useEffect } from "react";
import { User, Token } from "./api/interfaces";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { signIn, signOut } from "./redux/userSlice";

function App() {
  const user = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();
  const sampleUser: User = { username: "Samad", type: "owner" };
  const sampleToken: Token = { access: "419", refresh: "914" };

  useEffect(() => {
    // dispatch(signIn({ user: sampleUser, token: sampleToken }));
  }, []);

  console.log("user =>", user);

  return (
    <h1 className="text-3xl font-bold underline text-blue-600  ">
      Hello world!
    </h1>
  );
}

export default App;
