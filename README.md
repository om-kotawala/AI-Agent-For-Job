
```markdown
# 🤖 AI Employment Agent

An intelligent web-based platform that helps users:
- Upload resumes and receive an AI-based score
- Search relevant jobs based on job role
- Preview and send job applications to listed companies via email

Designed to reduce unemployment using modern AI tools and automation.

---

## 🚀 Features

- 📄 Resume scoring with AI (Python backend)
- 🔍 Job search via Google Jobs (SerpAPI)
- 📧 Email preview & automated job application
- ✅ Simple UI for seamless navigation
- 🧑‍💻 Built using MERN + Python + TailwindCSS

---


---

## 🌐 Tech Stack

| Layer       | Tech Used                           |
|-------------|--------------------------------------|
| Frontend    | React (Vite) + TailwindCSS           |
| Backend     | Node.js, Express.js                  |
| AI Scoring  | Python (Flask / script), PDF parsing |
| Job Search  | SerpAPI (Google Jobs engine)         |
| Database    | MongoDB                              |
| Emailing    | Nodemailer + SMTP                    |

---
```
## 🔧 Setup Instructions

### ✅ Prerequisites

- Node.js v18+
- Python 3.10+
- MongoDB Atlas / Local
- SerpAPI account (for job search)

---

## 📦 Frontend Setup

```bash
cd frontend
npm install
npm run dev
````

* Runs at: `http://localhost:5173/`

---

## ⚙️ Backend Setup (Node.js + Express)

```bash
cd backend
npm install
node index.js
```

* Runs at: `http://localhost:5000/`

### Create `.env` in `/backend` with:

```
PORT=5000
MONGO_URI=your_mongo_db_uri
SERPAPI_KEY=your_serpapi_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

## 🧠 Python Service Setup

```bash
cd python-service
pip install -r requirements.txt
```

### Run Job Scraper (test):

```bash
python search_jobs.py "Software Developer"
```

---

## 💻 How It Works

1. User enters name and email
2. Uploads resume → Python scores it
3. If score ≥ 60, user enters job role
4. Top 10 jobs are fetched and shown
5. User previews email
6. Email with resume is sent to recruiters

---

---

## 📬 Sample Email Preview

```text
From: om@example.com  
To: HR Manager  
Subject: Application for Software Engineer  

Dear HR,

I am writing to apply for the Software Engineer role at [Company]. Please find my resume attached.

Looking forward to hearing from you.

Best regards,  
Om Kotawala
```

---



