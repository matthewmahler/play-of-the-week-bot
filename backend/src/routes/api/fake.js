const express = require("express");
const router = express.Router();
const Submission = require("../../models/Submission");
const faker = require("faker");

router.get("/", async (req, res) => {
  const newSubmission = {
    username: faker.internet.userName(),
    id: faker.random.number(1000000000),
    url: faker.internet.url(),
    createdAt: faker.date.between("07/23/2021", "2022-06-23"),
  };

  const submission = await Submission.create(newSubmission).catch(errHandler);

  if (submission) {
    res.json(submission);
  } else {
    res.status(500).json({ msg: "internal db error occoured" });
  }
});

// Helpers
const errHandler = (err) => {
  console.log("Error: ", err);
};

module.exports = router;
