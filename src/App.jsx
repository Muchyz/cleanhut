import { useState, useRef, useEffect } from "react";

/* ═══════════════ DATA ═══════════════ */
const PACKAGES = [
  { id:"welfare",    icon:"🤝", name:"Welfare",              desc:"Compulsory for all adults 18+", must:true, color:"#15803d", light:"#f0fdf4", border:"#86efac" },
  { id:"soft",       icon:"💵", name:"Soft Loans",           desc:"Affordable, flexible repayment",            color:"#1d4ed8", light:"#eff6ff", border:"#93c5fd" },
  { id:"emergency",  icon:"🚨", name:"Emergency Loans",      desc:"Instant disbursement when urgent",          color:"#b45309", light:"#fffbeb", border:"#fcd34d" },
  { id:"school",     icon:"🎓", name:"School Fees Loans",    desc:"Education financing, all levels",           color:"#7c3aed", light:"#f5f3ff", border:"#c4b5fd" },
  { id:"hospital",   icon:"🏥", name:"Hospital Insurance",   desc:"Medical cover for your family",             color:"#be185d", light:"#fdf2f8", border:"#f9a8d4" },
  { id:"group",      icon:"👥", name:"Group Projects",       desc:"Community investment initiatives",          color:"#0f766e", light:"#f0fdfa", border:"#5eead4" },
  { id:"initiation", icon:"🌱", name:"Initiation",           desc:"New member onboarding",                     color:"#c2410c", light:"#fff7ed", border:"#fdba74" },
  { id:"water",      icon:"💧", name:"Water Drilling",       desc:"Borehole & water access projects",          color:"#0284c7", light:"#f0f9ff", border:"#38bdf8" },
  { id:"farming",    icon:"🌾", name:"Fertilizers & Seeds",  desc:"Agricultural inputs & support",             color:"#65a30d", light:"#f7fee7", border:"#bef264" },
  { id:"title",      icon:"🏠", name:"Title & Logbook Loans",desc:"Secured loans on property/vehicle",         color:"#6d28d9", light:"#faf5ff", border:"#a78bfa" },
];

const LOAN_TYPES = ["Soft Loan","Emergency Loan","School Fees Loan","Title Loan","Logbook Loan"];
const REPAYMENTS = ["1 Month","3 Months","6 Months","12 Months","18 Months","24 Months","36 Months"];
const REG_STEPS  = ["Personal","Packages","Documents","Review"];
const LOAN_STEPS = ["Details","Loan Info","Documents","Review"];

const HERO_BG = "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80";

