# 💻 Student Sign-Up System — React + Python

This is a full-stack web application that helps **enroll students in a computer packages class** while **preventing duplicate registrations** — a common issue when using basic tools like Google Forms.

Built using **React (frontend)** and **Python (backend)**, this project streamlines course enrollment and ensures data integrity.

---

## 🧠 Problem It Solves

- **Google Forms** and other generic tools don’t prevent the same student from signing up multiple times.
- This app introduces **form validation, unique checks**, and an **API-driven workflow** to block duplicates based on:
  - Full Name
  - Birth Info
  - Phone Number
  - Alternative Number
  - Location
  - Class Schedule

---

## 🧰 Tech Stack

| Layer      | Technology       |
|------------|------------------|
| Frontend   | React, Axios, Bootstrap |
| Backend    | Python |
| Database   | PostgreSQL |
| Optional   | Email service for confirmations (e.g., SMTP, SendGrid) |

---

## ✨ Key Features

- 📋 **Student Registration Form** (React-based)
- 🔁 **Real-time Duplicate Checks** before submission
- 💾 **Data Storage** in a relational database (e.g., Postgres)
- ✅ **Success Feedback** after sign-up
- 📊 **Admin Dashboard** to view and export enrolled students

---

## 📂 Project Structure

```plaintext
/cs-class
├── backend/
│   ├── app.py               # FastAPI/Flask app with registration endpoint
│   ├── .gitignore             # ORM models (SQLAlchemy or Pydantic)
│   └── Procfile             # Local DB (switchable)
├── ui/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   └── Form.tsx(api/js)
│   │   └── Admin.tsx 
│   └── public/
├── README.md
└── requirements.txt
