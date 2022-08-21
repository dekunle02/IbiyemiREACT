// import { useState, useEffect } from "react";
// import { User, Token } from "./api/interfaces";
// import { useAppSelector, useAppDispatch } from "./redux/hooks";
// import { signIn, signOut } from "./redux/userSlice";

import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
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

// Profile
import ProfileLayout from "./pages/profile/layout";
import ProfileIndex from "./pages/profile";
import ChangeUsername from "./pages/profile/change-username";
import ChangePassword from "./pages/profile/change-password";
import AddRemission from "./pages/profile/add-remission";

// Manager
import ManagerLayout from "./pages/manager/layout";
import Dashboard from "./pages/manager/dashboard";
import Accounts from "./pages/manager/accounts";
import Sales from "./pages/manager/sales";

// Products
import ProductLayout from "./pages/manager/products/layout";
import ProductIndex from "./pages/manager/products/index";
import ProductOutOfStock from "./pages/manager/products/products-out-stock";
import ProductDetail from "./pages/manager/products/detail";
import CategoryList from "./pages/manager/products/category-list";
import CategoryDetail from "./pages/manager/products/category-detail";
import CategoryNew from "./pages/manager/products/category-new";
import CategoryEdit from "./pages/manager/products/category-edit";

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

          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<ProfileIndex />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="change-username" element={<ChangeUsername />} />
            <Route path="add-remission" element={<AddRemission />} />
          </Route>

          <Route path="manager" element={<ManagerLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="products" element={<ProductLayout />}>
              <Route index element={<ProductIndex />} />
              <Route path="categories" element={<Outlet />}>
                <Route index element={<CategoryList />} />
                <Route path="new" element={<CategoryNew />} />
                <Route path="edit/:id" element={<CategoryEdit />} />
                <Route path=":id" element={<CategoryDetail />} />
              </Route>
              <Route path="out" element={<ProductOutOfStock />} />
              <Route path=":id" element={<ProductDetail />} />
            </Route>

            <Route path="sales" element={<Sales />} />
            <Route path="accounts" element={<Accounts />} />
          </Route>
        </Route>

        {/* 404 PAGE */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
