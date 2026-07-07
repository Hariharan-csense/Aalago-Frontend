import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PageBanner from "../components/layout/PageBanner";
import { siteInfo } from "../config/site";

export default function ContactPage() {
  const contacts = [
    { icon: CallRoundedIcon, label: "Phone", value: siteInfo.phone },
    { icon: EmailRoundedIcon, label: "Email", value: siteInfo.email },
    { icon: LocationOnRoundedIcon, label: "Address", value: siteInfo.address },
    { icon: AccessTimeRoundedIcon, label: "Working Hours", value: siteInfo.hours },
  ];

  return (
    <>
      <PageBanner title="Contact Us" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contact Us" }]} />
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-extrabold text-charcoal m-0 mb-6">Contact Info</h2>
          <div className="space-y-5">
            {contacts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0"><Icon className="text-brand" fontSize="small" /></div>
                <div><p className="text-sm font-bold text-charcoal m-0 mb-0.5">{label}</p><p className="text-sm text-charcoal/70 m-0">{value}</p></div>
              </div>
            ))}
          </div>
        </div>
        <form className="bg-white border border-gray-100 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-extrabold text-charcoal m-0 mb-6">Send Inquiry</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70">Name<input type="text" placeholder="Your name" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none font-normal" /></label>
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70">Email<input type="email" placeholder="you@example.com" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none font-normal" /></label>
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70 sm:col-span-2">Mobile<input type="tel" placeholder="+91 98765 43210" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none font-normal" /></label>
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70 sm:col-span-2">Subject<input type="text" placeholder="How can we help?" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none font-normal" /></label>
            <label className="grid gap-1.5 text-sm font-semibold text-charcoal/70 sm:col-span-2">Message<textarea rows={5} placeholder="Your message" className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none resize-y font-normal" /></label>
          </div>
          <button type="button" className="w-full mt-5 py-3 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer hover:bg-brand-dark">Send Inquiry</button>
        </form>
      </section>
    </>
  );
}
