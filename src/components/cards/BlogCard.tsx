import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SafeImage from "../ui/SafeImage";
import type { BlogPost } from "../../types/api";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col hover:-translate-y-1 transition-transform">
      {post.image && <SafeImage src={post.image} alt={post.title} className="w-full h-48 object-cover" />}
      <div className="p-5 flex flex-col flex-1">
        <span className="inline-block w-fit text-xs font-bold text-brand bg-brand/10 px-2.5 py-1 rounded uppercase mb-3">{post.category}</span>
        <h3 className="text-lg font-extrabold text-charcoal m-0 mb-2 leading-snug">{post.title}</h3>
        <p className="text-sm text-charcoal/60 leading-relaxed flex-1 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-charcoal/50 mb-4 pb-4 border-b border-gray-100">
          <span className="font-semibold text-charcoal">{post.author}</span>
          <span>{post.date}</span>
        </div>
        <Link to="/blog" className="inline-flex items-center gap-1 text-brand font-bold text-sm no-underline hover:gap-2 transition-all">
          Read More <ArrowForwardRoundedIcon fontSize="small" />
        </Link>
      </div>
    </article>
  );
}
