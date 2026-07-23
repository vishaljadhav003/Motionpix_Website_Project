const STORAGE_KEY = "myapp_testcases_v1";

export function loadTestCases(fallback = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveTestCases(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export const TestCaseAPI = {
  async getAll(fallback = []) {
    return loadTestCases(fallback);
  },

  async createOne(newTc) {
    const list = loadTestCases([]);
    const next = [newTc, ...list];
    saveTestCases(next);
    return next;
  },

  // ✅ replace entire list (useful for edit/delete/duplicate)
  async replaceAll(nextList) {
    saveTestCases(nextList);
    return nextList;
  },

  async deleteOne(id) {
    const list = loadTestCases([]);
    const next = list.filter((t) => String(t.id).toLowerCase() !== String(id).toLowerCase());
    saveTestCases(next);
    return next;
  },

  async updateOne(id, patch) {
    const list = loadTestCases([]);
    const idLower = String(id).toLowerCase();
    const next = list.map((t) => {
      if (String(t.id).toLowerCase() !== idLower) return t;
      return { ...t, ...patch };
    });
    saveTestCases(next);
    return next;
  },
};