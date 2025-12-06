import jwt from "jsonwebtoken";
import { config } from "../config";

interface TokenPayload {
  sub: string;
  email: string;
}

export const signAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, config.refreshSecret, { expiresIn: config.refreshExpiresIn });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.jwtSecret) as TokenPayload;

