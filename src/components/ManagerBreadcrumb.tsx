import { Link, useResolvedPath, useMatch } from "react-router-dom";
import { ManagerMenuItem } from "../constants/constants";

interface BreadCrumbItem extends React.HTMLAttributes<HTMLDivElement> {
  menuItem: ManagerMenuItem;
}

function Breadcrumb({ menuItem }: BreadCrumbItem): JSX.Element {
  const resolvedLink = useResolvedPath(menuItem.link);
  const match = useMatch({ path: resolvedLink.pathname, end: true });

  return (
    <Link
      key={menuItem.id}
      className={`${match ? "underline" : "text-colorBlack/80"} mx-2`}
      to={menuItem.link}
    >
      {menuItem.text}
    </Link>
  );
}

export default Breadcrumb;
