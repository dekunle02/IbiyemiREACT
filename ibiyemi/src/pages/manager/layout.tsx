import { Outlet } from "react-router-dom";
import Breadcrumb from "../../components/ManagerBreadcrumb";
import ManagerSideNav from "../../components/ManagerSideNav";
import { ManagerMenuItems } from "../../constants/constants";

function ManagerLayout() {
  return (
    <div className="flex flex-col w-full h-full">
      {/* BREADCRUMB */}
      <nav className="mt-3 mb-2 md:hidden block">
        {ManagerMenuItems.map((item, index) => (
          <span key={item.id}>
            <Breadcrumb key={item.id} menuItem={item} />
            {index !== ManagerMenuItems.length - 1 && "/"}
          </span>
        ))}
      </nav>

      <div className="flex flex-row w-full h-full md:mt-3">
        <div className="h-full">
          <ManagerSideNav />
        </div>

        <div className="m-2 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ManagerLayout;
