import { Link } from "react-router-dom";
import { getPageContent } from "../../api/endpoints";
import { useAsync } from "../../hooks/useAsync";
import type { BannerContent } from "../../types/api";

interface PageBannerProps {
  title: string;
  breadcrumbs: { label: string; to?: string }[];
  image?: string;
}

const bannerImages: Record<string, string> = {
  Destinations: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80",
  Properties: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
  "About Us": "https://images.unsplash.com/photo-1561361513-2d2a92c751f6?auto=format&fit=crop&w=1600&q=80",
  Blog: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
  "Contact Us": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=80",
  Legal: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
};

const titleToBannerKey: Record<string, keyof BannerContent> = {
  Destinations: "destinations",
  Properties: "properties",
  "About Us": "about",
  Blog: "blog",
  "Contact Us": "contact",
  Legal: "legal",
};

export default function PageBanner({
  title,
  breadcrumbs,
  image,
}: PageBannerProps) {
  const { data: banners } = useAsync(() => getPageContent("banners"), []);
  const bannerKey = titleToBannerKey[title];
  const bannerImage = image
    ?? (bannerKey && banners ? banners[bannerKey] : "")
    ?? bannerImages[title]
    ?? "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80";

  return (
    <section
      className="relative h-[300px] flex items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full text-white">
        <h1 className="text-3xl md:text-4xl font-extrabold m-0 mb-2">
          {title}
        </h1>
        <nav className="text-sm text-white/85" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label}>
              {i > 0 && <span className="mx-2">›</span>}
              {crumb.to ? (
                <Link
                  to={crumb.to}
                  className="text-white/85 no-underline hover:text-white"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
