import type { NextConfig } from "next";

// Export statique réservé au job CI "GitHub Pages" (voir .github/workflows/deploy-pages.yml),
// qui build uniquement la landing page publique (l'auth/dashboard exigent un serveur → Vercel).
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "FinLens";

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
