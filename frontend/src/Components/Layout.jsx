// Components/Layout.jsx
import React, { useEffect, useState } from "react";
// import { Link, Outlet } from "react-router-dom";
import { NavLink, Link, Outlet } from 'react-router-dom';

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageName, setPageName] = useState(false)
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/Contact" },
    { name: "Cart", path: "/Cart" },
    { name: "Profile", path: "/Profile" },
    { name: "Order History", path: "/OrderHistory" },
  ];

  useEffect(() => {
    const currentLink = navLinks.find(link => link.path === location.pathname);
    if (currentLink) {
      setPageName(currentLink.name);
    }
  }, [location.pathname]);

  return (
    // <CartProvider>
    <div className="flex flex-col items-start bg-background">
      <nav className="w-full fixed bg-white z-10 border-b-4 border-brand-red">
        <div className="h-[50px] flex justify-between items-center px-6 md:justify-center">

          <ul className="hidden md:flex justify-center items-center gap-20 font-redhat font-bold text-[20px]">

            <NavLink to="/" className={({ isActive }) =>
              isActive? "text-brand-red cursor-pointer" : "hover:text-brand-red transition-all cursor-pointer"}>
              Home
            </NavLink>

            <NavLink to="/Contact" className={({ isActive }) =>
              isActive? "text-brand-red cursor-pointer" : "hover:text-brand-red transition-all cursor-pointer"}>
              Contact
            </NavLink>

            <NavLink to="/Cart" className={({ isActive }) =>
              isActive? "text-brand-red cursor-pointer" : "hover:text-brand-red transition-all cursor-pointer"}>
              Cart
            </NavLink>

            <NavLink to="/Profile" className={({ isActive }) =>
              isActive? "text-brand-red cursor-pointer" : "hover:text-brand-red transition-all cursor-pointer"}>
              Profile
            </NavLink>

            <NavLink
              to="/OrderHistory" className={({ isActive }) =>
              isActive? "text-brand-red cursor-pointer" : "hover:text-brand-red transition-all cursor-pointer"}>
              Order History
            </NavLink>

          </ul>

          {/* Mobile: Logo/Brand + Hamburger */}
          <span className="md:hidden font-redhat font-bold text-brand-red text-[20px]">
            {pageName}
          </span>

          <button className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span
              className={`block w-6 h-[2px] bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`block w-6 h-[2px] bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-[2px] bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>
        </div>



        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64" : "max-h-0"}`}>

            <div className="w-full h-[2px] bg-brand-red mb-[10px]"></div>

          <ul className="flex flex-col font-redhat font-bold text-[18px] px-6 pb-4 gap-4">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} onClick={() => {setMenuOpen(false)}} className={({ isActive }) =>
                  `cursor-pointer transition-all ${isActive ? "text-brand-red" : "hover:text-brand-red"}` } >
                    {link.name}
                </NavLink>
              ))}
          </ul>
        </div>
      </nav>

      <main className="w-full">
        <Outlet />
      </main>
    </div>
    // </CartProvider>
  );
}

export default Layout;
