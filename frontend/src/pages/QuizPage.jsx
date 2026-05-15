import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useNoteStore } from "../store/noteStore";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { generateQuiz } = useNoteStore();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [nextRevision, setNextRevision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    generateQuiz(id).then((q) => { setQuestions(q); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const q = questions[current];
  const answered = selected !== null;

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
  };

  const handleNext = () => {
    setAnswers([...answers, { question: q.question, selected, correct: q.correct, explanation: q.explanation }]);
    if (current + 1 >= questions.length) {
      setShowResult(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  const score = Math.round((answers.filter((a) => a.selected === a.correct).length / questions.length) * 100);

  const handleSubmitScore = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post(`/api/notes/${id}/quiz-result?score=${score}`);
      setNextRevision(data);
      toast.success("Score saved! Revision scheduled.");
    } catch { toast.error("Failed to save score"); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
        <div className="text-sm font-medium" style={{ color: "var(--muted)" }}>Generating quiz…</div>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="h-full flex items-center justify-center text-center p-8">
      <div>
        <div className="text-4xl mb-3">😅</div>
        <div className="font-display font-semibold mb-2" style={{ color: "var(--text)" }}>Couldn't generate quiz</div>
        <div className="text-sm mb-4" style={{ color: "var(--muted)" }}>Add more content to your note and try again</div>
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm">Back</button>
      </div>
    </div>
  );

  if (showResult) {
    const correct = answers.filter((a) => a.selected === a.correct).length;
    const scoreColor = score >= 80 ? "text-green-500" : score >= 60 ? "text-amber-500" : "text-red-500";
    const scoreBg = score >= 80 ? "from-green-100 to-green-200" : score >= 60 ? "from-amber-100 to-amber-200" : "from-red-100 to-red-200";

    return (
      <div className="h-full overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          {/* Score circle */}
          <div className="text-center mb-8">
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${scoreBg} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <div>
                <div className={`text-3xl font-display font-bold ${scoreColor}`}>{score}%</div>
                <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>{correct}/{questions.length}</div>
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
              {score >= 80 ? "Excellent! 🎉" : score >= 60 ? "Good job! 👍" : "Keep practicing! 💪"}
            </h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>You got {correct} out of {questions.length} correct</p>
          </div>

          {/* Next revision info */}
          {nextRevision ? (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-center">
              <div className="text-sm font-semibold text-blue-700">
                Next revision in <span className="text-blue-900">{nextRevision.days_until} day{nextRevision.days_until !== 1 ? "s" : ""}</span>
              </div>
              <div className="text-xs text-blue-600 mt-0.5">Based on your score — spaced repetition scheduling</div>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <button onClick={handleSubmitScore} disabled={submitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all disabled:opacity-70">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? "Saving…" : "Save score & schedule revision"}
              </button>
            </div>
          )}

          {/* Answer review */}
          <div className="space-y-3 mb-6">
            {answers.map((a, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-start gap-3">
                  {a.selected === a.correct
                    ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>{a.question}</div>
                    {a.selected !== a.correct && (
                      <div className="text-xs text-red-500 mb-1">Your answer: {questions[i]?.options?.[a.selected]}</div>
                    )}
                    <div className="text-xs text-green-600">Correct: {questions[i]?.options?.[a.correct]}</div>
                    {a.explanation && <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{a.explanation}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setShowResult(false); setNextRevision(null); }} className="px-5 py-2.5 border rounded-xl text-sm font-semibold transition-all hover:bg-slate-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              Retry Quiz
            </button>
            <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all">
              Back to Notes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--muted)" }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
            Question {current + 1} of {questions.length}
          </span>
        </div>

        {/* Progress */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${((current) / questions.length) * 100}%` }} />
        </div>

        {/* Question card */}
        <div className="card p-8 mb-6 fade-in">
          <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-3">Question {current + 1}</div>
          <div className="font-display text-xl font-semibold leading-relaxed mb-6" style={{ color: "var(--text)" }}>{q?.question}</div>

          <div className="space-y-3">
            {q?.options?.map((opt, i) => {
              let cls = "border rounded-xl px-4 py-3 text-sm font-medium cursor-pointer transition-all ";
              if (!answered) {
                cls += "hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20";
              } else if (i === q.correct) {
                cls += "bg-green-50 border-green-400 text-green-700";
              } else if (i === selected && selected !== q.correct) {
                cls += "bg-red-50 border-red-400 text-red-600";
              } else {
                cls += "opacity-50";
              }
              return (
                <div key={i} onClick={() => handleSelect(i)} className={cls} style={!answered || (i !== q.correct && i !== selected) ? { borderColor: "var(--border)", color: "var(--text)" } : {}}>
                  <span className="font-semibold mr-2">{["A", "B", "C", "D"][i]})</span> {opt.replace(/^[ABCD]\)\s*/, "")}
                </div>
              );
            })}
          </div>

          {answered && q?.explanation && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 fade-in">
              <span className="font-semibold">Explanation: </span>{q.explanation}
            </div>
          )}
        </div>

        {answered && (
          <div className="flex justify-end fade-in">
            <button onClick={handleNext} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all">
              {current + 1 >= questions.length ? "See Results" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
