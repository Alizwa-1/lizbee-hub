export type DocCategory = "email" | "meeting" | "research" | "note";

export interface SavedDoc {
  id: string;
  title: string;
  category: DocCategory;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const DOCS_KEY = "lizbee.docs.v1";
const CHAT_KEY = "lizbee.chat.v1";
const ONBOARD_KEY = "lizbee.onboarded.v1";

function safe<T>(fn: () => T, fallback: T): T {
  try { return fn(); } catch { return fallback; }
}

export function loadDocs(): SavedDoc[] {
  if (typeof window === "undefined") return [];
  return safe(() => JSON.parse(localStorage.getItem(DOCS_KEY) || "[]") as SavedDoc[], []);
}
export function saveDocs(docs: SavedDoc[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}
export function addDoc(doc: Omit<SavedDoc, "id" | "createdAt" | "updatedAt">): SavedDoc {
  const now = Date.now();
  const full: SavedDoc = { ...doc, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  const docs = loadDocs();
  docs.unshift(full);
  saveDocs(docs);
  return full;
}
export function updateDoc(id: string, patch: Partial<SavedDoc>) {
  const docs = loadDocs().map((d) => (d.id === id ? { ...d, ...patch, updatedAt: Date.now() } : d));
  saveDocs(docs);
}
export function deleteDoc(id: string) {
  saveDocs(loadDocs().filter((d) => d.id !== id));
}

export interface ChatMsg { role: "user" | "assistant"; content: string; ts: number }
export function loadChat(): ChatMsg[] {
  if (typeof window === "undefined") return [];
  return safe(() => JSON.parse(localStorage.getItem(CHAT_KEY) || "[]") as ChatMsg[], []);
}
export function saveChat(msgs: ChatMsg[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_KEY, JSON.stringify(msgs.slice(-200)));
}
export function clearChat() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAT_KEY);
}

export function isOnboarded(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(ONBOARD_KEY) === "1";
}
export function markOnboarded() {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARD_KEY, "1");
}
