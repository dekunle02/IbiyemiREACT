import { Outlet } from "react-router-dom";
import Breadcrumb from "../../components/ManagerBreadcrumb";
import ManagerSideNav from "../../components/ManagerSideNav";
import { ManagerMenuItems } from "../../constants/constants";

function ManagerLayout() {
  return (
    <>
      {/* BREADCRUMB */}
      <nav className="my-1 md:hidden">
        {ManagerMenuItems.map((item, index) => (
          <>
            <Breadcrumb menuItem={item} />
            {index !== ManagerMenuItems.length - 1 && "/"}
          </>
        ))}
      </nav>
      <div className="flex flex-row">
        <ManagerSideNav />
        <Outlet />
      </div>
    </>
  );
}

export default ManagerLayout;
