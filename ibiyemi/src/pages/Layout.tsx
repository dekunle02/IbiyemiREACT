import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { PopupProvider } from "../context/PopupContext";
import Navbar from "../components/Navbar";

function Layout() {
  return (
    <PopupProvider>
      <AuthProvider>
        <div className="w-screen h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-grow">
            <Outlet />
          </div>
        </div>
      </AuthProvider>
    </PopupProvider>
  );
}

export default Layout;
