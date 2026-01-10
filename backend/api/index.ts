import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../src/app";

// Ensure the Vercel runtime sees the response end so the invocation
// can complete instead of timing out.
export default function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      res.off("finish", onFinish);
      res.off("close", onClose);
      res.off("error", onError);
    };

    const onFinish = () => {
      cleanup();
      resolve();
    };

    const onClose = () => {
      cleanup();
      resolve();
    };

    const onError = (err: unknown) => {
      cleanup();
      reject(err);
    };

    res.on("finish", onFinish);
    res.on("close", onClose);
    res.on("error", onError);

    try {
      app(req as any, res as any);
    } catch (err) {
      onError(err);
    }
  });
}

