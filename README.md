# Sisenco Weekly Reports — Team Report & Dashboard System

A full-stack web application for team members to submit weekly work reports and for managers to review, approve, and analyze reports across the whole team.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, Axios
- **Backend:** Node.js, Express, Sequelize ORM
- **Database:** MySQL
- **AI Assistant:** Google Gemini API

## Features

- Role-based authentication (Team Member / Manager) with JWT sessions
- Weekly report creation, editing, and submission (tasks, blockers, achievements, next-week plans, hours by type)
- Full review/correction workflow: Draft → Submitted → Needs Correction → Approved
- Manager dashboard with summary metrics, charts, and filters (status, team member, project, date range)
- Project/category management (CRUD)
- User management with role assignment
- AI chat assistant for managers to ask questions about team activity

## Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher recommended)
- [MySQL](https://dev.mysql.com/downloads/) (or MySQL Workbench for a GUI)
- A free [Google Gemini API key](https://aistudio.google.com) (only needed for the AI chat assistant feature)

## Setup Instructions

### 1. Install Dependencies

Clone the repository, then install dependencies for both the frontend and backend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Set Up the Database

Open MySQL Workbench (or your preferred MySQL client) and run:

```sql
CREATE DATABASE sisenco_app;
```

Then select `sisenco_app` as the active database and run the table-creation SQL found in `backend/database-schema.sql`.

### 3. Configure Environment Variables

In the `backend` folder, create a `.env` file with the following:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sisenco_app
JWT_SECRET=any_random_secret_string
PORT=5000
GEMINI_API_KEY=your_gemini_api_key

> Note: if your MySQL password contains special characters like `#`, wrap it in double quotes, e.g. `DB_PASSWORD="my#pass"`.

### 4. Run the Backend

```bash
cd backend
node index.js
```

The server will start on `http://localhost:5000`.

### 5. (Optional) Seed Sample Data

To populate the database with sample team members, projects, and reports for testing:

```bash
cd backend
node seed.js
```

This creates:
- 1 manager: `sarah.manager@example.com` / `manager123`
- 4 team members (e.g. `alex@example.com`) / `password123`
- 3 sample projects and several weeks of reports in varied statuses

### 6. Run the Frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure
sisenco-app/
├── backend/
│ ├── config/ # Database connection setup
│ ├── controllers/ # Business logic for each route
│ ├── middleware/ # Auth & role-checking middleware
│ ├── models/ # Sequelize models (database tables)
│ ├── routes/ # API route definitions
│ ├── seed.js # Sample data generator
│ └── index.js # Server entry point
├── frontend/
│ └── src/
│ ├── api/ # Functions for calling the backend
│ ├── components/ # Reusable UI components (Navbar, ChatAssistant, etc.)
│ └── pages/ # Full pages (Login, Dashboard, ReportForm, etc.)
└── README.md

## Notes

- The AI chat assistant requires a valid `GEMINI_API_KEY` in the backend `.env` file. Without it, the rest of the app functions normally — only the chat assistant will be unavailable.
- Report version history (a bonus feature) was not implemented due to time constraints; the review history (who reviewed what, when, and their comment) is fully tracked instead.