import { Link } from "react-router-dom";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";

const cards = [
  {
    to: "/admin/destinations",
    title: "Destinations",
    copy: "Add and edit temple towns shown on the public site.",
    icon: PlaceRoundedIcon,
  },
  {
    to: "/admin/properties",
    title: "Properties",
    copy: "Manage stays linked to each destination.",
    icon: HomeWorkRoundedIcon,
  },
  {
    to: "/admin/blog",
    title: "Blog",
    copy: "Publish and update blog cards shown on the public site.",
    icon: ArticleRoundedIcon,
  },
  {
    to: "/admin/content",
    title: "Page Content",
    copy: "Edit Home and About page copy, images, stats, and testimonials.",
    icon: EditNoteRoundedIcon,
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="text-charcoal/60 mb-8">
        Destinations, properties, blog posts, and page content are stored in the backend.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(({ to, title, copy, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="block p-6 bg-white rounded-xl border border-gray-100 shadow-sm no-underline hover:border-brand/30 hover:shadow-md transition-all"
          >
            <Icon className="text-brand mb-3" />
            <h3 className="text-lg font-bold text-charcoal mb-2">{title}</h3>
            <p className="text-sm text-charcoal/60 m-0">{copy}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
