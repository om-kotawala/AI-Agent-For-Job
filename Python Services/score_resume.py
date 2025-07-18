import sys
import fitz  # PyMuPDF
import re

def extract_text(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.lower()

def score_skills(text):
    keywords = ['python', 'react', 'node', 'api', 'mongodb', 'machine learning', 'html', 'css']
    match_count = sum(1 for kw in keywords if kw in text)
    return min(30, (match_count / len(keywords)) * 30)

def score_education(text):
    if any(deg in text for deg in ['b.tech', 'be', 'bachelor', 'master', 'm.tech', 'msc']):
        return 20
    return 0

def score_experience(text):
    if any(word in text for word in ['experience', 'intern', 'project', 'developed', 'worked']):
        return 20
    return 0

def score_formatting(text):
    word_count = len(text.split())
    return 10 if 300 <= word_count <= 800 else 5 if word_count > 200 else 0

def score_contact_info(text):
    has_email = bool(re.search(r'\S+@\S+\.\S+', text))
    has_phone = bool(re.search(r'\b\d{10}\b', text))  # crude 10-digit check
    return 10 if has_email and has_phone else 5 if has_email or has_phone else 0

def score_extras(text):
    extras = ['certification', 'achievement', 'linkedin.com', 'github.com']
    match_count = sum(1 for kw in extras if kw in text)
    return min(10, match_count * 2.5)

def total_score(text):
    return round(
        score_skills(text) +
        score_education(text) +
        score_experience(text) +
        score_formatting(text) +
        score_contact_info(text) +
        score_extras(text), 2
    )

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: PDF path missing")
        sys.exit(1)

    pdf_path = sys.argv[1]
    try:
        text = extract_text(pdf_path)
        score = total_score(text)
        print(score)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)
