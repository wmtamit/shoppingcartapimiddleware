const express = require("express");
const router = express.Router();

const User = require("../models/user");

const UserControllers=require('../controllers/users')
const checkAuth = require("../middleware/check-auth");
router.post("/login", UserControllers.users_login_user);

router.post("/signup", UserControllers.users_signup_user);

router.delete("/:userId",checkAuth, UserControllers.users_delete_user);
module.exports = router;
