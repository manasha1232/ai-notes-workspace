import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNoteStore } from "../store/noteStore";
import { ArrowLeft, ArrowRight, Shuffle, RotateCcw, BookOpen, Loader2 } from "lucide-react";

export default function FlashcardsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { generateFlashcards } = useNoteStore();
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hard, setHard] = useState(new Set());
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateFlashcards(id).then((c) => { setCards(c); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const shuffle = () => {
    setCards((c) => [...c].sort(() => Math.random() - 0.5));
    setIdx(0); setFlipped(false);
  };

  const next = () => {
    if (idx + 1 >= cards.length) { setDone(true); return; }
    setIdx(idx + 1); setFlipped(false);
  };

  const prev = () => { if (idx > 0) { setIdx(idx - 1); setFlipped(false); } };

  const markHard = () => {
    const newHard = new Set(hard);
    newHard.add(idx);
    setHard(newHard);
    next();
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (done) return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="font-display text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>All done!</h2>
      <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
        You reviewed {cards.length} cards
        {hard.size > 0 && ` · ${hard.size} marked as hard`}
      </p>
      <div className="flex gap-3 mt-6">
        {hard.size > 0 && (
          <button onClick={() => { const h = [...hard]; setCards(cards.filter((_, i) => h.includes(i))); setIdx(0); setFlipped(false); setDone(false); setHard(new Set()); }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-all">
            Review hard cards ({hard.size})
          </button>
        )}
        <button onClick={() => { setIdx(0); setFlipped(false); setDone(false); setHard(new Set()); }}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all">
          <RotateCcw className="w-4 h-4 inline mr-1" /> Restart
        </button>
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 border rounded-xl text-sm font-semibold transition-all hover:bg-slate-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
          Back to Notes
        </button>
      </div>
    </div>
  );

  const card = cards[idx];

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium hover:text-blue-600 transition-colors" style={{ color: "var(--muted)" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span className="font-display font-semibold text-sm" style={{ color: "var(--text)" }}>
            Card {idx + 1} of {cards.length}
          </span>
        </div>
        <button onClick={shuffle} className="flex items-center gap-1.5 text-sm font-medium hover:text-blue-600 transition-colors" style={{ color: "var(--muted)" }}>
          <Shuffle className="w-4 h-4" /> Shuffle
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl h-1.5 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${((idx + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-2xl cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className="relative w-full transition-all duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "240px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-xl"
            style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
          >
            <div className="text-blue-200 text-xs font-semibold mb-3 uppercase tracking-wide">Question</div>
            <div className="text-white text-xl font-display font-semibold leading-relaxed">{card?.front}</div>
            <div className="text-blue-300 text-xs mt-4">Click to reveal answer</div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "var(--card)", border: "2px solid var(--border)" }}
          >
            <div className="text-amber-500 text-xs font-semibold mb-3 uppercase tracking-wide">Answer</div>
            <div className="text-lg font-display font-semibold leading-relaxed" style={{ color: "var(--text)" }}>{card?.back}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-8">
        <button onClick={prev} disabled={idx === 0} className="p-3 rounded-xl border font-medium transition-all hover:bg-slate-50 disabled:opacity-30 dark:hover:bg-slate-800" style={{ borderColor: "var(--border)" }}>
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--text)" }} />
        </button>

        <button onClick={markHard} className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-xl text-sm transition-all border border-amber-200">
          Mark as Hard
        </button>

        <button onClick={next} className="p-3 rounded-xl border font-medium transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ borderColor: "var(--border)" }}>
          <ArrowRight className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {hard.size > 0 && (
        <div className="mt-4 text-xs font-medium text-amber-600">{hard.size} card{hard.size !== 1 ? "s" : ""} marked as hard</div>
      )}
    </div>
  );
}
