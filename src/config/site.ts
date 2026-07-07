export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const USE_BACKEND_DATA = true;

export const ADMIN_TOKEN_KEY = "aalago_admin_token";

export const siteInfo = {
  phone: "+91 93630 12345",
  email: "hello@aalago.in",
  address: "Temple-town network, Tamil Nadu, India",
  hours: "Mon – Sat: 9:00 AM – 7:00 PM",
};

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Destinations", to: "/destinations" },
  { label: "Properties", to: "/properties" },
  { label: "About Us", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

export const footerQuickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Destinations", to: "/destinations" },
  { label: "Properties", to: "/properties" },
  { label: "Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];
