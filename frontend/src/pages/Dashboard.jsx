import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../api/client";
import { FileText, Zap, Clock, TrendingUp, BookOpen, ChevronRight, Tag } from "lucide-react";

function StatCard({ icon: Icon, value, label, color, bg }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <div className="text-2xl font-display font-bold" style={{ color: "var(--text)" }}>{value}</div>
        <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>{label}</div>
      </div>
    </div>
  );
}

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

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/notes/analytics/stats"),
      api.get("/api/notes/revision/queue"),
    ]).then(([s, q]) => {
      setStats(s.data);
      setQueue(q.data);
    }).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (loading) return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}</div>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text)" }}>
          {greeting}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} value={stats?.total_notes ?? 0} label="Total Notes" color="text-blue-600" bg="bg-blue-100" />
        <StatCard icon={Zap} value={stats?.total_ai_uses ?? 0} label="AI Uses" color="text-amber-600" bg="bg-amber-100" />
        <StatCard icon={Clock} value={queue.length} label="Due for Revision" color="text-rose-500" bg="bg-rose-100" />
        <StatCard icon={TrendingUp} value={stats?.weekly_count ?? 0} label="Notes This Week" color="text-green-600" bg="bg-green-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revision Queue */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold" style={{ color: "var(--text)" }}>Revision Queue</h2>
            {queue.length > 0 && <span className="text-xs bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full">{queue.length} due</span>}
          </div>
          {queue.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <div className="font-display font-semibold text-sm" style={{ color: "var(--text)" }}>All caught up!</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>No notes due for revision</div>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((note) => (
                <div key={note.id} className="card p-4 flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate" style={{ color: "var(--text)" }}>{note.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {note.quiz_score != null && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${note.quiz_score >= 80 ? "bg-green-100 text-green-700" : note.quiz_score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                          Last score: {note.quiz_score}%
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "var(--muted)" }}>{note.revision_count} revision{note.revision_count !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => navigate("/notes", { state: { noteId: note.id } })} className="text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                      Edit
                    </button>
                    <button onClick={() => navigate(`/quiz/${note.id}`)} className="text-xs font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors">
                      Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Recent + Tags */}
        <div className="space-y-6">
          {/* Recent Notes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold" style={{ color: "var(--text)" }}>Recent Notes</h2>
              <button onClick={() => navigate("/notes")} className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {(stats?.recent_notes ?? []).slice(0, 5).map((note) => (
                <div
                  key={note.id}
                  onClick={() => navigate("/notes", { state: { noteId: note.id } })}
                  className="card p-3 cursor-pointer hover:shadow-md transition-all hover:border-blue-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{note.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{timeAgo(note.updated_at)}</div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${catColors[note.category] || catColors.General}`}>
                      {note.category}
                    </span>
                  </div>
                </div>
              ))}
              {(stats?.recent_notes ?? []).length === 0 && (
                <div className="card p-4 text-center text-sm" style={{ color: "var(--muted)" }}>
                  No notes yet.{" "}
                  <button onClick={() => navigate("/notes")} className="text-blue-600 font-semibold hover:underline">Create one</button>
                </div>
              )}
            </div>
          </div>

          {/* Top Tags */}
          {stats?.top_tags?.length > 0 && (
            <div>
              <h2 className="font-display font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                <Tag className="w-4 h-4 text-amber-500" /> Top Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {stats.top_tags.map(([tag, count]) => (
                  <div key={tag} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
                    #{tag} <span className="bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full text-xs">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
