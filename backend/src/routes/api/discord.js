const express = require("express");
const router = express.Router();
const Submission = require("../../models/Submission");

router.get("/", async (req, res) => {
  const submissions = await Submission.findAll({
    attributes: ["id", "username", "url", "createdAt", "isWinner"],
  }).catch(errHandler);
  res.json(submissions);
});

// Helpers
const errHandler = (err) => {
  console.log("Error: ", err);
};

module.exports = router;
