import express from "express";
const app = express();
const port = 3000;
import cors from "cors";
import AppError from "./utils/appError.js";
import { errorHandler } from "./middlewares/errorHandller.js";
import { authRouter } from "./routes/auth.route.js";
import { conntecMongodb } from "./config/contectmongo.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



conntecMongodb();
app.get("/api/health", (req, res, next) => {
  res.status(200).json({
    message: "OK",
    status: 200,
  });
});

app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log("server is running on port ", port);
});
