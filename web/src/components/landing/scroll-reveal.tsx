"use client";

import { useEffect } from "react";

/**
 * Révèle les éléments `.reveal` au scroll. Le <noscript> de la page (voir
 * page.tsx) neutralise `.reveal` si ce script ne s'exécute jamais, pour ne
 * jamais laisser du contenu caché sans JS.
 */
export function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
