import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connect from "./src/db/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import userRoutes from "./src/routes/api/register.js";
const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("Welcome to Event Mangment Web Application");
});
app.use("/api", userRoutes);

app.listen(process.env.PORT || 3400, () => {
  connect;
});
