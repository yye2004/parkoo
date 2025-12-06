import { Router } from "express";
import { db } from "../db/mock";

const availabilityRouter = Router();

availabilityRouter.get("/", (_req, res) => {
  const snapshot = db.getAvailability();
  return res.json(snapshot);
});

export { availabilityRouter };

