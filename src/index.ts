import express from "express";
import axios from "axios";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;
app.use(cors());

// Endpoint to export expenses to CSV
app.get("/export", async (req, res) => {
  const email = req.query.email as string;
  if (!email) {
    return res.status(400).send("Email query parameter is required");
  }

  // Construct the API URL with the provided email
  const apiUrl = `${
    process.env.SUPABASE_API_URL
  }?split_by=cs.{"${encodeURIComponent(email)}"}&select=*&order=expense_id.asc`;
  const headers = {
    apikey: process.env.SUPABASE_API_KEY,
    Authorization: process.env.SUPABASE_AUTH_TOKEN,
  };

  try {
    // Fetch data from the API
    console.log(`Fetching data from API: ${apiUrl}`);
    const response = await axios.get(apiUrl, { headers });
    const data = response.data;

    if (data.length === 0) {
      console.log("No expenses found for the given email");
      return res.status(404).send("No expenses found for the given email");
    }

    console.log("Data fetched successfully from API");
    // Create CSV writer with dynamic headers
    const csvWriter = createObjectCsvWriter({
      path: "output.csv",
      header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
    });

    // Write data to CSV file
    console.log("Writing data to CSV file");
    await csvWriter.writeRecords(data);

    const filePath = path.resolve("output.csv");
    console.log(`CSV file created at ${filePath}`);
    // Send the CSV file as a response
    res.download(filePath, "expenses.csv", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending file");
      } else {
        console.log("CSV file sent successfully");
      }
      // Delete the file after sending it
      fs.unlinkSync(filePath);
      console.log("CSV file deleted after sending");
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(port, () => {
  console.log(`Expense to CSV Microservice listening at http://localhost:${port}`);
});
