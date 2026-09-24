import os
import json
from typing import TypedDict

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader

from groq import Groq
from langgraph.graph import StateGraph, END


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY is not configured.")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# Current Groq production model
MODEL_NAME = "openai/gpt-oss-20b"


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AIVOA Deviation Management API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LANGGRAPH STATE
# ============================================================

class DeviationState(TypedDict, total=False):
    source_text: str
    extracted_data: dict
    assessment: dict
    final_result: dict


# ============================================================
# REQUEST MODEL
# ============================================================

class AnalyzeRequest(BaseModel):
    text: str


# ============================================================
# AI EXTRACTION NODE
# ============================================================

def ai_extract_node(state: DeviationState):

    if client is None:
        raise RuntimeError(
            "GROQ_API_KEY is not configured."
        )

    source_text = state["source_text"]

    prompt = f"""
You are an AI assistant for pharmaceutical API manufacturing
deviation management.

Analyze the following deviation report and extract structured
information.

SOURCE:
{source_text}

Return ONLY valid JSON.

Use exactly these keys:

{{
  "deviation_title": "",
  "batch_number": "",
  "product_name": "",
  "deviation_date": "",
  "description": "",
  "parameter": "",
  "approved_range": "",
  "observed_value": "",
  "immediate_action": "",
  "department": ""
}}

Rules:

1. Do not invent information.
2. If a field is unavailable, use an empty string.
3. Keep extracted information concise.
4. Preserve values and dates from the source.
5. The result must be valid JSON.
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": (
                    "You extract structured pharmaceutical "
                    "deviation information."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1,
        response_format={
            "type": "json_object"
        }
    )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError(
            "AI returned an empty extraction response."
        )

    extracted = json.loads(content)

    return {
        "extracted_data": extracted
    }


# ============================================================
# AI IMPACT / SEVERITY ASSESSMENT NODE
# ============================================================

def ai_assessment_node(state: DeviationState):

    if client is None:
        raise RuntimeError(
            "GROQ_API_KEY is not configured."
        )

    data = state["extracted_data"]

    prompt = f"""
You are a pharmaceutical quality management AI assistant.

Assess the following manufacturing deviation:

{json.dumps(data, indent=2)}

Return ONLY valid JSON using exactly these keys:

{{
  "impact": "Low | Moderate | Major | Critical",
  "severity": "Minor | Major | Critical",
  "reason": ""
}}

Rules:

1. Base the recommendation only on the supplied information.
2. Do not invent facts.
3. Keep the reason concise.
4. This is an AI recommendation.
5. A human Quality professional must review the recommendation.
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": (
                    "You assist pharmaceutical quality teams "
                    "with deviation assessment."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1,
        response_format={
            "type": "json_object"
        }
    )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError(
            "AI returned an empty assessment response."
        )

    assessment = json.loads(content)

    return {
        "assessment": assessment
    }


# ============================================================
# COMBINE NODE
# ============================================================

def combine_node(state: DeviationState):

    extracted = state.get("extracted_data", {})
    assessment = state.get("assessment", {})

    result = {
        **extracted,
        **assessment
    }

    return {
        "final_result": result
    }


# ============================================================
# LANGGRAPH WORKFLOW
# ============================================================

workflow = StateGraph(DeviationState)

workflow.add_node(
    "extract",
    ai_extract_node
)

workflow.add_node(
    "assess",
    ai_assessment_node
)

workflow.add_node(
    "combine",
    combine_node
)

workflow.set_entry_point("extract")

workflow.add_edge(
    "extract",
    "assess"
)

workflow.add_edge(
    "assess",
    "combine"
)

workflow.add_edge(
    "combine",
    END
)

deviation_graph = workflow.compile()


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "AIVOA Deviation Management API",
        "status": "running"
    }


# ============================================================
# HEALTH ENDPOINT
# ============================================================

@app.get("/api/health")
def health():

    return {
        "status": "healthy",
        "groq_configured": bool(GROQ_API_KEY),
        "model": MODEL_NAME
    }


# ============================================================
# TEXT ANALYSIS ENDPOINT
# ============================================================

@app.post("/api/deviations/analyze")
def analyze_deviation(
    request: AnalyzeRequest
):

    if not request.text.strip():

        raise HTTPException(
            status_code=400,
            detail="Deviation text is required."
        )

    try:

        result = deviation_graph.invoke(
            {
                "source_text": request.text
            }
        )

        return {
            "success": True,
            "data": result["final_result"]
        }

    except Exception as e:

        print(
            "AI ANALYSIS ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# PDF / TXT FILE ANALYSIS ENDPOINT
# ============================================================

@app.post("/api/deviations/analyze-file")
async def analyze_file(
    file: UploadFile = File(...)
):

    try:

        contents = await file.read()

        filename = file.filename or ""

        # ----------------------------------------------------
        # PDF
        # ----------------------------------------------------

        if filename.lower().endswith(".pdf"):

            temp_path = "temp_deviation.pdf"

            with open(temp_path, "wb") as f:
                f.write(contents)

            try:

                reader = PdfReader(temp_path)

                text = "\n".join(
                    page.extract_text() or ""
                    for page in reader.pages
                )

            finally:

                if os.path.exists(temp_path):
                    os.remove(temp_path)

        # ----------------------------------------------------
        # TXT
        # ----------------------------------------------------

        else:

            text = contents.decode(
                "utf-8",
                errors="ignore"
            )

        if not text.strip():

            raise HTTPException(
                status_code=400,
                detail="No readable text found in uploaded file."
            )

        # ----------------------------------------------------
        # LANGGRAPH
        # ----------------------------------------------------

        result = deviation_graph.invoke(
            {
                "source_text": text
            }
        )

        return {
            "success": True,
            "filename": filename,
            "data": result["final_result"]
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            "FILE ANALYSIS ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )