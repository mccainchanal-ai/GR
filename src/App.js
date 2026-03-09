import { useState, useCallback } from "react";

// ─── Score band definitions ────────────────────────────────────────────────
const BANDS = {
  // Section I – Point Headings (10)
  headings: [
    {
      label: "Excellent — All headings persuasive, precise, proper format",
      pts: 10,
    },
    {
      label: "Good — Persuasive but lacks precision or minor format errors",
      pts: 8,
    },
    {
      label:
        "Satisfactory — Topic labels only or does not follow required format",
      pts: 5,
    },
    { label: "Poor — Not persuasive, significantly mis-formatted", pts: 2 },
    { label: "Inadequate — No headings or entirely deficient", pts: 0 },
  ],
  // Section II – Organization & Roadmap (10)
  org: [
    {
      label:
        "Excellent — Roadmap complete, logical sequence, seamless transitions",
      pts: 10,
    },
    {
      label: "Good — Roadmap present, minor gaps in transitions or sequencing",
      pts: 8,
    },
    {
      label: "Satisfactory — Roadmap incomplete or misplaced, weak transitions",
      pts: 5,
    },
    { label: "Poor — No effective roadmap, arguments hard to follow", pts: 2 },
    { label: "Inadequate — Roadmap entirely absent", pts: 0 },
  ],
  // CREAC 1 sub-components
  c1_c_open: [
    {
      label: "Satisfactory–Excellent — Clear, persuasive opening conclusion",
      pts: 1,
    },
    {
      label: "Poor/Inadequate — Missing, neutral, or misses trespasser issue",
      pts: 0,
    },
  ],
  c1_r: [
    {
      label: "Excellent — Accurate, synthesized, persuasive; key terms present",
      pts: 3,
    },
    { label: "Good — Generally accurate; minor synthesis gaps", pts: 2 },
    { label: "Satisfactory — Basic rule stated but incomplete", pts: 1 },
    { label: "Poor/Inadequate — Absent, wrong, or not synthesized", pts: 0 },
  ],
  c1_e: [
    {
      label:
        "Excellent — By point; thesis sentences; thorough synthesis; F-H-R",
      pts: 5,
    },
    {
      label:
        "Good — Mostly by point; thesis sentences with some topic sentences",
      pts: 4,
    },
    {
      label: "Satisfactory — Some by-case organization; topic sentences",
      pts: 3,
    },
    { label: "Poor — Minimal; string citations; little synthesis", pts: 1 },
    { label: "Inadequate — Absent or incomprehensible", pts: 0 },
  ],
  c1_a: [
    {
      label:
        "Excellent — All 4 analogy steps; direct fact comparisons; rebuttal; key words",
      pts: 5,
    },
    {
      label:
        "Good — Most analogy steps; mostly direct comparisons; counterargument touched",
      pts: 4,
    },
    {
      label:
        "Satisfactory — Basic application; some conclusion comparisons; no counteranalysis",
      pts: 3,
    },
    { label: "Poor — Largely conclusory; no fact-to-fact comparisons", pts: 1 },
    { label: "Inadequate — No meaningful application", pts: 0 },
  ],
  c1_c_close: [
    {
      label:
        "Satisfactory–Excellent — Persuasive; key words; flows from analysis",
      pts: 2,
    },
    { label: "Poor — Weak, generic, or partially consistent", pts: 1 },
    { label: "Inadequate — Absent or inconsistent", pts: 0 },
  ],
  // CREAC 2 sub-components
  c2_c_open: [
    {
      label: "Satisfactory–Excellent — Clear, persuasive conclusion on duty",
      pts: 2,
    },
    { label: "Poor — Vague, neutral, or lacking persuasive force", pts: 1 },
    { label: "Inadequate — Absent or misplaced", pts: 0 },
  ],
  c2_r: [
    {
      label:
        "Excellent — Comprehensive, synthesized; foreseeability standard clear",
      pts: 5,
    },
    { label: "Good — Generally accurate; minor synthesis gaps", pts: 4 },
    {
      label: "Satisfactory — Basic rule; foreseeability underdeveloped",
      pts: 3,
    },
    { label: "Poor — Significant errors; foreseeability misstated", pts: 1 },
    { label: "Inadequate — Absent or fundamentally wrong", pts: 0 },
  ],
  c2_e: [
    {
      label:
        "Excellent — By point; persuasive thesis sentences; thorough synthesis; F-H-R",
      pts: 7,
    },
    {
      label:
        "Good — By point mostly; thesis sentences; most authorities present",
      pts: 6,
    },
    { label: "Satisfactory — Basic; some by-case; F-H-R gaps", pts: 4 },
    {
      label: "Poor — Little organization; string-cited; minimal explanation",
      pts: 1,
    },
    { label: "Inadequate — No meaningful explanation", pts: 0 },
  ],
  c2_a: [
    {
      label:
        "Excellent — All 4 steps; direct fact comparisons; reasoning applied; strong rebuttal",
      pts: 8,
    },
    {
      label: "Good — Most steps; mostly direct; counterarguments addressed",
      pts: 6,
    },
    {
      label:
        "Satisfactory — Adequate; some conclusion comparisons; counteranalysis thin",
      pts: 4,
    },
    { label: "Poor — Largely conclusory; no fact-to-fact comparisons", pts: 1 },
    { label: "Inadequate — No meaningful application", pts: 0 },
  ],
  c2_c_close: [
    {
      label:
        "Satisfactory–Excellent — Persuasive; key words; flows from analysis",
      pts: 2,
    },
    { label: "Poor — Weak or generic", pts: 1 },
    { label: "Inadequate — Absent or inconsistent", pts: 0 },
  ],
  // CREAC 3 sub-components
  c3_c_open: [
    {
      label:
        "Satisfactory–Excellent — Clear, persuasive conclusion on voluntary assumption",
      pts: 2,
    },
    { label: "Poor — Vague, neutral, or lacking persuasive force", pts: 1 },
    { label: "Inadequate — Absent or misplaced", pts: 0 },
  ],
  c3_r: [
    {
      label:
        "Excellent — Complete; scope limitation addressed; strong synthesis",
      pts: 5,
    },
    {
      label:
        "Good — Generally accurate; scope limitation present but underdeveloped",
      pts: 4,
    },
    {
      label: "Satisfactory — Basic rule; scope limitation missing or weak",
      pts: 3,
    },
    { label: "Poor — Significant errors; scope not addressed", pts: 1 },
    { label: "Inadequate — Absent or fundamentally wrong", pts: 0 },
  ],
  c3_e: [
    {
      label:
        "Excellent — By point; persuasive thesis sentences; scope explained; strong synthesis",
      pts: 8,
    },
    {
      label: "Good — By point mostly; thesis sentences; scope addressed",
      pts: 6,
    },
    { label: "Satisfactory — Basic; scope confused; F-H-R gaps", pts: 4 },
    {
      label: "Poor — Little organization; scope not addressed; string-cited",
      pts: 1,
    },
    { label: "Inadequate — No meaningful explanation", pts: 0 },
  ],
  c3_a: [
    {
      label:
        "Excellent — All 4 steps; Mullins/Davis comparisons; scope applied; landlord conduct analyzed",
      pts: 8,
    },
    {
      label:
        "Good — Most steps; Mullins/Davis compared; scope touched; counterarguments addressed",
      pts: 6,
    },
    {
      label: "Satisfactory — Adequate; scope not applied; counteranalysis thin",
      pts: 4,
    },
    {
      label: "Poor — Conclusory; landlord conduct ignored; no fact comparisons",
      pts: 1,
    },
    { label: "Inadequate — No meaningful application", pts: 0 },
  ],
  c3_c_close: [
    {
      label:
        "Satisfactory–Excellent — Persuasive; key words; Conclusion section and signature present",
      pts: 2,
    },
    {
      label:
        "Poor — Weak; Conclusion section incomplete; minor signature issues",
      pts: 1,
    },
    {
      label: "Inadequate — Absent; Conclusion section or signature missing",
      pts: 0,
    },
  ],
  // Section IV – Citation (10)
  citation: [
    {
      label:
        "Excellent — All citations correct; pin cites; proper short forms; names underlined",
      pts: 10,
    },
    {
      label:
        "Good — Generally correct; pin cites mostly present; isolated errors",
      pts: 8,
    },
    {
      label:
        "Satisfactory — Citations present; pin cites often missing; short forms misused",
      pts: 6,
    },
    {
      label:
        "Poor — Numerous missing; no pin cites; incorrect forms throughout",
      pts: 3,
    },
    { label: "Inadequate — Citations absent or entirely deficient", pts: 0 },
  ],
  // Section V – Persuasive Writing (5)
  persuasion: [
    {
      label:
        "Excellent — Consistently persuasive, plain English, professional, no passive voice",
      pts: 5,
    },
    {
      label: "Good — Generally persuasive; passive voice used sparingly",
      pts: 4,
    },
    {
      label:
        "Satisfactory — Some persuasive techniques; often neutral or legalistic",
      pts: 3,
    },
    {
      label: "Poor — Largely neutral or defensive; imprecise language",
      pts: 1,
    },
    { label: "Inadequate — No persuasive orientation", pts: 0 },
  ],
};

