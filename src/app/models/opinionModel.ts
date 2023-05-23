import mongoose from "mongoose";

const opinionSchema = new mongoose.Schema(
  {
    CrewM: { type: mongoose.Schema.Types.ObjectId, required: true },
    Signed: { type: Boolean, required: true },

    Tkufa: { type: Number, required: true },
    fillDate: { type: Date, required: true },
    MonthsNo: { type: Number, required: true },
    Position: { type: String, required: true },

    wasRank: { type: String, required: true },
    wasDereg: { type: String, required: true },
    wasMaslool: { type: String, required: true },
    wasSoogHatsava: { type: String, required: true },
    wasUnit: { type: String, required: true },

    wasMyEvaMA: { type: Number, required: true },
    wasMyEvaRank: { type: String, required: true },
    wasMyEvaLastName: { type: String, required: true },
    wasMyEvaFirstName: { type: String, required: true },

    wasMyAuthMA: { type: Number, required: false },
    wasMyAuthRank: { type: String, required: false },
    wasMyAuthLastName: { type: String, required: false },
    wasMyAuthFirstName: { type: String, required: false },
    wasMyAuthApped: { type: Boolean, required: false, default: false },

    C1: { type: Number, required: true },
    C2: { type: Number, required: true },
    C3: { type: Number, required: true },
    C4: { type: Number, required: true },
    C5: { type: Number, required: true },
    C6: { type: Number, required: true },
    C7: { type: Number, required: true },
    C8: { type: Number, required: true },
    C9: { type: Number, required: true },

    M1: { type: Number, required: true },

    M2: { type: Number, required: false },

    Tp: [{ type: String, required: true }],
    Fp: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

const Opinion = mongoose.model("opinion", opinionSchema);

export default Opinion;
