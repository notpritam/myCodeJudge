import express from "express";
import cookieSession from "cookie-session";

import { configure } from "./config/express.js";
import connect from "./config/db.js";
import passport from "./config/passport.js";
import session from "express-session";

const app = express();

connect();

configure(app);

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["key1"],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
// app.use(passport.initialize());
// app.use(passport.session());

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
