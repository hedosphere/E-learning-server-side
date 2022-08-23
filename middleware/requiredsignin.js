import { expressjwt } from "express-jwt";
import User from "../model/user";
import Course from "../model/course";

//

//

export const requireSignin = expressjwt({
  algorithms: ["HS256"],
  secret: process.env.JWTSECRET,
  getToken: (req, res) => req.cookies.token,
});

export const isInstructor = async (req, res, next) => {
  //
  try {
    const user = await User.findById(req.auth._id).exec();
    if (!user.role.includes("Instructor")) return res.sendStatus(403);
    next();
  } catch (err) {
    console.log(err);
  }
};

export const mustEnroll = async (req, res, next) => {
  // courses
  try {
    const user = await User.findById(req.auth._id).exec();
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).exec();
    let lengthz = user.courses.length;
    const ids = [];
    // console.log("course id", course._id);
    let courseId = course._id.toString();

    for (let i = 0; i < lengthz; i++) {
      ids.push(user.courses[i].toString());
    }

    // if (user)
    //
    if (!ids.includes(courseId)) {
      res.sendStatus(400);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
