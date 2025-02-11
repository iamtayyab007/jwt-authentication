import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./Routes/AuthRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
mongoose
  .connect("mongodb://localhost:27017/jwt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successfull");
  })
  .catch((error) => {
    console.log(error.message);
  });
app.use(
  cors({
    origin: ["http://localhost:5173"],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/", router);
