import type { MetadataRoute } from "next";
import { publicEnv } from "../lib/env";

const siteUrl = publicEnv.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
