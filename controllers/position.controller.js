import db from "../models/index.js";
const Position = db.position;

export const getPositions = async (req, res) => {
   const positions = await Position.findAll();
   res.json(positions);
}

export const addPosition = async (req, res) => {
   const { name } = req.body;

   const existing = await Position.findOne({ where: { name } })
   if (existing) {
      throw new Error("The position already exists");
   }

   const newPosition = await Position.create({ name });
   res.status(201).json(newPosition);
}

export const updatePosition = async (req, res) => {
   const { id } = req.params;
   const { name } = req.body;

   const position = await Position.findByPk(id);
   if (!position) res.status(404).json({ message: "Position not found" });


   position.name = name;
   await position.save();

   res.json({ message: "Position updated", position });
}

export const deletePosition = async (req, res) => {
   const { id } = req.params;

   const deleted = await Position.destroy({ where: { id } });
   if (!deleted) return res.status(404).json({ message: "Position not found" });

   res.json({ message: "Position deleted" });
}