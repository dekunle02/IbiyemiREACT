import { useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/images/company_logo.png";
import { motion } from "framer-motion";

interface NavMenuItem extends React.HTMLAttributes<HTMLDivElement> {
  link: string;
}

const variants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: "-100%" },
};

function NavLink({ link, children }: NavMenuItem) {
  const resolvedLink = useResolvedPath(link);
  const match = useMatch({ path: resolvedLink.pathname, end: true });

  return (
    <Link
      to={resolvedLink}
      className={`text-xl py-5 text-colorBlack/50 px-3 text-center
        ${
          match
            ? "text-colorBlack border-b-0 md:border-b-4 border-colorBlack"
            : "hover:text-colorBlack"
        }`}
    >
      {children}
    </Link>
  );
}

function Navbar() {
  const [showMobileMenu, setMobileMenuVisibility] = useState<boolean>(false);
  const toggleMobileMenu = () => {
    setMobileMenuVisibility(!showMobileMenu);
  };

  return (
    <nav className="sticky top-0 z-[4] shadow-sm px-2 md:px-10 bg-colorWhite flex flex-col">
      <div className="h-16 flex flex-row">
        <div className="flex-grow flex">
          <img src={logo} alt="company" className="h-8 my-auto" />
        </div>

        <div className="hidden md:flex flex-row px-10 gap-3">
          <NavLink link="/">Store</NavLink>
          <NavLink link="/manager">Manager</NavLink>
          <NavLink link="/profile">Profile</NavLink>
        </div>

        <div className="min-h-min flex">
          <Link to="/signout" className="button my-auto">
            Sign Out
          </Link>
        </div>

        <button onClick={toggleMobileMenu} className="p-4 text-2xl md:hidden">
          {showMobileMenu && <HiX />}
          {!showMobileMenu && <HiMenu />}
        </button>
      </div>

      <motion.div
        animate={showMobileMenu ? "open" : "closed"}
        variants={variants}
        className={`${showMobileMenu ? "flex" : "hidden"}  flex-col p-2`}
      >
        <NavLink link="/">Store</NavLink>
        <NavLink link="/manager">Manager</NavLink>
        <NavLink link="/profile">Profile</NavLink>
      </motion.div>
    </nav>
  );
}

export default Navbar;
