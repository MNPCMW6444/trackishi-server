import express from "express";

import jwt from "jsonwebtoken";

import Mm from "../models/mmModel";
import User from "../models/userModel";

const router = express.Router();

async function addFudsTomm(themm: any) {
  let josnres = themm.toJSON();
  const screww = await User.findById(josnres.CrewM);
  josnres.CrewM = screww;
  const commm = await User.findById(josnres.Commander);
  josnres.Commander = commm;
  const authh = await User.findById(josnres.Authorizer);
  josnres.Authorizer = authh;
  return josnres;
}

router.get("/allMMs/:uid", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr = await User.findById((validatedUser as any).user);

    const mms = await Mm.find({ who: req.params.uid });

    for (let i = 0; i < mms.length; i++) mms[i] = await addFudsTomm(mms[i]);

    res.json(mms);
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/true", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr = await User.findById((validatedUser as any).user);

    const { when, what, how } = req.body;

    const newMM = new Mm({ when, what, how });

    const savedMM = newMM.save();

    res.json(savedMM);
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/false", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ errorMessage: "אינך מחובר" });

    const validatedUser = jwt.verify(token, process.env.JWTSECRET as any);

    const userr = await User.findById((validatedUser as any).user);

    if (!userr) return res.status(400).json({ errorMessage: "not logged in" });

    const { when, prof, of, image } = req.body;

    const newMM = new Mm({ when, prof, of, image });

    const savedMM = newMM.save();

    res.json(savedMM);
  } catch (err) {
    res.status(500).send();
  }
});

export default router;
