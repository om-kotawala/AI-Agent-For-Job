import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState({ name: "", email: "" });
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [jobsWithEmail, setJobsWithEmail] = useState([]);
  const [resumePath, setResumePath] = useState("");


  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);

    const res = await axios.post('http://localhost:5000/api/upload', formData);
    setScore(res.data.score);
    setResumePath(res.data.resumePath); // Make sure your backend returns this!
  };

  const handleSearch = async () => {
    const res = await axios.post('http://localhost:5000/api/jobs', { role: jobRole });
    setJobs(res.data.jobs);
  };

  const handleSendEmails = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/send-mails", {
        email: user.email,
        resumePath,
        jobs: jobsWithEmail,
      });
      alert(res.data.message);
      setShowPreview(false); // close modal
    } catch (err) {
      alert("Failed to send emails.");
    }
  };




  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-indigo-100 to-white font-sans p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl overflow-y-auto max-h-[95vh]">

        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          AI Job Assistant 🤖
        </h1>

        {!userConfirmed && (
          <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-12">
            <h2 className="text-xl font-bold mb-4 text-indigo-600 text-center">Welcome to AI Employment Agent</h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              onClick={() => {
                if (user.name && user.email.includes("@")) setUserConfirmed(true);
                else alert("Please enter valid name and email.");
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
            >
              Start
            </button>
          </div>
        )}

        {/* Upload Resume */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">
            Upload Your Resume (.PDF):
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 border border-gray-300 rounded p-2 w-full"
          />
          <button
            onClick={handleUpload}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all"
          >
            Submit Resume
          </button>
        </div>

        {/* Show Score */}
        {score !== null && (
          <div className={`text-lg font-semibold mb-6 ${score >= 60 ? 'text-green-600' : 'text-red-500'}`}>
            Resume Score: {score} / 100
          </div>
        )}

        {/* Job Role Input */}
        {score >= 60 && (
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">Enter Job Role:</label>
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g., Software Engineer"
              className="border border-gray-300 rounded p-2 w-full mb-4"
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all"
            >
              Search Jobs
            </button>
          </div>
        )}

        {/* Jobs Table */}
        {jobs.length > 0 && (
          <div className="overflow-x-auto max-h-[600px] border rounded">
            <table className="w-full table-auto text-sm text-left border-collapse">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2">Sr</th>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Bond</th>
                  <th className="px-3 py-2">Salary</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Link</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={index} className="even:bg-gray-50 hover:bg-indigo-50">
                    <td className="px-3 py-2">{job.sr}</td>
                    <td className="px-3 py-2">{job.company}</td>
                    <td className="px-3 py-2">{job.role}</td>
                    <td className="px-3 py-2">{job.email}</td>
                    <td className="px-3 py-2">{job.bond}</td>
                    <td className="px-3 py-2">{job.salary}</td>
                    <td className="px-3 py-2">{job.location}</td>
                    <td className="px-3 py-2">
                      {job.link && job.link.startsWith("http") ? (
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">Not Available</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {jobs.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 font-medium">Would you like us to send emails on your behalf?</p>
            <p className="mb-4">Sending to: <span className="text-indigo-600 font-semibold">{user.email}</span></p>
            
            <button
              onClick={() => setShowPreview(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ✅ Yes, Send Emails
            </button>
            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg relative">
                  <h2 className="text-lg font-bold mb-2 text-indigo-700">📧 Email Preview</h2>

                  <p className="mb-1"><span className="font-semibold">From:</span> {user.email}</p>
                  <p className="mb-1"><span className="font-semibold">To:</span> {jobsWithEmail.length} recipients</p>
                  <p className="mb-1"><span className="font-semibold">Subject:</span> Application for [Job Role]</p>

                  <div className="border p-3 mt-3 rounded bg-gray-50 text-sm">
                    <p>Dear HR,</p>
                    <p className="mt-2">I am writing to apply for the [Job Role] role at [Company]. Please find my resume attached.</p>
                    <p className="mt-2">Looking forward to hearing from you.</p>
                    <p className="mt-2">Best regards,<br />{user.name}</p>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">📎 Resume: <span className="font-mono">{resumePath}</span></p>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendEmails}
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Confirm & Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
