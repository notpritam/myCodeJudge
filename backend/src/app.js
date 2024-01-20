import express from "express";

import { configure } from "./config/express.js";
import connect from "./config/db.js";

const app = express();

connect();

configure(app);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
