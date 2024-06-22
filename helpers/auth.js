const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const saltedSha512 = require("salted-sha512");
const messages = require("../constants/messages");
const User = require("../models/user");

module.exports = {
  passport: function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true,
        },
        /**function for login user
         * @param {string} email
         * @param {string} password
         * @param {Function} done
         * @return {[type]}
         */
        async function (req, email, password, done) {

          const user = await User.findOne({
            email: email.trim().toLowerCase(),
            password: saltedSha512(password, process.env.SHA512_SALT_KEY),
          }).lean();


          if (!user || user.isDeleted) {
            return done(null, false, {
              message: messages.invalidLogin,
            });
          };

          if (!user.isActive) {
            return done(null, false, {
              message: messages.inactiveAccount,
            });
          };

          return done(null, user);
        }
      )
    );

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(async function (user, done) {
      done(null, user);
    });
  },

  checkAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next(); //return next
    }
    //redirect to requested page
    res.redirect("/?u=" + req.originalUrl);
  },
};
