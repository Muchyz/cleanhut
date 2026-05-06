import { useState, useRef } from "react";

const PACKAGES = [
  { id: "welfare", icon: "🤝", name: "Welfare", desc: "For persons over 18yrs — compulsory for all adult members", fee: "KES 1,000", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
  { id: "soft_loan", icon: "💵", name: "Soft Loans", desc: "Affordable loans with flexible repayment terms", fee: "", color: "#0369a1", bg: "#f0f9ff", border: "#7dd3fc" },
  { id: "emergency_loan", icon: "🚨", name: "Emergency Loans", desc: "Quick disbursement for urgent financial needs", fee: "", color: "#b45309", bg: "#fffbeb", border: "#fcd34d" },
  { id: "school_fees", icon: "🎓", name: "School Fees Loans", desc: "Education financing for all levels", fee: "", color: "#7c3aed", bg: "#faf5ff", border: "#c4b5fd" },
  { id: "hospital", icon: "🏥", name: "Hospital Insurance", desc: "Medical cover for you and your family", fee: "", color: "#db2777", bg: "#fdf2f8", border: "#f9a8d4" },
  { id: "group", icon: "👥", name: "Group Projects", desc: "Collaborative community investment initiatives", fee: "", color: "#0f766e", bg: "#f0fdfa", border: "#5eead4" },
  { id: "initiation", icon: "🌱", name: "Initiation", desc: "New member onboarding and orientation", fee: "", color: "#c2410c", bg: "#fff7ed", border: "#fdba74" },
  { id: "water", icon: "💧", name: "Water Drilling", desc: "Borehole and water access projects", fee: "", color: "#0284c7", bg: "#f0f9ff", border: "#38bdf8" },
  { id: "farming", icon: "🌾", name: "Fertilizers & Seeds", desc: "Agricultural inputs and farming support", fee: "", color: "#65a30d", bg: "#f7fee7", border: "#bef264" },
  { id: "title_loan", icon: "🏠", name: "Title & Logbook Loans", desc: "Secured loans against property or vehicle", fee: "", color: "#6d28d9", bg: "#f5f3ff", border: "#a78bfa" },
];

const FEES = [
  { label: "Registration", amount: "500", icon: "📋" },
  { label: "File", amount: "200", icon: "🗂️" },
  { label: "Welfare (18yrs+)", amount: "1,000", icon: "🤝" },
];

const LOAN_TYPES = ["Soft Loan", "Emergency Loan", "School Fees Loan", "Title Loan", "Logbook Loan"];
const REPAYMENT = ["1 Month", "3 Months", "6 Months", "12 Months", "18 Months", "24 Months", "36 Months"];

export default function App() {
  const [screen, setScreen] = useState("home"); // home | register | loan
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Registration form
  const [reg, setReg] = useState({
    firstName: "", lastName: "", dob: "", phone: "", email: "",
    idType: "national_id", idNumber: "",
    packages: ["welfare"],
    selfie: null, selfiePreview: null,
    idFront: null, idFrontPreview: null,
    idBack: null, idBackPreview: null,
  });

  // Loan form
  const [loan, setLoan] = useState({
    firstName: "", lastName: "", phone: "", idNumber: "",
    loanType: "", loanAmount: "", purpose: "", repayment: "",
    selfie: null, selfiePreview: null,
    idFront: null, idFrontPreview: null,
    idBack: null, idBackPreview: null,
  });

  const selfieRef = useRef();
  const idFrontRef = useRef();
  const idBackRef = useRef();

  const upReg = (f, v) => setReg(p => ({ ...p, [f]: v }));
  const upLoan = (f, v) => setLoan(p => ({ ...p, [f]: v }));

  const togglePkg = (id) => {
    if (id === "welfare") return;
    setReg(p => ({
      ...p,
      packages: p.packages.includes(id)
        ? p.packages.filter(x => x !== id)
        : [...p.packages, id],
    }));
  };

  const handlePhoto = (field, previewField, file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setter(p => ({ ...p, [field]: file, [previewField]: e.target.result }));
    reader.readAsDataURL(file);
  };

  const regSteps = ["Personal Info", "Packages", "Documents", "Review"];
  const loanSteps = ["Your Details", "Loan Info", "Documents", "Review"];

  const canRegStep0 = reg.firstName && reg.lastName && reg.dob && reg.phone && reg.idNumber;
  const canRegStep1 = reg.packages.length > 0;
  const canRegStep2 = reg.selfiePreview && reg.idFrontPreview && reg.idBackPreview;
  const canLoanStep0 = loan.firstName && loan.lastName && loan.phone && loan.idNumber;
  const canLoanStep1 = loan.loanType && loan.loanAmount && loan.purpose && loan.repayment;
  const canLoanStep2 = loan.selfiePreview && loan.idFrontPreview && loan.idBackPreview;

  const totalFees = () => {
    let total = 500 + 200;
    if (reg.packages.includes("welfare")) total += 1000;
    return total.toLocaleString();
  };

  const PhotoUpload = ({ label, preview, inputRef, onCapture, icon }) => (
    <div style={{ flex: 1 }}>
      <div style={styles.photoLabel}>{label}</div>
      <div
        style={{
          ...styles.photoBox,
          background: preview ? "transparent" : "#f8faff",
          border: preview ? "2px solid #16a34a" : "2px dashed #cbd5e1",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Tap to upload</div>
          </div>
        )}
        {preview && (
          <div style={{ position: "absolute", top: 6, right: 6, background: "#16a34a", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white" }}>✓</div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => onCapture(e.target.files[0])} />
    </div>
  );

  const StepBar = ({ steps, current }) => (
    <div style={styles.stepBar}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i < current ? "#16a34a" : i === current ? "#1e3a5f" : "#e2e8f0",
              color: i <= current ? "white" : "#94a3b8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, flexShrink: 0,
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: i === current ? "#1e3a5f" : "#94a3b8", textAlign: "center", lineHeight: 1.2 }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < current ? "#16a34a" : "#e2e8f0", margin: "0 4px", marginBottom: 16 }} />}
        </div>
      ))}
    </div>
  );

  const Field = ({ label, required, children }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}</label>
      {children}
    </div>
  );

  // ── HOME ──
  if (screen === "home") return (
    <div style={styles.app}>
      <style>{cssGlobal}</style>

      {/* Hero Banner */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>EST. VAGRAM COMPANY</div>
        <div style={styles.heroLogo}>🏦</div>
        <h1 style={styles.heroTitle}>VAGRAM<br />CREDIT LIMITED</h1>
        <p style={styles.heroSub}>Welfare · Loans · Insurance · Farming<br />Building Communities Together</p>
      </div>

      <div style={styles.main}>

        {/* Fees Info */}
        <div style={styles.feesCard}>
          <div style={styles.sectionHead}>📋 Membership Fees</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {FEES.map(f => (
              <div key={f.label} style={styles.feeChip}>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>{f.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1e3a5f" }}>KES {f.amount}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.noteBox}>⚠️ <strong>Welfare (KES 1,000)</strong> is compulsory for every member above 18 years</div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase" }}>Requirements</div>
            {["Copy of National ID / Passport", "Birth Certificate (for children under 18 years)"].map(r => (
              <div key={r} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ color: "#16a34a", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: "#374151" }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div style={styles.sectionHead}>📦 Packages Offered</div>
        <div style={styles.pkgGrid}>
          {PACKAGES.map((p, i) => (
            <div key={p.id} style={{ ...styles.pkgCard, background: p.bg, borderColor: p.border }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{p.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: p.color, marginBottom: 2 }}>{i + 1}. {p.name}</div>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>{p.desc}</div>
              {p.fee && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: p.color }}>{p.fee}</div>}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          <button style={styles.btnGreen} onClick={() => { setScreen("register"); setStep(0); setDone(false); }}>
            🤝 Join as a Member
          </button>
          <button style={styles.btnBlue} onClick={() => { setScreen("loan"); setStep(0); setDone(false); }}>
            💵 Apply for a Loan
          </button>
        </div>

        <div style={styles.footer}>© 2026 Vagram Credit Limited · All Rights Reserved</div>
      </div>
    </div>
  );

  // ── SUCCESS ──
  if (done) return (
    <div style={styles.app}>
      <style>{cssGlobal}</style>
      <div style={{ ...styles.main, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1e3a5f", marginBottom: 8 }}>
          {screen === "register" ? "Registration Submitted!" : "Loan Application Submitted!"}
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 24 }}>
          Thank you, <strong>{screen === "register" ? reg.firstName : loan.firstName}</strong>!<br />
          Your application has been received. Our team will review and contact you shortly.
        </p>
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 14, padding: 16, marginBottom: 24, width: "100%", maxWidth: 340 }}>
          <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 700 }}>
            {screen === "register" ? `Total Fees: KES ${totalFees()}` : `Loan Request: KES ${Number(loan.loanAmount).toLocaleString()}`}
          </div>
        </div>
        <button style={styles.btnGreen} onClick={() => { setScreen("home"); setDone(false); }}>← Back to Home</button>
      </div>
    </div>
  );

  // ── REGISTER FLOW ──
  if (screen === "register") return (
    <div style={styles.app}>
      <style>{cssGlobal}</style>
      <div style={styles.formHeader}>
        <button style={styles.backBtn} onClick={() => step === 0 ? setScreen("home") : setStep(s => s - 1)}>←</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1e3a5f" }}>Member Registration</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Vagram Credit Limited</div>
        </div>
      </div>

      <StepBar steps={regSteps} current={step} />

      <div style={styles.main}>

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="slide-up">
            <div style={styles.cardTitle}>Personal Information</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="First Name" required><input style={styles.input} placeholder="e.g. John" value={reg.firstName} onChange={e => upReg("firstName", e.target.value)} /></Field>
              <Field label="Last Name" required><input style={styles.input} placeholder="e.g. Kamau" value={reg.lastName} onChange={e => upReg("lastName", e.target.value)} /></Field>
            </div>
            <Field label="Date of Birth" required>
              <input style={styles.input} type="date" value={reg.dob} onChange={e => upReg("dob", e.target.value)} />
            </Field>
            <Field label="Phone Number" required>
              <input style={styles.input} type="tel" placeholder="+254 700 000 000" value={reg.phone} onChange={e => upReg("phone", e.target.value)} />
            </Field>
            <Field label="Email Address">
              <input style={styles.input} type="email" placeholder="email@example.com" value={reg.email} onChange={e => upReg("email", e.target.value)} />
            </Field>
            <Field label="ID Type" required>
              <div style={{ display: "flex", gap: 10 }}>
                {[["national_id", "National ID"], ["passport", "Passport"], ["birth_cert", "Birth Certificate"]].map(([v, l]) => (
                  <label key={v} style={{ ...styles.radioPill, ...(reg.idType === v ? styles.radioPillActive : {}) }}>
                    <input type="radio" name="idType" value={v} checked={reg.idType === v} onChange={e => upReg("idType", e.target.value)} style={{ display: "none" }} />
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{l}</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="ID / Passport / Certificate Number" required>
              <input style={styles.input} placeholder="Enter document number" value={reg.idNumber} onChange={e => upReg("idNumber", e.target.value)} />
            </Field>
            <button style={{ ...styles.btnGreen, opacity: canRegStep0 ? 1 : 0.4 }} disabled={!canRegStep0} onClick={() => setStep(1)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 1: Packages */}
        {step === 1 && (
          <div className="slide-up">
            <div style={styles.cardTitle}>Select Packages</div>
            <div style={styles.noteBox}>🟢 Welfare is <strong>mandatory</strong> for members above 18 years (pre-selected)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {PACKAGES.map(p => {
                const sel = reg.packages.includes(p.id);
                const mandatory = p.id === "welfare";
                return (
                  <div key={p.id} onClick={() => togglePkg(p.id)} style={{
                    ...styles.pkgSelectCard,
                    background: sel ? p.bg : "white",
                    border: `2px solid ${sel ? p.color : "#e2e8f0"}`,
                    cursor: mandatory ? "default" : "pointer",
                    opacity: mandatory ? 0.9 : 1,
                  }}>
                    <span style={{ fontSize: 22 }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: sel ? p.color : "#374151" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.desc}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {p.fee && <span style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{p.fee}</span>}
                      {mandatory && <span style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", padding: "2px 6px", borderRadius: 20, fontWeight: 700 }}>MUST</span>}
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                        background: sel ? p.color : "#f1f5f9",
                        border: `2px solid ${sel ? p.color : "#cbd5e1"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: "white",
                      }}>{sel ? "✓" : ""}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ ...styles.feeChip, marginTop: 16, justifyContent: "space-between", padding: "14px 16px" }}>
              <span style={{ fontWeight: 700, color: "#1e3a5f" }}>Total Fees Payable</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#16a34a" }}>KES {totalFees()}</span>
            </div>

            <button style={{ ...styles.btnGreen, marginTop: 14, opacity: canRegStep1 ? 1 : 0.4 }} disabled={!canRegStep1} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="slide-up">
            <div style={styles.cardTitle}>Upload Documents</div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Please upload clear photos of the following. Tap each box to take a photo or choose from gallery.</p>

            <div style={styles.docSection}>
              <div style={styles.docSectionTitle}>📸 Selfie (Live Photo)</div>
              <div style={{ display: "flex" }}>
                <PhotoUpload
                  label="Take a clear selfie"
                  preview={reg.selfiePreview}
                  inputRef={selfieRef}
                  icon="🤳"
                  onCapture={f => handlePhoto("selfie", "selfiePreview", f, setReg)}
                />
              </div>
            </div>

            <div style={styles.docSection}>
              <div style={styles.docSectionTitle}>🪪 ID / Passport / Certificate</div>
              <div style={{ display: "flex", gap: 12 }}>
                <PhotoUpload label="Front Side" preview={reg.idFrontPreview} inputRef={idFrontRef} icon="🪪" onCapture={f => handlePhoto("idFront", "idFrontPreview", f, setReg)} />
                <PhotoUpload label="Back Side" preview={reg.idBackPreview} inputRef={idBackRef} icon="🔄" onCapture={f => handlePhoto("idBack", "idBackPreview", f, setReg)} />
              </div>
            </div>

            <button style={{ ...styles.btnGreen, opacity: canRegStep2 ? 1 : 0.4 }} disabled={!canRegStep2} onClick={() => setStep(3)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="slide-up">
            <div style={styles.cardTitle}>Review & Submit</div>

            <div style={styles.reviewBlock}>
              <div style={styles.reviewHead}>👤 Personal Details</div>
              {[
                ["Full Name", `${reg.firstName} ${reg.lastName}`],
                ["Date of Birth", reg.dob],
                ["Phone", reg.phone],
                ["Email", reg.email || "—"],
                ["ID Type", reg.idType.replace("_", " ").toUpperCase()],
                ["ID Number", reg.idNumber],
              ].map(([l, v]) => (
                <div key={l} style={styles.reviewRow}>
                  <span style={styles.reviewLbl}>{l}</span>
                  <span style={styles.reviewVal}>{v}</span>
                </div>
              ))}
            </div>

            <div style={styles.reviewBlock}>
              <div style={styles.reviewHead}>📦 Selected Packages</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {reg.packages.map(id => {
                  const p = PACKAGES.find(x => x.id === id);
                  return <span key={id} style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{p.icon} {p.name}</span>;
                })}
              </div>
            </div>

            <div style={styles.reviewBlock}>
              <div style={styles.reviewHead}>📷 Documents</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[["Selfie", reg.selfiePreview], ["ID Front", reg.idFrontPreview], ["ID Back", reg.idBackPreview]].map(([l, src]) => (
                  <div key={l} style={{ flex: 1, textAlign: "center" }}>
                    <img src={src} alt={l} style={{ width: "100%", height: 70, objectFit: "cover", borderRadius: 10, border: "1.5px solid #e2e8f0" }} />
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...styles.feeChip, justifyContent: "space-between", padding: "14px 16px", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, color: "#1e3a5f" }}>Total Fees</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#16a34a" }}>KES {totalFees()}</span>
            </div>

            <button style={styles.btnGreen} onClick={() => setDone(true)}>
              ✅ Submit Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── LOAN FLOW ──
  if (screen === "loan") return (
    <div style={styles.app}>
      <style>{cssGlobal}</style>
      <div style={styles.formHeader}>
        <button style={styles.backBtn} onClick={() => step === 0 ? setScreen("home") : setStep(s => s - 1)}>←</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1e3a5f" }}>Loan Application</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Vagram Credit Limited</div>
        </div>
      </div>

      <StepBar steps={loanSteps} current={step} />

      <div style={styles.main}>

        {/* Loan Step 0 */}
        {step === 0 && (
          <div className="slide-up">
            <div style={styles.cardTitle}>Applicant Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="First Name" required><input style={styles.input} placeholder="First name" value={loan.firstName} onChange={e => upLoan("firstName", e.target.value)} /></Field>
              <Field label="Last Name" required><input style={styles.input} placeholder="Last name" value={loan.lastName} onChange={e => upLoan("lastName", e.target.value)} /></Field>
            </div>
            <Field label="Phone Number" required>
              <input style={styles.input} type="tel" placeholder="+254 700 000 000" value={loan.phone} onChange={e => upLoan("phone", e.target.value)} />
            </Field>
            <Field label="National ID / Passport No." required>
              <input style={styles.input} placeholder="Enter document number" value={loan.idNumber} onChange={e => upLoan("idNumber", e.target.value)} />
            </Field>
            <button style={{ ...styles.btnBlue, opacity: canLoanStep0 ? 1 : 0.4 }} disabled={!canLoanStep0} onClick={() => setStep(1)}>
              Continue →
            </button>
          </div>
        )}

        {/* Loan Step 1 */}
        {step === 1 && (
          <div className="slide-up">
            <div style={styles.cardTitle}>Loan Details</div>
            <Field label="Loan Type" required>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {LOAN_TYPES.map(t => (
                  <label key={t} style={{ ...styles.pkgSelectCard, cursor: "pointer", padding: "12px 14px", ...(loan.loanType === t ? { background: "#eff6ff", border: "2px solid #1e3a5f" } : {}) }}>
                    <input type="radio" name="loanType" value={t} checked={loan.loanType === t} onChange={e => upLoan("loanType", e.target.value)} style={{ accentColor: "#1e3a5f", width: 16, height: 16 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: loan.loanType === t ? "#1e3a5f" : "#374151" }}>{t}</span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Loan Amount (KES)" required>
              <input style={styles.input} type="number" placeholder="e.g. 50000" value={loan.loanAmount} onChange={e => upLoan("loanAmount", e.target.value)} />
              {loan.loanAmount && (
                <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 700, marginTop: 4 }}>
                  KES {Number(loan.loanAmount).toLocaleString()}
                </div>
              )}
            </Field>

            <Field label="Repayment Period" required>
              <select style={styles.input} value={loan.repayment} onChange={e => upLoan("repayment", e.target.value)}>
                <option value="">Select period</option>
                {REPAYMENT.map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>

            <Field label="Loan Purpose" required>
              <textarea style={{ ...styles.input, resize: "vertical" }} rows={3} placeholder="How will you use this loan?" value={loan.purpose} onChange={e => upLoan("purpose", e.target.value)} />
            </Field>

            <button style={{ ...styles.btnBlue, opacity: canLoanStep1 ? 1 : 0.4 }} disabled={!canLoanStep1} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {/* Loan Step 2: Documents */}
        {step === 2 && (
          <div className="slide-up">
            <div style={styles.cardTitle}>Upload Documents</div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Upload clear photos of yourself and your ID/Passport.</p>

            <div style={styles.docSection}>
              <div style={styles.docSectionTitle}>📸 Selfie (Live Photo)</div>
              <div style={{ display: "flex" }}>
                <PhotoUpload label="Clear selfie photo" preview={loan.selfiePreview} inputRef={selfieRef} icon="🤳"
                  onCapture={f => handlePhoto("selfie", "selfiePreview", f, setLoan)} />
              </div>
            </div>

            <div style={styles.docSection}>
              <div style={styles.docSectionTitle}>🪪 National ID / Passport</div>
              <div style={{ display: "flex", gap: 12 }}>
                <PhotoUpload label="Front Side" preview={loan.idFrontPreview} inputRef={idFrontRef} icon="🪪"
                  onCapture={f => handlePhoto("idFront", "idFrontPreview", f, setLoan)} />
                <PhotoUpload label="Back Side" preview={loan.idBackPreview} inputRef={idBackRef} icon="🔄"
                  onCapture={f => handlePhoto("idBack", "idBackPreview", f, setLoan)} />
              </div>
            </div>

            <button style={{ ...styles.btnBlue, opacity: canLoanStep2 ? 1 : 0.4 }} disabled={!canLoanStep2} onClick={() => setStep(3)}>
              Continue →
            </button>
          </div>
        )}

        {/* Loan Step 3: Review */}
        {step === 3 && (
          <div className="slide-up">
            <div style={styles.cardTitle}>Review & Submit</div>

            <div style={styles.reviewBlock}>
              <div style={styles.reviewHead}>👤 Applicant Details</div>
              {[
                ["Full Name", `${loan.firstName} ${loan.lastName}`],
                ["Phone", loan.phone],
                ["ID Number", loan.idNumber],
              ].map(([l, v]) => (
                <div key={l} style={styles.reviewRow}>
                  <span style={styles.reviewLbl}>{l}</span>
                  <span style={styles.reviewVal}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ ...styles.reviewBlock, borderColor: "#bfdbfe", background: "#f0f9ff" }}>
              <div style={{ ...styles.reviewHead, color: "#1e3a5f" }}>💵 Loan Details</div>
              {[
                ["Loan Type", loan.loanType],
                ["Repayment", loan.repayment],
                ["Purpose", loan.purpose],
              ].map(([l, v]) => (
                <div key={l} style={styles.reviewRow}>
                  <span style={styles.reviewLbl}>{l}</span>
                  <span style={styles.reviewVal}>{v}</span>
                </div>
              ))}
              <div style={styles.reviewRow}>
                <span style={styles.reviewLbl}>Amount</span>
                <span style={{ ...styles.reviewVal, fontSize: 20, color: "#1e3a5f", fontWeight: 900 }}>KES {Number(loan.loanAmount).toLocaleString()}</span>
              </div>
            </div>

            <div style={styles.reviewBlock}>
              <div style={styles.reviewHead}>📷 Documents</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[["Selfie", loan.selfiePreview], ["ID Front", loan.idFrontPreview], ["ID Back", loan.idBackPreview]].map(([l, src]) => (
                  <div key={l} style={{ flex: 1, textAlign: "center" }}>
                    <img src={src} alt={l} style={{ width: "100%", height: 70, objectFit: "cover", borderRadius: 10, border: "1.5px solid #e2e8f0" }} />
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <button style={styles.btnBlue} onClick={() => setDone(true)}>
              ✅ Submit Loan Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── STYLES ──
const styles = {
  app: { fontFamily: "'Nunito', 'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f1f5f9", maxWidth: 480, margin: "0 auto" },
  hero: { background: "linear-gradient(160deg, #1e3a5f 0%, #0f2942 60%, #16a34a 100%)", padding: "36px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden" },
  heroBadge: { display: "inline-block", background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", padding: "4px 14px", borderRadius: 20, marginBottom: 12, textTransform: "uppercase" },
  heroLogo: { fontSize: 48, marginBottom: 8 },
  heroTitle: { fontSize: 32, fontWeight: 900, color: "white", margin: "0 0 10px", lineHeight: 1.1, letterSpacing: "-0.5px" },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 },
  main: { padding: "20px 16px 32px" },
  feesCard: { background: "white", borderRadius: 18, padding: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: 20 },
  feeChip: { display: "flex", alignItems: "center", gap: 10, background: "#f8faff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 14px" },
  noteBox: { background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#92400e", marginTop: 12 },
  sectionHead: { fontSize: 13, fontWeight: 800, color: "#1e3a5f", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" },
  pkgGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 },
  pkgCard: { borderRadius: 14, border: "1.5px solid", padding: "14px 12px", textAlign: "center" },
  btnGreen: { width: "100%", background: "linear-gradient(135deg, #16a34a, #15803d)", color: "white", border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 800, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 16px rgba(22,163,74,0.3)" },
  btnBlue: { width: "100%", background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)", color: "white", border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 800, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 16px rgba(30,58,95,0.3)" },
  footer: { textAlign: "center", fontSize: 10, color: "#cbd5e1", marginTop: 28, paddingTop: 12, borderTop: "1px solid #e2e8f0" },
  formHeader: { background: "white", borderBottom: "1px solid #e8edf5", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" },
  backBtn: { background: "#f1f5f9", border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", fontFamily: "inherit" },
  stepBar: { background: "white", borderBottom: "1px solid #e8edf5", padding: "14px 20px", display: "flex", alignItems: "center" },
  cardTitle: { fontSize: 20, fontWeight: 900, color: "#1e3a5f", marginBottom: 16 },
  label: { display: "block", fontSize: 11, fontWeight: 800, color: "#374151", marginBottom: 5, letterSpacing: "0.04em", textTransform: "uppercase" },
  input: { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", fontSize: 14, fontFamily: "'Nunito', sans-serif", color: "#0f172a", background: "#fafbff", outline: "none", boxSizing: "border-box" },
  radioPill: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 8px", border: "1.5px solid #e2e8f0", borderRadius: 10, cursor: "pointer", background: "#fafbff", transition: "all 0.2s" },
  radioPillActive: { borderColor: "#1e3a5f", background: "#eff6ff", color: "#1e3a5f" },
  pkgSelectCard: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border: "2px solid #e2e8f0", borderRadius: 14, background: "white", transition: "all 0.2s" },
  photoBox: { width: "100%", height: 120, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" },
  photoLabel: { fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" },
  docSection: { background: "#f8faff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, marginBottom: 14 },
  docSectionTitle: { fontSize: 12, fontWeight: 800, color: "#1e3a5f", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" },
  reviewBlock: { background: "white", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 16, marginBottom: 12 },
  reviewHead: { fontSize: 12, fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 },
  reviewRow: { display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" },
  reviewLbl: { fontSize: 12, color: "#94a3b8", minWidth: 90, flexShrink: 0 },
  reviewVal: { fontSize: 13, color: "#0f172a", fontWeight: 700, wordBreak: "break-word" },
};

const cssGlobal = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  input:focus, select:focus, textarea:focus { border-color: #1e3a5f !important; box-shadow: 0 0 0 3px rgba(30,58,95,0.1) !important; background: white !important; outline: none; }
  input::placeholder, textarea::placeholder { color: #cbd5e1; }
  button:active { opacity: 0.85; transform: scale(0.98); }
  @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  .slide-up { animation: slideUp 0.3s ease; }
`;
