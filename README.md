# 🚀 CAIA System Design Platform

A modern, full-stack platform designed to help developers master **System Design**, **Backend Architecture**, **Frontend Patterns**, and **DevOps**. 

Built with a clean **MVC backend** and a stunning, highly interactive **React glassmorphism frontend**, this project demonstrates how to build scalable, maintainable, and visually beautiful applications.

---

## 📖 Description

The **CAIA Platform** is a comprehensive educational tool that goes beyond just reading articles. It provides an immersive learning experience with dynamic roadmaps, community voting, personal note-taking, and deep analytics.

The application is split into two parts:
1. **Frontend:** A responsive, modern React application built with Vite, featuring custom UI components, glassmorphism aesthetics, and real-time interactions.
2. **Backend:** A robust Node.js/Express API connected to MongoDB Atlas, implementing advanced data aggregation, search algorithms, and structured MVC design.

---

## ✨ Key Features

### 🎨 Beautiful Modern UI
- **Glassmorphism Design:** Semi-transparent, blurred backgrounds for a premium feel.
- **Responsive Layouts:** Perfect viewing experience on both desktop and mobile devices.
- **Interactive Micro-animations:** Smooth hover effects and transitions.

### 🗺️ Structured Learning & Discovery
- **Learning Roadmaps:** Step-by-step visual timelines for different tracks (System Design, Backend, Frontend, DevOps).
- **Advanced Search & Filtering:** Find concepts by tags, patterns, language, difficulty, or category.
- **Trending & Popularity Engine:** Automatically surfaces the most viewed and engaged content.

### 🤝 Interactive Community Features
- **Community Voting:** Upvote or downvote concepts in real-time.
- **Personal Notes:** Add and save private markdown notes directly to any concept card.
- **Bookmarking:** Save important concepts to your personal dashboard for later review.

### 📊 Comprehensive Analytics
- **Dashboard Metrics:** Track total concepts, top categories, and system growth.
- **API & Database Tracking:** Monitor backend performance metrics.

---

## 📁 Project Structure

This is a monorepo containing both the frontend and backend applications.

```
caia_system_design/
│
├── frontend/             # React + Vite Application
│   ├── src/
│   │   ├── components/   # Reusable UI elements (Sidebar, ConceptCard, etc.)
│   │   ├── pages/        # Main views (Dashboard, Explore, Roadmaps, Analytics)
│   │   ├── App.jsx       # Routing and layout structure
│   │   └── api.js        # Centralized API fetch logic
│   └── .env              # Frontend environment variables
│
└── backend/              # Node.js + Express API
    ├── src/
    │   ├── controllers/  # Business logic & API handlers
    │   ├── models/       # MongoDB Mongoose Schemas
    │   ├── routers/      # API route definitions
    │   └── config/       # Database connections
    ├── app.js            # Express app configuration
    └── server.js         # Entry point
```

---

## ⚙️ Tech Stack

### Frontend
* **React 18** – UI Library
* **Vite** – Fast build tool and development server
* **React Router DOM** – Client-side routing
* **Lucide React** – Beautiful, consistent SVG icons
* **Vanilla CSS** – Custom styling with CSS variables and glassmorphism tokens

### Backend
* **Node.js** – Server runtime
* **Express.js** – Web framework
* **MongoDB Atlas** – Cloud NoSQL database
* **Mongoose** – Object Data Modeling (ODM)
* **Cors & Dotenv** – Security and environment management

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have **Node.js** installed on your machine.

### 1. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/system_design # Or your Atlas URI
```
Start the backend server:
```bash
npm run dev
```

### 2. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1 # Or your deployed backend URL
```
Start the frontend development server:
```bash
npm run dev
```

### 3. View the App
Open your browser and navigate to `http://localhost:5173`.

---

## 🌍 Deployment

This application is completely deployment-ready!
- **Backend:** Configured to be easily deployed on Render, Railway, or Heroku. It uses `process.env.PORT` and allows CORS.
- **Frontend:** Configured to be deployed on Vercel or Netlify. Just set the `VITE_API_BASE_URL` environment variable in your Vercel dashboard to point to your live backend!

---

## 🧠 Concepts Covered During Development

* **Full-stack MVC Architecture:** Separating concerns across the stack.
* **Optimistic UI Updates:** Providing instant feedback for actions like voting before the server responds.
* **Complex MongoDB Aggregations:** Powering analytics and trending algorithms.
* **Dynamic Routing:** Utilizing URL parameters for deep-linking content.
* **CSS Best Practices:** Using custom CSS properties (`var(--color)`) for highly maintainable themes.

---

## 🙌 Author

Developed as a comprehensive showcase of modern **Full-Stack Development, UI/UX Design, and Backend Engineering**.
