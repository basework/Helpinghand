import { createBrowserClient } from "@supabase/ssr";

function makeClient() {
  // Only create the browser client when running in the browser.
  if (typeof window === "undefined") return null

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Throwing here would crash the browser at runtime; prefer a clear error.
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in the runtime environment")
  }

  return createBrowserClient(url, key)
}

export const supabase = makeClient();