const DEDUCTION_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const gradeFromScore = (n) => {
  if (n >= 93) return { letter: "A", color: "#16a34a" };
  if (n >= 90) return { letter: "A−", color: "#16a34a" };
  if (n >= 87) return { letter: "B+", color: "#2563eb" };
  if (n >= 83) return { letter: "B", color: "#2563eb" };
  if (n >= 80) return { letter: "B−", color: "#2563eb" };
  if (n >= 77) return { letter: "C+", color: "#d97706" };
  if (n >= 73) return { letter: "C", color: "#d97706" };
  if (n >= 70) return { letter: "C−", color: "#d97706" };
  if (n >= 67) return { letter: "D+", color: "#dc2626" };
  if (n >= 63) return { letter: "D", color: "#dc2626" };
  if (n >= 60) return { letter: "D−", color: "#dc2626" };
  return { letter: "F", color: "#991b1b" };
};

// ─── Sub-components ────────────────────────────────────────────────────────

function ScoreSelect({ id, bands, value, onChange }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        onChange(id, e.target.value === "" ? null : Number(e.target.value))
      }
      className="score-select"
    >
      <option value="">— select —</option>
      {bands.map((b, i) => (
        <option key={i} value={b.pts}>
          {b.label} ({b.pts} pt{b.pts !== 1 ? "s" : ""})
        </option>
      ))}
    </select>
  );
}

