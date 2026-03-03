import express, { Request, Response } from "express";
import { runMigrations } from "./migrate";

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend chạy bằng TypeScript" });
});

async function bootstrap() {
  try {
    console.log("🔄 Running migrations...");
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

bootstrap();