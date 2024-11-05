const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const dotenv = require("dotenv");

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_MAILER_CLIENT_ID,
      clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Users.findOne({ googleId: profile.id });

        if (!user) {
          user = new Users({
            googleId: profile.id,
            UserName: profile.displayName,
            Email: profile.emails[0].value,
          });
          await user.save();
        }
        const Role = user.Role;
        const token = jwt.sign(
          {
            _id: user._id,
            UserName: user.UserName,
            Email: user.Email,
            Role: Role,
            Image: user.Image,
          },
          process.env.jwt
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
module.exports = passport;
