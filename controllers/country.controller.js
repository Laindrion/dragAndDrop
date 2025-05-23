import db from "../models/index.js";
const Country = db.country;

export const getCountries = async (req, res) => {
   const countries = await Country.findAll();
   res.json(countries);
}

export const addCountry = async (req, res) => {
   const { name } = req.body;
   const newCountry = await Country.create({ name });
   res.status(201).json(newCountry);
}


export const updateCountry = async (req, res) => {
   const { id } = req.params;
   const { name } = req.body;

   const country = await Country.findByPk(id);
   if (!country) res.status(404).json({ message: "Country not found" });


   country.name = name;
   await country.save();

   res.json({ message: "Country updated", country });
}

export const deleteCountry = async (req, res) => {
   const { id } = req.params;

   const deleted = await Country.destroy({ where: { id } });
   if (!deleted) return res.status(404).json({ message: "Country not found" });

   res.json({ message: "Country deleted" });
}