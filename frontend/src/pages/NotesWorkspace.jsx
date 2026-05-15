import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useNoteStore } from "../store/noteStore";
import {
  Plus, Search, Archive, Trash2, Share2, Sparkles, BookOpen, HelpCircle,
  Check, Copy, Loader2, X, Tag, ChevronDown
} from "lucide-react";

const CATEGORIES = ["General", "Study", "Work", "Personal", "Research", "Projects"];
const catColors = { Study: "bg-blue-100 text-blue-700", Work: "bg-amber-100 text-amber-700", Personal: "bg-green-100 text-green-700", Research: "bg-purple-100 text-purple-700", General: "bg-slate-100 text-slate-600", Projects: "bg-rose-100 text-rose-600" };

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotesWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notes, activeNote, loading, fetchNotes, createNote, updateNote, deleteNote, setActiveNote, summarize, generateFlashcards, generateQuiz, shareNote } = useNoteStore();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [saved, setSaved] = useState(true);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const [localTags, setLocalTags] = useState([]);
  const [localCat, setLocalCat] = useState("General");
  const saveTimer = useRef(null);
  const lastSavedId = useRef(null);

  useEffect(() => { fetchNotes(); }, []);

  // Sync local state when active note changes
  useEffect(() => {
    if (activeNote) {
      setLocalTitle(activeNote.title);
      setLocalContent(activeNote.content);
      setLocalTags(activeNote.tags || []);
      setLocalCat(activeNote.category || "General");
      setAiResult(null);
      setShareUrl(activeNote.is_public && activeNote.share_id ? `${window.location.origin}/share/${activeNote.share_id}` : "");
      lastSavedId.current = activeNote.id;
    }
  }, [activeNote?.id]);

  // Restore note from navigation state
  useEffect(() => {
    if (location.state?.noteId && notes.length > 0) {
      const note = notes.find((n) => n.id === location.state.noteId);
      if (note) setActiveNote(note);
    }
  }, [location.state, notes.length]);

  const triggerSave = useCallback((id, updates) => {
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await updateNote(id, updates);
      setSaved(true);
    }, 1500);
  }, [updateNote]);

  const handleTitleChange = (e) => {
    setLocalTitle(e.target.value);
    if (activeNote) triggerSave(activeNote.id, { title: e.target.value, content: localContent, tags: localTags, category: localCat });
  };
  const handleContentChange = (e) => {
    setLocalContent(e.target.value);
    if (activeNote) triggerSave(activeNote.id, { title: localTitle, content: e.target.value, tags: localTags, category: localCat });
  };
  const handleCatChange = async (cat) => {
    setLocalCat(cat);
    if (activeNote) await updateNote(activeNote.id, { category: cat });
  };
  const addTag = async () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || localTags.includes(t)) { setTagInput(""); return; }
    const newTags = [...localTags, t];
    setLocalTags(newTags);
    setTagInput("");
    if (activeNote) await updateNote(activeNote.id, { tags: newTags });
  };
  const removeTag = async (tag) => {
    const newTags = localTags.filter((t) => t !== tag);
    setLocalTags(newTags);
    if (activeNote) await updateNote(activeNote.id, { tags: newTags });
  };

  const handleNew = async () => {
    const note = await createNote({ title: "Untitled Note", content: "", category: "General", tags: [] });
    toast.success("Note created");
  };

  const handleDelete = async () => {
    if (!activeNote) return;
    if (!confirm("Delete this note?")) return;
    await deleteNote(activeNote.id);
    toast.success("Note deleted");
  };

  const handleArchive = async () => {
    if (!activeNote) return;
    await updateNote(activeNote.id, { is_archived: !activeNote.is_archived });
    toast.success(activeNote.is_archived ? "Restored" : "Archived");
  };

  const handleShare = async () => {
    if (!activeNote) return;
    try {
      const res = await shareNote(activeNote.id);
      const url = `${window.location.origin}/share/${res.share_id}`;
      setShareUrl(url);
      toast.success("Share link generated!");
    } catch { toast.error("Share failed"); }
  };

  const handleAI = async (type) => {
    if (!activeNote) return;
    if (!localContent.trim()) return toast.error("Add some content first");
    setAiLoading(type);
    try {
      if (type === "summary") {
        const res = await summarize(activeNote.id);
        setAiResult({ type: "summary", ...res });
      } else if (type === "flashcards") {
        const cards = await generateFlashcards(activeNote.id);
        setAiResult({ type: "flashcards", cards });
        toast.success(`${cards.length} flashcards generated!`);
      } else if (type === "quiz") {
        const questions = await generateQuiz(activeNote.id);
        setAiResult({ type: "quiz", questions });
        toast.success(`${questions.length} questions generated!`);
      }
    } catch { toast.error("AI request failed"); }
    finally { setAiLoading(""); }
  };

  const filteredNotes = notes.filter((n) => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || n.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex h-full" style={{ background: "var(--bg)" }}>
      {/* Left: Note List */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r" style={{ background: "var(--sidebar)", borderColor: "var(--border)" }}>
        {/* Search + New */}
        <div className="p-4 space-y-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <button onClick={handleNew} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition-all">
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>

        {/* Category pills */}
        <div className="px-3 py-2 flex gap-1.5 flex-wrap border-b" style={{ borderColor: "var(--border)" }}>
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`text-xs font-medium px-2.5 py-1 rounded-full transition-all ${catFilter === c ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-6 text-center text-sm" style={{ color: "var(--muted)" }}>No notes found</div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNote(note)}
                className={`p-4 cursor-pointer border-b transition-all hover:bg-blue-50 dark:hover:bg-blue-900/10 ${activeNote?.id === note.id ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500" : ""}`}
                style={{ borderBottomColor: "var(--border)" }}
              >
                <div className="font-medium text-sm truncate mb-1" style={{ color: "var(--text)" }}>{note.title}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColors[note.category] || catColors.General}`}>{note.category}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{timeAgo(note.updated_at)}</span>
                </div>
                {note.tags?.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {note.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Center: Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeNote ? (
          <div className="flex-1 flex flex-col items-center justify-center" style={{ color: "var(--muted)" }}>
            <div className="text-5xl mb-4">📝</div>
            <div className="font-display font-semibold text-lg" style={{ color: "var(--text)" }}>Select or create a note</div>
            <div className="text-sm mt-1">Your workspace is ready</div>
            <button onClick={handleNew} className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all">
              <Plus className="w-4 h-4" /> New Note
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-6 py-3 border-b flex-wrap" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              {/* Category select */}
              <div className="relative">
                <select
                  value={localCat}
                  onChange={(e) => handleCatChange(e.target.value)}
                  className="text-xs font-medium pr-6 pl-2 py-1.5 rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200"
                  style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-1 top-2 w-3 h-3 pointer-events-none" style={{ color: "var(--muted)" }} />
              </div>

              <div className="flex-1" />

              {/* Save indicator */}
              <span className={`text-xs font-medium flex items-center gap-1 ${saved ? "text-green-500" : "text-amber-500"}`}>
                {saved ? <><Check className="w-3 h-3" /> Saved</> : "Saving…"}
              </span>

              <button onClick={handleArchive} className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors" title={activeNote.is_archived ? "Unarchive" : "Archive"}>
                <Archive className="w-4 h-4 text-amber-500" />
              </button>
              <button onClick={handleShare} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="Share">
                <Share2 className="w-4 h-4 text-blue-500" />
              </button>
              <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>

            {/* Share URL banner */}
            {shareUrl && (
              <div className="mx-6 mt-3 flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl px-4 py-2.5">
                <span className="flex-1 truncate font-medium">{shareUrl}</span>
                <button onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success("Copied!"); }} className="p-1 hover:bg-blue-100 rounded-lg">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setShareUrl("")}><X className="w-3.5 h-3.5" /></button>
              </div>
            )}

            {/* Title */}
            <div className="px-6 pt-5">
              <input
                value={localTitle}
                onChange={handleTitleChange}
                placeholder="Note title…"
                className="w-full text-2xl font-display font-bold bg-transparent border-none outline-none placeholder-slate-300"
                style={{ color: "var(--text)" }}
              />
            </div>

            {/* Tags */}
            <div className="px-6 py-2 flex items-center gap-2 flex-wrap">
              {localTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-amber-900"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" style={{ color: "var(--muted)" }} />
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === ",") && addTag()}
                  placeholder="Add tag…"
                  className="text-xs bg-transparent border-none outline-none w-20 placeholder-slate-400"
                  style={{ color: "var(--text)" }}
                />
              </div>
            </div>

            {/* Content */}
            <textarea
              value={localContent}
              onChange={handleContentChange}
              placeholder="Start writing your notes here…"
              className="flex-1 px-6 py-2 bg-transparent border-none outline-none text-sm leading-relaxed"
              style={{ color: "var(--text)", minHeight: "200px" }}
            />
          </div>
        )}
      </div>

      {/* Right: AI Panel */}
      <div className="w-72 flex-shrink-0 flex flex-col border-l" style={{ background: "var(--sidebar)", borderColor: "var(--border)" }}>
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-semibold text-sm" style={{ color: "var(--text)" }}>AI Assistant</span>
          </div>
        </div>

        <div className="p-4 space-y-2 border-b" style={{ borderColor: "var(--border)" }}>
          {[
            { key: "summary", label: "Summarize", icon: Sparkles, color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
            { key: "flashcards", label: "Flashcards", icon: BookOpen, color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
            { key: "quiz", label: "Generate Quiz", icon: HelpCircle, color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" },
          ].map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => handleAI(key)}
              disabled={!activeNote || !!aiLoading}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
            >
              {aiLoading === key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
              {aiLoading === key ? "Generating…" : label}
            </button>
          ))}
        </div>

        {/* AI Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {!aiResult && !aiLoading && (
            <div className="text-center text-xs py-8" style={{ color: "var(--muted)" }}>
              <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-30" />
              Select a note and click an AI tool to get started
            </div>
          )}

          {aiResult?.type === "summary" && (
            <div className="space-y-4 fade-in">
              {aiResult.suggested_title && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <div className="text-xs font-semibold text-blue-600 mb-1">Suggested Title</div>
                  <div className="text-sm font-medium text-blue-800">{aiResult.suggested_title}</div>
                </div>
              )}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <div className="text-xs font-semibold mb-1.5" style={{ color: "var(--muted)" }}>Summary</div>
                <div className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{aiResult.summary}</div>
              </div>
              {aiResult.key_points?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>Key Points</div>
                  <ul className="space-y-1.5">
                    {aiResult.key_points.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text)" }}>
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i+1}</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiResult.action_items?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>Action Items</div>
                  <ul className="space-y-1.5">
                    {aiResult.action_items.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text)" }}>
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {aiResult?.type === "flashcards" && (
            <div className="fade-in">
              <div className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>{aiResult.cards?.length} flashcards generated</div>
              <button onClick={() => navigate(`/flashcards/${activeNote.id}`)} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
                <BookOpen className="w-4 h-4" /> Open Flashcards
              </button>
              <div className="mt-3 space-y-2">
                {aiResult.cards?.slice(0, 2).map((c, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                    <div className="text-xs font-semibold text-blue-600 mb-1">Q: {c.front}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>A: {c.back?.slice(0, 60)}…</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiResult?.type === "quiz" && (
            <div className="fade-in">
              <div className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>{aiResult.questions?.length} questions generated</div>
              <button onClick={() => navigate(`/quiz/${activeNote.id}`)} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
                <HelpCircle className="w-4 h-4" /> Start Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
