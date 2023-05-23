import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import cookieParser from "cookie-parser";

import userRouter from "./app/routers/userRouter";
import opinionRouter from "./app/routers/opinionRouter";
import footerRouter from "./app/routers/footerRouter";
import mofaRouter from "./app/routers/mofaRouter";
import mmRouter from "./app/routers/mmRouter";

dotenv.config();

const app = express();
const port = process.env.PORT || 6555;
app.use(cookieParser());

let mainDbStatus = false;

const connectToDBs = () => {
  try {
    mongoose.connect("" + process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    mainDbStatus = true;
  } catch (e) {
    console.error(e);
    mainDbStatus = false;
  }
  if (!mainDbStatus) setTimeout(connectToDBs, 180000);
  else console.log("connected to mongo");
};

connectToDBs();

app.use(express.json());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:5999"]
        : ["https://trackishi.netlify.app"],
    credentials: true,
  })
);

app.listen(port, () => console.log(`Server started on port: ${port}`));

app.get("/areyoualive", (_, res) => {
  res.json({ answer: "yes" });
});

app.use("/user", userRouter);
app.use("/opinion", opinionRouter);
app.use("/footer", footerRouter);
app.use("/mofa", mofaRouter);
app.use("/mm", mmRouter);
