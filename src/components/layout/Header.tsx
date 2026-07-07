import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useAuth } from "../../admin/AuthContext";
import { navLinks, siteInfo } from "../../config/site";
import logoHorizontal from "../../assets/AalaGo Vertical-Dmwj14_N.png";

function Logo() {
  return (
    <Link to="/" className="inline-flex items-center no-underline">
      <img src={logoHorizontal} alt="aalaGO" className="h-10 w-auto" />
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const adminPath = isAuthenticated ? "/admin" : "/admin/login";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-[72px] gap-6">
          <Logo />
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"}
                className={({ isActive }) => `text-sm font-semibold no-underline ${isActive ? "text-brand" : "text-charcoal/70 hover:text-brand"}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href={`tel:${siteInfo.phone.replace(/\s/g, "")}`} className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-charcoal no-underline">
              <CallRoundedIcon className="text-brand" fontSize="small" />
              {siteInfo.phone}
            </a>
            <Link
              to={adminPath}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-brand/20 text-brand text-sm font-bold no-underline hover:bg-brand hover:text-white transition-colors"
            >
              <AdminPanelSettingsRoundedIcon fontSize="small" />
              <span className="hidden xl:inline">{isAuthenticated ? "Admin" : "Admin Login"}</span>
            </Link>
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
            <NavLink
              to={adminPath}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `inline-flex items-center gap-2 text-sm font-semibold no-underline py-1 ${isActive ? "text-brand" : "text-charcoal/70"}`}
            >
              <AdminPanelSettingsRoundedIcon fontSize="small" />
              {isAuthenticated ? "Admin" : "Admin Login"}
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
