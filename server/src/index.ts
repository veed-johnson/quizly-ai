import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";

import router from "./router";
import mongoose from "mongoose";
import { ErrorMiddleware } from "./Api/Middlewares/ErrorMiddleware";
import { QuizRoute } from "./Api/Routes/QuizRoute";
import { generateQuizScheduler } from "./Api/Schedulers/AddQuizScheduler";
import { sendMessageToUsersScheduler } from "./Api/Schedulers/SendMessageToUsersScheduler";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://quizly-ai.vercel.app/",
      "https://quizly-ai-main.vercel.app/",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

console.log({ErrorMiddleware})
app.use(ErrorMiddleware);

app.use("/", router());
// routes
app.use("/quiz", QuizRoute);


// Schedulers
generateQuizScheduler.addNewQuizzes(); // Handles creating quizzes
// sendMessageToUsersScheduler.execute();

const server = http.createServer(app);

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

mongoose.set("strictQuery", false);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log({error}));

