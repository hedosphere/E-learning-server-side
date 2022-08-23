import express from "express";
import { requireSignin } from "../middleware/requiredsignin";

//

//

import {
  register,
  logout,
  login,
  currentUser,
  resetPassword,
  callback,
  isInstructor,
  payOut,
  sendCode,
} from "../controller/auth";

const route = express.Router();
route.post("/register", register);
route.post("/login", login);

route.post("/sendcode", sendCode);
route.post("/reset-password", resetPassword);
route.get("/logout", logout);
route.post("/current-user", requireSignin, currentUser);

// paymens

route.post("/payout", requireSignin, payOut);
route.post("/callback", requireSignin, callback);
route.get("/is-instructor", requireSignin, isInstructor);
//.
module.exports = route;

// route.use("/register2", (req, res) => {
//   res.send("All the way from Route");
// });
