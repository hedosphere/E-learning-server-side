//
import User from "../model/user";
import Course from "../model/course";

export const currentInstructor = async (req, res) => {
  //
  const user = await User.findById({ _id: req.auth._id }).exec();
  //   console.log(user);

  if (user && !user.role.includes("Instructor"))
    return res.status(406).send("Pls become instructor");
  // console.log(user);

  res.json({ ok: true });
  //
};
//
//

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.auth._id })
      .sort({ createdAt: -1 })
      .exec();
    return res.json(courses);
  } catch (err) {
    console.log(err);
  }

  //
};

//

//

//

//

//
