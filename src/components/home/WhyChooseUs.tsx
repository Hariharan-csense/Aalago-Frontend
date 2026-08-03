import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import type { FeatureItem } from "../../types/api";

const icons = [VerifiedRoundedIcon, ExploreRoundedIcon, SearchRoundedIcon, HandshakeRoundedIcon];

export default function WhyChooseUs({ items }: { items: FeatureItem[] }) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <h2 className="text-3xl font-extrabold text-center text-charcoal mb-10">Why Choose AalaGO?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={item.title} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4"><Icon className="text-brand" /></div>
                <h3 className="text-lg font-bold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal/60 leading-relaxed m-0">{item.copy}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
