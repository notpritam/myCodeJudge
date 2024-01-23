import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      // passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // try {
      //   let user = await User.findOne({ googleId: profile.id });
      //   if (!user) {
      //     user = await User.create({
      //       googleId: profile.id,
      //       name: profile.displayName,
      //       email: profile.emails[0].value,
      //       image: profile.photos[0].value,
      //       profileImageURL: profile.photos[0].value,
      //     });

      //     return done(null, user);
      //   }
      // } catch (e) {
      //   return done(e, null);
      // }

      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
