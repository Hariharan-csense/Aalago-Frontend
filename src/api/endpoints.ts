import { API_BASE_URL, ADMIN_TOKEN_KEY, USE_BACKEND_DATA } from "../config/site";
import { adminRequest, apiRequest } from "./client";
import {
  blogPosts,
  fallbackAboutContent,
  fallbackBannerContent,
  fallbackHomeContent,
} from "../data/fallback";
import type {
  AboutContent,
  AdminLoginResponse,
  ApiItemResponse,
  ApiListResponse,
  BannerContent,
  BlogPost,
  Destination,
  HomeContent,
  Property,
} from "../types/api";

// ── Public: destinations & properties (backend when VITE_API_URL is set) ──

export async function getDestinations(): Promise<Destination[]> {
  const res = await apiRequest<ApiListResponse<Destination>>("/destinations");
  return res.data;
}

export async function getProperties(destinationId?: string): Promise<Property[]> {
  const qs = destinationId ? `?destinationId=${destinationId}` : "";
  const res = await apiRequest<ApiListResponse<Property>>(`/properties${qs}`);
  return res.data;
}

export async function getProperty(id: string): Promise<Property> {
  const res = await apiRequest<ApiItemResponse<Property>>(`/properties/${id}`);
  return res.data;
}

// ── Frontend-only content (always from fallback.ts) ──

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!USE_BACKEND_DATA) return blogPosts;
  const res = await apiRequest<ApiListResponse<BlogPost>>("/blog-posts");
  return res.data;
}

export async function getPageContent(slug: "home"): Promise<HomeContent>;
export async function getPageContent(slug: "about"): Promise<AboutContent>;
export async function getPageContent(slug: "banners"): Promise<BannerContent>;
export async function getPageContent(slug: "home" | "about" | "banners"): Promise<HomeContent | AboutContent | BannerContent> {
  if (!USE_BACKEND_DATA) {
    if (slug === "home") return fallbackHomeContent;
    if (slug === "about") return fallbackAboutContent;
    return fallbackBannerContent;
  }
  const res = await apiRequest<ApiItemResponse<HomeContent | AboutContent | BannerContent>>(`/page-content/${slug}`);
  if (slug === "home") return { ...fallbackHomeContent, ...res.data };
  if (slug === "about") return { ...fallbackAboutContent, ...res.data };
  return { ...fallbackBannerContent, ...res.data };
}

// ── Admin API ──

export async function adminLogin(email: string, password: string) {
  return apiRequest<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function adminGetDestinations() {
  const res = await adminRequest<ApiListResponse<Destination>>("/admin/destinations");
  return res.data;
}

export async function adminCreateDestination(data: Omit<Destination, "properties">) {
  const res = await adminRequest<ApiItemResponse<Destination>>("/admin/destinations", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function adminUpdateDestination(id: string, data: Partial<Destination>) {
  const res = await adminRequest<ApiItemResponse<Destination>>(`/admin/destinations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function adminDeleteDestination(id: string) {
  await adminRequest<void>(`/admin/destinations/${id}`, { method: "DELETE" });
}

export async function adminGetProperties(destinationId?: string) {
  const qs = destinationId ? `?destinationId=${destinationId}` : "";
  const res = await adminRequest<ApiListResponse<Property>>(`/admin/properties${qs}`);
  return res.data;
}

export async function adminCreateProperty(data: Property) {
  const res = await adminRequest<ApiItemResponse<Property>>("/admin/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function adminUpdateProperty(id: string, data: Partial<Property>) {
  const res = await adminRequest<ApiItemResponse<Property>>(`/admin/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function adminDeleteProperty(id: string) {
  await adminRequest<void>(`/admin/properties/${id}`, { method: "DELETE" });
}

export async function adminUploadImage(file: File) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) throw new Error("Not authenticated");
  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`${API_BASE_URL}/admin/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  if (!res.ok) {
    let msg = `Upload failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data.message ?? msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  const data = await res.json() as ApiItemResponse<{ filename: string; url: string }>;
  return data.data;
}

export async function adminGetBlogPosts() {
  const res = await adminRequest<ApiListResponse<BlogPost>>("/admin/blog-posts");
  return res.data;
}

export async function adminCreateBlogPost(data: BlogPost) {
  const res = await adminRequest<ApiItemResponse<BlogPost>>("/admin/blog-posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function adminUpdateBlogPost(id: string, data: Partial<BlogPost>) {
  const res = await adminRequest<ApiItemResponse<BlogPost>>(`/admin/blog-posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function adminDeleteBlogPost(id: string) {
  await adminRequest<void>(`/admin/blog-posts/${id}`, { method: "DELETE" });
}

export async function adminGetPageContent(slug: "home"): Promise<HomeContent>;
export async function adminGetPageContent(slug: "about"): Promise<AboutContent>;
export async function adminGetPageContent(slug: "banners"): Promise<BannerContent>;
export async function adminGetPageContent(slug: "home" | "about" | "banners") {
  const res = await adminRequest<ApiItemResponse<HomeContent | AboutContent | BannerContent>>(`/admin/page-content/${slug}`);
  if (slug === "home") return { ...fallbackHomeContent, ...res.data };
  if (slug === "about") return { ...fallbackAboutContent, ...res.data };
  return { ...fallbackBannerContent, ...res.data };
}

export async function adminUpdatePageContent(slug: "home", data: HomeContent): Promise<HomeContent>;
export async function adminUpdatePageContent(slug: "about", data: AboutContent): Promise<AboutContent>;
export async function adminUpdatePageContent(slug: "banners", data: BannerContent): Promise<BannerContent>;
export async function adminUpdatePageContent(slug: "home", data: Partial<HomeContent>): Promise<HomeContent>;
export async function adminUpdatePageContent(slug: "about", data: Partial<AboutContent>): Promise<AboutContent>;
export async function adminUpdatePageContent(slug: "banners", data: Partial<BannerContent>): Promise<BannerContent>;
export async function adminUpdatePageContent(slug: "home" | "about" | "banners", data: Partial<HomeContent> | Partial<AboutContent> | Partial<BannerContent>) {
  const res = await adminRequest<ApiItemResponse<HomeContent | AboutContent | BannerContent>>(`/admin/page-content/${slug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (slug === "home") return { ...fallbackHomeContent, ...res.data };
  if (slug === "about") return { ...fallbackAboutContent, ...res.data };
  return { ...fallbackBannerContent, ...res.data };
}
