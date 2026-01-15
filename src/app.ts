import express from "express";
import cors from "cors";
import routes from "./routers/index";

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/", (_req, res) => {
  res.status(200).send("🚀 Backend is running");
});

// register routes
routes.forEach(({ path, router }) => {
  app.use(path, router);
});

export default app;
