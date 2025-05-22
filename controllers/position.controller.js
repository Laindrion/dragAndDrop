import db from "../models/index.js";

const Poisition = db.country;

export const getPositions = async (req, res) => {
   const positions = await Poisition.findAll();
   res.json(positions);
}

export const addPosition = async (res, req) => {
   const { name } = req.body;
   const newPosition = await Poisition.create({ name });
   res.status(201).json(newPosition);
}