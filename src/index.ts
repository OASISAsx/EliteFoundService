import app from "./app";
import "dotenv/config";

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
});
