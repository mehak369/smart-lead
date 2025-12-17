const express = require("express");
const axios = require("axios");
const Lead = require("../models/Lead");

const router = express.Router();

router.post("/batch", async (req, res) => {
  try {
    let { names } = req.body;

    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ message: "Names array required" });
    }

    // clean input
    names = names.map(n => n.trim()).filter(n => n.length > 0);

    // prepare API calls
    const apiCalls = names.map(name =>
      axios.get(`https://api.nationalize.io?name=${name}`)
    );

    // execute all calls in parallel
    const responses = await Promise.all(apiCalls);

    // process results
    const leadsToSave = responses.map((response, index) => {
      const name = names[index];
      const countryData = response.data.country[0];

      let country = "Unknown";
      let probability = 0;

      if (countryData) {
        country = countryData.country_id;
        probability = countryData.probability;
      }

      const status = probability >= 0.6 ? "Verified" : "To Check";

      return {
        name,
        country,
        probability,
        status,
        syncedToCRM: false
      };
    });

    // save to DB
    const savedLeads = await Lead.insertMany(leadsToSave);

    res.json(savedLeads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
