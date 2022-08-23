import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchem = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },

    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
      max: 70,
    },

    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: [String],
      default: ["Subscriber"],
      enum: ["Subscriber", "Instructor", "Admin"],
    },

    passwordcode: {
      type: String,
      default: undefined,
    },

    courses: [
      {
        type: mongoose.ObjectId,
        ref: "Course",
      },
    ],

    hedopayId: "",
    hedopayData: {},
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchem);
