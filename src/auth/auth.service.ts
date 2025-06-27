import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../db/UserModel";
import { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function signup(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ error: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, passwordHash });

  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
  return res.json({ token, user: { id: user._id, username: user.username } });
}

export async function signin(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
  return res.json({ token, user: { id: user._id, username: user.username } });
}
