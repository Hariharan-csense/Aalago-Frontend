import { type FormEvent, useEffect, useRef, useState } from "react";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  adminGetPageContent,
  adminUpdatePageContent,
  adminUploadImage,
} from "../../api/endpoints";
import { LoadingState, ErrorState } from "../../components/ui/AsyncState";
import SafeImage from "../../components/ui/SafeImage";
import { useToast } from "../../components/ui/ToastProvider";
import type {
  AboutContent,
  BannerContent,
  FeatureItem,
  HomeContent,
  Testimonial,
} from "../../types/api";

type PageSlug = "home" | "about" | "banners";

const bannerFields: { key: keyof BannerContent; label: string }[] = [
  { key: "destinations", label: "Destinations Banner" },
  { key: "properties", label: "Properties Banner" },
  { key: "about", label: "About Us Banner" },
  { key: "blog", label: "Blog Banner" },
  { key: "contact", label: "Contact Us Banner" },
  { key: "legal", label: "Legal Banner" },
];

function toLines(list: string[]) {
  return list.join("\n");
}

function fromLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function parseArray<T>(value: string, label: string): T[] {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error(`${label} must be a JSON array`);
  return parsed as T[];
}

function withHomeFormState(
  home: HomeContent,
  extras: Partial<HomeContent>,
  homeAboutText: string,
  homeFeaturesJson: string,
  homeTestimonialsJson: string,
) {
  return {
    ...home,
    ...extras,
    aboutText: fromLines(homeAboutText),
    whyChooseUs: parseArray<FeatureItem>(homeFeaturesJson, "Why choose us"),
    testimonials: parseArray<Testimonial>(homeTestimonialsJson, "Testimonials"),
    ...extras,
  };
}

function withAboutFormState(
  about: AboutContent,
  extras: Partial<AboutContent>,
  aboutParagraphs: string,
  aboutStatsJson: string,
  aboutGalleryImages: string,
) {
  return {
    ...about,
    paragraphs: fromLines(aboutParagraphs),
    stats: parseArray<{ value: string; label: string }>(
      aboutStatsJson,
      "Stats",
    ),
    galleryImages: fromLines(aboutGalleryImages),
    ...extras,
  };
}

