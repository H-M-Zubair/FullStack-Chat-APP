import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { Timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // Remove the password field
  return user;
};

const User = mongoose.model("User", userSchema);
export default User;
