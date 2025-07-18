const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendEmails = async (req, res) => {
  try {
    const { email, resumePath, jobs } = req.body;

    // Setup transport (using Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_gmail@gmail.com",         // <-- replace with your Gmail
        pass: "your_gmail_app_password",      // <-- use Gmail App Password
      },
    });

    // Loop through jobs and send email
    let sent = 0;
    for (let job of jobs) {
      if (!job.email || job.email === "Not Disclosed") continue;

      await transporter.sendMail({
        from: email,
        to: job.email,
        subject: `Job Application for ${job.role} at ${job.company}`,
        text: `Dear HR,

                I am writing to apply for the ${job.role} role at ${job.company}. 
                Please find my resume attached for your review.

                Looking forward to hearing from you.

                Best regards,
                Om Kotawala`,
        attachments: [
          {
            filename: "Resume.pdf",
            path: path.resolve(resumePath),
          },
        ],
      });

      sent++;
    }

    res.json({ message: `${sent} emails sent successfully.` });
  } catch (err) {
    console.error("Error sending emails:", err);
    res.status(500).json({ error: "Failed to send emails" });
  }
};

module.exports = sendEmails;
