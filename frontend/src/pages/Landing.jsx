import { Link } from "react-router-dom";
import { Zap, Brain, BookOpen, Target, Share2, BarChart3, ChevronRight, Star } from "lucide-react";

const features = [
  { icon: Brain, color: "bg-blue-100 text-blue-600", title: "AI Summaries", desc: "Get crisp summaries of any note in seconds" },
  { icon: BookOpen, color: "bg-amber-100 text-amber-600", title: "Smart Flashcards", desc: "Auto-generate cards to reinforce memory" },
  { icon: Target, color: "bg-green-100 text-green-600", title: "Auto Quiz", desc: "Test yourself with AI-generated questions" },
  { icon: Zap, color: "bg-purple-100 text-purple-600", title: "Spaced Repetition", desc: "Review reminders based on your quiz scores" },
  { icon: Share2, color: "bg-rose-100 text-rose-600", title: "Public Sharing", desc: "Share notes with a beautiful public link" },
  { icon: BarChart3, color: "bg-teal-100 text-teal-600", title: "Learning Analytics", desc: "Track progress with productivity insights" },
];

const steps = [
  { n: "01", title: "Write Notes", desc: "Paste or type your study content into the editor" },
  { n: "02", title: "AI Analyzes", desc: "Get summaries, flashcards and quizzes instantly" },
  { n: "03", title: "Learn & Revise", desc: "Smart scheduling tells you exactly when to review" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 font-body">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-slate-800 text-lg">Peblo Study</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link to="/signup" className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition-all shadow-sm hover:shadow-md">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-amber-200">
          <Star className="w-3 h-3" />
          AI-Powered Study Platform for Serious Learners
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Turn Notes into{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Knowledge
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 8 Q75 2 150 8 Q225 14 298 8" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
          </span>
          {" "}— Instantly
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          AI-powered summaries, flashcards, quizzes and smart revision scheduling.
          Study smarter, not harder.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl">
            Start for free <ChevronRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-2xl border border-slate-200 transition-all">
            Sign in
          </Link>
        </div>

        {/* Hero visual */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100 border border-slate-100 p-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-300" />
              <div className="w-3 h-3 rounded-full bg-amber-300" />
              <div className="w-3 h-3 rounded-full bg-green-300" />
              <div className="flex-1 bg-slate-100 rounded-lg h-6 ml-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-left">
              <div className="col-span-1 space-y-2">
                {["Photosynthesis", "Cell Biology", "DNA Replication", "Mitosis"].map((t, i) => (
                  <div key={i} className={`p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${i === 0 ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-slate-50 text-slate-500"}`}>
                    {t}
                  </div>
                ))}
              </div>
              <div className="col-span-2 bg-slate-50 rounded-2xl p-4">
                <div className="text-xs font-semibold text-slate-700 mb-2">Photosynthesis</div>
                <div className="text-xs text-slate-400 leading-relaxed mb-4">Photosynthesis is the process by which plants convert light energy into chemical energy stored as glucose...</div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <div className="text-xs font-semibold text-blue-700 mb-1.5">✨ AI Summary</div>
                  <div className="text-xs text-blue-600 leading-relaxed">Plants use sunlight, CO₂ and water to produce glucose and oxygen through two main stages: light reactions and the Calvin cycle.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">Everything you need to study better</h2>
          <p className="text-slate-500">Six powerful features, one calm workspace</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:shadow-blue-50 transition-all hover:-translate-y-0.5">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-slate-800 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">How it works</h2>
          <p className="text-slate-500">Three steps to smarter studying</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {steps.map(({ n, title, desc }, i) => (
            <div key={n} className="flex-1 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4 font-display font-bold text-blue-600 text-lg">
                {n}
              </div>
              <h3 className="font-display font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center mt-6 mx-4">
                  <ChevronRight className="w-6 h-6 text-amber-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white">
          <h2 className="font-display text-3xl font-bold mb-3">Ready to study smarter?</h2>
          <p className="text-blue-200 mb-8">Join thousands of students transforming how they learn</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold px-8 py-3.5 rounded-2xl transition-all shadow-lg">
            Get started free <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-bold text-slate-700">Peblo Study</span>
        </div>
        <p className="text-sm text-slate-400">Built for learners, powered by AI</p>
      </footer>
    </div>
  );
}
