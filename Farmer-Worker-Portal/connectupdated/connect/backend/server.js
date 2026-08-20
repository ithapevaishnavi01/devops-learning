const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/agriconnect";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Job Schema
const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  wage: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Open",
  },
});

const Job = mongoose.model("Job", jobSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Farmer Worker Portal Backend Running...");
});

// GET All Jobs
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching jobs",
      error: err.message,
    });
  }
});

// POST New Job
app.post("/jobs", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();

    res.status(201).json({
      message: "Job posted successfully",
      job,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error posting job",
      error: err.message,
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
