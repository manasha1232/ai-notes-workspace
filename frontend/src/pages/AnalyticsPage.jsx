import { useEffect, useState } from "react";
import api from "../api/client";
import { FileText, Zap, Clock, Brain, CheckCircle } from "lucide-react";

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

const catColors = { Study: "bg-blue-100 text-blue-700", Work: "bg-amber-100 text-amber-700", Personal: "bg-green-100 text-green-700", Research: "bg-purple-100 text-purple-700", General: "bg-slate-100 text-slate-600", Projects: "bg-rose-100 text-rose-600" };

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/notes/analytics/stats").then((r) => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 space-y-4 animate-pulse max-w-4xl mx-auto">
      <div className="h-8 w-64 bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}</div>
      <div className="h-48 bg-slate-200 rounded-2xl" />
    </div>
  );

  const maxTagCount = Math.max(...(stats?.top_tags?.map(([, c]) => c) ?? [1]), 1);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text)" }}>Your Learning Analytics</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Track your study progress and AI usage</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: FileText, label: "Total Notes", value: stats?.total_notes ?? 0, color: "text-blue-600", bg: "bg-blue-100" },
          { icon: Zap, label: "AI Generations", value: stats?.total_ai_uses ?? 0, color: "text-amber-600", bg: "bg-amber-100" },
          { icon: Clock, label: "Revision Queue", value: stats?.revision_queue_count ?? 0, color: "text-rose-500", bg: "bg-rose-100" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className="text-2xl font-display font-bold" style={{ color: "var(--text)" }}>{value}</div>
              <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top tags bar chart */}
        <div className="card p-6">
          <h2 className="font-display font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text)" }}>
            📌 Top Tags
          </h2>
          {stats?.top_tags?.length > 0 ? (
            <div className="space-y-3">
              {stats.top_tags.map(([tag, count]) => (
                <div key={tag} className="flex items-center gap-3">
                  <div className="w-20 text-xs font-medium text-right truncate" style={{ color: "var(--text)" }}>#{tag}</div>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-end pr-2 transition-all duration-700"
                      style={{ width: `${(count / maxTagCount) * 100}%` }}
                    >
                      <span className="text-white text-xs font-semibold">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-center py-6" style={{ color: "var(--muted)" }}>No tags yet — add tags to your notes</div>
          )}
        </div>

        {/* Recent activity */}
        <div className="card p-6">
          <h2 className="font-display font-semibold mb-5" style={{ color: "var(--text)" }}>📋 Recent Activity</h2>
          {stats?.recent_notes?.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_notes.map((note) => (
                <div key={note.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{note.title}</div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${catColors[note.category] || catColors.General}`}>{note.category}</span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>{timeAgo(note.updated_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-center py-6" style={{ color: "var(--muted)" }}>No notes yet</div>
          )}
        </div>

        {/* AI usage */}
        <div className="card p-6">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Brain className="w-5 h-5 text-blue-500" /> AI Usage
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-blue-600">{stats?.total_ai_uses ?? 0}</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>AI tool{stats?.total_ai_uses !== 1 ? "s" : ""} used in total</div>
              <div className="text-xs mt-0.5 text-blue-500 font-medium">Summaries · Flashcards · Quizzes</div>
            </div>
          </div>
        </div>

        {/* Revision health */}
        <div className="card p-6">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <CheckCircle className="w-5 h-5 text-green-500" /> Revision Health
          </h2>
          {(stats?.revision_queue_count ?? 0) === 0 ? (
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎉</div>
              <div>
                <div className="font-display font-semibold" style={{ color: "var(--text)" }}>All caught up!</div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>No notes pending revision</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-amber-600">{stats.revision_queue_count}</span>
              </div>
              <div>
                <div className="font-semibold" style={{ color: "var(--text)" }}>{stats.revision_queue_count} note{stats.revision_queue_count !== 1 ? "s" : ""} need revision</div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>Head to Dashboard to review them</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
