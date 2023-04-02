import { lazy } from "react";
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
const ProfileLayout = lazy(() => import("./pages/profile/layout"));
const ProfileIndex = lazy(() => import("./pages/profile"));
const ChangeUsername = lazy(() => import("./pages/profile/change-username"));
const ChangePassword = lazy(() => import("./pages/profile/change-password"));
const AddRemission = lazy(() => import("./pages/profile/add-remission"));

// Manager
const ManagerLayout = lazy(() => import("./pages/manager/layout"));
const Dashboard = lazy(() => import("./pages/manager/dashboard"));
const Employees = lazy(() => import("./pages/manager/employees"));
const Sales = lazy(() => import("./pages/manager/sales"));
const Shop = lazy(() => import("./pages/manager/shop"));

// Products
const ProductLayout = lazy(() => import("./pages/manager/products/layout"));
const ProductIndex = lazy(() => import("./pages/manager/products/index"));
const ProductOutOfStock = lazy(
  () => import("./pages/manager/products/products-out-stock")
);
const ProductAddEdit = lazy(() => import("./pages/manager/products/add-edit"));
const ProductMassEdit = lazy(
  () => import("./pages/manager/products/mass-edit")
);
const CategoryList = lazy(
  () => import("./pages/manager/products/category-list")
);
const CategoryDetail = lazy(
  () => import("./pages/manager/products/category-detail")
);
const CategoryNew = lazy(() => import("./pages/manager/products/category-new"));
const CategoryEdit = lazy(
  () => import("./pages/manager/products/category-edit")
);

function App() {
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
              <Route path=":id" element={<ProductAddEdit />} />
              <Route path="new" element={<ProductAddEdit />} />
              <Route path="mass-edit" element={<ProductMassEdit />} />
            </Route>
            <Route path="sales" element={<Sales />} />
            <Route path="myshop" element={<Shop />} />
            <Route path="employees" element={<Employees />} />
          </Route>
        </Route>

        {/* 404 PAGE */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
