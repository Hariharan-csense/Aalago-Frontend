import { type ImgHTMLAttributes, useEffect, useState } from "react";

const fallbackImage = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
  <rect width="800" height="520" fill="#f3f4f6"/>
  <rect x="56" y="56" width="688" height="408" rx="24" fill="#ffffff" stroke="#e5e7eb"/>
  <path d="M265 328l82-92 55 64 43-48 91 76H265z" fill="#d1d5db"/>
  <circle cx="514" cy="196" r="38" fill="#c41e2a"/>
  <text x="400" y="404" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#111827">aalaGO</text>
</svg>
`)}`;

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement>;

export default function SafeImage({ src, alt, onError, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackImage);

  useEffect(() => {
    setCurrentSrc(src || fallbackImage);
  }, [src]);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt ?? ""}
      onError={(event) => {
        if (currentSrc !== fallbackImage) setCurrentSrc(fallbackImage);
        onError?.(event);
      }}
    />
  );
}
