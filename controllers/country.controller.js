import db from "../models/index.js";

const Country = db.country;

export const getCountries = async (req, res) => {
   const countries = await Country.findAll();
   res.json(countries);
}

export const addCountry = async (res, req) => {
   const { name } = req.body;
   const newCountry = await Country.create({ name });
   res.status(201).json(newCountry);
}