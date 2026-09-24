# AIVOA — AI-Powered Deviation Intake Module

An AI-powered Deviation Intake Module designed to streamline deviation reporting, information extraction, impact assessment, and severity recommendation using **React, FastAPI, LangGraph, and Groq**.

AIVOA allows users to enter deviation information manually or upload PDF/TXT documents. The system processes the information through an AI workflow, extracts structured deviation details, generates an impact and severity assessment, and presents the result for human review before saving.

---

## 🎯 Project Objective

The objective of AIVOA is to simplify and accelerate the deviation intake process by using AI-assisted information extraction and assessment.

The system provides:

* Manual deviation information entry
* PDF/TXT document upload
* AI-powered deviation information extraction
* AI-assisted impact assessment
* AI-assisted severity recommendation
* Reason generation for the assessment
* Human review and editing before saving
* Structured AI processing using LangGraph
* REST API communication between frontend and backend

> **Human-in-the-loop:** AI-generated results are provided as recommendations. The user can review and edit the information before finalizing the deviation record.

---

# ✨ Key Features

## 1. Deviation Intake Form

Users can enter deviation information through the React-based interface.

The application provides a structured interface for capturing deviation-related information and submitting it to the backend for AI processing.

## 2. PDF/TXT Document Upload

Users can upload supported **PDF or TXT documents** containing deviation information.

The FastAPI backend extracts the document content and sends it through the AI processing workflow.

## 3. AI-Powered Information Extraction

The AI extraction stage identifies structured information from the deviation input, including:

* Title
* Batch Number
* Product
* Date
* Description
* Process Parameter
* Approved Range
* Observed Value
* Immediate Action
* Department

## 4. AI Impact & Severity Assessment

After extracting the deviation information, the system performs an AI-assisted assessment.

The generated assessment contains:

* **Impact**
* **Severity**
* **Reason**

## 5. Human Review

The generated AI result is presented to the user for review.

The user can:

1. Review extracted information
2. Review the AI assessment
3. Edit information when required
4. Confirm the reviewed information
5. Save the final result

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────────┐
│                React Frontend               │
│                                              │
│  Deviation Form / AI Copilot / File Upload │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTP / API
                       ▼
┌──────────────────────────────────────────────┐
│               FastAPI Backend                │
│                                              │
│  POST /api/deviations/analyze                │
│  POST /api/deviations/analyze-file           │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 LangGraph                   │
│                                              │
│  ┌─────────────────┐                         │
│  │ ai_extract_node │                         │
│  └────────┬────────┘                         │
│           ▼                                  │
│  ┌─────────────────────┐                     │
│  │ ai_assessment_node  │                     │
│  └──────────┬──────────┘                     │
│             ▼                                │
│  ┌─────────────────┐                         │
│  │   combine_node  │                         │
│  └────────┬────────┘                         │
│           ▼                                  │
│          END                                 │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │    Groq API    │
              │   AI / LLM     │
              └────────────────┘
```

---

# 🔄 End-to-End Workflow

```text
User Input / PDF / TXT
        │
        ▼
React Frontend
        │
        ▼
FastAPI API Endpoint
        │
        ▼
DeviationState
        │
        ▼
AI Extraction Node
        │
        ▼
Structured Deviation Information
        │
        ▼
AI Assessment Node
        │
        ▼
Impact + Severity + Reason
        │
        ▼
Combine Node
        │
        ▼
Final AI-Assisted Result
        │
        ▼
Human Review / Edit
        │
        ▼
Save Final Deviation
```

---

# 🤖 LangGraph AI Workflow

The backend uses **LangGraph** to organize the AI processing pipeline.

## 1. `ai_extract_node`

The extraction node processes the deviation input and extracts structured information.

The extracted fields include:

```text
Title
Batch Number
Product
Date
Description
Process Parameter
Approved Range
Observed Value
Immediate Action
Department
```

---

## 2. `ai_assessment_node`

The assessment node uses the extracted deviation information to generate an AI-assisted assessment.

The output includes:

```text
Impact
Severity
Reason
```

---

## 3. `combine_node`

The combine node combines the extracted deviation information and AI assessment into the final workflow state.

The workflow then reaches:

```text
END
```

---

# 🧠 State Management

The backend uses a `DeviationState` structure to carry information between the LangGraph nodes.

Conceptually:

```text
DeviationState
      │
      ├── Input / Deviation Data
      │
      ├── Extracted Fields
      │
      ├── Impact
      │
      ├── Severity
      │
      └── Reason
