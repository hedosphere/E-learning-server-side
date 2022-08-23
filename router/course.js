import express from "express";
import formidable from "express-formidable";
import {
  requireSignin,
  isInstructor,
  mustEnroll,
} from "../middleware/requiredsignin";

//

//

import {
  uploadImage,
  removeAwsObjects,
  removeAwsObjectVideo,
  lessonDelete,
  updateLesson,
  courseUnpublish,
  enrollStatus,
  courses,
  edit,
  coursePublish,
  addLessons,
  uploadvideo,
  loadCourse,
  create,
  freeEnroll,
  paidEnroll,
  UserCourses,
  markAsCompleted,
  markAsInCompleted,
  listCompleted,
} from "../controller/course";

const route = express.Router();
//

//

//image
route.post("/course/upload-image", uploadImage);
route.post("/course/remove-image", removeAwsObjects);

//video
//   /api/course/video-upload
route.post(
  "/course/upload-video/:instructorId",
  requireSignin,
  formidable(),
  uploadvideo
);
route.post(
  "/course/remove-video/:instructorId",
  requireSignin,
  removeAwsObjectVideo
);

// course
route.post("/course/create", requireSignin, isInstructor, create);
route.get("/course/:slug", loadCourse);
route.post("/course/addlesson/:slug/:instructorID", requireSignin, addLessons);
route.put("/course/edit/:slug", requireSignin, edit);

//   put(`/api/course/publish/${courseID}`); courseUnpublish
route.put("/course/publish/:courseID", requireSignin, coursePublish);
route.put("/course/unpublish/:courseID", requireSignin, courseUnpublish);

//  `/api/lesson/removelesson/${slug}/${remove._id}/${courseSlug}`;
route.put(
  "/lesson/removelesson/:slug/:lessonId/:courseSlug",
  requireSignin,
  lessonDelete
);
route.put("/lesson/update/:slug", requireSignin, updateLesson);
route.get("/course", courses);
// const { data } = await axios.get(`/api/enroll-status/${course._id}`); enrollStatus

route.get("/enroll-status/:courseId", requireSignin, enrollStatus);
// const { data } = await axios.post(`/api/free-enroll/${course._id}`);freeEnroll paidEnroll UserCourses
route.post("/free-enroll/:courseId", requireSignin, freeEnroll);
route.post("/paid-enroll/:courseId", requireSignin, paidEnroll);

// const { data } = await axios.get(`/api/user/course`);
// User courses
route.get("/user/course", requireSignin, UserCourses);
route.get("/single-course/:slug", requireSignin, mustEnroll, loadCourse);

//

//
// const { data } = await axios.post/api/mark-completed listCompleted

route.post("/mark-completed", requireSignin, markAsCompleted);
route.post("/mark-incompleted", requireSignin, markAsInCompleted);
route.post("/list-completed", requireSignin, listCompleted);

//
//
module.exports = route;
