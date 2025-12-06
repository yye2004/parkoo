import serverless from "serverless-http";
import { app } from "../src/app";

// Vercel expects a default export for the handler
export default serverless(app);