/* ═══════════════ CSS ═══════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f1f5f9; -webkit-font-smoothing: antialiased; }
  input, select, textarea {
    font-family: 'Outfit', sans-serif; font-size: 15px; color: #0f172a;
    background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px;
    padding: 12px 14px; width: 100%; outline: none;
    transition: border .2s, box-shadow .2s;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #15803d !important;
    box-shadow: 0 0 0 3px rgba(21,128,61,0.12) !important;
    background: #fff !important;
  }
  input::placeholder, textarea::placeholder { color: #cbd5e1; }
  select option { background:#fff; color:#0f172a; }
  textarea { resize: vertical; font-family: 'Outfit', sans-serif; }
  button { font-family: 'Outfit', sans-serif; }
  button:active { opacity:.87; transform:scale(.98); }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes bounce    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes menuSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .fu { animation: fadeUp .38s ease both; }
  .pkg-tile { transition: transform .2s, box-shadow .2s; }
  .pkg-tile:hover { transform: translateY(-3px); box-shadow: 0 8px 22px rgba(0,0,0,0.1); }
`;

/* ═══════════════ TOKENS ═══════════════ */
const T = {
  app:      { fontFamily:"'Outfit',sans-serif", minHeight:"100vh", background:"#f1f5f9", maxWidth:480, margin:"0 auto" },
  main:     { padding:"20px 16px 40px" },
  card:     { background:"#fff", borderRadius:20, padding:20, boxShadow:"0 2px 18px rgba(0,0,0,0.06)", marginBottom:18, border:"1px solid #f1f5f9" },
  cardTitle:{ fontSize:20, fontWeight:800, color:"#0f172a", marginBottom:4, fontFamily:"'Playfair Display',serif" },
  cardSub:  { fontSize:13, color:"#64748b", marginBottom:18 },
  secHead:  { fontSize:11, fontWeight:800, color:"#475569", textTransform:"uppercase", letterSpacing:".08em", marginBottom:12 },
  noteBox:  { background:"#fefce8", border:"1.5px solid #fde047", borderRadius:12, padding:"10px 14px", fontSize:12, color:"#713f12", lineHeight:1.6 },
  reqItem:  { display:"flex", gap:8, alignItems:"flex-start", marginBottom:7 },
  reqDot:   { color:"#15803d", fontWeight:900, fontSize:13, flexShrink:0, marginTop:1 },
  pkgGrid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 },
  pkgTile:  { borderRadius:16, padding:"14px 12px", border:"1.5px solid", textAlign:"center" },
  mustBadge:{ marginTop:6, display:"inline-block", background:"#fef3c7", color:"#92400e", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:20, letterSpacing:".06em" },
  btnGreen: { width:"100%", background:"linear-gradient(135deg,#15803d,#0f5c2a)", color:"#fff", border:"none", borderRadius:16, padding:"17px 20px", fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:"0 6px 24px rgba(21,128,61,0.32)", display:"flex", alignItems:"center", justifyContent:"center", gap:10 },
  btnOut:   { width:"100%", background:"#fff", color:"#15803d", border:"2.5px solid #15803d", borderRadius:16, padding:"15px 20px", fontSize:16, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 },
  footer:   { textAlign:"center", fontSize:10, color:"#cbd5e1", marginTop:28, paddingTop:16, borderTop:"1px solid #f1f5f9" },
  formHdr:  { background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"13px 16px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 10px rgba(0,0,0,0.05)" },
  backBtn:  { background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, width:38, height:38, fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#334155", lineHeight:1, flexShrink:0 },
  stepWrap: { background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"14px 20px", display:"flex", alignItems:"center" },
  label:    { display:"block", fontSize:11, fontWeight:800, color:"#374151", marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" },
  row2:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  pill:     { flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"11px 8px", border:"1.5px solid #e2e8f0", borderRadius:12, cursor:"pointer", fontSize:12, fontWeight:700, color:"#475569", background:"#f8fafc", transition:"all .18s" },
  pillOn:   { borderColor:"#15803d", background:"#f0fdf4", color:"#15803d" },
  listRow:  { display:"flex", alignItems:"center", gap:12, padding:"13px 14px", border:"2px solid #f1f5f9", borderRadius:14, background:"#fff", cursor:"pointer", transition:"all .15s", marginBottom:8 },
  photoSec: { background:"#f8faff", border:"1px solid #e8edf5", borderRadius:16, padding:14, marginBottom:14 },
  photoHd:  { fontSize:11, fontWeight:800, color:"#334155", textTransform:"uppercase", letterSpacing:".07em", marginBottom:10 },
  photoLbl: { fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".05em", marginBottom:5 },
  revBlock: { background:"#fff", border:"1.5px solid #f1f5f9", borderRadius:16, padding:16, marginBottom:12 },
  revHead:  { fontSize:11, fontWeight:800, color:"#15803d", textTransform:"uppercase", letterSpacing:".07em", marginBottom:12 },
  revRow:   { display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" },
  revLbl:   { fontSize:11, color:"#94a3b8", minWidth:90, flexShrink:0, textTransform:"uppercase", letterSpacing:".04em" },
  revVal:   { fontSize:13, color:"#0f172a", fontWeight:700, wordBreak:"break-word" },
  totalBox: { display:"flex", justifyContent:"space-between", alignItems:"center", background:"#f0fdf4", border:"1.5px solid #86efac", borderRadius:14, padding:"14px 16px", marginBottom:16 },
};

/* ═══════════════ NAVBAR ═══════════════ */
function Navbar({ onRegister, onLoan }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Bar */}
      <div style={{
        position:"fixed", top:0,
        left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, zIndex:300,
        background: scrolled ? "rgba(4,22,10,0.95)" : "rgba(0,0,0,0.30)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        boxShadow: scrolled ? "0 4px 28px rgba(0,0,0,0.4)" : "none",
        transition: "background .28s, box-shadow .28s",
      }}>
        <div style={{ display:"flex", alignItems:"center", height:54, padding:"0 14px", gap:10 }}>

          {/* Logo */}
          <div style={{
            width:32, height:32, borderRadius:8, flexShrink:0,
            background:"linear-gradient(135deg,#16a34a,#15803d)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16, boxShadow:"0 2px 8px rgba(21,128,61,0.5)",
          }}>🏦</div>

          {/* Name */}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:900, color:"#fff", letterSpacing:"-.2px", lineHeight:1.15, fontFamily:"'Playfair Display',serif" }}>VAGRAM</div>
            <div style={{ fontSize:8.5, color:"rgba(255,255,255,0.5)", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" }}>Credit Limited</div>
          </div>

          {/* Buttons */}
          <button onClick={onRegister} style={{
            background:"rgba(255,255,255,0.12)", color:"#fff",
            border:"1px solid rgba(255,255,255,0.22)",
            borderRadius:8, padding:"6px 12px",
            fontSize:12, fontWeight:700, cursor:"pointer",
            lineHeight:1, whiteSpace:"nowrap", flexShrink:0,
          }}>Join</button>

          <button onClick={onLoan} style={{
            background:"#15803d", color:"#fff", border:"none",
            borderRadius:8, padding:"6px 12px",
            fontSize:12, fontWeight:700, cursor:"pointer",
            lineHeight:1, whiteSpace:"nowrap", flexShrink:0,
            boxShadow:"0 2px 10px rgba(21,128,61,0.55)",
          }}>Loan</button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width:32, height:32, borderRadius:7, flexShrink:0,
              background:"rgba(255,255,255,0.10)",
              border:"1px solid rgba(255,255,255,0.18)",
              cursor:"pointer",
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:4.5, padding:0,
            }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display:"block", width:14, height:1.8,
                background:"#fff", borderRadius:2,
                transition:"all .22s ease",
                opacity: menuOpen && i===1 ? 0 : 1,
                transform: menuOpen
                  ? i===0 ? "rotate(45deg) translate(4.5px,4.5px)"
                  : i===2 ? "rotate(-45deg) translate(4.5px,-4.5px)"
                  : "none"
                  : "none",
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <div style={{
          position:"fixed", top:54,
          left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:480,
          background:"rgba(4,20,10,0.97)",
          backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
          borderBottom:"1px solid rgba(255,255,255,0.08)",
          zIndex:299,
          animation:"menuSlide .22s ease both",
        }}>
          {[
            { icon:"🏠", label:"Home",                 fn:() => setMenuOpen(false) },
            { icon:"🤝", label:"Member Registration",  fn:() => { onRegister(); setMenuOpen(false); } },
            { icon:"💵", label:"Apply for a Loan",     fn:() => { onLoan();     setMenuOpen(false); } },
          ].map(({ icon, label, fn }) => (
            <div key={label} onClick={fn} style={{
              display:"flex", alignItems:"center", gap:14,
              padding:"15px 18px",
              borderBottom:"1px solid rgba(255,255,255,0.06)",
              cursor:"pointer",
            }}>
              <span style={{ fontSize:19, width:26, textAlign:"center" }}>{icon}</span>
              <span style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.87)", flex:1 }}>{label}</span>
              <span style={{ color:"rgba(255,255,255,0.28)", fontSize:18 }}>›</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════ HERO ═══════════════ */
function Hero({ onRegister, onLoan }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div style={{ position:"relative", height:"100svh", minHeight:560, maxHeight:820, overflow:"hidden" }}>

      {/* Fallback gradient */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(150deg,#052e16 0%,#14532d 60%,#052e16 100%)",
      }} />

      {/* Photo */}
      <img
        src={HERO_BG} alt=""
        onLoad={() => setImgLoaded(true)}
        style={{
          position:"absolute", inset:0, width:"100%", height:"100%",
          objectFit:"cover", objectPosition:"center 30%",
          opacity: imgLoaded ? 1 : 0,
          transition:"opacity 1s ease",
        }}
      />

      {/* Overlay */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(3,18,9,0.58) 45%, rgba(2,12,6,0.91) 100%)",
      }} />

      {/* Glow accent */}
      <div style={{
        position:"absolute", bottom:-80, left:-80, width:300, height:300,
        borderRadius:"50%",
        background:"radial-gradient(circle, rgba(21,128,61,0.22) 0%, transparent 65%)",
        pointerEvents:"none",
      }} />

      {/* Content */}
      <div style={{
        position:"relative", zIndex:2, height:"100%",
        display:"flex", flexDirection:"column",
        justifyContent:"flex-end",
        padding:"76px 20px 30px",
      }}>

        {/* Live pill */}
        <div className="fu" style={{
          alignSelf:"flex-start", display:"flex", alignItems:"center", gap:8,
          background:"rgba(21,128,61,0.25)",
          backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)",
          border:"1px solid rgba(74,222,128,0.28)",
          borderRadius:50, padding:"5px 14px 5px 8px",
          marginBottom:16,
        }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#4ade80", display:"block", animation:"blink 1.8s ease infinite" }} />
          <span style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.88)", letterSpacing:".09em", textTransform:"uppercase" }}>
            Trusted Financial Partner
          </span>
        </div>

        {/* Heading */}
        <h1 className="fu" style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(30px,9vw,44px)",
          fontWeight:800, color:"#fff",
          lineHeight:1.05, letterSpacing:"-1px",
          marginBottom:10,
          textShadow:"0 2px 28px rgba(0,0,0,0.55)",
          animationDelay:".06s",
        }}>
          VAGRAM<br />
          <em style={{ fontStyle:"italic", color:"#4ade80" }}>CREDIT</em> LIMITED
        </h1>

        {/* Sub */}
        <p className="fu" style={{
          fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.85,
          marginBottom:22, animationDelay:".1s",
        }}>
          Welfare · Loans · Insurance<br />Farming · Group Projects
        </p>

        {/* Stats */}
        <div className="fu" style={{ display:"flex", gap:8, marginBottom:24, animationDelay:".13s" }}>
          {[["🤝","500+","Members"],["📦","10+","Packages"],["⚡","Fast","Loans"]].map(([ic,val,lbl]) => (
            <div key={lbl} style={{
              flex:1, textAlign:"center",
              background:"rgba(255,255,255,0.08)",
              backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
              border:"1px solid rgba(255,255,255,0.13)",
              borderRadius:14, padding:"10px 6px",
            }}>
              <div style={{ fontSize:15, marginBottom:3 }}>{ic}</div>
              <div style={{ fontSize:16, fontWeight:900, color:"#4ade80", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.5)", fontWeight:700, marginTop:3, letterSpacing:".06em", textTransform:"uppercase" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fu" style={{ display:"flex", gap:10, animationDelay:".16s" }}>
          <button onClick={onRegister} style={{
            flex:1, background:"linear-gradient(135deg,#16a34a,#15803d)",
            color:"#fff", border:"none", borderRadius:14, padding:"15px 10px",
            fontSize:14, fontWeight:800, cursor:"pointer",
            boxShadow:"0 6px 20px rgba(21,128,61,0.45)",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>🤝 Join Now</button>
          <button onClick={onLoan} style={{
            flex:1,
            background:"rgba(255,255,255,0.09)",
            backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)",
            color:"#fff", border:"1.5px solid rgba(255,255,255,0.25)",
            borderRadius:14, padding:"15px 10px",
            fontSize:14, fontWeight:800, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>💵 Apply Loan</button>
        </div>

        {/* Scroll hint */}
        <div style={{ textAlign:"center", marginTop:18, animation:"bounce 2s ease infinite" }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:".1em", textTransform:"uppercase" }}>Scroll</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.28)", marginTop:1 }}>↓</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ SHARED COMPONENTS ═══════════════ */
function StepBar({ steps, current }) {
  return (
    <div style={T.stepWrap}>
      {steps.map((s, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? 1 : "none" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{
              width:26, height:26, borderRadius:"50%", fontSize:11, fontWeight:800,
              display:"flex", alignItems:"center", justifyContent:"center",
              background: i < current ? "#15803d" : i === current ? "#0f4c27" : "#f1f5f9",
              color: i <= current ? "#fff" : "#94a3b8",
              border: i === current ? "2.5px solid #15803d" : "2px solid transparent",
            }}>{i < current ? "✓" : i+1}</div>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:".05em", textTransform:"uppercase", whiteSpace:"nowrap", color: i === current ? "#15803d" : i < current ? "#15803d" : "#cbd5e1" }}>{s}</span>
          </div>
          {i < steps.length-1 && <div style={{ flex:1, height:2, margin:"0 5px", marginBottom:16, borderRadius:2, background: i < current ? "#15803d" : "#f1f5f9" }} />}
        </div>
      ))}
    </div>
  );
}

function Fld({ label, required, children, mb }) {
  return (
    <div style={{ marginBottom: mb ?? 14 }}>
      {label && <label style={T.label}>{label}{required && <span style={{ color:"#ef4444", marginLeft:3 }}>*</span>}</label>}
      {children}
    </div>
  );
}

function PhotoBox({ label, preview, inputRef, onPick, icon }) {
  return (
    <div style={{ flex:1 }}>
      <div style={T.photoLbl}>{label}</div>
      <div onClick={() => inputRef.current?.click()} style={{
        height:112, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
        cursor:"pointer", overflow:"hidden", position:"relative", transition:"all .2s",
        background: preview ? "transparent" : "#f8faff",
        border: preview ? "2px solid #15803d" : "2px dashed #cbd5e1",
      }}>
        {preview
          ? <img src={preview} alt={label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <div style={{ textAlign:"center" }}><div style={{ fontSize:28, marginBottom:5 }}>{icon}</div><div style={{ fontSize:10, color:"#94a3b8", fontWeight:700 }}>Tap to upload</div></div>
        }
        {preview && <div style={{ position:"absolute", top:6, right:6, background:"#15803d", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", fontWeight:900 }}>✓</div>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => onPick(e.target.files[0])} />
    </div>
  );
}

function RevRow({ label, value }) {
  if (!value) return null;
  return <div style={T.revRow}><span style={T.revLbl}>{label}</span><span style={T.revVal}>{value}</span></div>;
}

function FormHeader({ title, step, total, onBack }) {
  return (
    <div style={T.formHdr}>
      <button style={T.backBtn} onClick={onBack}>‹</button>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", fontFamily:"'Playfair Display',serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{title}</div>
        <div style={{ fontSize:10, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".06em" }}>Vagram Credit Limited</div>
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:"#15803d", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:20, padding:"4px 12px", flexShrink:0 }}>{step+1} / {total}</div>
    </div>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [step,   setStep]   = useState(0);
  const [done,   setDone]   = useState(false);

  const [rFirst,setRFirst]=useState(""); const [rLast,setRLast]=useState("");
  const [rDob,setRDob]=useState(""); const [rPhone,setRPhone]=useState("");
  const [rEmail,setREmail]=useState(""); const [rIdType,setRIdType]=useState("national_id");
  const [rIdNum,setRIdNum]=useState(""); const [rPkgs,setRPkgs]=useState(["welfare"]);
  const [rSelP,setRSelP]=useState(null); const [rFrtP,setRFrtP]=useState(null); const [rBckP,setRBckP]=useState(null);

  const [lFirst,setLFirst]=useState(""); const [lLast,setLLast]=useState("");
  const [lPhone,setLPhone]=useState(""); const [lIdNum,setLIdNum]=useState("");
  const [lType,setLType]=useState(""); const [lAmount,setLAmount]=useState("");
  const [lPurpose,setLPurpose]=useState(""); const [lRepay,setLRepay]=useState("");
  const [lSelP,setLSelP]=useState(null); const [lFrtP,setLFrtP]=useState(null); const [lBckP,setLBckP]=useState(null);

  const rSelRef=useRef(); const rFrtRef=useRef(); const rBckRef=useRef();
  const lSelRef=useRef(); const lFrtRef=useRef(); const lBckRef=useRef();

  const loadPhoto=(file,setter)=>{ if(!file) return; const r=new FileReader(); r.onload=e=>setter(e.target.result); r.readAsDataURL(file); };
  const togglePkg=id=>{ if(id==="welfare") return; setRPkgs(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); };
  const totalFees=()=>(700+(rPkgs.includes("welfare")?1000:0)).toLocaleString();

  const canR0=rFirst&&rLast&&rDob&&rPhone&&rIdNum;
  const canR2=rSelP&&rFrtP&&rBckP;
  const canL0=lFirst&&lLast&&lPhone&&lIdNum;
  const canL1=lType&&lAmount&&lPurpose&&lRepay;
  const canL2=lSelP&&lFrtP&&lBckP;

  const goHome=()=>{setScreen("home");setStep(0);setDone(false);};
  const goReg=()=>{setScreen("register");setStep(0);setDone(false);};
  const goLoan=()=>{setScreen("loan");setStep(0);setDone(false);};

  /* ══ HOME ══ */
  if (screen==="home") return (
    <div style={T.app}>
      <style>{CSS}</style>
      <Navbar onRegister={goReg} onLoan={goLoan} />
      <Hero   onRegister={goReg} onLoan={goLoan} />

      <div style={T.main}>

        {/* Fees */}
        <div className="fu" style={T.card}>
          <div style={T.secHead}>📋 Membership Fees</div>

          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
            {[
              { icon:"📋", label:"Registration Fee",  sub:"One-time on joining",    amount:"500",   clr:"#15803d", bg:"#f0fdf4", bd:"#86efac" },
              { icon:"🗂️", label:"File Fee",           sub:"Document processing",    amount:"200",   clr:"#1d4ed8", bg:"#eff6ff", bd:"#93c5fd" },
              { icon:"🤝", label:"Welfare Fee (18+)",  sub:"Compulsory for adults",  amount:"1,000", clr:"#b45309", bg:"#fffbeb", bd:"#fcd34d" },
            ].map(({ icon,label,sub,amount,clr,bg,bd }) => (
              <div key={label} style={{
                display:"flex", alignItems:"center",
                background:bg, border:`1.5px solid ${bd}`,
                borderRadius:14, padding:"12px 14px", gap:12,
              }}>
                <div style={{ width:42,height:42,borderRadius:12,flexShrink:0,background:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:800,color:"#1e293b",lineHeight:1.2 }}>{label}</div>
                  <div style={{ fontSize:10,color:"#64748b",marginTop:2 }}>{sub}</div>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <div style={{ fontSize:9,color:"#94a3b8",fontWeight:700,letterSpacing:".04em",lineHeight:1 }}>KES</div>
                  <div style={{ fontSize:22,fontWeight:900,color:clr,fontFamily:"'Playfair Display',serif",lineHeight:1.15 }}>{amount}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",background:"#052e16",borderRadius:14,padding:"13px 16px",marginBottom:14 }}>
            <div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.5)",letterSpacing:".06em",textTransform:"uppercase" }}>Total (with Welfare)</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.38)",marginTop:2 }}>Reg + File + Welfare</div>
            </div>
            <span style={{ fontSize:24,fontWeight:900,color:"#4ade80",fontFamily:"'Playfair Display',serif" }}>KES 1,700</span>
          </div>

          <div style={T.noteBox}>⚠️ <strong>Welfare (KES 1,000)</strong> is compulsory for every member above 18 years.</div>

          <div style={{ marginTop:16 }}>
            <div style={T.secHead}>Requirements</div>
            {["Copy of National ID or Passport","Birth Certificate — for children under 18"].map(r=>(
              <div key={r} style={T.reqItem}><span style={T.reqDot}>◆</span><span style={{ fontSize:13,color:"#374151",lineHeight:1.5 }}>{r}</span></div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div className="fu" style={{ animationDelay:".06s" }}>
          <div style={T.secHead}>📦 Packages Offered</div>
          <div style={T.pkgGrid}>
            {PACKAGES.map((p,i)=>(
              <div key={p.id} className="fu pkg-tile" style={{ ...T.pkgTile,background:p.light,borderColor:p.border,animationDelay:`${i*.04}s` }}>
                <div style={{ fontSize:28,marginBottom:6 }}>{p.icon}</div>
                <div style={{ fontSize:12,fontWeight:800,color:p.color,marginBottom:3 }}>{p.name}</div>
                <div style={{ fontSize:10,color:"#64748b",lineHeight:1.4 }}>{p.desc}</div>
                {p.must && <div style={T.mustBadge}>MUST</div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="fu" style={{ display:"flex",flexDirection:"column",gap:12,animationDelay:".1s" }}>
          <button style={T.btnGreen} onClick={goReg}><span>🤝</span><span>Join as a Member</span></button>
          <button style={T.btnOut}   onClick={goLoan}><span>💵</span><span>Apply for a Loan</span></button>
        </div>

        <div style={T.footer}>© 2026 Vagram Credit Limited · All Rights Reserved</div>
      </div>
    </div>
  );

  /* ══ SUCCESS ══ */
  if (done) return (
    <div style={T.app}>
      <style>{CSS}</style>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 20px",textAlign:"center" }}>
        <div className="fu" style={{ fontSize:72,marginBottom:18 }}>✅</div>
        <h2 className="fu" style={{ fontSize:24,fontWeight:800,fontFamily:"'Playfair Display',serif",color:"#0f4c27",marginBottom:10,animationDelay:".07s" }}>
          {screen==="register"?"Registration Submitted!":"Application Submitted!"}
        </h2>
        <p className="fu" style={{ fontSize:14,color:"#64748b",lineHeight:1.8,marginBottom:24,animationDelay:".11s" }}>
          Thank you, <strong style={{ color:"#0f172a" }}>{screen==="register"?rFirst:lFirst}</strong>.<br/>Our team will review and contact you shortly.
        </p>
        <div className="fu" style={{ ...T.card,width:"100%",maxWidth:300,marginBottom:24,textAlign:"center",animationDelay:".15s" }}>
          <div style={{ fontSize:22,fontWeight:900,color:"#15803d",fontFamily:"'Playfair Display',serif" }}>
            {screen==="register"?`Total Fees: KES ${totalFees()}`:`Loan Request: KES ${Number(lAmount||0).toLocaleString()}`}
          </div>
        </div>
        <button className="fu" style={{ ...T.btnGreen,maxWidth:300,animationDelay:".19s" }} onClick={goHome}>← Back to Home</button>
      </div>
    </div>
  );

  /* ══ REGISTER ══ */
  if (screen==="register") return (
    <div style={T.app}>
      <style>{CSS}</style>
      <FormHeader title="Member Registration" step={step} total={REG_STEPS.length} onBack={()=>step===0?goHome():setStep(s=>s-1)} />
      <StepBar steps={REG_STEPS} current={step} />
      <div style={T.main}>
        {step===0&&(<div className="fu" style={T.card}>
          <div style={T.cardTitle}>Personal Information</div>
          <div style={T.cardSub}>Please fill in your details accurately</div>
          <div style={T.row2}>
            <Fld label="First Name" required><input placeholder="e.g. John" value={rFirst} onChange={e=>setRFirst(e.target.value)} /></Fld>
            <Fld label="Last Name"  required><input placeholder="e.g. Kamau" value={rLast} onChange={e=>setRLast(e.target.value)} /></Fld>
          </div>
          <Fld label="Date of Birth" required><input type="date" value={rDob} onChange={e=>setRDob(e.target.value)} /></Fld>
          <Fld label="Phone Number" required><input type="tel" placeholder="+254 700 000 000" value={rPhone} onChange={e=>setRPhone(e.target.value)} /></Fld>
          <Fld label="Email Address"><input type="email" placeholder="your@email.com" value={rEmail} onChange={e=>setREmail(e.target.value)} /></Fld>
          <Fld label="ID Type" required>
            <div style={{ display:"flex",gap:8 }}>
              {[["national_id","National ID"],["passport","Passport"],["birth_cert","Birth Cert"]].map(([v,l])=>(
                <div key={v} onClick={()=>setRIdType(v)} style={{ ...T.pill,...(rIdType===v?T.pillOn:{}) }}>{l}</div>
              ))}
            </div>
          </Fld>
          <Fld label="Document Number" required><input placeholder="ID / Passport number" value={rIdNum} onChange={e=>setRIdNum(e.target.value)} /></Fld>
          <button style={{ ...T.btnGreen,opacity:canR0?1:.4 }} disabled={!canR0} onClick={()=>setStep(1)}>Continue →</button>
        </div>)}
        {step===1&&(<div className="fu">
          <div style={T.card}><div style={T.cardTitle}>Select Packages</div><div style={T.cardSub}>Welfare is mandatory for adults 18+</div><div style={T.noteBox}>🟢 Welfare is pre-selected and cannot be removed</div></div>
          <div style={T.card}>
            {PACKAGES.map(p=>{const sel=rPkgs.includes(p.id);return(
              <div key={p.id} onClick={()=>togglePkg(p.id)} style={{ ...T.listRow,background:sel?p.light:"#fff",borderColor:sel?p.color:"#f1f5f9",cursor:p.must?"default":"pointer" }}>
                <span style={{ fontSize:22 }}>{p.icon}</span>
                <div style={{ flex:1 }}><div style={{ fontSize:13,fontWeight:800,color:sel?p.color:"#374151" }}>{p.name}</div><div style={{ fontSize:11,color:"#94a3b8" }}>{p.desc}</div></div>
                {p.must&&<span style={T.mustBadge}>MUST</span>}
                <div style={{ width:22,height:22,borderRadius:"50%",flexShrink:0,background:sel?p.color:"#f1f5f9",border:`2px solid ${sel?p.color:"#e2e8f0"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:900 }}>{sel?"✓":""}</div>
              </div>
            );})}
          </div>
          <div style={T.totalBox}><span style={{ fontWeight:800,color:"#0f172a" }}>Total Fees Payable</span><span style={{ fontSize:22,fontWeight:900,color:"#15803d",fontFamily:"'Playfair Display',serif" }}>KES {totalFees()}</span></div>
          <button style={T.btnGreen} onClick={()=>setStep(2)}>Continue →</button>
        </div>)}
        {step===2&&(<div className="fu" style={T.card}>
          <div style={T.cardTitle}>Upload Documents</div><div style={T.cardSub}>Tap each box to capture or choose a photo</div>
          <div style={T.photoSec}><div style={T.photoHd}>📸 Selfie</div><div style={{ display:"flex" }}><PhotoBox label="Live selfie photo" preview={rSelP} inputRef={rSelRef} icon="🤳" onPick={f=>loadPhoto(f,setRSelP)} /></div></div>
          <div style={T.photoSec}><div style={T.photoHd}>🪪 ID / Passport / Certificate</div><div style={{ display:"flex",gap:12 }}><PhotoBox label="Front Side" preview={rFrtP} inputRef={rFrtRef} icon="🪪" onPick={f=>loadPhoto(f,setRFrtP)} /><PhotoBox label="Back Side" preview={rBckP} inputRef={rBckRef} icon="🔄" onPick={f=>loadPhoto(f,setRBckP)} /></div></div>
          <button style={{ ...T.btnGreen,opacity:canR2?1:.4 }} disabled={!canR2} onClick={()=>setStep(3)}>Continue →</button>
        </div>)}
        {step===3&&(<div className="fu">
          <div style={{ ...T.cardTitle,marginBottom:4 }}>Review & Submit</div>
          <p style={{ fontSize:13,color:"#64748b",marginBottom:16 }}>Confirm your details below</p>
          <div style={T.revBlock}><div style={T.revHead}>👤 Personal Details</div><RevRow label="Full Name" value={`${rFirst} ${rLast}`} /><RevRow label="DOB" value={rDob} /><RevRow label="Phone" value={rPhone} /><RevRow label="Email" value={rEmail||"—"} /><RevRow label="ID Type" value={rIdType.replace("_"," ").toUpperCase()} /><RevRow label="ID Number" value={rIdNum} /></div>
          <div style={T.revBlock}><div style={T.revHead}>📦 Packages Selected</div><div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>{rPkgs.map(id=>{const p=PACKAGES.find(x=>x.id===id);return<span key={id} style={{ background:p.light,border:`1px solid ${p.border}`,color:p.color,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20 }}>{p.icon} {p.name}</span>;})}</div></div>
          <div style={T.revBlock}><div style={T.revHead}>📷 Documents</div><div style={{ display:"flex",gap:10 }}>{[["Selfie",rSelP],["ID Front",rFrtP],["ID Back",rBckP]].map(([l,src])=><div key={l} style={{ flex:1,textAlign:"center" }}><img src={src} alt={l} style={{ width:"100%",height:72,objectFit:"cover",borderRadius:10,border:"1.5px solid #e2e8f0" }} /><div style={{ fontSize:10,color:"#94a3b8",marginTop:4 }}>{l}</div></div>)}</div></div>
          <div style={T.totalBox}><span style={{ fontWeight:800,color:"#0f172a" }}>Total Fees</span><span style={{ fontSize:22,fontWeight:900,color:"#15803d",fontFamily:"'Playfair Display',serif" }}>KES {totalFees()}</span></div>
          <button style={T.btnGreen} onClick={()=>setDone(true)}>✅ Submit Registration</button>
        </div>)}
      </div>
    </div>
  );

  /* ══ LOAN ══ */
  if (screen==="loan") return (
    <div style={T.app}>
      <style>{CSS}</style>
      <FormHeader title="Loan Application" step={step} total={LOAN_STEPS.length} onBack={()=>step===0?goHome():setStep(s=>s-1)} />
      <StepBar steps={LOAN_STEPS} current={step} />
      <div style={T.main}>
        {step===0&&(<div className="fu" style={T.card}>
          <div style={T.cardTitle}>Applicant Details</div><div style={T.cardSub}>Your personal information</div>
          <div style={T.row2}><Fld label="First Name" required><input placeholder="First name" value={lFirst} onChange={e=>setLFirst(e.target.value)} /></Fld><Fld label="Last Name" required><input placeholder="Last name" value={lLast} onChange={e=>setLLast(e.target.value)} /></Fld></div>
          <Fld label="Phone Number" required><input type="tel" placeholder="+254 700 000 000" value={lPhone} onChange={e=>setLPhone(e.target.value)} /></Fld>
          <Fld label="National ID / Passport No." required><input placeholder="Document number" value={lIdNum} onChange={e=>setLIdNum(e.target.value)} /></Fld>
          <button style={{ ...T.btnGreen,opacity:canL0?1:.4 }} disabled={!canL0} onClick={()=>setStep(1)}>Continue →</button>
        </div>)}
        {step===1&&(<div className="fu" style={T.card}>
          <div style={T.cardTitle}>Loan Details</div><div style={T.cardSub}>Tell us about the loan you need</div>
          <Fld label="Loan Type" required>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {LOAN_TYPES.map(t=>(
                <div key={t} onClick={()=>setLType(t)} style={{ ...T.listRow,cursor:"pointer",padding:"12px 14px",background:lType===t?"#f0fdf4":"#fff",borderColor:lType===t?"#15803d":"#f1f5f9" }}>
                  <div style={{ width:16,height:16,borderRadius:"50%",flexShrink:0,border:`2px solid ${lType===t?"#15803d":"#cbd5e1"}`,background:lType===t?"#15803d":"transparent",display:"flex",alignItems:"center",justifyContent:"center" }}>{lType===t&&<div style={{ width:6,height:6,borderRadius:"50%",background:"#fff" }} />}</div>
                  <span style={{ fontSize:13,fontWeight:700,color:lType===t?"#15803d":"#374151" }}>{t}</span>
                </div>
              ))}
            </div>
          </Fld>
          <Fld label="Loan Amount (KES)" required>
            <input type="number" placeholder="e.g. 50000" value={lAmount} onChange={e=>setLAmount(e.target.value)} />
            {lAmount&&<div style={{ fontSize:12,color:"#15803d",fontWeight:700,marginTop:4 }}>KES {Number(lAmount).toLocaleString()}</div>}
          </Fld>
          <Fld label="Repayment Period" required><select value={lRepay} onChange={e=>setLRepay(e.target.value)}><option value="">Select period</option>{REPAYMENTS.map(r=><option key={r}>{r}</option>)}</select></Fld>
          <Fld label="Loan Purpose" required><textarea rows={3} placeholder="How will you use this loan?" value={lPurpose} onChange={e=>setLPurpose(e.target.value)} /></Fld>
          <button style={{ ...T.btnGreen,opacity:canL1?1:.4 }} disabled={!canL1} onClick={()=>setStep(2)}>Continue →</button>
        </div>)}
        {step===2&&(<div className="fu" style={T.card}>
          <div style={T.cardTitle}>Upload Documents</div><div style={T.cardSub}>Clear photos of yourself and your ID</div>
          <div style={T.photoSec}><div style={T.photoHd}>📸 Selfie</div><div style={{ display:"flex" }}><PhotoBox label="Live selfie photo" preview={lSelP} inputRef={lSelRef} icon="🤳" onPick={f=>loadPhoto(f,setLSelP)} /></div></div>
          <div style={T.photoSec}><div style={T.photoHd}>🪪 National ID / Passport</div><div style={{ display:"flex",gap:12 }}><PhotoBox label="Front Side" preview={lFrtP} inputRef={lFrtRef} icon="🪪" onPick={f=>loadPhoto(f,setLFrtP)} /><PhotoBox label="Back Side" preview={lBckP} inputRef={lBckRef} icon="🔄" onPick={f=>loadPhoto(f,setLBckP)} /></div></div>
          <button style={{ ...T.btnGreen,opacity:canL2?1:.4 }} disabled={!canL2} onClick={()=>setStep(3)}>Continue →</button>
        </div>)}
        {step===3&&(<div className="fu">
          <div style={{ ...T.cardTitle,marginBottom:4 }}>Review & Submit</div>
          <p style={{ fontSize:13,color:"#64748b",marginBottom:16 }}>Confirm before submitting</p>
          <div style={T.revBlock}><div style={T.revHead}>👤 Applicant</div><RevRow label="Full Name" value={`${lFirst} ${lLast}`} /><RevRow label="Phone" value={lPhone} /><RevRow label="ID No." value={lIdNum} /></div>
          <div style={{ ...T.revBlock,borderColor:"#bfdbfe",background:"#f0f9ff" }}><div style={{ ...T.revHead,color:"#1d4ed8" }}>💵 Loan Details</div><RevRow label="Type" value={lType} /><RevRow label="Repayment" value={lRepay} /><RevRow label="Purpose" value={lPurpose} /><div style={T.revRow}><span style={T.revLbl}>Amount</span><span style={{ ...T.revVal,fontSize:20,color:"#15803d",fontFamily:"'Playfair Display',serif" }}>KES {Number(lAmount).toLocaleString()}</span></div></div>
          <div style={T.revBlock}><div style={T.revHead}>📷 Documents</div><div style={{ display:"flex",gap:10 }}>{[["Selfie",lSelP],["ID Front",lFrtP],["ID Back",lBckP]].map(([l,src])=><div key={l} style={{ flex:1,textAlign:"center" }}><img src={src} alt={l} style={{ width:"100%",height:72,objectFit:"cover",borderRadius:10,border:"1.5px solid #e2e8f0" }} /><div style={{ fontSize:10,color:"#94a3b8",marginTop:4 }}>{l}</div></div>)}</div></div>
          <div style={{ ...T.totalBox,borderColor:"#93c5fd",background:"#eff6ff" }}><span style={{ fontWeight:800,color:"#0f172a" }}>Loan Requested</span><span style={{ fontSize:22,fontWeight:900,color:"#1d4ed8",fontFamily:"'Playfair Display',serif" }}>KES {Number(lAmount).toLocaleString()}</span></div>
          <button style={T.btnGreen} onClick={()=>setDone(true)}>✅ Submit Loan Application</button>
        </div>)}
      </div>
    </div>
  );
}
