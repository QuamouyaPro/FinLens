import { NextRequest, NextResponse } from "next/server";

/** Vérifie l'en-tête Authorization: Bearer <CRON_SECRET> (Vercel Cron / scheduler externe). */
export function assertCronAuthorized(request: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");

  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return null;
}
