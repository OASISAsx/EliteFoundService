import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
});

server.on("error", (err: any) => {
  if (err?.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Try setting PORT env var or stop the process using it.`
    );
    process.exit(1);
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});
