import { Outlet } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"

function Layout() {
    return (
        <AuthProvider>
            LAYOUT
            <Outlet />
        </AuthProvider>
    )
}

export default Layout