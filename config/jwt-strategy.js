const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const User = require("../models/user-model");

const options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    /*
    - done(error, false) => failure, authentication denied
    - done(null, false) => no error, but no valid user found
    - done(null, user) => success, attach user to req.user
    */
    const user = await User.findById(jwt_payload._id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch(error) {
    return done(error, false)
  }
}));

/*
  Documentation:

  passport
  https://www.passportjs.org/
  https://github.com/jaredhanson/passport
  https://github.com/jaredhanson/passport/blob/master/lib/middleware/initialize.js
  https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js

  passport-jwt
  https://www.passportjs.org/packages/passport-jwt/
  https://github.com/mikenicholson/passport-jwt
*/