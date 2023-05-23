import express from "express";

import jwt from "jsonwebtoken";

import Opinion from "../models/opinionModel";

import User from "../models/userModel";

const router = express.Router();

async function addFudsToOpinion(theopinion: any) {
  let josnres = theopinion.toJSON();
  const screww = await User.findById(josnres.CrewM);
  josnres.CrewM = screww;
  const commm = await User.findById(josnres.Commander);
  josnres.Commander = commm;
  const authh = await User.findById(josnres.Authorizer);
  josnres.Authorizer = authh;
  return josnres;
}

router.get("/getallmy", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr: any = await User.findById((validatedUser as any).user);

    const opinions = await Opinion.find({ CrewM: userr });

    for (let i = 0; i < opinions.length; i++)
      opinions[i] = await addFudsToOpinion(opinions[i]);

    res.json(opinions);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/getallmy2/:ma", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);
    const ro = (await User.findById((validatedUser as any)?.user))?.Role;
    if (ro === "DIRECT" || ro === "AUTHCO") {
      const screww = await User.find({ MA: req.params.ma });

      const opinions = await Opinion.find({ CrewM: screww });

      for (let i = 0; i < opinions.length; i++)
        opinions[i] = await addFudsToOpinion(opinions[i]);

      res.json(opinions);
    } else {
      return res.status(401).json({
        errorMessage: 'ניסית לקבל את כל החוו"דים של איש צוות אך אינך מפקד שלו',
      });
    }
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/getallunapp", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr: any = await User.findById((validatedUser as any).user);

    const opinions = await Opinion.find({
      wasMyAuthMA: userr.MA,
      wasMyAuthApped: false,
    });

    for (let i = 0; i < opinions.length; i++)
      opinions[i] = await addFudsToOpinion(opinions[i]);

    res.json(opinions);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/getmyOpinion/:id", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr: any = await User.findById((validatedUser as any).user);

    const opinion = await Opinion.findById(req.params.id);

    let ifpakud: any = await User.findById((opinion as any).CrewM.toJSON());

    if (
      (opinion as any).CrewM.toJSON() != userr._id.toJSON() &&
      ifpakud.MyComm.toJSON() != userr._id.toJSON() &&
      ifpakud.MyAuth.toJSON() != userr._id.toJSON()
    )
      return res.status(400).json({
        errorMessage:
          "אינך יכול לצפות בחוו''ד זה מכיוון שאינו שלך או של פקוד שלך",
      });

    res.json(await addFudsToOpinion(opinion));
  } catch (err) {
    res.status(401).send();
  }
});

