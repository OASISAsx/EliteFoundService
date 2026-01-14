import express from "express";
import cors from "cors";
import userRouter from "./routers/user.route";
import mailRouter from "./routers/mail.route";
import uploadRouter from "./routers/upload.route";
import informationRouter from "./routers/information.route";

const app = express();

// middleware
app.use(express.json());
app.use(cors()); //
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/upload", uploadRouter);
app.use("/api", userRouter);
app.use("/api", mailRouter);
app.use("/api", informationRouter);

export default app;
