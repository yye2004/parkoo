import { Express } from "express";
import { authRouter } from "./auth";
import { availabilityRouter } from "./availability";

export const registerRoutes = (app: Express) => {
  app.use("/auth", authRouter);
  app.use("/availability", availabilityRouter);
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
};