router.get("/getallmyn/:ma", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const comm: any = await User.findById((validatedUser as any).user);

    const screww: any = await User.find({ MA: req.params.ma });

    const opinions = await Opinion.find({ CrewM: screww });

    if (
      comm.Role === "DIRECT" ||
      (comm.Role === "SCHOOL" &&
        comm._id.toString() === screww[0].MyComm.toString())
    ) {
      for (let i = 0; i < opinions.length; i++)
        opinions[i] = await addFudsToOpinion(opinions[i]);
      res.json(opinions);
    } else {
      try {
        if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

        if (comm._id.toString() === screww[0].MyAuth.toString()) {
          for (let i = 0; i < opinions.length; i++)
            opinions[i] = await addFudsToOpinion(opinions[i]);
          res.json(opinions);
        } else {
          return res.status(401).json({
            errorMessage:
              'ניסית לקבל את כל החוו"דים של איש צוות אך אינך מפקד יחידה שלו',
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send();
      }
    }
  } catch (err) {
    try {
      const token = req.cookies.token;

      if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

      const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

      const userr: any = await User.findById((validatedUser as any).user);

      const screww: any = await User.find({ MA: req.params.ma });

      const opinions = await Opinion.find({ CrewM: screww });

      if (userr._id.toString() === screww[0].MyAuth.toString()) {
        for (let i = 0; i < opinions.length; i++)
          opinions[i] = await addFudsToOpinion(opinions[i]);
        res.json(opinions);
      } else {
        return res.status(401).json({
          errorMessage:
            'ניסית לקבל את כל החוו"דים של איש צוות אך אינך מפקד יחידה שלו',
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
});

router.put("/editOpinion/:id", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr: any = await User.findById((validatedUser as any).user);

    const opinionId = req.params.id;

    if (!opinionId)
      return res.status(400).json({
        errorMessage: "יש בעיה... לא התקבל מזהה חוו''ד",
      });
    const opinionn = await Opinion.findById(opinionId);

    const {
      CrewM,
      gSigned,
      Tkufa,
      gfillDate,
      MonthsNo,
      Position,
      C1,
      C2,
      C3,
      C4,
      C5,
      C6,
      C7,
      C8,
      C9,
      M1,
      M2,
      Tp,
      Fp,
    } = req.body;

    if (!gSigned) {
      return res.status(400).json({
        errorMessage: "האם החווד חתום?",
      });
    }
    if (!Tkufa) {
      return res.status(400).json({
        errorMessage: "לאיזה תקופה החווד?",
      });
    }
    if (!gfillDate) {
      return res.status(400).json({
        errorMessage: "מתי הוזן החווד?",
      });
    }
    if (!MonthsNo) {
      return res.status(400).json({
        errorMessage: "כמה חודשים פיקדת?",
      });
    }
    if (MonthsNo < 0)
      return res.status(400).json({
        errorMessage: "לא ייתכן שפיקדת פחות מ0 חודשים / הזנת תו שאינו מספר",
      });
    if (!Position) {
      return res.status(400).json({
        errorMessage: "מה תפקיד הפקוד?",
      });
    }

    if (
      !(
        C1 == 4 ||
        C1 == 5 ||
        C1 == 6 ||
        C1 == 7 ||
        C1 == 8 ||
        C1 == 9 ||
        C1 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 1 חסר" });

    if (
      !(
        C2 == 4 ||
        C2 == 5 ||
        C2 == 6 ||
        C2 == 7 ||
        C2 == 8 ||
        C2 == 9 ||
        C2 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 2 חסר" });

    if (
      !(
        C3 == 4 ||
        C3 == 5 ||
        C3 == 6 ||
        C3 == 7 ||
        C3 == 8 ||
        C3 == 9 ||
        C3 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 3 חסר" });

    if (
      !(
        C4 == 4 ||
        C4 == 5 ||
        C4 == 6 ||
        C4 == 7 ||
        C4 == 8 ||
        C4 == 9 ||
        C4 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 4 חסר" });

    if (
      !(
        C5 == 4 ||
        C5 == 5 ||
        C5 == 6 ||
        C5 == 7 ||
        C5 == 8 ||
        C5 == 9 ||
        C5 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 5 חסר" });

    if (
      !(
        C6 == 4 ||
        C6 == 5 ||
        C6 == 6 ||
        C6 == 7 ||
        C6 == 8 ||
        C6 == 9 ||
        C6 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 6 חסר" });

    if (
      !(
        C7 == 4 ||
        C7 == 5 ||
        C7 == 6 ||
        C7 == 7 ||
        C7 == 8 ||
        C7 == 9 ||
        C7 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 7 חסר" });

    if (
      !(
        C8 == 4 ||
        C8 == 5 ||
        C8 == 6 ||
        C8 == 7 ||
        C8 == 8 ||
        C8 == 9 ||
        C8 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 8 חסר" });

    if (
      !(
        C9 == 4 ||
        C9 == 5 ||
        C9 == 6 ||
        C9 == 7 ||
        C9 == 8 ||
        C9 == 9 ||
        C9 == 10
      )
    ) {
      return res.status(400).json({
        errorMessage: "חסר קריטריון כלשהו",
      });
    }

    if (
      !(
        M1 == 4 ||
        M1 == 5 ||
        M1 == 6 ||
        M1 == 7 ||
        M1 == 8 ||
        M1 == 9 ||
        M1 == 10
      )
    ) {
      return res.status(400).json({
        errorMessage: "חסר ציון מסכם",
      });
    }

    if (!(M2 == 0 || M2 == 1 || M2 == 2 || M2 == 3 || M2 == 4)) {
      return res.status(400).json({
        errorMessage: "חסר פוטנציאל להובלה",
      });
    }

    if (!Tp) {
      return res.status(400).json({
        errorMessage: "לא התקבלו יעדים לשיפור",
      });
    }

    if (!Fp) {
      return res.status(400).json({
        errorMessage: "לא התקבל סיכם",
      });
    }

    if (userr.Role === "DIRECT") {
      const crewmm = await User.findById(CrewM);
      const fillDate = new Date(
        gfillDate.substring(3, 5) +
          "/" +
          gfillDate.substring(0, 2) +
          "/" +
          gfillDate.substring(6, gfillDate.length) +
          "Z"
      );
      const Signed = gSigned === "כן";
      if (crewmm?.MyComm?.toString() === userr._id.toString()) {
        (opinionn as any).Signed = Signed;
        (opinionn as any).Tkufa = Tkufa;
        (opinionn as any).fillDate = fillDate;
        (opinionn as any).MonthsNo = MonthsNo;
        (opinionn as any).Position = Position;
        (opinionn as any).C1 = C1;
        (opinionn as any).C2 = C2;
        (opinionn as any).C3 = C3;
        (opinionn as any).C4 = C4;
        (opinionn as any).C5 = C5;
        (opinionn as any).C6 = C6;
        (opinionn as any).C7 = C7;
        (opinionn as any).C8 = C8;
        (opinionn as any).C9 = C9;
        (opinionn as any).M1 = M1;
        (opinionn as any).M2 = M2;
        (opinionn as any).Tp = Tp;
        (opinionn as any).Fp = Fp;
        (opinionn as any).wasMyAuthApped = false;

        const savedOpinion = await (opinionn as any).save();

        res.json(savedOpinion);
      } else
        return res.status(401).json({
          errorMessage: "ניסיתי לעדכן חווד של פקוד בגף אך אינך מפקד גף שלו",
        });
    } else {
      return res.status(401).json({
        errorMessage: "ניסיתי לעדכן חווד של פקוד בגף אך אינך מפקד בכללי",
      });
    }
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.get("/approve/:id", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr: any = await User.findById((validatedUser as any).user);

    const opinionId = req.params.id;

    if (!opinionId)
      return res.status(400).json({
        errorMessage: "יש בעיה... לא התקבל מזהה חוו''ד",
      });
    const opinionn = await Opinion.findById(opinionId);

    if (userr.Role === "AUTHCO") {
      const crewmm = await User.findById((opinionn as any).CrewM._id);

      if (crewmm?.MyAuth?.toString() === userr._id.toString()) {
        (opinionn as any).wasMyAuthApped = true;

        const savedOpinion = await (opinionn as any).save();

        res.json({ answer: savedOpinion.wasMyAuthApped });
      } else
        return res.status(401).json({
          errorMessage:
            "ניסיתי לאשר חווד של פקוד ביחידה אך אינך מפקד יחידה שלו",
        });
    } else {
      return res.status(401).json({
        errorMessage:
          "ניסיתי לאשר חווד של פקוד ביחידה אך אינך מפקד יחידה בכללי",
      });
    }
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.post("/createOpinion", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr: any = await User.findById((validatedUser as any).user);

    const {
      CrewM,
      gSigned,
      Tkufa,
      gfillDate,
      MonthsNo,
      Position,
      C1,
      C2,
      C3,
      C4,
      C5,
      C6,
      C7,
      C8,
      C9,
      M1,
      M2,
      Tp,
      Fp,
    } = req.body;

    if (!CrewM) {
      return res.status(400).json({
        errorMessage: "של מי החווד?",
      });
    }
    if (!gSigned) {
      return res.status(400).json({
        errorMessage: "האם החווד חתום?",
      });
    }
    if (!Tkufa) {
      return res.status(400).json({
        errorMessage: "לאיזה תקופה החווד?",
      });
    }
    if (!gfillDate) {
      return res.status(400).json({
        errorMessage: "מתי הוזן החווד?",
      });
    }
    if (!MonthsNo) {
      return res.status(400).json({
        errorMessage: "כמה חודשים פיקדת?",
      });
    }
    if (MonthsNo < 0)
      return res.status(400).json({
        errorMessage: "לא ייתכן שפיקדת פחות מ0 חודשים / הזנת תו שאינו מספר",
      });
    if (!Position) {
      return res.status(400).json({
        errorMessage: "מה תפקיד הפקוד?",
      });
    }

    if (
      !(
        C1 == 4 ||
        C1 == 5 ||
        C1 == 6 ||
        C1 == 7 ||
        C1 == 8 ||
        C1 == 9 ||
        C1 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 1 חסר" });

    if (
      !(
        C2 == 4 ||
        C2 == 5 ||
        C2 == 6 ||
        C2 == 7 ||
        C2 == 8 ||
        C2 == 9 ||
        C2 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 2 חסר" });

    if (
      !(
        C3 == 4 ||
        C3 == 5 ||
        C3 == 6 ||
        C3 == 7 ||
        C3 == 8 ||
        C3 == 9 ||
        C3 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 3 חסר" });

    if (
      !(
        C4 == 4 ||
        C4 == 5 ||
        C4 == 6 ||
        C4 == 7 ||
        C4 == 8 ||
        C4 == 9 ||
        C4 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 4 חסר" });

    if (
      !(
        C5 == 4 ||
        C5 == 5 ||
        C5 == 6 ||
        C5 == 7 ||
        C5 == 8 ||
        C5 == 9 ||
        C5 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 5 חסר" });

    if (
      !(
        C6 == 4 ||
        C6 == 5 ||
        C6 == 6 ||
        C6 == 7 ||
        C6 == 8 ||
        C6 == 9 ||
        C6 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 6 חסר" });

    if (
      !(
        C7 == 4 ||
        C7 == 5 ||
        C7 == 6 ||
        C7 == 7 ||
        C7 == 8 ||
        C7 == 9 ||
        C7 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 7 חסר" });

    if (
      !(
        C8 == 4 ||
        C8 == 5 ||
        C8 == 6 ||
        C8 == 7 ||
        C8 == 8 ||
        C8 == 9 ||
        C8 == 10
      )
    )
      return res.status(400).json({ errorMessage: "פרמטר 8 חסר" });

    if (
      !(
        C9 == 4 ||
        C9 == 5 ||
        C9 == 6 ||
        C9 == 7 ||
        C9 == 8 ||
        C9 == 9 ||
        C9 == 10
      )
    ) {
      return res.status(400).json({
        errorMessage: "חסר קריטריון כלשהו",
      });
    }

    if (
      !(
        M1 == 4 ||
        M1 == 5 ||
        M1 == 6 ||
        M1 == 7 ||
        M1 == 8 ||
        M1 == 9 ||
        M1 == 10
      )
    ) {
      return res.status(400).json({
        errorMessage: "חסר ציון מסכם",
      });
    }
    const crewmm: any = await User.findById(CrewM);
    if (
      (crewmm.Dereg === "a" || crewmm.Dereg === "b") &&
      crewmm.SoogHatsava !== "miluim"
    ) {
      if (!(M2 == 0 || M2 == 1 || M2 == 2 || M2 == 3 || M2 == 4)) {
        return res.status(400).json({
          errorMessage: "חסר פוטנציאל להובלה",
        });
      }
    }
    if (!Tp) {
      return res.status(400).json({
        errorMessage: "לא התקבלו יעדים לשיפור",
      });
    }

    if (!Fp) {
      return res.status(400).json({
        errorMessage: "לא התקבל סיכם",
      });
    }

    if (userr.Role === "DIRECT" || userr.Role === "AUTHCO") {
      const hiscomm: any = await User.findById(crewmm.MyComm);
      const hisauth: any = await User.findById(crewmm.MyAuth);

      let lwasMyEvaMA;
      let lwasMyEvaRank;
      let lwasMyEvaLastName;
      let lwasMyEvaFirstName;

      let lwasMyAuthMA;
      let lwasMyAuthRank;
      let lwasMyAuthLastName;
      let lwasMyAuthFirstName;

      if (crewmm.Dereg === "c" || crewmm.Dereg === "d") {
        lwasMyEvaMA = hisauth.MA;
        lwasMyEvaRank = hisauth.Rank;
        lwasMyEvaLastName = hisauth.LastName;
        lwasMyEvaFirstName = hisauth.FirstName;
      } else {
        lwasMyEvaMA = hiscomm.MA;
        lwasMyEvaRank = hiscomm.Rank;
        lwasMyEvaLastName = hiscomm.LastName;
        lwasMyEvaFirstName = hiscomm.FirstName;
        lwasMyAuthMA = hisauth.MA;
        lwasMyAuthRank = hisauth.Rank;
        lwasMyAuthLastName = hisauth.LastName;
        lwasMyAuthFirstName = hisauth.FirstName;
      }

      const wasMyEvaMA = lwasMyEvaMA;
      const wasMyEvaRank = lwasMyEvaRank;
      const wasMyEvaLastName = lwasMyEvaLastName;
      const wasMyEvaFirstName = lwasMyEvaFirstName;

      const wasMyAuthMA = lwasMyAuthMA;
      const wasMyAuthRank = lwasMyAuthRank;
      const wasMyAuthLastName = lwasMyAuthLastName;
      const wasMyAuthFirstName = lwasMyAuthFirstName;

      const wasRank = crewmm.Rank;
      const wasDereg = crewmm.Dereg;
      const wasMaslool = crewmm.Maslool;
      const wasSoogHatsava = crewmm.SoogHatsava;
      const wasUnit = crewmm.Unit;
      const fillDate = new Date(
        gfillDate.substring(3, 5) +
          "/" +
          gfillDate.substring(0, 2) +
          "/" +
          gfillDate.substring(6, gfillDate.length) +
          "Z"
      );
      const Signed = gSigned === "כן";
      if (
        (crewmm.MyComm && crewmm.MyComm.toString()) === userr._id.toString() ||
        crewmm.MyAuth.toString() === userr._id.toString()
      ) {
        if ((await Opinion.findOne({ CrewM: crewmm, Tkufa: Tkufa })) === null) {
          let lnewOpinion;
          if (crewmm.Dereg === "a" || crewmm.Dereg === "b")
            lnewOpinion = new Opinion({
              CrewM,
              Signed,
              Tkufa,
              fillDate,
              MonthsNo,
              Position,
              wasRank,
              wasDereg,
              wasMaslool,
              wasSoogHatsava,
              wasUnit,
              wasMyEvaMA,
              wasMyEvaRank,
              wasMyEvaLastName,
              wasMyEvaFirstName,
              wasMyAuthMA,
              wasMyAuthRank,
              wasMyAuthLastName,
              wasMyAuthFirstName,
              C1,
              C2,
              C3,
              C4,
              C5,
              C6,
              C7,
              C8,
              C9,
              M1,
              M2,
              Tp,
              Fp,
            });
          else
            lnewOpinion = new Opinion({
              CrewM,
              Signed,
              Tkufa,
              fillDate,
              MonthsNo,
              Position,
              wasRank,
              wasDereg,
              wasMaslool,
              wasSoogHatsava,
              wasUnit,
              wasMyEvaMA,
              wasMyEvaRank,
              wasMyEvaLastName,
              wasMyEvaFirstName,
              C1,
              C2,
              C3,
              C4,
              C5,
              C6,
              C7,
              C8,
              C9,
              M1,
              M2,
              Tp,
              Fp,
            });

          const newOpinion = lnewOpinion;

          const savedOpinion = await newOpinion.save();

          res.json(savedOpinion);
        } else
          return res.status(400).json({
            errorMessage: "כבר קיים חווד לתקופה זו, ערוך אותו",
          });
      } else
        return res.status(401).json({
          errorMessage:
            "ניסיתי לעדכן חווד של פקוד בגף אך אינך מפקד גף או יחידה שלו",
        });
    } else {
      return res.status(401).json({
        errorMessage: "ניסיתי לעדכן חווד של פקוד בגף אך אינך מפקד בכללי",
      });
    }
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.get("/getmyavgs/", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr: any = await User.findById((validatedUser as any).user);

    const gafusers = await User.find({
      Unit: userr.Unit,
      Maslool: userr.Maslool,
    });
    const courseusers = await User.find({ CourseNo: userr.CourseNo });

    let gafopinions = [];
    let courseopinions = [];

    //  let resses = [];
    //  let ress;
    //  let emptyres;

    // for (
    //  let j = 4000;
    //  j < 6000;
    //  j++ // כי אלף שנים בעיניך כיום אתמול כי יעבר ואשמורה בלילה
    // ) {
    for (let i = 0; i < gafusers.length; i++)
      gafopinions.push(
        await Opinion.find({
          CrewM: gafusers[i]._id,
        })
      );

    for (let i = 0; i < courseusers.length; i++)
      courseopinions.push(
        await Opinion.find({
          CrewM: courseusers[i]._id,
        })
      );

    //gafopinions = gafopinions.filter((val) => val !== null && val !== []);
    //courseopinions = courseopinions.filter((val) => val !== null && val !== []);

    let gafbytkufa = [];
    let coursebytkufa = [];
    let ttkufa = 0;
    let temp: any = 0;
    while (gafopinions.length > 0) {
      ttkufa = gafopinions[0][0] && gafopinions[0][0].Tkufa;
      for (let i = 0; i < gafopinions.length; i++) {
        for (let j = 0; j < gafopinions.length; j++) {
          if (
            gafopinions[i] &&
            gafopinions[i][j] &&
            gafopinions[i][j].Tkufa === ttkufa
          ) {
            temp = gafopinions[i][j];
            gafopinions[i].splice(j, 1);
            gafbytkufa.push({ tkufa: ttkufa, opinion: temp });
          }
        }
      }
      if (gafopinions[0].length === 0) gafopinions.splice(0, 1);
    }

    while (courseopinions.length > 0) {
      ttkufa = courseopinions[0][0] && courseopinions[0][0].Tkufa;
      for (let i = 0; i < courseopinions.length; i++) {
        for (let j = 0; j < courseopinions.length; j++) {
          if (
            courseopinions[i] &&
            courseopinions[i][j] &&
            courseopinions[i][j].Tkufa === ttkufa
          ) {
            temp = courseopinions[i][j];
            courseopinions[i].splice(j, 1);
            coursebytkufa.push({ tkufa: ttkufa, opinion: temp });
          }
        }
      }
      if (courseopinions[0].length === 0) courseopinions.splice(0, 1);
    }

    let bettergaf = [];
    let inner;

    let currentt = 0;
    while (gafbytkufa.length > 0) {
      inner = [];
      currentt = gafbytkufa[0].tkufa;
      while (gafbytkufa[0] && currentt === gafbytkufa[0].tkufa) {
        inner.push(gafbytkufa[0].opinion);
        gafbytkufa.splice(0, 1);
      }
      bettergaf.push({ Tkufa: currentt, OpinionArray: inner });
    }

    let bettercourse = [];

    currentt = 0;
    while (coursebytkufa.length > 0) {
      inner = [];
      currentt = coursebytkufa[0].tkufa;
      while (coursebytkufa[0] && currentt === coursebytkufa[0].tkufa) {
        inner.push(coursebytkufa[0].opinion);
        coursebytkufa.splice(0, 1);
      }
      bettercourse.push({ Tkufa: currentt, OpinionArray: inner });
    }

    let gafopinionscsonly;
    let gapi;
    let gafavgsbytkufot = [];

    for (let k = 0; k < bettergaf.length; k++) {
      gafopinionscsonly = [];

      for (let i = 0; i < bettergaf[k].OpinionArray.length; i++)
        gafopinionscsonly.push({
          c1: bettergaf[k].OpinionArray[i].C1,
          c2: bettergaf[k].OpinionArray[i].C2,
          c3: bettergaf[k].OpinionArray[i].C3,
          c4: bettergaf[k].OpinionArray[i].C4,
          c5: bettergaf[k].OpinionArray[i].C5,
          c6: bettergaf[k].OpinionArray[i].C6,
          c7: bettergaf[k].OpinionArray[i].C7,
          c8: bettergaf[k].OpinionArray[i].C8,
          c9: bettergaf[k].OpinionArray[i].C9,
          c10: bettergaf[k].OpinionArray[i].M1,
        });

      gapi = {
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 0,
        c5: 0,
        c6: 0,
        c7: 0,
        c8: 0,
        c9: 0,
        c10: 0,
      };

      for (let i = 0; i < gafopinionscsonly.length; i++)
        gapi = {
          c1: gapi.c1 + gafopinionscsonly[i].c1,
          c2: gapi.c2 + gafopinionscsonly[i].c2,
          c3: gapi.c3 + gafopinionscsonly[i].c3,
          c4: gapi.c4 + gafopinionscsonly[i].c4,
          c5: gapi.c5 + gafopinionscsonly[i].c5,
          c6: gapi.c6 + gafopinionscsonly[i].c6,
          c7: gapi.c7 + gafopinionscsonly[i].c7,
          c8: gapi.c8 + gafopinionscsonly[i].c8,
          c9: gapi.c9 + gafopinionscsonly[i].c9,
          c10: gapi.c10 + gafopinionscsonly[i].c10,
        };

      gapi = {
        c1: gapi.c1 / gafopinionscsonly.length,
        c2: gapi.c2 / gafopinionscsonly.length,
        c3: gapi.c3 / gafopinionscsonly.length,
        c4: gapi.c4 / gafopinionscsonly.length,
        c5: gapi.c5 / gafopinionscsonly.length,
        c6: gapi.c6 / gafopinionscsonly.length,
        c7: gapi.c7 / gafopinionscsonly.length,
        c8: gapi.c8 / gafopinionscsonly.length,
        c9: gapi.c9 / gafopinionscsonly.length,
        c10: gapi.c10 / gafopinionscsonly.length,
      };

      gafavgsbytkufot.push({ Tkufa: bettergaf[k].Tkufa, avg: gapi });
    }

    let courseopinionscsonly;
    let cursi;
    let courseavgsbytkufot = [];

    for (let k = 0; k < bettercourse.length; k++) {
      courseopinionscsonly = [];

      for (let i = 0; i < bettercourse[k].OpinionArray.length; i++)
        courseopinionscsonly.push({
          c1: bettercourse[k].OpinionArray[i].C1,
          c2: bettercourse[k].OpinionArray[i].C2,
          c3: bettercourse[k].OpinionArray[i].C3,
          c4: bettercourse[k].OpinionArray[i].C4,
          c5: bettercourse[k].OpinionArray[i].C5,
          c6: bettercourse[k].OpinionArray[i].C6,
          c7: bettercourse[k].OpinionArray[i].C7,
          c8: bettercourse[k].OpinionArray[i].C8,
          c9: bettercourse[k].OpinionArray[i].C9,
          c10: bettercourse[k].OpinionArray[i].M1,
        });

      cursi = {
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 0,
        c5: 0,
        c6: 0,
        c7: 0,
        c8: 0,
        c9: 0,
        c10: 0,
      };

      for (let i = 0; i < courseopinionscsonly.length; i++)
        cursi = {
          c1: cursi.c1 + courseopinionscsonly[i].c1,
          c2: cursi.c2 + courseopinionscsonly[i].c2,
          c3: cursi.c3 + courseopinionscsonly[i].c3,
          c4: cursi.c4 + courseopinionscsonly[i].c4,
          c5: cursi.c5 + courseopinionscsonly[i].c5,
          c6: cursi.c6 + courseopinionscsonly[i].c6,
          c7: cursi.c7 + courseopinionscsonly[i].c7,
          c8: cursi.c8 + courseopinionscsonly[i].c8,
          c9: cursi.c9 + courseopinionscsonly[i].c9,
          c10: cursi.c10 + courseopinionscsonly[i].c10,
        };
      cursi = {
        c1: cursi.c1 / courseopinionscsonly.length,
        c2: cursi.c2 / courseopinionscsonly.length,
        c3: cursi.c3 / courseopinionscsonly.length,
        c4: cursi.c4 / courseopinionscsonly.length,
        c5: cursi.c5 / courseopinionscsonly.length,
        c6: cursi.c6 / courseopinionscsonly.length,
        c7: cursi.c7 / courseopinionscsonly.length,
        c8: cursi.c8 / courseopinionscsonly.length,
        c9: cursi.c9 / courseopinionscsonly.length,
        c10: cursi.c10 / courseopinionscsonly.length,
      };

      courseavgsbytkufot.push({ Tkufa: bettercourse[k].Tkufa, avg: cursi });
    }

    // if (j === 2000) {
    //   emptyres = ress;
    //    resses.push(ress);
    //  } else if (ress !== emptyres) resses.push(ress);
    //   }

    res.json({ gapi: gafavgsbytkufot, cursi: courseavgsbytkufot });
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

export default router;
