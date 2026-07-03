import type { NextConfig } from "next";

// Prévisualisation statique sur GitHub Pages : https://<user>.github.io/FinLens/
// Le déploiement final (Phase 2+) utilisera Vercel, sans ces contraintes de sous-chemin.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "FinLens";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
