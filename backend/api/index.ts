import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../src/app";

// Ensure the Vercel runtime sees the response end so the invocation
// can complete instead of timing out.
export default function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve, reject) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    res.on("error", reject);

    app(req as any, res as any);
  });
}

