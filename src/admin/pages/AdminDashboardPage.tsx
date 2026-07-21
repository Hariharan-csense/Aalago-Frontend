import { Link } from "react-router-dom";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import ContactMailRoundedIcon from "@mui/icons-material/ContactMailRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import {
  adminGetBlogPosts,
  adminGetDestinations,
  adminGetMembershipPackages,
  adminGetPartnerEnquiries,
  adminGetProperties,
  adminGetSubscribers,
} from "../../api/endpoints";
import { ErrorState, LoadingState } from "../../components/ui/AsyncState";
import { useAsync } from "../../hooks/useAsync";

async function getDashboardData() {
  const [destinations, properties, blogPosts, enquiries, subscribers, memberships] = await Promise.all([
    adminGetDestinations(),
    adminGetProperties(),
    adminGetBlogPosts(),
    adminGetPartnerEnquiries(),
    adminGetSubscribers(),
    adminGetMembershipPackages(),
  ]);

  return {
    destinations,
    properties,
    blogPosts,
    enquiries,
    subscribers,
    memberships,
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboardPage() {
  const { data, loading, error, refetch } = useAsync(getDashboardData, []);

  const stats = [
    {
      to: "/admin/properties",
      label: "Total Properties",
      value: data?.properties.length ?? 0,
      hint: `${data?.properties.filter((item) => item.popular).length ?? 0} featured`,
      icon: HomeWorkRoundedIcon,
      accent: "border-l-brand",
      tone: "bg-brand/10 text-brand",
    },
    {
      to: "/admin/destinations",
      label: "Destinations",
      value: data?.destinations.length ?? 0,
      hint: "Temple towns listed",
      icon: PlaceRoundedIcon,
      accent: "border-l-red-500",
      tone: "bg-red-50 text-red-700",
    },
    {
      to: "/admin/enquiries",
      label: "Partner Enquiries",
      value: data?.enquiries.length ?? 0,
      hint: "Property owner leads",
      icon: ContactMailRoundedIcon,
      accent: "border-l-rose-500",
      tone: "bg-rose-50 text-rose-700",
    },
    {
      to: "/admin/subscribers",
      label: "Subscribers",
      value: data?.subscribers.length ?? 0,
      hint: "Newsletter signups",
      icon: MarkEmailReadRoundedIcon,
      accent: "border-l-brand",
      tone: "bg-brand/10 text-brand",
    },
  ];

  const shortcuts = [
    {
      to: "/admin/properties",
      title: "Manage Properties",
      copy: "Add stays, prices, photos, amenities, and booking links.",
      icon: HomeWorkRoundedIcon,
    },
    {
      to: "/admin/destinations",
      title: "Manage Destinations",
      copy: "Keep temple towns, images, and descriptions fresh.",
      icon: PlaceRoundedIcon,
    },
    {
      to: "/admin/content",
      title: "Page Content",
      copy: "Edit Home and About page copy, banners, stats, and testimonials.",
      icon: EditNoteRoundedIcon,
    },
    {
      to: "/admin/memberships",
      title: "Memberships",
      copy: "Create and update membership packages shown on the site.",
      icon: WorkspacePremiumRoundedIcon,
    },
    {
      to: "/admin/blog",
      title: "Blog",
      copy: "Publish and update travel stories and content cards.",
      icon: ArticleRoundedIcon,
    },
    {
      to: "/admin/subscribers",
      title: "Subscribers",
      copy: "Review newsletter email signups from the public website.",
      icon: MarkEmailReadRoundedIcon,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-brand text-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="m-0 mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">
              Admin Overview
            </p>
            <h2 className="m-0 text-3xl font-extrabold">Dashboard</h2>
            <p className="m-0 mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
              Track listings, partner leads, subscribers, memberships, and content from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/properties"
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-brand no-underline hover:bg-white/90"
            >
              Add / Edit Property
            </Link>
            <Link
              to="/admin/enquiries"
              className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white no-underline hover:bg-white/15"
            >
              View Leads
            </Link>
          </div>
        </div>
        {data && (
          <div className="grid border-t border-white/15 bg-brand-dark/20 sm:grid-cols-3">
            <HeroMetric label="Active properties" value={data.properties.length} />
            <HeroMetric label="Latest enquiries" value={data.enquiries.slice(0, 7).length} />
            <HeroMetric label="Content sections" value={data.blogPosts.length + data.memberships.length} />
          </div>
        )}
      </section>

      {loading && <LoadingState label="Loading dashboard..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ to, label, value, hint, icon: Icon, accent, tone }) => (
              <Link
                key={label}
                to={to}
                className={`rounded-xl border border-l-4 border-gray-100 ${accent} bg-white p-5 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone}`}>
                    <Icon fontSize="small" />
                  </span>
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-extrabold text-brand">
                    Live
                  </span>
                </div>
                <p className="m-0 text-sm font-bold text-charcoal/55">{label}</p>
                <p className="m-0 mt-2 text-3xl font-extrabold text-charcoal">{value}</p>
                <p className="m-0 mt-2 text-xs font-semibold text-charcoal/45">{hint}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="px-5 pt-5">
                  <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-brand">Leads</p>
                  <h3 className="m-0 mt-1 text-lg font-extrabold text-charcoal">Recent Enquiries</h3>
                </div>
                <Link to="/admin/enquiries" className="mr-5 mt-5 text-sm font-bold text-brand no-underline">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-100 px-5 pb-3">
                {data.enquiries.slice(0, 5).map((item) => (
                  <div key={item.id} className="grid gap-3 py-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-sm font-extrabold text-brand">
                      {initials(item.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="m-0 text-sm font-extrabold text-charcoal">{item.hotelName}</p>
                      <p className="m-0 mt-1 truncate text-xs text-charcoal/55">
                        {item.name} - {item.city} - {item.phoneNumber}
                      </p>
                    </div>
                    <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-charcoal/45">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                ))}
                {!data.enquiries.length && (
                  <p className="m-0 py-8 text-center text-sm text-charcoal/50">No partner enquiries yet.</p>
                )}
              </div>
            </section>

            <div className="grid gap-6">
              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-brand">Health</p>
                    <h3 className="m-0 mt-1 text-lg font-extrabold text-charcoal">Site Summary</h3>
                  </div>
                  <Link to="/admin/content" className="text-sm font-bold text-brand no-underline">
                    Edit
                  </Link>
                </div>
                <div className="grid gap-3">
                  <SummaryRow label="Blog posts" value={data.blogPosts.length} />
                  <SummaryRow label="Membership packages" value={data.memberships.length} />
                  <SummaryRow label="Newsletter subscribers" value={data.subscribers.length} />
                  <SummaryRow label="Average property price" value={`Rs.${averagePrice(data.properties).toLocaleString("en-IN")}`} />
                </div>
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-brand">Audience</p>
                    <h3 className="m-0 mt-1 text-lg font-extrabold text-charcoal">Recent Subscribers</h3>
                  </div>
                  <Link to="/admin/subscribers" className="text-sm font-bold text-brand no-underline">
                    View
                  </Link>
                </div>
                <div className="grid gap-3">
                  {data.subscribers.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3">
                      <div className="min-w-0">
                        <p className="m-0 truncate text-sm font-extrabold text-charcoal">{item.email}</p>
                        <p className="m-0 mt-1 text-xs text-charcoal/45">{item.source}</p>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-charcoal/45">{formatDate(item.createdAt)}</span>
                    </div>
                  ))}
                  {!data.subscribers.length && (
                    <p className="m-0 rounded-lg bg-gray-50 py-6 text-center text-sm text-charcoal/50">
                      No subscribers yet.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>

          <section>
            <h3 className="mb-4 text-lg font-extrabold text-charcoal">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {shortcuts.map(({ to, title, copy, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group block rounded-xl border border-gray-100 bg-white p-5 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-brand group-hover:bg-brand group-hover:text-white">
                    <Icon fontSize="small" />
                  </span>
                  <h4 className="mb-2 text-base font-bold text-charcoal">{title}</h4>
                  <p className="m-0 text-sm text-charcoal/60">{copy}</p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-white/10 px-6 py-4 sm:border-r last:border-r-0">
      <p className="m-0 text-2xl font-extrabold text-white">{value}</p>
      <p className="m-0 mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/45">{label}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 px-4 py-3">
      <span className="text-sm font-bold text-charcoal/60">{label}</span>
      <span className="text-sm font-extrabold text-charcoal">{value}</span>
    </div>
  );
}

function averagePrice(properties: { price: number }[]) {
  if (!properties.length) return 0;
  const total = properties.reduce((sum, property) => sum + Number(property.price || 0), 0);
  return Math.round(total / properties.length);
}

function initials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
