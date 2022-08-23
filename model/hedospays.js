import mongoose from "mongoose";

const { Schema } = mongoose;

const pays = new Schema(
  {
    user: {
      // type: String,
      type: mongoose.ObjectId,
      required: true,
      ref: "User",
    },
    accountnumber: {
      type: String,
      require: true,
      trim: true,
    },

    accounttype: {
      type: String,
      trim: true,
      require: true,
    },

    bankname: {
      type: String,
      trim: true,
      require: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Hedospays", pays);
