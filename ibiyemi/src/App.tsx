// import { useState, useEffect } from "react";
// import { User, Token } from "./api/interfaces";
// import { useAppSelector, useAppDispatch } from "./redux/hooks";
// import { signIn, signOut } from "./redux/userSlice";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// General
import NotFoundPage from "./pages/NotFoundPage";

// Auth
import SignInPage from "./pages/SignInPage";
import SignOutPage from "./pages/SignOutPage";

// Application
import Layout from "./pages/Layout";

// Shop
import ShopIndex from "./pages/shop";
import CheckoutPage from "./pages/shop/CheckoutPage";
import ReceiptPage from "./pages/shop/Receipt";

function App() {
  // const user = useAppSelector((state) => state.user);
  // const token = useAppSelector((state) => state.token);
  // const dispatch = useAppDispatch();
  // const sampleUser: User = { username: "Samad", type: "owner" };
  // const sampleToken: Token = { access: "419", refresh: "914" };

  // useEffect(() => {
  //   dispatch(signIn({ user: sampleUser, token: sampleToken }));
  // }, []);

  // console.log("user =>", user);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* LANDING PAGES */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signout" element={<SignOutPage />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<ShopIndex />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="receipt/:id" element={<ReceiptPage />} />
        </Route>

        {/* 404 PAGE */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
