import { Outlet } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"
import { PopupProvider } from "../context/PopupContext"

function Layout() {
    return (
        <PopupProvider>
            <AuthProvider>
                LAYOUT
                <Outlet />
            </AuthProvider>
        </PopupProvider>
    )
}

export default Layout