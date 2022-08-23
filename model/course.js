import mongoose from "mongoose";

// const { ObjectID } = mongoose.Schema;
const { Schema } = mongoose;

const lessonSchem = new Schema(
  {
    title: {
      type: String,
      minLength: 3,
      trim: true,
      maxLength: 360,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    content: {
      type: {},
      minLength: 200,
    },
    video: {},
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//
//

const courseSchem = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      trim: true,
      maxLength: 360,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: {},
      required: true,
      minLength: 200,
    },
    price: {
      type: Number,
      default: 9.99,
    },
    image: {},

    category: String,

    published: {
      type: Boolean,
      default: false,
    },

    paid: {
      type: Boolean,
      default: true,
    },

    instructor: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },

    lesson: [lessonSchem],
  },
  { timestamps: true }
);

//

//

export default mongoose.model("Course", courseSchem);
