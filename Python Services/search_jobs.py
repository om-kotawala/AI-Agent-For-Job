from serpapi import GoogleSearch
import sys
import json

def get_jobs_from_google(job_role):
    params = {
        "engine": "google_jobs",
        "q": f"{job_role} India",
        "api_key": "98168824ffecab91e1bb2fd9688f14462213b76acf3c9d7c81f9731ecee98469"
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    jobs = []
    seen = set()

    for job in results.get("jobs_results", []):
        job_id = job.get("job_id")
        if job_id in seen:
            continue
        seen.add(job_id)

        salary_raw = job.get("detected_extensions", {}).get("salary")
        if salary_raw and any(char.isdigit() for char in salary_raw):
            salary = salary_raw
        else:
            salary = "Not Disclosed"

        jobs.append({
            "sr": len(jobs)+1,
            "company": job.get("company_name", "Unknown"),
            "role": job.get("title", "Unknown"),
            "email": "Not Disclosed",
            "bond": "Not Disclosed",
            "salary": salary,
            "location": job.get("location", "Not Disclosed"),
            "link": f"https://www.google.com/search?q={job_role.replace(' ', '+')}&ibp=htl;jobs#fpstate=tldetail&htidocid={job_id}" if job_id else "N/A"
        })


    return jobs

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit()

    role = sys.argv[1]
    jobs = get_jobs_from_google(role)
    print(json.dumps(jobs, indent=2))
