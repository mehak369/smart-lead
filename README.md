# Smart Lead Automation System

## Overview

The **Smart Lead Automation System** is a full-stack web application that simulates a real-world lead enrichment and automation workflow. The system accepts a batch of names, enriches them using a third-party API, applies business rules to determine lead quality, stores the processed data, and runs a background automation to sync verified leads to a simulated CRM system.

This project is designed to demonstrate skills in **API integration, asynchronous batch processing, backend business logic, data persistence, automation using background jobs, and frontend data visualization**.

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* JavaScript (ES6+)

### Backend

* Node.js
* Express.js
* MongoDB (MongoDB Atlas)
* Mongoose
* Axios
* node-cron

### Deployment

* Backend: Render
* Frontend: Netlify

---

## Live URLs

* **Frontend:** https://smart-lead-task.netlify.app/
* **Backend API:** [https://smart-lead-muog.onrender.com](https://smart-lead-muog.onrender.com)
---

## Features

### 1. Batch Lead Input

* Users can submit a batch of first names separated by commas.
* Example:

  ```
  Peter, Aditi, Ravi, Satoshi
  ```

### 2. Lead Enrichment

* Each name is enriched using the **Nationalize.io API**.
* The API predicts the most likely country and provides a probability score.

### 3. Business Logic

* If probability ≥ **60% (0.6)** → Lead is marked **Verified**
* If probability < **60%** → Lead is marked **To Check**
* If no country data is returned → Country is set to **Unknown** and status is **To Check**

### 4. Data Persistence

Each processed lead is stored in MongoDB with:

* Name
* Predicted Country
* Probability
* Status
* CRM Sync Flag (`syncedToCRM`)
* Timestamp

### 5. Background Automation

* A scheduled background task runs **every 5 minutes**.
* It identifies **Verified leads that have not been synced**.
* Simulates CRM sync by logging:

  ```
  [CRM Sync] Sending verified lead {Name} to Sales Team...
  ```
* Ensures **idempotency** so that each lead is synced **only once**.

### 6. Frontend Dashboard

* Clean, dark-themed UI
* Responsive layout:

  * Table view on desktop
  * Card view on mobile
* Displays:

  * Name
  * Country
  * Confidence Score
  * Status
* Filter leads by:

  * All
  * Verified
  * To Check

---

## Architecture Overview

### High-Level Flow

1. User submits a batch of names from the frontend.
2. Backend API receives the batch.
3. Backend makes **parallel API calls** to Nationalize.io.
4. Business logic is applied to determine lead status.
5. Processed leads are saved in MongoDB.
6. A cron job periodically syncs verified leads to a simulated CRM.

---

## Asynchronous Batch Processing Strategy

To efficiently handle multiple external API calls, the backend uses **parallel asynchronous execution**.

* All API requests are prepared together.
* Requests are executed concurrently using `Promise.all`.
* This prevents blocking, reduces processing time, and avoids timeouts for larger batches.

This approach ensures scalability and efficient use of system resources.

---

## Background Automation & Idempotency Strategy

### Automation

* Implemented using `node-cron`
* Runs every **5 minutes**
* Operates independently of user actions

### Idempotency

* Each lead has a `syncedToCRM` boolean flag.
* Only leads with:

  ```
  status = "Verified"
  AND
  syncedToCRM = false
  ```

  are processed.
* Once synced, the flag is updated to `true`, ensuring the same lead is **never processed twice**, even if the cron job runs multiple times.

---

## Database Schema (Lead)

| Field       | Type    | Description            |
| ----------- | ------- | ---------------------- |
| name        | String  | Lead name              |
| country     | String  | Predicted country      |
| probability | Number  | Confidence score (0–1) |
| status      | String  | Verified / To Check    |
| syncedToCRM | Boolean | CRM sync flag          |
| createdAt   | Date    | Timestamp              |

---

## Setup Instructions (Local)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5051
MONGO_URI=your_mongodb_connection_string
```

Run:

```bash
npm start
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5051
```

---

## Deployment Notes

### Backend (Render)

* Uses `process.env.PORT`
* MongoDB Atlas connection via environment variables
* Cron job starts automatically with the server

### Frontend (Netlify)

* Environment variable `VITE_API_URL` points to Render backend
* Build command: `npm run build`
* Publish directory: `dist`

---

## Evaluation Criteria Mapping

| Area            | How This Project Meets It           |
| --------------- | ----------------------------------- |
| API Integration | Nationalize.io used correctly       |
| Async Handling  | Parallel API requests               |
| Business Logic  | 60% verification rule enforced      |
| Data Integrity  | Idempotent CRM sync                 |
| Code Quality    | Modular backend and clean UI        |
| UI/UX           | Functional, responsive, dark-themed |

