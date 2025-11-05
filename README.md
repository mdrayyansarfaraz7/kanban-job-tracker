# Kanban Job Tracker

Kanban Job Tracker is a **Next.js + TypeScript** application designed to manage job applications across different stages — Applied, Interviewing, Offer, Rejected. The application provides a drag-and-drop Kanban interface with persistent storage using **MongoDB**. The user interface is built with **Tailwind CSS** and **ShadCN UI** for a clean and responsive design.

---

## Tech Stack

* **Framework**: Next.js (App Router, TypeScript)
* **UI**: Tailwind CSS, ShadCN UI
* **Database**: MongoDB (via Mongoose)
* **Backend**: Next.js API routes

---

## Core Functionality

* Kanban board to manage job applications visually across different stages
* Full CRUD operations for job applications
* Status updates by moving job cards between columns
* Responsive user interface suitable for desktop and mobile

---

## API Routes

| Route                      | Method | Description                                                         |
| -------------------------- | ------ | ------------------------------------------------------------------- |
| `/jobs/`                   | GET    | Fetch all job applications                                          |
| `/jobs/`                   | POST   | Create a new job application                                        |
| `/jobs/:id`                | GET    | Get details of a specific job application                           |
| `/jobs/:id`                | PUT    | Update a job application                                            |
| `/jobs/:id`                | DELETE | Delete a job application                                            |
| `/jobs/:id/update-status/` | PUT    | Update the status of a job application (move across Kanban columns) |

---

## Features Implemented

* Drag-and-drop Kanban board with persistent data storage
* Create, read, update, and delete job applications
* Column-based status updates: Applied → Interviewing → Offer → Rejected
* Clean, modern, and responsive UI using Tailwind CSS and ShadCN UI
* Type-safe API routes using Next.js and TypeScript

---

## Live Website
* https://kanban-job-tracker-ten.vercel.app/

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mdrayyansarfaraz7/kanban-job-tracker.git
   ```
2. Navigate to the project directory:

   ```bash
   cd kanban-job-tracker
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Create a `.env` file and add your MongoDB connection string:

   ```
   MONGODB_URI=<your-mongodb-uri>
   ```
5. Run the development server:

   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.