export default function AdminContentPage() {
  const { showToast } = useToast();
  const [slug, setSlug] = useState<PageSlug>("home");
  const [home, setHome] = useState<HomeContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [banners, setBanners] = useState<BannerContent | null>(null);
  const [homeAboutText, setHomeAboutText] = useState("");
  const [homeFeaturesJson, setHomeFeaturesJson] = useState("");
  const [homeTestimonialsJson, setHomeTestimonialsJson] = useState("");
  const [aboutParagraphs, setAboutParagraphs] = useState("");
  const [aboutStatsJson, setAboutStatsJson] = useState("");
  const [aboutGalleryImages, setAboutGalleryImages] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const homeHeroImageRef = useRef("");
  const homeAboutImageRef = useRef("");
  const aboutGalleryImagesRef = useRef("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [homeContent, aboutContent, bannerContent] = await Promise.all([
        adminGetPageContent("home"),
        adminGetPageContent("about"),
        adminGetPageContent("banners"),
      ]);
      setHome(homeContent);
      setAbout(aboutContent);
      setBanners(bannerContent);
      setHomeAboutText(toLines(homeContent.aboutText));
      setHomeFeaturesJson(prettyJson(homeContent.whyChooseUs));
      setHomeTestimonialsJson(prettyJson(homeContent.testimonials));
      setAboutParagraphs(toLines(aboutContent.paragraphs));
      setAboutStatsJson(prettyJson(aboutContent.stats));
      setAboutGalleryImages(toLines(aboutContent.galleryImages));
      homeHeroImageRef.current = homeContent.heroImage;
      homeAboutImageRef.current = homeContent.aboutImage;
      aboutGalleryImagesRef.current = toLines(aboutContent.galleryImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (uploading) return;
    setSaving(true);
    try {
      if (slug === "home" && home) {
        const payload = withHomeFormState(
          home,
          {
            heroImage: homeHeroImageRef.current || home.heroImage,
            aboutImage: homeAboutImageRef.current || home.aboutImage,
          },
          homeAboutText,
          homeFeaturesJson,
          homeTestimonialsJson,
        );
        setHome(await adminUpdatePageContent("home", payload));
      }
      if (slug === "about" && about) {
        const payload = withAboutFormState(
          about,
          {
            galleryImages: fromLines(
              aboutGalleryImagesRef.current || aboutGalleryImages,
            ),
          },
          aboutParagraphs,
          aboutStatsJson,
          aboutGalleryImagesRef.current || aboutGalleryImages,
        );
        setAbout(await adminUpdatePageContent("about", payload));
      }
      if (slug === "banners" && banners) {
        setBanners(await adminUpdatePageContent("banners", banners));
      }
      showToast("Content saved", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function uploadContentImage(
    file: File | undefined,
    applyUrl: (url: string) => void | Promise<void>,
  ) {
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await adminUploadImage(file);
      if (!uploaded.url) throw new Error("Upload returned no image URL");
      await applyUrl(uploaded.url);
      showToast("Image uploaded", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function uploadAboutGallery(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => adminUploadImage(file)),
      );
      let savedImages: string[] = [];
      setAboutGalleryImages((current) => {
        const next = toLines([
          ...fromLines(current),
          ...uploaded.map((item) => item.url),
        ]);
        aboutGalleryImagesRef.current = next;
        savedImages = fromLines(next);
        return next;
      });
      if (!about) throw new Error("About content is not loaded");
      const saved = await adminUpdatePageContent(
        "about",
        withAboutFormState(
          about,
          { galleryImages: savedImages },
          aboutParagraphs,
          aboutStatsJson,
          toLines(savedImages),
        ),
      );
      setAbout(saved);
      showToast("Gallery images uploaded", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function uploadBannerImage(key: keyof BannerContent, file: File | undefined) {
    if (!file || !banners) return;
    await uploadContentImage(file, async (url) => {
      const next = { ...banners, [key]: url };
      setBanners(await adminUpdatePageContent("banners", next));
    });
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Page Content</h2>
          <p className="text-charcoal/60 text-sm m-0">
            Edit page text, images, and public banner backgrounds from backend data.
          </p>
        </div>
        <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1">
          {(["home", "about", "banners"] as PageSlug[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSlug(item)}
              className={`px-4 py-2 rounded-md border-0 text-sm font-bold cursor-pointer capitalize ${slug === item ? "bg-brand text-white" : "bg-transparent text-charcoal/70"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {slug === "home" && home && (
          <>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Hero Title
              <input
                value={home.heroTitle}
                onChange={(e) =>
                  setHome({ ...home, heroTitle: e.target.value })
                }
                required
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Hero Highlight
              <input
                value={home.heroHighlight}
                onChange={(e) =>
                  setHome({ ...home, heroHighlight: e.target.value })
                }
                required
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              Hero Subtitle
              <textarea
                value={home.heroSubtitle}
                onChange={(e) =>
                  setHome({ ...home, heroSubtitle: e.target.value })
                }
                required
                rows={2}
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal resize-y"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              Hero Image
              <input
                value={home.heroImage}
                onChange={(e) => {
                  homeHeroImageRef.current = e.target.value;
                  setHome({ ...home, heroImage: e.target.value });
                }}
                required
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  uploadContentImage(e.target.files?.[0], async (url) => {
                    homeHeroImageRef.current = url;
                    setHome((current) =>
                      current ? { ...current, heroImage: url } : current,
                    );
                    const saved = await adminUpdatePageContent("home", {
                      ...withHomeFormState(
                        home,
                        {},
                        homeAboutText,
                        homeFeaturesJson,
                        homeTestimonialsJson,
                      ),
                      heroImage: url,
                    });
                    setHome(saved);
                  })
                }
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal bg-white"
              />
              {home.heroImage && (
                <SafeImage
                  src={home.heroImage}
                  alt=""
                  className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-100"
                />
              )}
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              About Title
              <input
                value={home.aboutTitle}
                onChange={(e) =>
                  setHome({ ...home, aboutTitle: e.target.value })
                }
                required
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              About Image
              <input
                value={home.aboutImage}
                onChange={(e) => {
                  homeAboutImageRef.current = e.target.value;
                  setHome({ ...home, aboutImage: e.target.value });
                }}
                required
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  uploadContentImage(e.target.files?.[0], async (url) => {
                    homeAboutImageRef.current = url;
                    setHome((current) =>
                      current ? { ...current, aboutImage: url } : current,
                    );
                    const saved = await adminUpdatePageContent("home", {
                      ...withHomeFormState(
                        home,
                        {},
                        homeAboutText,
                        homeFeaturesJson,
                        homeTestimonialsJson,
                      ),
                      aboutImage: url,
                    });
                    setHome(saved);
                  })
                }
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal bg-white"
              />
              {home.aboutImage && (
                <SafeImage
                  src={home.aboutImage}
                  alt=""
                  className="w-full h-28 object-cover rounded-lg border border-gray-100"
                />
              )}
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              About Paragraphs (one per line)
              <textarea
                value={homeAboutText}
                onChange={(e) => setHomeAboutText(e.target.value)}
                required
                rows={4}
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal resize-y"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Newsletter Title
              <input
                value={home.newsletterTitle}
                onChange={(e) =>
                  setHome({ ...home, newsletterTitle: e.target.value })
                }
                required
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Newsletter Text
              <input
                value={home.newsletterText}
                onChange={(e) =>
                  setHome({ ...home, newsletterText: e.target.value })
                }
                required
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              Why Choose Us JSON
              <textarea
                value={homeFeaturesJson}
                onChange={(e) => setHomeFeaturesJson(e.target.value)}
                required
                rows={8}
                className="px-3 py-2 rounded-lg border border-gray-200 font-mono text-xs resize-y"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              Testimonials JSON
              <textarea
                value={homeTestimonialsJson}
                onChange={(e) => setHomeTestimonialsJson(e.target.value)}
                required
                rows={8}
                className="px-3 py-2 rounded-lg border border-gray-200 font-mono text-xs resize-y"
              />
            </label>
          </>
        )}

        {slug === "about" && about && (
          <>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Title
              <input
                value={about.title}
                onChange={(e) => setAbout({ ...about, title: e.target.value })}
                required
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Subtitle
              <input
                value={about.subtitle}
                onChange={(e) =>
                  setAbout({ ...about, subtitle: e.target.value })
                }
                required
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              Paragraphs (one per line)
              <textarea
                value={aboutParagraphs}
                onChange={(e) => setAboutParagraphs(e.target.value)}
                required
                rows={5}
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal resize-y"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              Mission
              <textarea
                value={about.mission}
                onChange={(e) =>
                  setAbout({ ...about, mission: e.target.value })
                }
                required
                rows={3}
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal resize-y"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              Vision
              <textarea
                value={about.vision}
                onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                required
                rows={3}
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal resize-y"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              Stats JSON
              <textarea
                value={aboutStatsJson}
                onChange={(e) => setAboutStatsJson(e.target.value)}
                required
                rows={7}
                className="px-3 py-2 rounded-lg border border-gray-200 font-mono text-xs resize-y"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
              Gallery Images (one per line)
              <textarea
                value={aboutGalleryImages}
                onChange={(e) => {
                  aboutGalleryImagesRef.current = e.target.value;
                  setAboutGalleryImages(e.target.value);
                }}
                required
                rows={5}
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal resize-y"
              />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => uploadAboutGallery(e.target.files)}
                className="px-3 py-2 rounded-lg border border-gray-200 font-normal bg-white"
              />
              {fromLines(aboutGalleryImages).length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {fromLines(aboutGalleryImages)
                    .slice(0, 8)
                    .map((src) => (
                      <SafeImage
                        key={src}
                        src={src}
                        alt=""
                        className="w-full h-20 object-cover rounded-lg border border-gray-100"
                      />
                    ))}
                </div>
              )}
            </label>
          </>
        )}

        {slug === "banners" && banners && (
          <>
            {bannerFields.map((field) => (
              <label key={field.key} className="flex flex-col gap-2 text-sm font-semibold">
                {field.label}
                <input
                  value={banners[field.key]}
                  onChange={(e) =>
                    setBanners({ ...banners, [field.key]: e.target.value })
                  }
                  required
                  className="px-3 py-2 rounded-lg border border-gray-200 font-normal"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadBannerImage(field.key, e.target.files?.[0])}
                  className="px-3 py-2 rounded-lg border border-gray-200 font-normal bg-white"
                />
                {banners[field.key] && (
                  <SafeImage
                    src={banners[field.key]}
                    alt=""
                    className="w-full h-28 object-cover rounded-lg border border-gray-100"
                  />
                )}
              </label>
            ))}
          </>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer disabled:opacity-60"
          >
            <SaveRoundedIcon fontSize="small" />
            {uploading ? "Uploading..." : saving ? "Saving..." : "Save Content"}
          </button>
          {uploading && (
            <span className="ml-3 text-sm text-charcoal/60">
              Uploading image...
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
