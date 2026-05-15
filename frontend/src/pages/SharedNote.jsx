import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Zap, Tag, Clock } from "lucide-react";

export default function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${base}/api/shared/${shareId}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setNote)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Top bar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-slate-800">Peblo Study</span>
          </div>
          <Link to="/signup" className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-xl transition-all">
            Sign up free
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {error ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Note not found</h1>
            <p className="text-slate-500 mb-6">This note is private or doesn't exist</p>
            <Link to="/" className="text-blue-600 font-semibold hover:underline">← Back to Peblo</Link>
          </div>
        ) : (
          <div className="fade-in">
            {/* Note header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{note.category}</span>
                {note.tags?.map((t) => (
                  <span key={t} className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                    <Tag className="w-3 h-3" />#{t}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-3xl font-bold text-slate-900 mb-3">{note.title}</h1>
              {note.updated_at && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  Last updated {new Date(note.updated_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              )}
            </div>

            {/* AI summary */}
            {note.ai_summary && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  ✨ AI Summary
                </div>
                <p className="text-blue-800 leading-relaxed mb-4">{note.ai_summary}</p>
                {note.ai_key_points?.length > 0 && (
                  <ul className="space-y-1.5">
                    {note.ai_key_points.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                        <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-semibold">{i+1}</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm mb-10">
              <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                {note.content || <span className="text-slate-400 italic">No content</span>}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
              <div className="text-lg font-display font-bold mb-1">Want AI summaries for your own notes?</div>
              <div className="text-blue-200 text-sm mb-5">Summarize, quiz, and schedule revisions — free forever</div>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold px-7 py-3 rounded-xl transition-all shadow-lg">
                Try Peblo Study free →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
