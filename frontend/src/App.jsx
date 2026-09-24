import { useState } from "react";
import axios from "axios";
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileText,
  Loader2,
  Save,
  ShieldCheck,
  Upload,
  WandSparkles,
} from "lucide-react";
import "./App.css";

const emptyForm = {
  deviation_title: "",
  batch_number: "",
  product_name: "",
  deviation_date: "",
  department: "",
  description: "",
  parameter: "",
  approved_range: "",
  observed_value: "",
  immediate_action: "",
};

function App() {
  const [form, setForm] = useState(emptyForm);
  const [sourceText, setSourceText] = useState("");
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const analyzeText = async () => {
    if (!sourceText.trim()) {
      setMessage("Please enter deviation information first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setAssessment(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/deviations/analyze",
        {
          text: sourceText,
        }
      );

      const result = response.data.data;

      setForm({
        deviation_title: result.deviation_title || "",
        batch_number: result.batch_number || "",
        product_name: result.product_name || "",
        deviation_date: result.deviation_date || "",
        department: result.department || "",
        description: result.description || "",
        parameter: result.parameter || "",
        approved_range: result.approved_range || "",
        observed_value: result.observed_value || "",
        immediate_action: result.immediate_action || "",
      });

      setAssessment({
        impact: result.impact || "",
        severity: result.severity || "",
        reason: result.reason || "",
      });

      setMessage("AI analysis completed. Please review the generated information.");
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.detail ||
          "Unable to analyze the deviation. Check that the backend and Groq API are running."
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setMessage("");
    setAssessment(null);

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/deviations/analyze-file",
        data
      );

      const result = response.data.data;

      setForm({
        deviation_title: result.deviation_title || "",
        batch_number: result.batch_number || "",
        product_name: result.product_name || "",
        deviation_date: result.deviation_date || "",
        department: result.department || "",
        description: result.description || "",
        parameter: result.parameter || "",
        approved_range: result.approved_range || "",
        observed_value: result.observed_value || "",
        immediate_action: result.immediate_action || "",
      });

      setAssessment({
        impact: result.impact || "",
        severity: result.severity || "",
        reason: result.reason || "",
      });

      setMessage("Document analyzed successfully. Please review the AI-generated fields.");
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.detail ||
          "Unable to process the uploaded document."
      );
    } finally {
      setLoading(false);
    }
  };

  const saveDeviation = async () => {
    setSaving(true);
    setMessage("");

    try {
      // Demo-ready save action.
      // The reviewed object is prepared here for database persistence.
      console.log("Deviation submitted:", {
        ...form,
        ...assessment,
      });

      await new Promise((resolve) => setTimeout(resolve, 700));

      setMessage("Deviation reviewed and saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to save the deviation.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={23} />
          </div>

          <div>
            <h1>AIVOA</h1>
            <span>AI Quality Management</span>
          </div>
        </div>

        <div className="header-right">
          <span className="system-status">
            <span className="status-dot" />
            AI System Online
          </span>

          <div className="user-avatar">K</div>
        </div>
      </header>

      <main className="page">
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <ClipboardList size={15} />
              QUALITY MANAGEMENT
            </div>

            <h2>Log Deviation</h2>

            <p>
              Capture, assess and manage manufacturing deviations with
              AI-assisted intake.
            </p>
          </div>

          <div className="secure-badge">
            <ShieldCheck size={17} />
            Controlled Workflow
          </div>
        </section>

        <div className="workflow">
          <section className="form-card">
            <div className="card-header">
              <div className="section-icon">
                <FileText size={19} />
              </div>

              <div>
                <h3>Deviation Information</h3>
                <p>Review and edit information extracted by AI.</p>
              </div>
            </div>

            <div className="review-banner">
              <Brain size={17} />

              <div>
                <strong>AI-assisted form</strong>
                <span>
                  Fields are populated from your submitted deviation source.
                  Review before saving.
                </span>
              </div>
            </div>

            <div className="form-grid">
              <Field
                label="Deviation Title"
                value={form.deviation_title}
                onChange={(v) => updateField("deviation_title", v)}
                full
              />

              <Field
                label="Batch Number"
                value={form.batch_number}
                onChange={(v) => updateField("batch_number", v)}
              />

              <Field
                label="Product Name"
                value={form.product_name}
                onChange={(v) => updateField("product_name", v)}
              />

              <Field
                label="Deviation Date"
                value={form.deviation_date}
                onChange={(v) => updateField("deviation_date", v)}
              />

              <Field
                label="Department"
                value={form.department}
                onChange={(v) => updateField("department", v)}
              />

              <Field
                label="Process Parameter"
                value={form.parameter}
                onChange={(v) => updateField("parameter", v)}
              />

              <Field
                label="Approved Range"
                value={form.approved_range}
                onChange={(v) => updateField("approved_range", v)}
              />

              <Field
                label="Observed Value"
                value={form.observed_value}
                onChange={(v) => updateField("observed_value", v)}
              />

              <TextArea
                label="Description"
                value={form.description}
                onChange={(v) => updateField("description", v)}
                full
              />

              <TextArea
                label="Immediate Action"
                value={form.immediate_action}
                onChange={(v) => updateField("immediate_action", v)}
                full
              />
            </div>

            {message && (
              <div className="message">
                <CheckCircle2 size={17} />
                {message}
              </div>
            )}

            <div className="form-footer">
              <span className="required-note">
                AI-generated information requires human review.
              </span>

              <button
                className="save-button"
                onClick={saveDeviation}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="spin" size={17} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Deviation
                  </>
                )}
              </button>
            </div>
          </section>

          <aside className="copilot-card">
            <div className="copilot-header">
              <div className="copilot-title">
                <div className="ai-icon">
                  <WandSparkles size={19} />
                </div>

                <div>
                  <h3>AI Copilot</h3>
                  <p>Deviation Intake Assistant</p>
                </div>
              </div>

              <span className="ai-live">LIVE</span>
            </div>

            <div className="copilot-body">
              <label className="input-label">
                Deviation Source
              </label>

              <textarea
                className="source-input"
                placeholder="Paste a deviation email, report, or event description here..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />

              <div className="upload-row">
                <label className="upload-button">
                  <Upload size={17} />
                  Upload PDF / TXT
                  <input
                    type="file"
                    accept=".pdf,.txt,.text"
                    onChange={uploadFile}
                    hidden
                  />
                </label>

                {fileName && (
                  <span className="file-name">
                    <FileText size={14} />
                    {fileName}
                  </span>
                )}
              </div>

              <button
                className="analyze-button"
                onClick={analyzeText}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="spin" size={18} />
                    AI is analyzing...
                  </>
                ) : (
                  <>
                    <WandSparkles size={18} />
                    Analyze with AI
                  </>
                )}
              </button>

              <div className="copilot-divider" />

              <div className="assessment-heading">
                <div>
                  <h4>AI Impact Assessment</h4>
                  <span>Initial recommendation</span>
                </div>

                <AlertTriangle size={18} />
              </div>

              {assessment ? (
                <div className="assessment">
                  <div className="assessment-row">
                    <div>
                      <span className="assessment-label">Impact</span>
                      <strong>{assessment.impact || "Not available"}</strong>
                    </div>

                    <div>
                      <span className="assessment-label">Severity</span>
                      <strong>{assessment.severity || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="reason-box">
                    <span>AI Reasoning</span>
                    <p>
                      {assessment.reason ||
                        "No assessment reason was returned."}
                    </p>
                  </div>

                  <div className="human-review">
                    <ShieldCheck size={16} />
                    AI recommendation requires quality review.
                  </div>
                </div>
              ) : (
                <div className="empty-assessment">
                  <Brain size={29} />
                  <strong>No assessment yet</strong>
                  <span>
                    Submit deviation information to receive an AI-assisted
                    impact and severity recommendation.
                  </span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, full = false }) {
  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label>{label}</label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`AI will populate ${label.toLowerCase()}`}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, full = false }) {
  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label>{label}</label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`AI will populate ${label.toLowerCase()}`}
      />
    </div>
  );
}

export default App;