import { useResolvedPath, useMatch } from "react-router-dom";
import { Link } from "react-router-dom";
import { ManagerMenuItems, ManagerMenuItem } from "../constants/constants";

interface SideNavItemI extends React.HTMLAttributes<HTMLDivElement> {
  menuItem: ManagerMenuItem;
}

function SideNavItem({ menuItem }: SideNavItemI): JSX.Element {
  const resolvedLink = useResolvedPath(menuItem.link);
  const match = useMatch({ path: resolvedLink.pathname, end: true });

  return (
    <Link
      key={menuItem.id}
      className={`${
        match ? "bg-colorPrimary text-colorWhite" : "hover:bg-colorPrimary/20"
      } mx-2 p-3 icon-button rounded-xl`}
      to={menuItem.link}
    >
      {menuItem.icon}
      {menuItem.text}
    </Link>
  );
}

function ManagerSideNav() {
  return (
    <nav className="w-52 md:flex flex-col gap-2 my-2 hidden ">
      {ManagerMenuItems.map((item) => (
        <SideNavItem key={item.id} menuItem={item} />
      ))}
    </nav>
  );
}

export default ManagerSideNav;
