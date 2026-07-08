import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getProfile } from "./src/intelStore.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON bodies
  app.use(express.json());

  // API Route: Get Intel Profile (direct local fallback helper if requested)
  app.get("/api/intel", (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Missing query parameter 'q'" });
      }
      const data = getProfile(query);
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Intel assembly failure" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("VITE SYSTEM: Dev server middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("VITE SYSTEM: Serving static production bundles.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VAYU ASM SERVER: Online and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("VAYU SERVER CRITBOOT FAILURE:", err);
});
