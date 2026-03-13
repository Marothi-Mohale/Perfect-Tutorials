import type { MetadataRoute } from "next";
import { publicEnv } from "../lib/env";

const siteUrl = publicEnv.siteUrl;

const routes = [
  "",
  "/about",
  "/contact",
  "/courses",
  "/faq",
  "/how-it-works",
  "/pricing",
  "/testimonials",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
