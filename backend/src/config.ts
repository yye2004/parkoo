// backend/src/config.ts
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-change-me",
  // Mark these as literal types so they satisfy ms.StringValue
  jwtExpiresIn: '1h' as const,
  refreshExpiresIn: '7d' as const,
};
