const { Strategy: GitHubStrategy } = require("passport-github2");
const passport = require("passport");
const User = require("../models/user-model");

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ["user:email"]
};

passport.use(new GitHubStrategy(options, async (accessToken, refreshToken, profile, done) => {
  try {
    /*
      accessToken is a short-lived token issued by GitHub after the user authenticates.
      Your server can use it to make authenticated API requests to GitHub on behalf of the user.

      refreshToken is a long-lived token you can use to request new access tokens without asking the user to log in again.
      GitHub does not issue refresh tokens in its OAuth flow — so this will usually be undefined when using passport-github2.

      profile contains the GitHub profile object with user info (id, username, emails, avatar, etc.)

      done is the passport convention which is used to pass your app's user object (from DB)
      forward, which will then be attached to req.user.
    */
    console.log(profile);

    let user = await User.findOne({ githubId: profile.id }).select("-password -role -githubId");

    if (!user) {
      await User.create({
        username: profile.username,
        email: profile.emails[0].value,
        password: profile.username + profile.email + profile.id,
        githubId: profile.id
      });
      user = await User.findOne({ githubId: profile.id }).select("-password -role -githubId");
    }

    return done(null, user);
  } catch(error) {
    return done(error, false);
  }
}));

/*
  Documentation:

  passport
  https://www.passportjs.org/
  https://github.com/jaredhanson/passport
  https://github.com/jaredhanson/passport/blob/master/lib/middleware/initialize.js
  https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js

  passport-github2
  https://www.passportjs.org/packages/passport-github2/
  https://github.com/cfsghost/passport-github/blob/master/lib/strategy.js
  https://github.com/cfsghost/passport-github/blob/master/examples/login/app.js
*/