function CommentBox({ id, value, onChange, placeholder = "Comments…" }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      placeholder={placeholder}
      className="comment-box"
      rows={2}
    />
  );
}

function ScoreRow({ label, max, earned }) {
  const pct =
    max > 0 && earned !== null ? Math.round((earned / max) * 100) : null;
  return (
    <div className="score-row">
      <span className="score-row-label">{label}</span>
      <span className="score-row-pts">
        {earned !== null ? earned : "—"} / {max}
        {pct !== null && <span className="score-row-pct"> ({pct}%)</span>}
      </span>
    </div>
  );
}

function SectionHeader({ roman, title, max }) {
  return (
    <div className="section-header">
      <div className="section-title">
        <span className="section-roman">{roman}</span>
        <span className="section-name">{title}</span>
      </div>
      <div className="section-max">{max} pts</div>
    </div>
  );
}

function SubHeader({ letter, title, max }) {
  return (
    <div className="sub-header">
      <span className="sub-letter">{letter}</span>
      <span className="sub-title">{title}</span>
      <span className="sub-max">/{max}</span>
    </div>
  );
}

function CreacBlock({
  num,
  title,
  issue,
  pts,
  fields,
  scores,
  comments,
  onScore,
  onComment,
}) {
  const keys = fields.map((f) => f.key);
  const earned = keys.reduce((sum, k) => sum + (scores[k] ?? 0), 0);
  const allSet = keys.every(
    (k) => scores[k] !== undefined && scores[k] !== null
  );

  return (
    <div className="creac-block">
      <div className="creac-header">
        <div>
          <div className="creac-title">
            CREAC {num} — {title}
          </div>
          <div className="creac-issue">{issue}</div>
        </div>
        <div className={`creac-score-badge ${allSet ? "complete" : ""}`}>
          <span className="badge-earned">{allSet ? earned : "—"}</span>
          <span className="badge-max">/{pts}</span>
        </div>
      </div>

      {fields.map((f) => (
        <div key={f.key} className="field-group">
          <SubHeader letter={f.letter} title={f.title} max={f.max} />
          <ScoreSelect
            id={f.key}
            bands={BANDS[f.bandKey]}
            value={scores[f.key] ?? null}
            onChange={onScore}
          />
          <CommentBox
            id={`${f.key}_comment`}
            value={comments[`${f.key}_comment`] || ""}
            onChange={onComment}
          />
        </div>
      ))}

      <div className="creac-subtotal">
        CREAC {num} Subtotal:{" "}
        <strong>
          {allSet ? earned : "—"} / {pts}
        </strong>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function RubricForm() {
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});
  const [studentId, setStudentId] = useState("");
  const [side, setSide] = useState("");

  const onScore = useCallback(
    (k, v) => setScores((s) => ({ ...s, [k]: v })),
    []
  );
  const onComment = useCallback(
    (k, v) => setComments((c) => ({ ...c, [k]: v })),
    []
  );

  // ── Computed totals ──────────────────────────────────────────────────────
  const s = scores;
  const get = (k) => s[k] ?? null;

  const sec1 = get("headings");
  const sec2 = get("org");

  const c1Keys = ["c1_c_open", "c1_r", "c1_e", "c1_a", "c1_c_close"];
  const c2Keys = ["c2_c_open", "c2_r", "c2_e", "c2_a", "c2_c_close"];
  const c3Keys = ["c3_c_open", "c3_r", "c3_e", "c3_a", "c3_c_close"];

  const cSum = (keys) => {
    const vals = keys.map((k) => get(k));
    if (vals.some((v) => v === null)) return null;
    return vals.reduce((a, b) => a + b, 0);
  };
  const c1 = cSum(c1Keys);
  const c2 = cSum(c2Keys);
  const c3 = cSum(c3Keys);

  const sec3 = c1 !== null && c2 !== null && c3 !== null ? c1 + c2 + c3 : null;
  const sec4 = get("citation");
  const sec5 = get("persuasion");
  const ded = get("deduction") ?? 0;

  const allSections = [sec1, sec2, sec3, sec4, sec5];
  const baseTotal = allSections.every((v) => v !== null)
    ? allSections.reduce((a, b) => a + b, 0)
    : null;
  const total = baseTotal !== null ? Math.max(0, baseTotal - ded) : null;

  const grade = total !== null ? gradeFromScore(total) : null;

  const allDone = total !== null;

  // ── Print ────────────────────────────────────────────────────────────────
  const handlePrint = () => window.print();

  // ── CREAC field definitions ──────────────────────────────────────────────
  const creac1Fields = [
    {
      key: "c1_c_open",
      letter: "C",
      title: "Opening Conclusion",
      max: 1,
      bandKey: "c1_c_open",
    },
    { key: "c1_r", letter: "R", title: "Rule", max: 3, bandKey: "c1_r" },
    {
      key: "c1_e",
      letter: "E",
      title: "Rule Explanation",
      max: 5,
      bandKey: "c1_e",
    },
    { key: "c1_a", letter: "A", title: "Application", max: 5, bandKey: "c1_a" },
    {
      key: "c1_c_close",
      letter: "C",
      title: "Closing Conclusion",
      max: 2,
      bandKey: "c1_c_close",
    },
  ];
  const creac2Fields = [
    {
      key: "c2_c_open",
      letter: "C",
      title: "Opening Conclusion",
      max: 2,
      bandKey: "c2_c_open",
    },
    { key: "c2_r", letter: "R", title: "Rule", max: 5, bandKey: "c2_r" },
    {
      key: "c2_e",
      letter: "E",
      title: "Rule Explanation",
      max: 7,
      bandKey: "c2_e",
    },
    { key: "c2_a", letter: "A", title: "Application", max: 8, bandKey: "c2_a" },
    {
      key: "c2_c_close",
      letter: "C",
      title: "Closing Conclusion",
      max: 2,
      bandKey: "c2_c_close",
    },
  ];
  const creac3Fields = [
    {
      key: "c3_c_open",
      letter: "C",
      title: "Opening Conclusion",
      max: 2,
      bandKey: "c3_c_open",
    },
    { key: "c3_r", letter: "R", title: "Rule", max: 5, bandKey: "c3_r" },
    {
      key: "c3_e",
      letter: "E",
      title: "Rule Explanation",
      max: 8,
      bandKey: "c3_e",
    },
    { key: "c3_a", letter: "A", title: "Application", max: 8, bandKey: "c3_a" },
    {
      key: "c3_c_close",
      letter: "C",
      title: "Closing Conclusion",
      max: 2,
      bandKey: "c3_c_close",
    },
  ];

  // ── Completion progress ──────────────────────────────────────────────────
  const allFields = [
    "headings",
    "org",
    ...c1Keys,
    ...c2Keys,
    ...c3Keys,
    "citation",
    "persuasion",
    "deduction",
  ];
  const filled = allFields.filter((k) => get(k) !== null).length;
  const progress = Math.round((filled / allFields.length) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&family=JetBrains+Mono:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:   #1a2744;
          --ink:    #0f1b33;
          --gold:   #c8992a;
          --gold-lt:#f5e6c0;
          --rule:   #d4c5a0;
          --cream:  #faf8f4;
          --paper:  #f5f2eb;
          --mist:   #e8e4dc;
          --slate:  #5a6070;
          --green:  #16a34a;
          --blue:   #2563eb;
          --amber:  #d97706;
          --red:    #dc2626;
          --sans:   'Source Serif 4', Georgia, serif;
          --mono:   'JetBrains Mono', monospace;
          --display:'Playfair Display', Georgia, serif;
          --radius: 3px;
          --shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06);
        }

        body { background: var(--paper); font-family: var(--sans); color: var(--ink); }

        /* ── Layout ── */
        .app { max-width: 900px; margin: 0 auto; padding: 0 0 80px; }

        /* ── Masthead ── */
        .masthead {
          background: var(--navy);
          color: white;
          padding: 32px 40px 24px;
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 2px 12px rgba(0,0,0,.25);
        }
        .masthead-top {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 20px;
        }
        .masthead-title {
          font-family: var(--display);
          font-size: 1.1rem; font-weight: 700; letter-spacing: .02em;
          color: var(--gold-lt);
          line-height: 1.2;
        }
        .masthead-sub {
          font-size: .78rem; color: rgba(255,255,255,.55); margin-top: 3px;
          font-style: italic; font-family: var(--sans);
        }
        .score-display {
          display: flex; align-items: center; gap: 16px; flex-shrink: 0;
        }
        .total-pts {
          font-family: var(--mono); font-size: 2rem; font-weight: 600;
          color: white; line-height: 1;
        }
        .total-pts span { font-size: 1rem; color: rgba(255,255,255,.5); font-weight: 400; }
        .grade-badge {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--display); font-size: 1.3rem; font-weight: 900;
          border: 2px solid rgba(255,255,255,.2);
          transition: background .3s, color .3s;
        }
        .progress-bar-wrap { margin-top: 14px; }
        .progress-label { font-size: .7rem; color: rgba(255,255,255,.4); margin-bottom: 4px; letter-spacing: .08em; text-transform: uppercase; }
        .progress-track { height: 3px; background: rgba(255,255,255,.12); border-radius: 2px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--gold); transition: width .4s ease; border-radius: 2px; }

        /* ── Student info bar ── */
        .info-bar {
          background: var(--cream); border-bottom: 1px solid var(--mist);
          padding: 12px 40px; display: flex; gap: 24px; align-items: center;
        }
        .info-field { display: flex; align-items: center; gap: 8px; }
        .info-label { font-size: .72rem; text-transform: uppercase; letter-spacing: .1em; color: var(--slate); }
        .info-input {
          border: none; border-bottom: 1.5px solid var(--rule); background: transparent;
          font-family: var(--mono); font-size: .85rem; color: var(--ink);
          padding: 2px 4px; outline: none; width: 160px;
        }
        .info-input:focus { border-color: var(--gold); }
        .side-select {
          border: none; border-bottom: 1.5px solid var(--rule); background: transparent;
          font-family: var(--sans); font-size: .85rem; color: var(--ink);
          padding: 2px 4px; outline: none; cursor: pointer;
        }
        .side-select:focus { border-color: var(--gold); outline: none; }

        /* ── Section ── */
        .section {
          background: white; margin: 20px 40px 0;
          border: 1px solid var(--mist); border-radius: var(--radius);
          box-shadow: var(--shadow); overflow: hidden;
        }
        .section-header {
          background: var(--navy); color: white;
          padding: 12px 20px; display: flex; justify-content: space-between; align-items: center;
        }
        .section-title { display: flex; align-items: baseline; gap: 10px; }
        .section-roman { font-family: var(--mono); font-size: .75rem; font-weight: 600; color: var(--gold); letter-spacing: .12em; }
        .section-name { font-family: var(--display); font-size: 1rem; font-weight: 700; color: white; }
        .section-max { font-family: var(--mono); font-size: .8rem; color: rgba(255,255,255,.45); }
        .section-body { padding: 20px; }

        /* ── Field group ── */
        .field-group { margin-bottom: 16px; }
        .score-select {
          width: 100%; padding: 9px 12px; margin: 6px 0 4px;
          border: 1.5px solid var(--mist); border-radius: var(--radius);
          background: var(--cream); font-family: var(--sans); font-size: .85rem; color: var(--ink);
          cursor: pointer; outline: none; transition: border-color .15s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a6070' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          padding-right: 32px;
        }
        .score-select:focus { border-color: var(--gold); }
        .score-select:hover { border-color: var(--slate); }
        .comment-box {
          width: 100%; padding: 7px 10px;
          border: 1px solid var(--mist); border-radius: var(--radius);
          background: var(--paper); font-family: var(--sans); font-size: .8rem;
          color: var(--slate); resize: vertical; outline: none;
          transition: border-color .15s;
        }
        .comment-box:focus { border-color: var(--gold); background: white; }

        /* ── Sub-header (CREAC components) ── */
        .sub-header {
          display: flex; align-items: baseline; gap: 8px; margin-bottom: 2px;
        }
        .sub-letter {
          font-family: var(--display); font-weight: 900; font-size: 1.1rem; color: var(--gold);
          width: 20px; text-align: center;
        }
        .sub-title { font-size: .85rem; font-weight: 600; color: var(--navy); }
        .sub-max { font-family: var(--mono); font-size: .72rem; color: var(--slate); margin-left: auto; }

        /* ── CREAC block ── */
        .creac-block {
          background: white; margin: 20px 40px 0;
          border: 1px solid var(--mist); border-radius: var(--radius);
          box-shadow: var(--shadow); overflow: hidden;
        }
        .creac-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 16px 20px 14px; border-bottom: 1px solid var(--mist);
          background: var(--cream);
        }
        .creac-title { font-family: var(--display); font-size: 1rem; font-weight: 700; color: var(--navy); }
        .creac-issue { font-size: .78rem; color: var(--slate); font-style: italic; margin-top: 3px; max-width: 600px; line-height: 1.4; }
        .creac-score-badge {
          display: flex; align-items: baseline; gap: 1px;
          background: var(--mist); border-radius: 4px; padding: 4px 10px;
          flex-shrink: 0;
        }
        .creac-score-badge.complete { background: var(--navy); }
        .creac-score-badge.complete .badge-earned { color: white; }
        .creac-score-badge.complete .badge-max { color: rgba(255,255,255,.5); }
        .badge-earned { font-family: var(--mono); font-size: 1.3rem; font-weight: 600; color: var(--navy); }
        .badge-max { font-family: var(--mono); font-size: .85rem; color: var(--slate); }
        .creac-block > .field-group { padding: 14px 20px 0; }
        .creac-subtotal {
          border-top: 1px solid var(--mist); padding: 10px 20px;
          font-size: .82rem; color: var(--slate); text-align: right;
          background: var(--cream);
        }
        .creac-subtotal strong { font-family: var(--mono); color: var(--navy); }

        /* ── Score row (summary) ── */
        .score-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 5px 0; border-bottom: 1px dotted var(--mist);
          font-size: .83rem;
        }
        .score-row:last-child { border-bottom: none; }
        .score-row-label { color: var(--slate); }
        .score-row-pts { font-family: var(--mono); font-weight: 600; color: var(--navy); }
        .score-row-pct { font-size: .72rem; color: var(--slate); font-weight: 400; }

        /* ── Deduction ── */
        .deduction-row {
          display: flex; align-items: center; gap: 12px; margin-top: 10px;
        }
        .deduction-label { font-size: .85rem; color: var(--slate); }
        .deduction-select {
          border: 1.5px solid var(--mist); border-radius: var(--radius);
          background: var(--cream); font-family: var(--mono); font-size: .9rem;
          color: var(--red); padding: 5px 10px; cursor: pointer; outline: none;
        }
        .deduction-select:focus { border-color: var(--gold); }

        /* ── Summary card ── */
        .summary-card {
          background: var(--navy); color: white;
          margin: 24px 40px 0; border-radius: var(--radius);
          padding: 24px 28px;
        }
        .summary-title {
          font-family: var(--display); font-size: .85rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px;
        }
        .summary-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px;
        }
        .summary-row {
          display: flex; justify-content: space-between; padding: 4px 0;
          border-bottom: 1px solid rgba(255,255,255,.08); font-size: .82rem;
        }
        .summary-row-label { color: rgba(255,255,255,.6); }
        .summary-row-val { font-family: var(--mono); font-weight: 600; color: white; }
        .summary-total-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,.2);
        }
        .summary-total-label { font-family: var(--display); font-size: 1.1rem; font-weight: 700; color: var(--gold-lt); }
        .summary-total-val { font-family: var(--mono); font-size: 1.8rem; font-weight: 600; color: white; }

        /* ── Print button ── */
        .print-btn {
          display: block; margin: 28px 40px 0;
          background: var(--gold); color: white; border: none;
          padding: 12px 28px; border-radius: var(--radius);
          font-family: var(--display); font-size: .95rem; font-weight: 700;
          cursor: pointer; letter-spacing: .04em;
          transition: background .15s, transform .1s;
        }
        .print-btn:hover { background: #b38522; transform: translateY(-1px); }

        /* ── Print styles ── */
        @media print {
          .masthead { position: static; }
          .print-btn { display: none; }
          .info-bar, .masthead { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .section-header, .creac-header, .summary-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .app { max-width: 100%; padding: 0; }
          .section, .creac-block { margin: 12px 0 0; break-inside: avoid; }
        }
      `}</style>

      <div className="app">
        {/* ── Sticky masthead ─────────────────────────────────────── */}
        <div className="masthead">
          <div className="masthead-top">
            <div>
              <div className="masthead-title">
                LPS Argument Section Grading Rubric
              </div>
              <div className="masthead-sub">
                Ortiz v. Albert — Spring 2026 · Prof. McCain
              </div>
            </div>
            <div className="score-display">
              <div>
                <div className="total-pts">
                  {total !== null ? total : "—"}
                  <span> / 100</span>
                </div>
              </div>
              <div
                className="grade-badge"
                style={{
                  background: grade ? grade.color : "rgba(255,255,255,.1)",
                  color: "white",
                }}
              >
                {grade ? grade.letter : "—"}
              </div>
            </div>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-label">Completion — {progress}%</div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Student info ─────────────────────────────────────────── */}
        <div className="info-bar">
          <div className="info-field">
            <span className="info-label">Student / Exam #</span>
            <input
              className="info-input"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="______________"
            />
          </div>
          <div className="info-field">
            <span className="info-label">Side</span>
            <select
              className="side-select"
              value={side}
              onChange={(e) => setSide(e.target.value)}
            >
              <option value="">— select —</option>
              <option value="Plaintiff">Plaintiff</option>
              <option value="Defendant">Defendant</option>
            </select>
          </div>
        </div>

        {/* ── I. Point Headings ────────────────────────────────────── */}
        <div className="section">
          <SectionHeader
            roman="I"
            title="Point Headings &amp; Subheadings"
            max={10}
          />
          <div className="section-body">
            <ScoreSelect
              id="headings"
              bands={BANDS.headings}
              value={get("headings")}
              onChange={onScore}
            />
            <CommentBox
              id="headings_comment"
              value={comments.headings_comment || ""}
              onChange={onComment}
            />
          </div>
        </div>

        {/* ── II. Organization ─────────────────────────────────────── */}
        <div className="section">
          <SectionHeader
            roman="II"
            title="Argument Organization &amp; Roadmap"
            max={10}
          />
          <div className="section-body">
            <ScoreSelect
              id="org"
              bands={BANDS.org}
              value={get("org")}
              onChange={onScore}
            />
            <CommentBox
              id="org_comment"
              value={comments.org_comment || ""}
              onChange={onComment}
            />
          </div>
        </div>

        {/* ── III. CREAC header ────────────────────────────────────── */}
        <div className="section" style={{ marginBottom: 0 }}>
          <SectionHeader
            roman="III"
            title="Argument Analysis — CREAC Paradigm"
            max={65}
          />
          <div
            className="section-body"
            style={{ paddingBottom: 4, paddingTop: 10 }}
          >
            <div
              style={{
                fontSize: ".78rem",
                color: "var(--slate)",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              CREAC 1 (Trespasser Status) = 16 pts (25%) · CREAC 2
              (Foreseeability &amp; Duty) = 24 pts (37.5%) · CREAC 3 (Voluntary
              Assumption) = 25 pts (37.5%)
            </div>
          </div>
        </div>

        {/* ── CREAC 1 ──────────────────────────────────────────────── */}
        <CreacBlock
          num={1}
          title="Trespasser Status"
          pts={16}
          issue="Whether Ortiz was a trespasser at the time of the incident, and what duty, if any, Albert owed her."
          fields={creac1Fields}
          scores={scores}
          comments={comments}
          onScore={onScore}
          onComment={onComment}
        />

        {/* ── CREAC 2 ──────────────────────────────────────────────── */}
        <CreacBlock
          num={2}
          title="Foreseeability &amp; Duty of Care"
          pts={24}
          issue="Whether Albert owed Ortiz a duty to protect her from criminal acts of a third party based on reasonable foreseeability under existing social values and customs."
          fields={creac2Fields}
          scores={scores}
          comments={comments}
          onScore={onScore}
          onComment={onComment}
        />

        {/* ── CREAC 3 ──────────────────────────────────────────────── */}
        <CreacBlock
          num={3}
          title="Voluntary Assumption of Duty"
          pts={25}
          issue="Whether Albert voluntarily assumed a duty to protect those lawfully on the premises, thereby obligating him to discharge that duty with reasonable care."
          fields={creac3Fields}
          scores={scores}
          comments={comments}
          onScore={onScore}
          onComment={onComment}
        />

        {/* ── IV. Citation ─────────────────────────────────────────── */}
        <div className="section">
          <SectionHeader roman="IV" title="Citation" max={10} />
          <div className="section-body">
            <ScoreSelect
              id="citation"
              bands={BANDS.citation}
              value={get("citation")}
              onChange={onScore}
            />
            <CommentBox
              id="citation_comment"
              value={comments.citation_comment || ""}
              onChange={onComment}
            />
          </div>
        </div>

        {/* ── V. Persuasive Writing ────────────────────────────────── */}
        <div className="section">
          <SectionHeader roman="V" title="Persuasive Writing Style" max={5} />
          <div className="section-body">
            <ScoreSelect
              id="persuasion"
              bands={BANDS.persuasion}
              value={get("persuasion")}
              onChange={onScore}
            />
            <CommentBox
              id="persuasion_comment"
              value={comments.persuasion_comment || ""}
              onChange={onComment}
            />
          </div>
        </div>

        {/* ── VI. Format Deductions ────────────────────────────────── */}
        <div className="section">
          <SectionHeader
            roman="VI"
            title="Format &amp; Writing Quality — Deductions"
            max={-10}
          />
          <div className="section-body">
            <div className="deduction-row">
              <span className="deduction-label">Deduct:</span>
              <select
                className="deduction-select"
                value={get("deduction") ?? 0}
                onChange={(e) => onScore("deduction", Number(e.target.value))}
              >
                {DEDUCTION_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    −{n} point{n !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <CommentBox
              id="deduction_comment"
              value={comments.deduction_comment || ""}
              onChange={onComment}
              placeholder="Note specific deficiencies (grammar, format, late submission, etc.)…"
            />
          </div>
        </div>

        {/* ── Overall comments ─────────────────────────────────────── */}
        <div className="section">
          <SectionHeader roman="★" title="Overall Feedback" max={null} />
          <div className="section-body">
            <CommentBox
              id="overall_comment"
              value={comments.overall_comment || ""}
              onChange={onComment}
              placeholder="Overall feedback and comments for student…"
            />
          </div>
        </div>

        {/* ── Summary card ─────────────────────────────────────────── */}
        <div className="summary-card">
          <div className="summary-title">Score Summary</div>
          <div className="summary-grid">
            <ScoreRow label="I. Point Headings" max={10} earned={sec1} />
            <ScoreRow label="IV. Citation" max={10} earned={sec4} />
            <ScoreRow label="II. Organization" max={10} earned={sec2} />
            <ScoreRow label="V. Persuasive Style" max={5} earned={sec5} />
            <ScoreRow label="CREAC 1 (Trespasser)" max={16} earned={c1} />
            <ScoreRow label="CREAC 2 (Foreseeability)" max={24} earned={c2} />
            <ScoreRow label="CREAC 3 (Vol. Assumption)" max={25} earned={c3} />
            <ScoreRow label="III. CREAC Total" max={65} earned={sec3} />
          </div>
          <div
            className="summary-row"
            style={{
              marginTop: 12,
              borderTop: "1px solid rgba(255,255,255,.15)",
              paddingTop: 10,
              borderBottom: "none",
            }}
          >
            <span className="summary-row-label">
              VI. Format &amp; Writing Deductions
            </span>
            <span
              className="summary-row-val"
              style={{ color: ded > 0 ? "#f87171" : "white" }}
            >
              −{ded}
            </span>
          </div>
          <div className="summary-total-row">
            <div>
              <div className="summary-total-label">Final Score</div>
              {side && (
                <div
                  style={{
                    fontSize: ".75rem",
                    color: "rgba(255,255,255,.4)",
                    marginTop: 2,
                  }}
                >
                  {side}'s Memo
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="summary-total-val">
                {total !== null ? total : "—"} / 100
              </div>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: grade ? grade.color : "rgba(255,255,255,.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--display)",
                  fontSize: "1.4rem",
                  fontWeight: 900,
                  color: "white",
                  border: "2px solid rgba(255,255,255,.2)",
                  transition: "background .3s",
                }}
              >
                {grade ? grade.letter : "—"}
              </div>
            </div>
          </div>
        </div>

        <button className="print-btn" onClick={handlePrint}>
          Print / Save as PDF
        </button>
      </div>
    </>
  );
}
