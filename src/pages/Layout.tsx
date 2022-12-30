import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { PopupProvider } from "../context/PopupContext";
import Navbar from "../components/Navbar";

function Layout() {
  return (
    <AuthProvider>
      <PopupProvider>
        <div className="w-screen h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-grow">
            <Outlet />
          </div>
        </div>
      </PopupProvider>
    </AuthProvider>
  );
}

export default Layout;
