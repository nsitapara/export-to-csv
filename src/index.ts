import express from 'express';
import axios from 'axios';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Endpoint to export expenses to CSV
app.get('/export', async (req, res) => {
    const email = req.query.email as string;
    if (!email) {
        return res.status(400).send('Email query parameter is required');
    }

    // Construct the API URL with the provided email
    const apiUrl = `https://rleiwozkpxmcixddttwa.supabase.co/rest/v1/expenses?split_by=cs.{"${encodeURIComponent(email)}"}&select=*&order=expense_id.asc`;
    const headers = {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZWl3b3prcHhtY2l4ZGR0dHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3NTgyMzYsImV4cCI6MjAyOTMzNDIzNn0.A9mnK_A4MVIDBLMD3vNf_yIZKQ4pNJKZziXt9hT6zHU',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZWl3b3prcHhtY2l4ZGR0dHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3NTgyMzYsImV4cCI6MjAyOTMzNDIzNn0.A9mnK_A4MVIDBLMD3vNf_yIZKQ4pNJKZziXt9hT6zHU'
    };

    try {
        // Fetch data from the API
        console.log(`Fetching data from API: ${apiUrl}`);
        const response = await axios.get(apiUrl, { headers });
        const data = response.data;

        if (data.length === 0) {
            console.log('No expenses found for the given email');
            return res.status(404).send('No expenses found for the given email');
        }

        console.log('Data fetched successfully from API');
        // Create CSV writer with dynamic headers
        const csvWriter = createObjectCsvWriter({
            path: 'output.csv',
            header: Object.keys(data[0]).map(key => ({ id: key, title: key })),
        });

        // Write data to CSV file
        console.log('Writing data to CSV file');
        await csvWriter.writeRecords(data);

        const filePath = path.resolve('output.csv');
        console.log(`CSV file created at ${filePath}`);
        // Send the CSV file as a response
        res.download(filePath, 'expenses.csv', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            } else {
                console.log('CSV file sent successfully');
            }
            // Delete the file after sending it
            fs.unlinkSync(filePath); 
            console.log('CSV file deleted after sending');
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Microservice listening at http://localhost:${port}`);
});