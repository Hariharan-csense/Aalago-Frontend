import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type { Testimonial } from "../../types/api";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <blockquote className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="flex gap-0.5 text-amber-400 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <StarRoundedIcon key={i} fontSize="small" />
        ))}
      </div>
      <p className="text-charcoal/70 text-sm leading-relaxed mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
      <footer>
        <strong className="text-charcoal text-sm">{testimonial.name}</strong>
        <span className="block text-charcoal/50 text-xs">{testimonial.location}</span>
      </footer>
    </blockquote>
  );
}
