import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      // URL courte vers le prototype cliquable (docs/finlens-plateforme-v1.html),
      // servi tel quel comme fichier statique -- aucune dépendance au backend.
      { source: "/prototype", destination: "/prototype/index.html" },
    ];
  },
};

export default nextConfig;
