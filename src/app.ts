import express from "express";
import userRouter from "./routers/user.route";

const app = express();

// middleware
app.use(express.json());

// routes
app.get("/", (_req, res) => {
  res.status(200).send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>My Prisma Backend</title>
      </head>
      <body>
        <h1>🚀 Backend is running</h1>
        <p>API is live</p>
        <p>Health check OK</p>
      </body>
    </html>
  `);
});

app.use("/api", userRouter);

export default app;
