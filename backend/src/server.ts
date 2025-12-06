import express from "express";
import cors from "cors";
import { config } from "./config";
import { registerRoutes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

registerRoutes(app);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${config.port}`);
});

