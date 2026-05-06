import { useState } from "react";

const GMAIL = "your.email@gmail.com"; // 🔁 Replace with your Gmail
const JOTFORM_URL = "https://form.jotform.com/YOUR_FORM_ID"; // 🔁 Replace with your JotForm URL

const steps = ["Type", "Details", "Application", "Review"];

const countries = [
  "Kenya", "Nigeria", "South Africa", "Uganda", "Tanzania",
  "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "India", "Brazil", "Other"
];

const citiesByCountry = {
  "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Eldoret", "Nakuru"],
  "Nigeria": ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
  "Uganda": ["Kampala", "Entebbe", "Jinja", "Gulu"],
  "Tanzania": ["Dar es Salaam", "Dodoma", "Arusha", "Mwanza"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth"],
  "Other": ["Other"],
};

export default function App() {
  const [step, setStep] = useState(0);
  const [appType, setAppType] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [personal, setPersonal] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", country: "", additionalInfo: "",
    idType: "id", idNumber: "",
  });

  const [loanApp, setLoanApp] = useState({
    entityName: "", natureOfActivity: "", poBox: "", postalCode: "", town: "",
    mobile1: "", mobile2: "", physicalTown: "", street: "", building: "",
    premises: "", constitution: "",
    spouseMobile1: "", spouseMobile2: "", spouseEmail: "",
    loanAmount: "", loanPurpose: "", repaymentPeriod: "",
  });

  const [savingsApp, setSavingsApp] = useState({
    accountType: "", initialDeposit: "", monthlyContribution: "",
    savingsGoal: "", targetDate: "", employmentStatus: "", employer: "",
    monthlyIncome: "", referral: "",
  });

  const up = (field, val, setter) => setter(prev => ({ ...prev, [field]: val }));
  const cityOptions = personal.country ? (citiesByCountry[personal.country] || ["Other"]) : [];
  const canStep1 = personal.firstName && personal.lastName && personal.email && personal.phone && personal.idNumber;
  const canStep2 = appType === "loan" ? loanApp.entityName && loanApp.loanAmount : savingsApp.accountType && savingsApp.initialDeposit;

  const buildEmailBody = () => {
    let body = `NEW ${appType === "loan" ? "SME LOAN" : "SAVINGS"} APPLICATION\n${"=".repeat(40)}\n\n`;
    body += `PERSONAL INFO\nName: ${personal.firstName} ${personal.lastName}\n`;
    body += `Email: ${personal.email} | Phone: ${personal.phone}\n`;
    body += `ID: ${personal.idType.toUpperCase()} — ${personal.idNumber}\n`;
    body += `Location: ${personal.city}, ${personal.country}\n`;
    if (personal.additionalInfo) body += `Notes: ${personal.additionalInfo}\n`;
    body += `\n`;
    if (appType === "loan") {
      body += `SME LOAN DETAILS\nEntity: ${loanApp.entityName} | Activity: ${loanApp.natureOfActivity}\n`;
      body += `P.O.Box: ${loanApp.poBox} | Postal: ${loanApp.postalCode} | Town: ${loanApp.town}\n`;
      body += `Mobile: ${loanApp.mobile1} / ${loanApp.mobile2}\n`;
      body += `Location: ${loanApp.physicalTown}, ${loanApp.street}, ${loanApp.building}\n`;
      body += `Premises: ${loanApp.premises} | Constitution: ${loanApp.constitution}\n`;
      body += `Spouse: ${loanApp.spouseMobile1} / ${loanApp.spouseMobile2} / ${loanApp.spouseEmail}\n`;
      body += `Loan Amount: ${loanApp.loanAmount} | Period: ${loanApp.repaymentPeriod}\nPurpose: ${loanApp.loanPurpose}\n`;
    } else {
      body += `SAVINGS DETAILS\nAccount: ${savingsApp.accountType} | Employment: ${savingsApp.employmentStatus}\n`;
      body += `Initial: ${savingsApp.initialDeposit} | Monthly: ${savingsApp.monthlyContribution}\n`;
      body += `Goal: ${savingsApp.savingsGoal} | Target: ${savingsApp.targetDate}\n`;
      body += `Employer: ${savingsApp.employer} | Income: ${savingsApp.monthlyIncome}\n`;
    }
    return encodeURIComponent(body);
  };

  const handleGmail = () => {
    const subject = encodeURIComponent(`${appType === "loan" ? "SME Loan" : "Savings"} Application – ${personal.firstName} ${personal.lastName}`);
    window.open(`https://mail.google.com/mail/?view=cm&to=${GMAIL}&su=${subject}&body=${buildEmailBody()}`, "_blank");
    setSubmitted(true);
  };

  const handleJotForm = () => { window.open(JOTFORM_URL, "_blank"); setSubmitted(true); };

  const resetAll = () => {
    setStep(0); setAppType(null); setSubmitted(false);
    setPersonal({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", country: "", additionalInfo: "", idType: "id", idNumber: "" });
    setLoanApp({ entityName: "", natureOfActivity: "", poBox: "", postalCode: "", town: "", mobile1: "", mobile2: "", physicalTown: "", street: "", building: "", premises: "", constitution: "", spouseMobile1: "", spouseMobile2: "", spouseEmail: "", loanAmount: "", loanPurpose: "", repaymentPeriod: "" });
    setSavingsApp({ accountType: "", initialDeposit: "", monthlyContribution: "", savingsGoal: "", targetDate: "", employmentStatus: "", employer: "", monthlyIncome: "", referral: "" });
  };

  const S = {
    app: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", minHeight: "100vh", background: "#f0f4ff" },
    header: { background: "white", borderBottom: "1px solid #e8edf5", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
    logoIcon: { width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#1a56db,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
    progressBar: { background: "white", borderBottom: "1px solid #e8edf5", padding: "12px 20px", overflowX: "auto" },
    main: { padding: "20px 16px", maxWidth: 600, margin: "0 auto" },
    card: { background: "white", borderRadius: 20, padding: "24px 20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: 16 },
    input: { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", fontSize: 15, fontFamily: "inherit", color: "#0f172a", background: "#fafbff", outline: "none", boxSizing: "border-box" },
    label: { display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, letterSpacing: "0.03em" },
    btnPrimary: { flex: 1, background: "linear-gradient(135deg,#1a56db,#3b82f6)", color: "white", border: "none", borderRadius: 14, padding: "15px 20px", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 14px rgba(26,86,219,0.3)" },
    btnSecondary: { background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 14, padding: "15px 18px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", flexShrink: 0 },
    btnGmail: { flex: 1, background: "linear-gradient(135deg,#dc2626,#ef4444)", color: "white", border: "none", borderRadius: 14, padding: "15px 20px", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 14px rgba(220,38,38,0.3)" },
    btnJotform: { flex: 1, background: "linear-gradient(135deg,#d97706,#f59e0b)", color: "white", border: "none", borderRadius: 14, padding: "15px 20px", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 14px rgba(217,119,6,0.3)" },
    sectionBox: { background: "#f8faff", border: "1px solid #e8edf5", borderRadius: 14, padding: 16, marginBottom: 16 },
    reviewCard: { background: "white", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 18, marginBottom: 12 },
  };

  const Field = ({ label, children, style }) => (
    <div style={{ marginBottom: 14, ...style }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );

  const Row = ({ children, cols = 2 }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12, marginBottom: 0 }}>
      {children}
    </div>
  );

  const BtnRow = ({ children }) => (
    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>{children}</div>
  );

  const ReviewRow = ({ label, value }) => value ? (
    <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
      <span style={{ fontSize: 13, color: "#94a3b8", minWidth: 80, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600, wordBreak: "break-word" }}>{value}</span>
    </div>
  ) : null;

  const stepState = (i) => i === step ? "active" : i < step ? "done" : "pending";
  const stepColors = { active: { bg: "#1a56db", color: "white" }, done: { bg: "#10b981", color: "white" }, pending: { bg: "#f1f5f9", color: "#94a3b8" } };

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: #1a56db !important; box-shadow: 0 0 0 3px rgba(26,86,219,0.1) !important; background: white !important; outline: none; }
        input::placeholder, textarea::placeholder { color: #cbd5e1; }
        .type-card:hover { border-color: #93c5fd !important; background: #eff6ff !important; }
        .radio-pill:has(input:checked) { border-color: #1a56db !important; background: #eff6ff !important; color: #1a56db !important; }
        button:active { opacity: 0.85; }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .slide-up { animation: slideUp 0.3s ease; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 8px rgba(16,185,129,0.1)} 50%{box-shadow:0 0 0 18px rgba(16,185,129,0.04)} }
      `}</style>

      {/* HEADER */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.logoIcon}>🏦</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>FinServe</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Financial Portal</div>
          </div>
        </div>
        {!submitted && (
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, background: "#f1f5f9", borderRadius: 20, padding: "4px 12px" }}>
            {step + 1} / {steps.length}
          </div>
        )}
      </div>

      {/* PROGRESS */}
      {!submitted && (
        <div style={S.progressBar}>
          <div style={{ display: "flex", alignItems: "center", maxWidth: 500, margin: "0 auto", minWidth: "max-content" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, transition: "all 0.3s", ...stepColors[stepState(i)] }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, marginLeft: 6, color: stepState(i) === "active" ? "#1a56db" : stepState(i) === "done" ? "#10b981" : "#94a3b8", whiteSpace: "nowrap" }}>{s}</span>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, margin: "0 8px", borderRadius: 2, background: i < step ? "#10b981" : "#e2e8f0" }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN */}
      <div style={S.main}>

        {submitted ? (
          <div className="slide-up" style={{ background: "white", borderRadius: 24, padding: "40px 24px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#d1fae5,#a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36, animation: "pulse 2s infinite" }}>✅</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Application Sent!</div>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 24 }}>
              Your <strong>{appType === "loan" ? "SME Loan" : "Savings Account"}</strong> application for <strong>{personal.firstName} {personal.lastName}</strong> has been submitted successfully.
            </p>
            <div style={{ background: "#f8faff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#64748b" }}>
              📧 Sent to: <strong style={{ color: "#1a56db" }}>{GMAIL}</strong>
            </div>
            <button style={{ ...S.btnPrimary, width: "100%", flex: "none" }} onClick={resetAll}>← Start New Application</button>
          </div>
        ) : (
          <>
            {/* STEP 0 */}
            {step === 0 && (
              <div className="slide-up" style={S.card}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a56db", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Get Started</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Welcome to FinServe</div>
                  <div style={{ fontSize: 14, color: "#64748b" }}>Choose your application type to begin</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {[
                    { id: "savings", icon: "💰", name: "Savings Account", desc: "Open a savings account and grow your money.", badgeBg: "#d1fae5", badgeColor: "#059669", badgeText: "Flexible", selBorder: "#10b981", selBg: "#ecfdf5", checkColor: "#059669" },
                    { id: "loan", icon: "🏢", name: "SME Loan", desc: "Business loan for small & medium enterprises.", badgeBg: "#dbeafe", badgeColor: "#1a56db", badgeText: "Fast Approval", selBorder: "#1a56db", selBg: "#eff6ff", checkColor: "#1a56db" },
                  ].map(opt => (
                    <div key={opt.id} className="type-card" onClick={() => setAppType(opt.id)} style={{
                      border: `2px solid ${appType === opt.id ? opt.selBorder : "#e2e8f0"}`,
                      borderRadius: 16, padding: "18px 14px", cursor: "pointer",
                      background: appType === opt.id ? opt.selBg : "#fafbff",
                      textAlign: "center", transition: "all 0.2s",
                      boxShadow: appType === opt.id ? `0 0 0 1px ${opt.selBorder}` : "none"
                    }}>
                      <div style={{ display: "inline-block", background: opt.badgeBg, color: opt.badgeColor, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>{opt.badgeText}</div>
                      <div style={{ fontSize: 34, marginBottom: 8 }}>{opt.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{opt.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{opt.desc}</div>
                      {appType === opt.id && <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: opt.checkColor }}>✓ Selected</div>}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  {["🔒 Secure", "⚡ Fast", "🎯 Expert Review"].map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, background: "#f8faff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#64748b", fontWeight: 500 }}>{t}</div>
                  ))}
                </div>

                <button style={{ ...S.btnPrimary, width: "100%", flex: "none", opacity: !appType ? 0.4 : 1, cursor: !appType ? "not-allowed" : "pointer" }} disabled={!appType} onClick={() => setStep(1)}>
                  Continue →
                </button>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="slide-up" style={S.card}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Customer Details</div>
                <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Please provide accurate personal information</div>

                <Row><Field label="First Name *"><input style={S.input} placeholder="First name" value={personal.firstName} onChange={e => up("firstName", e.target.value, setPersonal)} /></Field>
                <Field label="Last Name *"><input style={S.input} placeholder="Last name" value={personal.lastName} onChange={e => up("lastName", e.target.value, setPersonal)} /></Field></Row>

                <Field label="ID Type *">
                  <div style={{ display: "flex", gap: 10 }}>
                    {["id", "passport"].map(t => (
                      <label key={t} className="radio-pill" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#475569", background: "#fafbff", transition: "all 0.2s" }}>
                        <input type="radio" name="idType" value={t} checked={personal.idType === t} onChange={e => up("idType", e.target.value, setPersonal)} style={{ accentColor: "#1a56db", width: 15, height: 15 }} />
                        {t === "id" ? "National ID" : "Passport"}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="ID / Passport Number *"><input style={S.input} placeholder="Enter number" value={personal.idNumber} onChange={e => up("idNumber", e.target.value, setPersonal)} /></Field>
                <Field label="Email Address *"><input style={S.input} type="email" placeholder="your@email.com" value={personal.email} onChange={e => up("email", e.target.value, setPersonal)} /></Field>
                <Field label="Phone Number *"><input style={S.input} type="tel" placeholder="+254 700 000 000" value={personal.phone} onChange={e => up("phone", e.target.value, setPersonal)} /></Field>
                <Field label="Physical Address"><input style={S.input} placeholder="Street address" value={personal.address} onChange={e => up("address", e.target.value, setPersonal)} /></Field>

                <Row>
                  <Field label="Country">
                    <select style={S.input} value={personal.country} onChange={e => { up("country", e.target.value, setPersonal); up("city", "", setPersonal); }}>
                      <option value="">Select country</option>
                      {countries.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="City">
                    <select style={S.input} value={personal.city} onChange={e => up("city", e.target.value, setPersonal)} disabled={!personal.country}>
                      <option value="">{personal.country ? "Select city" : "Country first"}</option>
                      {cityOptions.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                </Row>

                <Field label="Additional Information">
                  <textarea style={{ ...S.input, resize: "vertical" }} rows={3} placeholder="Any other details..." value={personal.additionalInfo} onChange={e => up("additionalInfo", e.target.value, setPersonal)} />
                </Field>

                <BtnRow>
                  <button style={S.btnSecondary} onClick={() => setStep(0)}>← Back</button>
                  <button style={{ ...S.btnPrimary, opacity: !canStep1 ? 0.4 : 1, cursor: !canStep1 ? "not-allowed" : "pointer" }} disabled={!canStep1} onClick={() => setStep(2)}>Continue →</button>
                </BtnRow>
              </div>
            )}

            {/* STEP 2 LOAN */}
            {step === 2 && appType === "loan" && (
              <div className="slide-up" style={S.card}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>SME Loan Application</div>
                <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Business and loan details</div>

                <Field label="Name of Entity / Business *"><input style={S.input} placeholder="Registered business name" value={loanApp.entityName} onChange={e => up("entityName", e.target.value, setLoanApp)} /></Field>
                <Field label="Nature of Activity *"><input style={S.input} placeholder="e.g. Retail, Manufacturing" value={loanApp.natureOfActivity} onChange={e => up("natureOfActivity", e.target.value, setLoanApp)} /></Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <Field label="P.O. Box"><input style={S.input} placeholder="P.O. Box" value={loanApp.poBox} onChange={e => up("poBox", e.target.value, setLoanApp)} /></Field>
                  <Field label="Postal Code"><input style={S.input} placeholder="00100" value={loanApp.postalCode} onChange={e => up("postalCode", e.target.value, setLoanApp)} /></Field>
                  <Field label="Town"><input style={S.input} placeholder="Town" value={loanApp.town} onChange={e => up("town", e.target.value, setLoanApp)} /></Field>
                </div>

                <Row>
                  <Field label="Mobile No 1"><input style={S.input} placeholder="+254..." value={loanApp.mobile1} onChange={e => up("mobile1", e.target.value, setLoanApp)} /></Field>
                  <Field label="Mobile No 2"><input style={S.input} placeholder="+254..." value={loanApp.mobile2} onChange={e => up("mobile2", e.target.value, setLoanApp)} /></Field>
                </Row>

                <Field label="Physical Location">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    <input style={S.input} placeholder="Town" value={loanApp.physicalTown} onChange={e => up("physicalTown", e.target.value, setLoanApp)} />
                    <input style={S.input} placeholder="Street" value={loanApp.street} onChange={e => up("street", e.target.value, setLoanApp)} />
                    <input style={S.input} placeholder="Building" value={loanApp.building} onChange={e => up("building", e.target.value, setLoanApp)} />
                  </div>
                </Field>

                <Row>
                  <Field label="Business Premises">
                    <div style={{ display: "flex", gap: 8 }}>
                      {["Rented", "Owned"].map(v => (
                        <label key={v} className="radio-pill" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px", border: "1.5px solid #e2e8f0", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#475569", background: "#fafbff" }}>
                          <input type="radio" name="premises" value={v} checked={loanApp.premises === v} onChange={e => up("premises", e.target.value, setLoanApp)} style={{ accentColor: "#1a56db" }} />{v}
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="Constitution">
                    <select style={S.input} value={loanApp.constitution} onChange={e => up("constitution", e.target.value, setLoanApp)}>
                      <option value="">Select type</option>
                      <option>Sole Proprietor</option><option>Partnership</option><option>Company</option>
                    </select>
                  </Field>
                </Row>

                <div style={S.sectionBox}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", marginBottom: 12 }}>Spouse Information (Optional)</div>
                  <Row>
                    <input style={{ ...S.input, marginBottom: 10 }} placeholder="Spouse Mobile 1" value={loanApp.spouseMobile1} onChange={e => up("spouseMobile1", e.target.value, setLoanApp)} />
                    <input style={{ ...S.input, marginBottom: 10 }} placeholder="Spouse Mobile 2" value={loanApp.spouseMobile2} onChange={e => up("spouseMobile2", e.target.value, setLoanApp)} />
                  </Row>
                  <input style={S.input} placeholder="Spouse Email" value={loanApp.spouseEmail} onChange={e => up("spouseEmail", e.target.value, setLoanApp)} />
                </div>

                <div style={{ ...S.sectionBox, background: "#f0f5ff", border: "1px solid #c7d7f8" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a56db", marginBottom: 12 }}>💼 Loan Details</div>
                  <Row>
                    <Field label="Loan Amount *"><input style={S.input} placeholder="e.g. 500,000" value={loanApp.loanAmount} onChange={e => up("loanAmount", e.target.value, setLoanApp)} /></Field>
                    <Field label="Repayment Period">
                      <select style={S.input} value={loanApp.repaymentPeriod} onChange={e => up("repaymentPeriod", e.target.value, setLoanApp)}>
                        <option value="">Select period</option>
                        {["6 months","12 months","18 months","24 months","36 months","48 months","60 months"].map(p => <option key={p}>{p}</option>)}
                      </select>
                    </Field>
                  </Row>
                  <Field label="Loan Purpose *">
                    <textarea style={{ ...S.input, resize: "vertical" }} rows={2} placeholder="How will you use the loan?" value={loanApp.loanPurpose} onChange={e => up("loanPurpose", e.target.value, setLoanApp)} />
                  </Field>
                </div>

                <BtnRow>
                  <button style={S.btnSecondary} onClick={() => setStep(1)}>← Back</button>
                  <button style={{ ...S.btnPrimary, opacity: !canStep2 ? 0.4 : 1, cursor: !canStep2 ? "not-allowed" : "pointer" }} disabled={!canStep2} onClick={() => setStep(3)}>Review →</button>
                </BtnRow>
              </div>
            )}

            {/* STEP 2 SAVINGS */}
            {step === 2 && appType === "savings" && (
              <div className="slide-up" style={S.card}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Savings Application</div>
                <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Tell us about your savings goals</div>

                <Row>
                  <Field label="Account Type *">
                    <select style={S.input} value={savingsApp.accountType} onChange={e => up("accountType", e.target.value, setSavingsApp)}>
                      <option value="">Select type</option>
                      {["Regular Savings","Fixed Deposit","Junior Savings","Business Savings","Retirement Savings"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Employment Status *">
                    <select style={S.input} value={savingsApp.employmentStatus} onChange={e => up("employmentStatus", e.target.value, setSavingsApp)}>
                      <option value="">Select status</option>
                      {["Employed","Self-Employed","Business Owner","Student","Retired","Other"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </Row>

                <Row>
                  <Field label="Initial Deposit *"><input style={S.input} placeholder="e.g. 1,000" value={savingsApp.initialDeposit} onChange={e => up("initialDeposit", e.target.value, setSavingsApp)} /></Field>
                  <Field label="Monthly Contribution"><input style={S.input} placeholder="e.g. 500" value={savingsApp.monthlyContribution} onChange={e => up("monthlyContribution", e.target.value, setSavingsApp)} /></Field>
                </Row>

                <Row>
                  <Field label="Employer / Business"><input style={S.input} placeholder="Employer name" value={savingsApp.employer} onChange={e => up("employer", e.target.value, setSavingsApp)} /></Field>
                  <Field label="Monthly Income"><input style={S.input} placeholder="e.g. 3,000" value={savingsApp.monthlyIncome} onChange={e => up("monthlyIncome", e.target.value, setSavingsApp)} /></Field>
                </Row>

                <Row>
                  <Field label="Savings Goal"><input style={S.input} placeholder="e.g. House, Education" value={savingsApp.savingsGoal} onChange={e => up("savingsGoal", e.target.value, setSavingsApp)} /></Field>
                  <Field label="Target Date"><input style={S.input} type="date" value={savingsApp.targetDate} onChange={e => up("targetDate", e.target.value, setSavingsApp)} /></Field>
                </Row>

                <Field label="How did you hear about us?">
                  <select style={S.input} value={savingsApp.referral} onChange={e => up("referral", e.target.value, setSavingsApp)}>
                    <option value="">Select option</option>
                    {["Friend / Family","Social Media","Website","Agent","Advertisement","Other"].map(r => <option key={r}>{r}</option>)}
                  </select>
                </Field>

                <BtnRow>
                  <button style={S.btnSecondary} onClick={() => setStep(1)}>← Back</button>
                  <button style={{ ...S.btnPrimary, opacity: !canStep2 ? 0.4 : 1, cursor: !canStep2 ? "not-allowed" : "pointer" }} disabled={!canStep2} onClick={() => setStep(3)}>Review →</button>
                </BtnRow>
              </div>
            )}

            {/* STEP 3 REVIEW */}
            {step === 3 && (
              <div className="slide-up">
                <div style={{ padding: "0 4px", marginBottom: 16 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Review Application</div>
                  <div style={{ fontSize: 14, color: "#64748b" }}>Confirm your details before submitting</div>
                </div>

                <div style={S.reviewCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>Personal Information</span>
                    <button style={{ background: "none", border: "none", color: "#1a56db", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "4px 10px", borderRadius: 8 }} onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <ReviewRow label="Name" value={`${personal.firstName} ${personal.lastName}`} />
                  <ReviewRow label="Email" value={personal.email} />
                  <ReviewRow label="Phone" value={personal.phone} />
                  <ReviewRow label="ID" value={`${personal.idType.toUpperCase()} — ${personal.idNumber}`} />
                  <ReviewRow label="Location" value={[personal.city, personal.country].filter(Boolean).join(", ")} />
                </div>

                {appType === "loan" && (
                  <div style={{ ...S.reviewCard, borderColor: "#bfdbfe", background: "#f8fbff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1a56db", textTransform: "uppercase", letterSpacing: "0.07em" }}>🏢 SME Loan Details</span>
                      <button style={{ background: "none", border: "none", color: "#1a56db", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "4px 10px", borderRadius: 8 }} onClick={() => setStep(2)}>Edit</button>
                    </div>
                    <ReviewRow label="Business" value={loanApp.entityName} />
                    <ReviewRow label="Activity" value={loanApp.natureOfActivity} />
                    <ReviewRow label="Constitution" value={loanApp.constitution} />
                    <ReviewRow label="Premises" value={loanApp.premises} />
                    <ReviewRow label="Amount" value={loanApp.loanAmount} />
                    <ReviewRow label="Repayment" value={loanApp.repaymentPeriod} />
                    <ReviewRow label="Purpose" value={loanApp.loanPurpose} />
                  </div>
                )}

                {appType === "savings" && (
                  <div style={{ ...S.reviewCard, borderColor: "#a7f3d0", background: "#f0fdf9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.07em" }}>💰 Savings Details</span>
                      <button style={{ background: "none", border: "none", color: "#059669", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "4px 10px", borderRadius: 8 }} onClick={() => setStep(2)}>Edit</button>
                    </div>
                    <ReviewRow label="Account" value={savingsApp.accountType} />
                    <ReviewRow label="Deposit" value={savingsApp.initialDeposit} />
                    <ReviewRow label="Monthly" value={savingsApp.monthlyContribution} />
                    <ReviewRow label="Goal" value={savingsApp.savingsGoal} />
                    <ReviewRow label="Status" value={savingsApp.employmentStatus} />
                    <ReviewRow label="Income" value={savingsApp.monthlyIncome} />
                  </div>
                )}

                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 14, display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 }}>
                  <span>⚠️</span>
                  <span style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>Choose how to submit: <strong>Gmail</strong> opens your email app, <strong>JotForm</strong> opens an online form.</span>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button style={{ ...S.btnSecondary, flexShrink: 0 }} onClick={() => setStep(2)}>← Back</button>
                  <button style={S.btnGmail} onClick={handleGmail}>📧 Gmail</button>
                  <button style={S.btnJotform} onClick={handleJotForm}>📋 JotForm</button>
                </div>
              </div>
            )}
          </>
        )}

        <div style={{ textAlign: "center", padding: "16px 0", fontSize: 11, color: "#cbd5e1" }}>
          © 2026 FinServe Portal · SSL Secured · All Rights Reserved
        </div>
      </div>
    </div>
  );
}