```

This allows information generated by one processing stage to be passed to the next stage of the workflow.

---

# 🔌 Backend API

## Analyze Text Input

```text
POST /api/deviations/analyze
```

Processes deviation information submitted through the application.

## Analyze Uploaded File

```text
POST /api/deviations/analyze-file
```

Processes supported uploaded **PDF/TXT** deviation documents.

## API Documentation

FastAPI provides interactive API documentation through:

```text
/docs
```

When running locally:

```text
http://localhost:8000/docs
```

---

# 🛠️ Technology Stack

### Frontend

* React
* JavaScript
* CSS
* Axios
* Vite

### Backend

* Python
* FastAPI
* Pydantic
* PyPDF

### AI & Workflow

* LangGraph
* Groq API

### Configuration

* Python `dotenv`
* Environment variables

---

# 📁 Project Structure

```text
Aivoa_Deviation_AI/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── .gitignore
│
└── .gitignore
```

---

# 🚀 Local Setup

## Prerequisites

Install the following:

* Python
* Node.js
* npm
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/kavya0000/Aivoa_Deviation_AI.git
cd Aivoa_Deviation_AI
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

Install the required backend dependencies.

Create a local `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

> Never commit the actual `.env` file or API key to the public repository.

Start the FastAPI backend using the configured application entry point.

---

## 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The React frontend communicates with the FastAPI backend through the configured API endpoints.

---

# 🔐 Security

The Groq API key is stored locally through an environment variable.

The following files/directories are intentionally excluded from Git:

```text
.env
backend/.env
backend/venv/
backend/__pycache__/
__pycache__/
*.pyc
```

This prevents sensitive credentials and unnecessary local Python environment files from being committed to the public repository.

---

# 👤 Human-in-the-Loop Design

AIVOA combines AI assistance with human review.

### AI-assisted processing

```text
Extraction
    ↓
Assessment
    ↓
Recommendation
```

### Human review

```text
Review
   ↓
Edit
   ↓
Confirm
   ↓
Save
```

This approach allows AI to accelerate deviation intake while keeping the final reviewed information under user control.

---

# 🎥 Project Demonstration

### Product Demonstration Video

The product demonstration shows the working of the implemented AIVOA AI tools and features, including deviation input, AI processing, generated assessment, and human review.

**Watch Product Demonstration:**
https://drive.google.com/file/d/1HPFy3-kwXt1IBrH593jpoxT1pwWtRpCf/view?usp=sharing

---

# 💻 Code Explanation

### End-to-End Code Explanation Video

The code explanation demonstrates the complete workflow from:

```text
Frontend User Input
        ↓
FastAPI API Endpoint
        ↓
Backend Processing
        ↓
LangGraph
        ↓
AI Extraction
        ↓
AI Assessment
        ↓
Combine
        ↓
Final Output
```

**Watch Code Explanation:**
https://drive.google.com/file/d/1nFqV9efMjE69WkpmDe0f6bG3FvF29vu0/view?usp=sharing

---

# 📌 Assignment Implementation

The AIVOA implementation demonstrates the integration of:

* Modern React frontend development
* FastAPI REST API development
* AI/LLM integration
* LangGraph workflow orchestration
* Structured information extraction
* PDF/TXT document processing
* AI-assisted impact assessment
* AI-assisted severity recommendation
* Human-in-the-loop review
* Frontend-to-backend communication

---

# 🎯 End-to-End Solution

The complete AIVOA solution follows this flow:

```text
┌───────────────────┐
│   User / Document │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  React Frontend   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   FastAPI API     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│    LangGraph      │
│                   │
│  Extract → Assess │
│       → Combine   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│     Groq AI       │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ AI-Assisted Result│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Human Review/Edit  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   Final Deviation │
└───────────────────┘
```

---

# 👩‍💻 Author

**Kavya Poleboina**

GitHub:
https://github.com/kavya0000

Project Repository:
https://github.com/kavya0000/Aivoa_Deviation_AI

