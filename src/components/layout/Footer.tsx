import { Link } from "react-router-dom";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { footerQuickLinks, siteInfo } from "../../config/site";
import { getDestinations } from "../../api/endpoints";
import { useAsync } from "../../hooks/useAsync";
import logoVertical from "../../assets/AalaGo Primary-CYzc3xfU.png";

const socials = [
  { icon: FacebookRoundedIcon, label: "Facebook" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: LinkedInIcon, label: "LinkedIn" },
  { icon: YouTubeIcon, label: "YouTube" },
];

export default function Footer() {
  const { data: destinations } = useAsync(getDestinations, []);

  return (
    <footer className="mt-auto">
      <div className="bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-block mb-4 bg-white rounded-lg p-2 no-underline">
              <img src={logoVertical} alt="aalaGO" className="h-14 w-auto" />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-5">Temple-town hospitality for travellers near India&apos;s sacred destinations.</p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="w-9 h-9 rounded-full border border-brand/40 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-colors">
                  <Icon fontSize="small" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold mb-4">Quick Links</h3>
            {footerQuickLinks.map((link) => (
              <Link key={link.label} to={link.to} className="block text-white/70 text-sm no-underline mb-2 hover:text-brand">{link.label}</Link>
            ))}
          </div>
          <div>
            <h3 className="text-base font-bold mb-4">Popular Destinations</h3>
            {destinations?.slice(0, 6).map((d) => (
              <Link key={d.id} to="/destinations" className="block text-white/70 text-sm no-underline mb-2 hover:text-brand">{d.name}</Link>
            ))}
          </div>
          <div>
            <h3 className="text-base font-bold mb-4">Contact Us</h3>
            <p className="text-white/70 text-sm mb-2">{siteInfo.email}</p>
            <p className="text-white/70 text-sm mb-2">{siteInfo.phone}</p>
            <p className="text-white/70 text-sm mb-2">{siteInfo.address}</p>
            <p className="text-white/70 text-sm">{siteInfo.hours}</p>
          </div>
        </div>
      </div>
      <div className="bg-brand py-2" />
      <div className="bg-black py-3">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <span>Copyright © 2026. All Rights Reserved</span>
          <div className="flex gap-4">
            <Link to="/legal" className="text-white/60 no-underline hover:text-white">Privacy Policy</Link>
            <span>|</span>
            <Link to="/legal" className="text-white/60 no-underline hover:text-white">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
