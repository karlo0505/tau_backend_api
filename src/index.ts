import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/database";

dotenv.config();
connectDB();
interface bodyParser {
  limit: string;
  extended: boolean;
  parameterLimit: number;
}

interface bodyParserText {
  limit: string;
}

import userRoutes from "./routes/users";
import uploadRoutes from "./routes/upload";
import applicationRoutes from "./routes/application";
import requirementsRoutes from "./routes/requirements";
import userinfoRoutes from "./routes/userinfo";

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.static(__dirname + "/files"));
app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded(<bodyParser>{
    limit: "500mb",
    extended: true,
    parameterLimit: 50000000,
  })
);
app.use(express.json());
app.use(express.urlencoded({ limit: "500mb" }));

app.use("/api/users", userRoutes);
app.use("/api/file", uploadRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/requirements", requirementsRoutes);
app.use("/api/userinfo", userinfoRoutes);
app.use("/files", express.static("files"));

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
