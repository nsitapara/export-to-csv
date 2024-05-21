import axios from 'axios';

async function testExportEndpoint() {
    const email = 'nsitapara@gmail.com';
    const url = `http://localhost:3000/export?email=${encodeURIComponent(email)}`;

    try {
        // Make a GET request to the export endpoint
        const response = await axios.get(url, { responseType: 'blob' });
        console.log('CSV file downloaded successfully');

        // Save the CSV file locally
        const fs = require('fs');
        const path = require('path');
        const filePath = path.resolve('downloaded_expenses.csv');
        fs.writeFileSync(filePath, response.data);
        console.log(`File saved to ${filePath}`);
    } catch (error: any) {
        // Handle any errors that occur during the request
        console.error('Error calling export endpoint:', error.message);
    }
}

// Call the test function
testExportEndpoint();