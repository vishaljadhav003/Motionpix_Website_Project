import React, { useEffect, useMemo, useState } from "react";
import "./TestCasesPage.css";
import { TestCaseAPI } from "./TestCaseStore";

const clampStr = (v) => (typeof v === "string" ? v.trim() : "");
const todayISO = () => new Date().toISOString().slice(0, 10);

const DEFAULTS = [
  {
    id: "TC-001",
    title: "Login with valid credentials",
    feature: "Auth",
    priority: "P0",
    status: "Pass",
    precondition: "User exists with verified email",
    steps: ["Open Login page", "Enter valid email and password", "Click Login"],
    expected: "User should land on Dashboard",
    actual: "User landed on Dashboard",
    tags: ["smoke", "regression"],
    updatedAt: "2026-03-04",
  },
  {
    id: "TC-002",
    title: "Login with wrong password",
    feature: "Auth",
    priority: "P0",
    status: "Fail",
    precondition: "User exists",
    steps: ["Open Login page", "Enter valid email + wrong password", "Click Login"],
    expected: "Error message should be shown",
    actual: "No error message, stays loading",
    tags: ["bug", "regression"],
    updatedAt: "2026-03-04",
  },
];

const STATUS = ["All", "Pass", "Fail", "Blocked"];
const PRIORITY = ["All", "P0", "P1", "P2"];
const SORT = [
  { value: "updatedDesc", label: "Updated: Newest" },
  { value: "updatedAsc", label: "Updated: Oldest" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
];

const STATUS_CREATE = ["Pass", "Fail", "Blocked"];
const PRIORITY_CREATE = ["P0", "P1", "P2"];

function nextId(existing) {
  let max = 0;
  for (const tc of existing) {
    const m = String(tc.id || "").match(/^TC-(\d+)$/i);
    if (m) max = Math.max(max, parseInt(m[1], 10) || 0);
  }
  const next = String(max + 1).padStart(3, "0");
  return `TC-${next}`;
}

function normalizeTags(input) {
  return clampStr(input)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function normalizeSteps(multiline) {
  return String(multiline || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function TestCasesPage() {
  const [testcases, setTestcases] = useState([]);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sortBy, setSortBy] = useState("updatedDesc");
  const [openId, setOpenId] = useState(null);

  // Modal state (Create/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // ✅ create | edit
  const [editingId, setEditingId] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Confirm delete modal
  const [confirm, setConfirm] = useState({ open: false, id: null, title: "" });

  const [form, setForm] = useState({
    id: "",
    title: "",
    feature: "",
    priority: "P1",
    status: "Pass",
    precondition: "",
    stepsText: "",
    expected: "",
    actual: "",
    tagsText: "",
  });

  useEffect(() => {
    (async () => {
      const list = await TestCaseAPI.getAll(DEFAULTS);
      setTestcases(list);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = testcases.filter((tc) => {
      const matchesQuery =
        !q ||
        String(tc.id).toLowerCase().includes(q) ||
        String(tc.title).toLowerCase().includes(q) ||
        String(tc.feature).toLowerCase().includes(q) ||
        (tc.tags || []).some((t) => String(t).toLowerCase().includes(q));

      const matchesStatus = status === "All" || tc.status === status;
      const matchesPriority = priority === "All" || tc.priority === priority;

      return matchesQuery && matchesStatus && matchesPriority;
    });

    const priorityRank = (p) => (p === "P0" ? 0 : p === "P1" ? 1 : p === "P2" ? 2 : 9);

    list.sort((a, b) => {
      if (sortBy === "updatedDesc") return (b.updatedAt || "").localeCompare(a.updatedAt || "");
      if (sortBy === "updatedAsc") return (a.updatedAt || "").localeCompare(b.updatedAt || "");
      if (sortBy === "priority") return priorityRank(a.priority) - priorityRank(b.priority);
      if (sortBy === "title") return String(a.title || "").localeCompare(String(b.title || ""));
      return 0;
    });

    return list;
  }, [testcases, query, status, priority, sortBy]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const pass = filtered.filter((t) => t.status === "Pass").length;
    const fail = filtered.filter((t) => t.status === "Fail").length;
    const blocked = filtered.filter((t) => t.status === "Blocked").length;
    return { total, pass, fail, blocked };
  }, [filtered]);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const onFormChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    const id = nextId(testcases);
    setMode("create");
    setEditingId(null);
    setFormErr("");
    setIsSaving(false);
    setForm({
      id,
      title: "",
      feature: "",
      priority: "P1",
      status: "Pass",
      precondition: "",
      stepsText: "",
      expected: "",
      actual: "",
      tagsText: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (tc) => {
    setMode("edit");
    setEditingId(tc.id);
    setFormErr("");
    setIsSaving(false);
    setForm({
      id: tc.id,
      title: tc.title || "",
      feature: tc.feature || "",
      priority: tc.priority || "P1",
      status: tc.status || "Pass",
      precondition: tc.precondition || "",
      stepsText: (tc.steps || []).join("\n"),
      expected: tc.expected || "",
      actual: tc.actual || "",
      tagsText: (tc.tags || []).join(", "),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const validate = () => {
    const id = clampStr(form.id);
    const title = clampStr(form.title);
    const feature = clampStr(form.feature);

    if (!id) return "Testcase ID required (e.g. TC-004).";
    if (!/^TC-\d+$/i.test(id)) return "ID format should be like TC-001, TC-004...";
    if (!title) return "Title required.";
    if (!feature) return "Feature required.";
    return "";
  };

  const saveForm = async () => {
    const err = validate();
    if (err) {
      setFormErr(err);
      return;
    }

    const payload = {
      id: clampStr(form.id),
      title: clampStr(form.title),
      feature: clampStr(form.feature),
      priority: form.priority,
      status: form.status,
      precondition: clampStr(form.precondition),
      steps: normalizeSteps(form.stepsText),
      expected: clampStr(form.expected),
      actual: clampStr(form.actual),
      tags: normalizeTags(form.tagsText),
      updatedAt: todayISO(),
    };

    setFormErr("");
    setIsSaving(true);

    try {
      if (mode === "create") {
        const idLower = payload.id.toLowerCase();
        if (testcases.some((t) => String(t.id).toLowerCase() === idLower)) {
          setFormErr("This Testcase ID already exists. Use a new ID.");
          return;
        }
        const nextList = await TestCaseAPI.createOne(payload);
        setTestcases(nextList);
        setOpenId(payload.id);
        setIsModalOpen(false);
      } else {
        // ✅ edit: allow same id for same testcase, but prevent conflicts if user changed id
        const editingLower = String(editingId).toLowerCase();
        const newLower = payload.id.toLowerCase();

        if (newLower !== editingLower) {
          const conflict = testcases.some((t) => String(t.id).toLowerCase() === newLower);
          if (conflict) {
            setFormErr("This Testcase ID already exists. Use a new ID.");
            return;
          }
        }

        // update by old id; if id changed, we replace list entry
        const next = testcases.map((t) => {
          if (String(t.id).toLowerCase() !== editingLower) return t;
          return payload;
        });

        const saved = await TestCaseAPI.replaceAll(next);
        setTestcases(saved);
        setOpenId(payload.id);
        setIsModalOpen(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const duplicateTc = async (tc) => {
    const newId = nextId(testcases);
    const copy = {
      ...tc,
      id: newId,
      title: `${tc.title} (Copy)`,
      updatedAt: todayISO(),
    };

    const nextList = await TestCaseAPI.createOne(copy);
    setTestcases(nextList);
    setOpenId(copy.id);
  };

  const askDelete = (tc) => {
    setConfirm({ open: true, id: tc.id, title: tc.title || "" });
  };

  const closeConfirm = () => setConfirm({ open: false, id: null, title: "" });

  const confirmDelete = async () => {
    const id = confirm.id;
    if (!id) return;
    const next = await TestCaseAPI.deleteOne(id);
    setTestcases(next);
    if (openId === id) setOpenId(null);
    closeConfirm();
  };

  return (
    <section className="tcPage">
      <header className="tcHeader">
        <div className="tcTitleWrap">
          <h1 className="tcTitle">Test <span>Cases</span></h1>
          <p className="tcSub">Search, filter, create and manage your website test scenarios.</p>
        </div>

        {/* ✅ premium: sticky toolbar (CSS only) */}
        <div className="tcControls tcStickyBar">
          <div className="tcTopRow">
            <div className="tcSearch">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID, title, feature, tag..."
                aria-label="Search testcases"
              />
            </div>

            <button className="tcBtnPrimary" onClick={openCreate} type="button">
              + Create Testcase
            </button>
          </div>

          <div className="tcSelectRow">
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status filter">
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>

            <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority filter">
              {PRIORITY.map((p) => (
                <option key={p} value={p}>
                  Priority: {p}
                </option>
              ))}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort testcases">
              {SORT.map((s) => (
                <option key={s.value} value={s.value}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="tcSummary">
        <div className="tcStat">
          <div className="tcStatNum">{summary.total}</div>
          <div className="tcStatLabel">Total</div>
        </div>
        <div className="tcStat tcPass">
          <div className="tcStatNum">{summary.pass}</div>
          <div className="tcStatLabel">Pass</div>
        </div>
        <div className="tcStat tcFail">
          <div className="tcStatNum">{summary.fail}</div>
          <div className="tcStatLabel">Fail</div>
        </div>
        <div className="tcStat tcBlocked">
          <div className="tcStatNum">{summary.blocked}</div>
          <div className="tcStatLabel">Blocked</div>
        </div>
      </div>

      <div className="tcList">
        {filtered.map((tc) => {
          const isOpen = openId === tc.id;

          return (
            <article key={tc.id} className="tcCard">
              <div
                className="tcCardTop"
                onClick={() => toggle(tc.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(tc.id);
                  }
                }}
              >
                <div className="tcLeft">
                  <div className="tcIdRow">
                    <span className="tcId">{tc.id}</span>
                    <span className={`tcBadge tcBadgeStatus tc_${tc.status}`}>{tc.status}</span>
                    <span className="tcBadge tcBadgePri">{tc.priority}</span>
                  </div>

                  <h3 className="tcCardTitle">{tc.title}</h3>

                  <div className="tcMeta">
                    <span>Feature: {tc.feature}</span>
                    <span>Updated: {tc.updatedAt}</span>
                  </div>
                </div>

                {/* ✅ premium actions */}
                <div className="tcRight">
                  <div className="tcActions" onClick={(e) => e.stopPropagation()}>
                    <button className="tcActionBtn" type="button" onClick={() => openEdit(tc)}>
                      Edit
                    </button>
                    <button className="tcActionBtn" type="button" onClick={() => duplicateTc(tc)}>
                      Duplicate
                    </button>
                    <button className="tcActionBtn tcDanger" type="button" onClick={() => askDelete(tc)}>
                      Delete
                    </button>
                  </div>

                  <span className="tcChevron">{isOpen ? "−" : "+"}</span>
                </div>
              </div>

              {isOpen && (
                <div className="tcDetails">
                  <div className="tcGrid">
                    <div className="tcBlock">
                      <div className="tcLabel">Precondition</div>
                      <div className="tcText">{tc.precondition || "-"}</div>
                    </div>

                    <div className="tcBlock">
                      <div className="tcLabel">Expected</div>
                      <div className="tcText">{tc.expected || "-"}</div>
                    </div>

                    <div className="tcBlock">
                      <div className="tcLabel">Actual</div>
                      <div className="tcText">{tc.actual || "-"}</div>
                    </div>

                    <div className="tcBlock">
                      <div className="tcLabel">Steps</div>
                      <ol className="tcSteps">
                        {(tc.steps || []).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="tcTags">
                    {(tc.tags || []).map((t) => (
                      <span key={t} className="tcTag">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="tcEmpty">No testcases found. Try clearing filters or changing search.</div>
        )}
      </div>

      {/* ✅ Create/Edit Modal */}
      {isModalOpen && (
        <div className="tcModalOverlay" onMouseDown={closeModal} role="presentation">
          <div
            className="tcModal"
            role="dialog"
            aria-modal="true"
            aria-label={mode === "create" ? "Create testcase" : "Edit testcase"}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="tcModalHeader">
              <div>
                <div className="tcModalTitle">{mode === "create" ? "Create Testcase" : "Edit Testcase"}</div>
                <div className="tcModalSub">Saved locally now. Easy to connect backend later.</div>
              </div>
              <button className="tcIconBtn" onClick={closeModal} type="button" aria-label="Close">
                ✕
              </button>
            </div>

            <div className="tcModalBody">
              {formErr && <div className="tcError">{formErr}</div>}

              <div className="tcFormGrid">
                <label className="tcField">
                  <span>ID</span>
                  <input value={form.id} onChange={onFormChange("id")} placeholder="TC-004" />
                </label>

                <label className="tcField">
                  <span>Feature</span>
                  <input value={form.feature} onChange={onFormChange("feature")} placeholder="Auth / Gallery / Payments..." />
                </label>

                <label className="tcField tcCol2">
                  <span>Title</span>
                  <input value={form.title} onChange={onFormChange("title")} placeholder="What are we testing?" />
                </label>

                <label className="tcField">
                  <span>Status</span>
                  <select value={form.status} onChange={onFormChange("status")}>
                    {STATUS_CREATE.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="tcField">
                  <span>Priority</span>
                  <select value={form.priority} onChange={onFormChange("priority")}>
                    {PRIORITY_CREATE.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="tcField tcCol2">
                  <span>Precondition</span>
                  <input value={form.precondition} onChange={onFormChange("precondition")} placeholder="User logged out, has account..." />
                </label>

                <label className="tcField tcCol2">
                  <span>Steps (one per line)</span>
                  <textarea
                    value={form.stepsText}
                    onChange={onFormChange("stepsText")}
                    placeholder={"Open page\nClick button\nVerify result"}
                    rows={5}
                  />
                </label>

                <label className="tcField tcCol2">
                  <span>Expected</span>
                  <textarea value={form.expected} onChange={onFormChange("expected")} rows={3} placeholder="Expected behavior..." />
                </label>

                <label className="tcField tcCol2">
                  <span>Actual</span>
                  <textarea value={form.actual} onChange={onFormChange("actual")} rows={3} placeholder="What happened..." />
                </label>

                <label className="tcField tcCol2">
                  <span>Tags (comma separated)</span>
                  <input value={form.tagsText} onChange={onFormChange("tagsText")} placeholder="smoke, regression, ui" />
                </label>
              </div>
            </div>

            <div className="tcModalFooter">
              <button className="tcBtnGhost" onClick={closeModal} type="button" disabled={isSaving}>
                Cancel
              </button>
              <button className="tcBtnPrimary" onClick={saveForm} type="button" disabled={isSaving}>
                {isSaving ? "Saving..." : mode === "create" ? "Save Testcase" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Confirm Modal */}
      {confirm.open && (
        <div className="tcModalOverlay" onMouseDown={closeConfirm} role="presentation">
          <div className="tcConfirm" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Confirm delete">
            <div className="tcConfirmTitle">Delete testcase?</div>
            <div className="tcConfirmText">
              This will remove <span className="tcConfirmStrong">{confirm.id}</span> permanently.
            </div>

            <div className="tcConfirmActions">
              <button className="tcBtnGhost" type="button" onClick={closeConfirm}>
                Cancel
              </button>
              <button className="tcBtnPrimary tcBtnDanger" type="button" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}