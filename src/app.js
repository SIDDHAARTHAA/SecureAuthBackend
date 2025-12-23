import express from "express"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import { errorHandler } from "./middlewares/error.middleware.js";


const app = express();

app.use(express.json());

app.use(cookieParser());

app.get("/health", (req, res) => {
    res.send("OK");
});

app.use("/auth", authRoutes);

app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

export default app;