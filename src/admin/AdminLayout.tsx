import { Link, NavLink, Outlet } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import ContactMailRoundedIcon from "@mui/icons-material/ContactMailRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import { useAuth } from "./AuthContext";
import logoPrimary from "../assets/AalaGo Primary-CYzc3xfU.png";

const links = [
  { to: "/admin", label: "Dashboard", icon: DashboardRoundedIcon, end: true },
  { to: "/admin/destinations", label: "Destinations", icon: PlaceRoundedIcon },
  { to: "/admin/properties", label: "Properties", icon: HomeWorkRoundedIcon },
  { to: "/admin/blog", label: "Blog", icon: ArticleRoundedIcon },
  { to: "/admin/content", label: "Page Content", icon: EditNoteRoundedIcon },
  { to: "/admin/memberships", label: "Memberships", icon: WorkspacePremiumRoundedIcon },
  { to: "/admin/enquiries", label: "Enquiries", icon: ContactMailRoundedIcon },
  { to: "/admin/subscribers", label: "Subscribers", icon: MarkEmailReadRoundedIcon },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white text-charcoal flex flex-col shrink-0 border-r border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <img src={logoPrimary} alt="aalaGO" className="h-30 w-auto" />
          <p className="text-xs text-charcoal/50 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold no-underline transition-colors ${
                  isActive ? "bg-brand text-white" : "text-charcoal/75 hover:bg-brand/5 hover:text-brand"
                }`
              }
            >
              <Icon fontSize="small" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-charcoal/50 mb-2 truncate">{user?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-charcoal text-sm font-semibold cursor-pointer hover:border-brand hover:text-brand"
          >
            <LogoutRoundedIcon fontSize="small" />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-brand/10 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-brand m-0">Manage aalaGO</h1>
          <Link to="/" className="text-sm font-semibold text-brand no-underline hover:underline">
            View Site →
          </Link>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
