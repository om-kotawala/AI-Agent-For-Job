const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sendEmails = require("./api/sendEmails");
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('resume'), (req, res) => {
  const filePath = req.file.path;

  const python = spawn('python', [
    path.join(__dirname, '../python-service/score_resume.py'),
    filePath,
  ]);

  let scoreOutput = '';

  python.stdout.on('data', (data) => {
    scoreOutput += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  python.on('close', (code) => {
    fs.unlink(filePath, () => {}); // delete the file afterwards

    const score = parseFloat(scoreOutput.trim());

    if (isNaN(score)) {
      return res.status(500).json({ error: 'Failed to generate score' });
    }

    res.json({ score });
  });
});

app.post('/api/jobs', (req, res) => {
  const { role } = req.body;

  const python = spawn('python', [
    path.join(__dirname, '../python-service/search_jobs.py'),
    role
  ]);

  let output = '';

  python.stdout.on('data', (data) => {
    output += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  python.on('close', () => {
    try {
      const jobs = JSON.parse(output);
      res.json({ jobs });
    } catch (err) {
      console.error('Failed to parse job data:', err);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });
});

app.post("/api/send-mails", sendEmails);


app.listen(5000, () => console.log('✅ Backend running on http://localhost:5000'));
