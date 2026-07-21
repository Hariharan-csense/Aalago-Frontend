import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { navLinks, siteInfo } from "../../config/site";
import logoHorizontal from "../../assets/AalaGo Vertical-Dmwj14_N.png";

function Logo() {
  return (
    <Link to="/" className="inline-flex items-center no-underline">
      <img src={logoHorizontal} alt="aalaGO" className="h-9 w-auto" />
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-[72px] gap-4">
          <Logo />
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Main">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"}
                className={({ isActive }) => `text-sm font-semibold no-underline whitespace-nowrap ${isActive ? "text-brand" : "text-charcoal/70 hover:text-brand"}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href={`tel:${siteInfo.phone.replace(/\s/g, "")}`} className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-charcoal no-underline whitespace-nowrap">
              <CallRoundedIcon className="text-brand" fontSize="small" />
              {siteInfo.phone}
            </a>
            <button type="button" className="lg:hidden w-10 h-10 flex items-center justify-center border-0 bg-transparent cursor-pointer" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="lg:hidden pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} onClick={() => setOpen(false)}
                className={({ isActive }) => `text-sm font-semibold no-underline py-1 ${isActive ? "text-brand" : "text-charcoal/70"}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
