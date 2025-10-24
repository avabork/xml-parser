# XML Parser Dashboard

A full-stack MERN (MongoDB, Express, React, Node.js) application built to upload, parse, and analyze any XML file.

This application features a smart parser that:
1.  **Analyzes Credit Reports:** Specifically identifies and extracts detailed data from Experian credit report XMLs [cite: 14-35], displaying a full financial summary.
2.  **Handles Generic XML:** Gracefully parses *any other* valid XML file (e.g., book catalogs, employee lists) and displays the raw JSON structure, preventing errors.

## Features

* **File Upload:** Upload any `.xml` file.
* **Smart Parsing:** Automatically detects if the file is a known credit report format or a generic XML.
* [cite_start]**Detailed Dashboard:** For credit reports, the homepage shows a detailed breakdown of basic details, credit score, and account summaries [cite: 15-35].
* **Generic JSON Viewer:** For all other XMLs, a clean, formatted JSON tree is displayed.
* **Report History:** A separate page to view all previously uploaded files.
* **Delete Reports:** Remove any report from the database.
* **Professional UI:** A responsive, multi-page layout built for a clean, enterprise-grade user experience.

## Tech Stack

* **Frontend:** React, React Router
* **Backend:** Node.js, Express
* **Database:** MongoDB (using Mongoose)
* **Parsing:** `multer` for file handling, `xml2js` for XML parsing

---

## How to Set Up and Run

### Prerequisites

* Node.js (v18 or later)
* npm
* MongoDB Atlas Account (or a local MongoDB instance)

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory.
    * You **must** add your MongoDB connection string:
    ```env
    MONGO_URI=your_mongodb_connection_string_here
    PORT=5001
    ```

4.  **Run the backend server:**
    ```sh
    npm start
    ```
    The server will be running on `http://localhost:5001`.

### 2. Frontend Setup

1.  **Open a new terminal** and navigate to the frontend directory:
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the React development server:**
    ```sh
    npm start
    ```
    The React app will open in your browser at `http://localhost:3000`.

### 3. Using the Application

1.  Open `http://localhost:3000` in your browser.
2.  Use the upload form on the **Dashboard** page to select an XML file.
3.  The file will be processed, and the "Most Recent Report" section will update.
4.  Navigate to the **Report History** page to see a list of all your uploads.
