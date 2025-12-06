import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db/mock";
import { signAccessToken, signRefreshToken, verifyAccessToken } from "../utils/token";
import { User } from "../types";

const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  phone: z.string().optional(),
  locale: z.enum(["en", "bm", "zh"]).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  locale: z.enum(["en", "bm", "zh"]).optional(),
  twoFaEnabled: z.boolean().optional()
});

interface AuthedRequest extends Request {
  user?: User;
}

const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "missing token" });
  const token = header.replace("Bearer ", "");
  try {
    const payload = verifyAccessToken(token);
    const user = db.getUserById(payload.sub);
    if (!user) return res.status(401).json({ error: "invalid token" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
};

authRouter.post("/register", (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password, name, phone, locale = "en" } = parsed.data;
  const existing = db.getUserByEmail(email);
  if (existing) return res.status(409).json({ error: "email already registered" });

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = db.createUser({ email, passwordHash, name, phone, twoFaEnabled: false, locale });
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });

  return res.status(201).json({ user: sanitizeUser(user), accessToken, refreshToken });
});

authRouter.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = db.getUserByEmail(email);
  if (!user) return res.status(401).json({ error: "invalid credentials" });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
  return res.json({ user: sanitizeUser(user), accessToken, refreshToken });
});

authRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  return res.json({ user: sanitizeUser(req.user!) });
});

authRouter.patch("/me", requireAuth, (req: AuthedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const updated = db.updateUser(req.user!.id, parsed.data);
  if (!updated) return res.status(404).json({ error: "user not found" });
  return res.json({ user: sanitizeUser(updated) });
});

authRouter.post("/reset/request", (req, res) => {
  const email = String(req.body?.email || "");
  if (!email) return res.status(400).json({ error: "email required" });
  // Stub: in production send email with token
  return res.json({ message: "If the email exists, a reset link was sent." });
});

const sanitizeUser = (user: User) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

export { authRouter };

