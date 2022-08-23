import express from "express";
import { requireSignin } from "../middleware/requiredsignin";

//

//

import { currentInstructor, instructorCourses } from "../controller/instructor";

const route = express.Router();
//

//

route.post("/current-instructor", requireSignin, currentInstructor);
route.get("/instructor-courses", requireSignin, instructorCourses);

//
//.
module.exports = route;

// route.use("/register2", (req, res) => {
//   res.send("All the way from Route");
// });
