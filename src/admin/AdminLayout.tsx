import { Link, NavLink, Outlet } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { useAuth } from "./AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: DashboardRoundedIcon, end: true },
  { to: "/admin/destinations", label: "Destinations", icon: PlaceRoundedIcon },
  { to: "/admin/properties", label: "Properties", icon: HomeWorkRoundedIcon },
  { to: "/admin/blog", label: "Blog", icon: ArticleRoundedIcon },
  { to: "/admin/content", label: "Page Content", icon: EditNoteRoundedIcon },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-charcoal text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-xl font-extrabold">
            <span className="text-brand">aala</span>GO
          </p>
          <p className="text-xs text-white/50 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold no-underline transition-colors ${
                  isActive ? "bg-brand text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon fontSize="small" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50 mb-2 truncate">{user?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-transparent text-white text-sm font-semibold cursor-pointer hover:bg-white/10"
          >
            <LogoutRoundedIcon fontSize="small" />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-charcoal m-0">Manage aalaGO</h1>
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
