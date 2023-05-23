import express from "express";

import jwt from "jsonwebtoken";

import Mofa from "../models/mofaModel";
import User from "../models/userModel";

const router = express.Router();

router.get("/getallmy", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr = await User.findById((validatedUser as any).user);

    const mofas = await Mofa.find({ CrewM: userr, IsDeleted: false });

    for (let i = 0; i < mofas.length; i++)
      mofas[i].name = (userr as any).NickName;

    res.json(mofas);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/checknum/:u/:ma", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr = await User.findById((validatedUser as any).user);
    const userr2 = await User.find({ MA: req.params.ma });

    const mofas = await Mofa.find({ CrewM: userr2[0]._id, Emda: req.params.u });

    console.log(mofas.length);

    res.json({ a: mofas.length });
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/getallhis/:ma", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr = await User.find({ MA: req.params.ma });

    const mofas = await Mofa.find({ CrewM: userr, IsDeleted: false });

    for (let i = 0; i < mofas.length; i++)
      mofas[i].name = (userr as any).NickName;
    const userr2: any = await User.findById((validatedUser as any).user);

    for (let i = 0; i < mofas.length; i++) {
      if (
        !(
          userr2.Role === "AUTHCO" ||
          userr2.Role === "DIRECT" ||
          userr2.Role === "SCHOOL"
        ) &&
        !(
          mofas[i].Emda === "מלא''מ - הגנ''ש" ||
          mofas[i].Emda === "מלא''מ - בת''ק" ||
          mofas[i].Emda === "מלא''מ - עומק" ||
          mofas[i].Emda === "שמ''כ - מתארים" ||
          mofas[i].Emda === "שמ''כ - יירוט" ||
          mofas[i].Emda === "שמ''כ - בת''ק"
        ) &&
        userr2.MA !== (mofas as any).sMA
      ) {
        mofas.splice(i, 1);
        i--;
      }
    }

    res.json(mofas);
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/createmofa", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const {
      isTest,
      isPass,
      fillDatep,
      CrewM,
      name,
      MadName,
      Emda,
      No,
      X11,
      X12,
      X13,
      X21,
      X22,
      X23,
      C1,
      C2,
      C3,
      C4,
      C5,
      C55,
      C6,
      C7,
      C8,
      C9,
      M1,
      M11,
      M21,
      Mf,
    } = req.body;

    if (!CrewM) {
      return res.status(400).json({
        errorMessage: "של מי המופע?",
      });
    }

    if (!fillDatep) {
      return res.status(400).json({
        errorMessage: "מתי הוזן המופע?",
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
        C55 == 4 ||
        C55 == 5 ||
        C55 == 6 ||
        C55 == 7 ||
        C55 == 8 ||
        C55 == 9 ||
        C55 == 10
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

    if (M1 < 7 && isPass)
      return res
        .status(400)
        .json({ errorMessage: "לא ניתן להעביר מבחן עם ציון מסכם נמוך מממוצע" });

    const fillDate = new Date(
      fillDatep.substring(3, 5) +
        "/" +
        fillDatep.substring(0, 2) +
        "/" +
        fillDatep.substring(6, fillDatep.length) +
        "Z"
    );
    const IsDeleted = false;

    const sMA = CrewM.MA;
    const sFirstName = CrewM.FirstName;
    const sLastName = CrewM.LastName;
    const sNickName = CrewM.NickName;
    const sCourseNo = CrewM.CourseNo;
    const sMaslool = CrewM.Maslool;
    const sUnit = CrewM.Unit;

    const newmofa = new Mofa({
      sMA,
      sFirstName,
      sLastName,
      sNickName,
      sCourseNo,
      sMaslool,
      sUnit,
      isTest,
      isPass,
      fillDate,
      CrewM,
      name,
      MadName,
      Emda,
      No,
      X11,
      X12,
      X13,
      X21,
      X22,
      X23,
      C1,
      C2,
      C3,
      C4,
      C5,
      C55,
      C6,
      C7,
      C8,
      C9,
      M1,
      M11,
      M21,
      Mf,
      IsDeleted,
    });

    const savednewmofa = await newmofa.save();

    res.json(savednewmofa);
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr = await User.findById((validatedUser as any).user);

    const mofa = await Mofa.findById(req.params.id);

    const c6 = (mofa as any).C6;

    //const ress = await mofa.delete();
    (mofa as any).IsDeleted = true;
    const ress = await (mofa as any).save();

    res.json(c6 === ress.C6 ? { res: "asd" } : { res: "problem" });
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/getallmyn", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const mander: any = await User.findById((validatedUser as any).user);

    const allmofas = await Mofa.find({ IsDeleted: false });

    let allresmofas = new Array();
    let manded;

    for (let i = 0; i < allmofas.length; i++) {
      manded = await User.findById(allmofas[i].CrewM);
      if ((mander as any).Role === "DIRECT")
        if (
          (manded &&
            manded.MyComm &&
            manded.MyComm.toString() === (mander as any)._id.toString()) ||
          (manded as any).MA === (mander as any).MA
        )
          allresmofas.push(allmofas[i]);
      if ((mander as any).Role === "SCHOOL")
        if (
          (manded &&
            manded.MyTutor &&
            manded.MyTutor.toString() === (mander as any)._id.toString()) ||
          (manded as any).MA === (mander as any).MA
        )
          allresmofas.push(allmofas[i]);
      if ((mander as any).Role === "S420")
        if (
          allmofas[i].Emda === "מלא''מ - הגנ''ש" ||
          allmofas[i].Emda === "מלא''מ - בת''ק" ||
          allmofas[i].Emda === "מלא''מ - עומק" ||
          allmofas[i].Emda === "שמ''כ - מתארים" ||
          allmofas[i].Emda === "שמ''כ - יירוט" ||
          allmofas[i].Emda === "שמ''כ - בת''ק"
        )
          allresmofas.push(allmofas[i]);
    }

    res.json(allresmofas);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

export default router;
