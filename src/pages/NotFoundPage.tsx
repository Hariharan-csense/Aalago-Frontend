import { Link } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

export default function NotFoundPage() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-7xl font-extrabold text-brand m-0 leading-none">404</p>
      <h1 className="text-2xl font-extrabold text-charcoal mt-4 mb-2">Page Not Found</h1>
      <p className="text-charcoal/60 max-w-md mb-8">The page you are looking for doesn&apos;t exist. Let&apos;s get you back on your spiritual journey.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-bold rounded-full no-underline hover:bg-brand-dark">
        <HomeRoundedIcon fontSize="small" /> Go Back Home
      </Link>
    </section>
  );
}
