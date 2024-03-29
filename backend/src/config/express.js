import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import authRoutes from "../routes/authRoute.js";
import codeRoutes from "../routes/evaluateCodeRoute.js";
import questionRoutes from "../routes/questionRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

const configure = (app) => {
  app.use(morgan("dev"));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cookieParser());

  app.use("/api/auth", authRoutes);
  app.use("/api/code", codeRoutes);
  app.use("/api/questions", questionRoutes);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });

  // Handle 404 errors
  app.use((req, res) => {
    res.status(404).send("Not Found");
  });

  return app;
};
export { configure };
