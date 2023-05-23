import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    MA: {
      type: Number,
      required: true,
      unique: true,
    },
    FirstName: String,
    LastName: String,
    NickName: String,
    CourseNo: Number,
    BirthDate: Date,
    Email: String,
    MainPhone: String,
    EmergencyPhone: String,
    AddressCity: String,
    AddressLine: String,
    Rank: String,
    Dereg: String,
    Maslool: String,
    SoogHatsava: String,
    Unit: String,
    Isb: Boolean,
    Isk: Boolean,
    passwordHash: { type: String, required: true },
    Role: { type: String, required: true },
    // || "SCREW" || "DIRECT" || "AUTHCO" || "KAHAD" || "PAKMATS" || "SCHOOL" || "S420"
    // => || איש צוות || מפקד גף || מפקד יחידה || מנהל כח אדם || מבצעים || מפקד הכשרה || מפקד הכשרה 420
    MyComm: mongoose.Schema.Types.ObjectId,
    MyTutor: mongoose.Schema.Types.ObjectId,
    MyAuth: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

export default User;
