import app from "./app";
import "dotenv/config";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("DATABASE_URL =", process.env.DATABASE_URL);
});
