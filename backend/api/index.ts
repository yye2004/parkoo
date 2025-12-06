import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../src/app";

// Explicitly handle the request with the Express app so Vercel's runtime
// doesn't need to infer how to invoke the exported default.
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}

