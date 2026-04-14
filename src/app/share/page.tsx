import { Suspense } from "react";
import ShareClient from "./ShareClient";

/**
 * Share Portal Entry Page
 * This page is a static entry point that renders the ShareClient.
 * Since next.config.mjs has output: "export", query parameters (?id=...) 
 * are handled on the client side at runtime.
 */

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    }>
      <ShareClient />
    </Suspense>
  );
}
