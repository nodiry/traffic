# Traffic Server for Web Analytics

This project is part of a web analytics platform that collects and stores website traffic data in real-time. The **Traffic Server** listens for incoming HTTP requests, processes the data, and stores it in a **MongoDB database** for later analysis.

## Features

- Tracks website traffic on a per-session basis.
- Collects the following data:
  - Page URL
  - Referrer URL
  - User-Agent (to detect device type)
  - IP address
  - Session ID
  - Device type (desktop, mobile, tablet)
  - Load time of the page
  - Country information (optional)
  - Timestamp of the request
- Uses MongoDB to store the analytics data.
- Built with **Bun** runtime for fast execution.

## Requirements

Before starting, ensure you have the following installed:
- **Bun**: [Bun Installation Guide](https://bun.sh/)
- **MongoDB**: You can either use a local instance or a cloud provider like MongoDB Atlas.

## Setup and Installation

Follow these steps to set up and run the Traffic Server.

1. **Clone this repository**:

   ```bash
   git clone https://github.com/yourusername/traffic-server.git
   cd traffic-server


Install dependencies using Bun:

bash
Copy
Edit
bun install
Configure your MongoDB connection:

Open config/config.js.

Modify the db field with your MongoDB connection string (if using MongoDB Atlas or a local instance).

Example for local MongoDB:

javascript
Copy
Edit
const config = {
  db: "mongodb://localhost/Analytics"
};
Start the Traffic Server:

bash
Copy
Edit
bun start
The server will be up and running on http://localhost:3000 (or the port specified in your environment).

Explanation of Traffic Server Code
The Traffic Server performs several key actions:

1. MongoDB Initialization
MongoDB is used to store tracking data. The MongoClient is used to connect to the database, and the tracks collection is used for storing the traffic data.
2. Get Device Type Function
The function getDeviceType analyzes the User-Agent header to determine if the request comes from a mobile, tablet, or desktop.
3. Bun Server Initialization
The Bun server is started with serve, which listens for HTTP requests (default on port 3000, or another port defined in your environment). It responds to POST requests made to /track/:unique.
4. Tracking Route
The server listens for POST requests at the /track/:unique route, where unique is a key used to identify the event being tracked.
The server expects the following data in the request body:
url: The page being tracked.
referrer: The referrer URL.
userAgent: The User-Agent string.
loadTime: The time it took for the page to load.
session_id: A unique identifier for the session.
deviceType: The type of device (mobile, tablet, desktop).
country: Optional country information.
The data is inserted into the MongoDB database.
5. Error Handling
If an error occurs, it's logged, and a 500 Internal Server Error response is returned. On success, a success message is returned.
Usage
The Traffic Server listens for POST requests to track traffic. You can send the tracking data to the server using the following API endpoint.

Endpoint:
POST /track/:unique
Request Body
The request body should include the following fields:

json
Copy
Edit
{
  "url": "https://example.com",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "loadTime": 2.5,
  "session_id": "session12345",
  "deviceType": "mobile",
  "country": "US"
}
url: The page URL being tracked (e.g., https://example.com).
referrer: The referrer URL (e.g., https://google.com).
userAgent: The User-Agent string from the browser (optional, will default to the header if not provided).
loadTime: The time it took to load the page (in seconds).
session_id: A unique identifier for the user's session.
deviceType: The device type (mobile, tablet, or desktop).
country: Optional field to store the country (can be obtained via IP geolocation).
Example Request
You can use curl to send a request to the server:

bash
Copy
Edit
curl -X POST http://localhost:3000/track/uniqueKey -H "Content-Type: application/json" -d '{
  "url": "https://example.com",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "loadTime": 2.5,
  "session_id": "session12345",
  "deviceType": "mobile",
  "country": "US"
}'
Response
Success: The server will return a success message.

json
Copy
Edit
{
  "message": "Tracking data stored"
}
Error: If an error occurs, the server will return an error message.

json
Copy
Edit
{
  "error": "Internal server error"
}
Troubleshooting
1. MongoDB Connection Issues
Ensure that MongoDB is running locally or that you have configured the correct connection string in config/config.js. You can check if your MongoDB service is running and accessible from the application.

2. Port Conflicts
If the server fails to start, make sure the port is available. You can change the port by setting the PORT environment variable.

bash
Copy
Edit
PORT=4000 bun start
3. Missing Dependencies
If there are any missing dependencies, try re-installing them:

bash
Copy
Edit
bun install
License
This project is licensed under the Apache License, Version 2.0. See LICENSE for more details.

markdown
Copy
Edit

---

### Key Sections of the README:
1. **Overview** - Describes the Traffic Server and what it does.
2. **Setup and Installation** - Explains how to set up the server and dependencies.
3. **Code Explanation** - Walks through the key parts of the Traffic Server code.
4. **Usage** - Details the API endpoint and how to send tracking data.
5. **Troubleshooting** - Common issues and how to resolve them.
6. **License** - Information about the project license.

This should help users quickly get started with the Traffic Server, understand how it works, and use it effectively. Let me know if you need anything else!