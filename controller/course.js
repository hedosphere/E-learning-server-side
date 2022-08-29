//
import { randomnumber } from "../util/randomnumber";
import Course from "../model/course";
import slugify from "slugify";
import { readFileSync } from "fs";
import User from "../model/user";
import Complete from "../model/markCompleted";
//
import aws from "aws-sdk";
// import { exec } from "child_process";
//
const awsConfig = {
  // { apiVersion: "2010-12-01" }
  apiVersion: process.env.AWS_API_VERSION,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const S3 = new aws.S3(awsConfig);
//

export const uploadImage = async (req, res) => {
  //

  try {
    const { image } = req.body;
    const type = image.split(";")[0].split("/")[1];

    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const shortID = await randomnumber();

    // console.log("shortID", shortID);

    const imgParams = {
      Body: base64Data,
      ACL: "public-read",
      Bucket: "hedobag",
      Key: `${shortID}.${type}`,
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    S3.upload(imgParams, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      // console.log("data ", data);
      return res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

//

// remove-video

export const removeAwsObjects = async (req, res) => {
  //

  // req.  object
  try {
    // const { image } = req.body;
    const { object } = req.body;
    console.log(object);
    // return;

    const imgParams = {
      Bucket: object.Bucket,
      Key: object.Key,
    };

    S3.deleteObject(imgParams, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      // console.log(data);
      return res.status(200).send("ok");
    });
    // return res.send("data");

    // return res.status(200).send("ok");
  } catch (err) {
    console.log(err);
  }
};

//

export const create = async (req, res) => {
  // console.log("/Create Course > back");

  try {
    // console.log("req.body ", req.body);

    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });
    if (alreadyExist) return res.status(400).send("Name is taken");

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.auth._id,
      ...req.body,
    }).save();
    // console.log("req.body ", course);

    return res.json(course);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

//
//

export const loadCourse = async (req, res) => {
  const { slug } = req.params;

  const course = await Course.findOne({ slug })
    .populate("instructor", "_id name")
    .exec();
  // console.log("load course", course);
  if (!course) return res.sendStatus(400);

  return res.json(course);

  //
};

//

export const uploadvideo = async (req, res) => {
  // console.log("********** videos");
  try {
    if (req.auth._id != req.params.instructorId) return res.sendStatus(400);

    const { video } = req.files;
    const shortID = await randomnumber();

    // console.log(shortID, video);
    const type = video.type.split("/")[1];
    const videoParams = {
      Body: readFileSync(video.path),
      ACL: "public-read",
      Bucket: "hedobag",
      Key: `${shortID}.${type}`,
      ContentType: video.type,
    };

    S3.upload(videoParams, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      return res.send(data);
    });
    // console.log("data ", data);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
  return;
};
//

export const removeAwsObjectVideo = async (req, res) => {
  //

  // req.  object
  try {
    // const { image } = req.body;
    const { object } = req.body;
    // console.log("object >>>>>  ", object);
    if (req.auth._id != req.params.instructorId) return res.sendStatus(400);

    const imgParams = {
      Bucket: object.Bucket,
      Key: object.Key,
    };

    S3.deleteObject(imgParams, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      // console.log(data);
      return res.status(200).send("ok");
    });
  } catch (err) {
    console.log(err);
  }
};

//

export const addLessons = async (req, res) => {
  //

  try {
    const { title, video, content } = req.body;
    const { slug, instructorID } = req.params;
    if (instructorID != req.auth._id) return res.sendStatus(400);

    //

    //
    const updateLesson = await Course.findOneAndUpdate(
      { slug },
      { $push: { lesson: { title, video, content, slug: slugify(title) } } },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();

    // console.log(instructorID, " Slugs ", req.body);
    return res.json(updateLesson);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const edit = async (req, res) => {
  //
  const { slug } = req.params;
  const course = await Course.findOne({ slug }).exec();

  if (req.auth._id != course.instructor)
    return res.status(400).send("Unauthorize");

  const update = await Course.findOneAndUpdate(
    { slug },
    { slug: slugify(req.body.name), ...req.body },
    {
      new: true,
    }
  )
    .populate("instructor", "_id name")
    .exec();

  console.log(update.id);
  return res.json(update);
};
//   console.log("ssssssss");
// };
//

export const lessonDelete = async (req, res) => {
  //
  try {
    const { slug, lessonId, courseSlug } = req.params;
    // const userID = req.auth._id;
    const course = await Course.findOne({ slug: courseSlug });

    if (req.auth._id != course.instructor)
      return res.status(400).send("Unauthorized");
    // console.log(lessonId);
    const updateLesson = await Course.findByIdAndUpdate(
      { _id: course._id },
      { $pull: { lesson: { _id: lessonId } } }
    ).exec();

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

//

//

//

//
export const updateLesson = async (req, res) => {
  // route.put("/lesson/update/:slug", requireSignin, updateLesson);
  //

  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).exec();
    // console.log("**** lesson", req.body);

    const { title, content, free_preview, video, _id } = req.body;

    if (req.auth._id != course.instructor) return sendStatus(400);

    const update = await Course.updateOne(
      { "lesson._id": _id },
      {
        $set: {
          "lesson.$.title": title,
          "lesson.$.slug": slugify(title),
          "lesson.$.content": content,
          "lesson.$.free_preview": free_preview,
          "lesson.$.video": video,
        },
      }, // lesson
      { new: true }
    ).exec();
    res.json({ ok: true });
    //
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

//

//

//

export const coursePublish = async (req, res) => {
  //
  const { courseID } = req.params;
  const course = await Course.findById({ _id: courseID });
  // if (course._id != courseID) {
  if (course.instructor._id != req.auth._id) {
    return res.sendStatus(400);
  }

  const update = await Course.findOneAndUpdate(
    { _id: courseID },
    { published: true },
    { new: true }
  );

  return res.json(update);
  // console.log(update.published, " >>> course published", course.slug);
};

export const courseUnpublish = async (req, res) => {
  //
  const { courseID } = req.params;
  const course = await Course.findById({ _id: courseID });
  if (course.instructor._id != req.auth._id) {
    return res.sendStatus(400);
  }

  const update = await Course.findOneAndUpdate(
    { _id: courseID },
    { published: false },
    { new: true }
  );

  return res.json(update);
};

export const courses = async (req, res) => {
  const allPublished = await Course.find({ published: true })
    .sort({ createdAt: -1 })
    .populate("instructor", "_id name")
    .exec();
  res.json(allPublished);
};
// t(`/api/lesson/remove${slug}/${remove._id}`); deleteLesson

// const { data } = await axios.get(`/api/enroll-status/${course._id}`); enrollStatus
//

//

export const enrollStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("  first attempt ", courseId);

    // const { _id } = req.auth;

    const user = await User.findById({ _id: req.auth._id }).exec();

    const ids = [];
    const lengthz = user.courses.length;
    // console.log(" before length ", lengthz);

    if (lengthz < 1) {
      return res.sendStatus(200);
    }
    // console.log("after length ");

    for (let i = 0; i < lengthz; i++) {
      ids.push(user.courses[i].toString());
    }

    console.log(" enroll-status", ids, courseId);
    res.json({
      status: ids.includes(courseId),
      course: await Course.findById({ _id: courseId }),
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
//

export const freeEnroll = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById({ _id: courseId }).exec();
    if (course.paid) return;

    const user = await User.findOneAndUpdate(
      { _id: req.auth._id },
      {
        $addToSet: {
          courses: course._id,
        },
      },
      { new: true }
    );

    console.log("Free enroll", courseId);
    res.json({
      course: await Course.findById({ _id: courseId }),
    });
  } catch (err) {
    console.log(err);
  }
};

//

export const paidEnroll = async (req, res) => {
  console.log("paid enroll");
  // return;
  try {
    const { courseId } = req.params;
    const course = await Course.findById({ _id: courseId }).exec();
    if (!course.paid) return;

    const user = await User.findOneAndUpdate(
      { _id: req.auth._id },
      {
        $addToSet: {
          courses: course._id,
        },
      },
      { new: true }
    );

    console.log("Paid enroll", courseId);
    res.json({
      course: await Course.findById({ _id: courseId }),
    });
  } catch (err) {
    console.log(err);
  }
};

//
export const UserCourses = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.auth._id });
    // console.log("user courses", userCourse.courses);
    const userCourse = await Course.find({ _id: { $in: user.courses } })
      .populate("instructor", "_id name")
      .exec();
    // console.log(userCourse[0].slug);
    res.json(userCourse);
    // const
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

//

export const markAsCompleted = async (req, res) => {
  //
  try {
    const complete = await Complete.findOne({
      user: req.auth._id,
      course: req.body.courseId,
    }).exec();

    if (complete) {
      const update = await Complete.findOneAndUpdate(
        {
          user: req.auth._id,
          course: req.body.courseId,
        },
        {
          $addToSet: { lessons: req.body.lessonId },
        },
        { new: true }
      ).exec();
      // console.log(update);
      res.json(update);
    } else {
      const create = await new Complete({
        user: req.auth._id,
        course: req.body.courseId,
        lessons: req.body.lessonId,
      }).save();
      // console.log(create);
      res.json(create);
    }
  } catch (err) {
    console.log(err);
  }
  // console.log(req.auth._id, req.body.courseId, req.body.lessonId);
};

//

export const markAsInCompleted = async (req, res) => {
  //
  try {
    const complete = await Complete.findOne({
      user: req.auth._id,
      course: req.body.courseId,
    }).exec();

    const update = await Complete.findOneAndUpdate(
      {
        user: req.auth._id,
        course: req.body.courseId,
      },
      {
        $pull: { lessons: req.body.lessonId },
      },
      { new: true }
    );

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
  // console.log(req.auth._id, req.body.courseId, req.body.lessonId);
};

//

//

export const listCompleted = async (req, res) => {
  // console.log("list complete");
  try {
    const listComplete = await Complete.findOne({
      user: req.auth._id,
      course: req.body.courseId,
    }).exec();
    // console.log(listComplete.lessons);
    listComplete && res.json(listComplete.lessons);
  } catch (err) {
    console.log(err);
  }
};

// enroll

//

export const enroll = async (req, res) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug }).exec();
  if (!course) return;
  const user = await User.find({ courses: { $in: course._id } });
  // console.log(course._id, "enroll list", user.length);
  // if (!user) return;

  return res.json(user.length);
};

//

//

//
