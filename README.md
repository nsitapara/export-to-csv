# Export to CSV Microservice

## Communication Contract

### Requesting Data

To request data from the microservice, make a GET request to the `/export` endpoint with the `email` query parameter.

**Example Request:**
curl "http://localhost:3000/export?email=nsitapara@gmail.com"


### Receiving Data

The microservice responds with a downloadable CSV file containing the requested data. The file is named `expenses.csv`.

**Example Response Handling:**
```
import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function testExportEndpoint() {
    const email = 'nsitapara@gmail.com';
    const url = `http://localhost:3000/export?email=${encodeURIComponent(email)}`;

    try {
        const response = await axios.get(url, { responseType: 'blob' });
        const filePath = path.resolve('downloaded_expenses.csv');
        fs.writeFileSync(filePath, response.data);
        console.log(`File saved to ${filePath}`);
    } catch (error) {
        console.error('Error calling export endpoint:', error.message);
    }
}

testExportEndpoint();
```

### UML Sequence Diagram

![UML Sequence Diagram](path/to/your/uml-diagram.png)

1. **Client** sends a GET request to `/export` with the `email` query parameter.
2. **Microservice** fetches data from the Supabase API.
3. **Microservice** converts the data to a CSV file.
4. **Microservice** sends the CSV file as a response.
5. **Client** receives and saves the CSV file.

### Running the Microservice

1. **Install Dependencies:**
npm install

2. **Start the Microservice:**
npx ts-node src/index.ts


3. **Run the Test Script:**
npx ts-node src/test.ts


This README provides clear instructions for requesting and receiving data from the microservice, along with an example call and a UML sequence diagram.
