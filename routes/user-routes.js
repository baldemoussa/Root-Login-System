const express = require("express");
const router = express.Router();
const authController = require("../controllers/user-controller");
const verifyAuthentification = require("../middleware/verifyAuthentification");
const adminOnly = require("../middleware/adminOnly");
const passport = require("passport");

// You could use this line to apply a middleware to every defined route in your router if you wanted
// router.use(verifyAuthentification);

router.get("/", verifyAuthentification, authController.getUser);
router.get("/admin", verifyAuthentification, adminOnly, authController.getUser);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);


// JWT Authentication with Passport
const passport = require("passport");

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  authController.getUser
);

router.get(
  "/github",
  passport.authenticate("github", { session: false })
);

//GitHub OAuth with Passport
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    res.json({ message: "Successfully authenticated using GitHub!" });
  }
);



module.exports = router;