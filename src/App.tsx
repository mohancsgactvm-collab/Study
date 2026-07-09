import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Plus,
  Compass,
  FileText,
  HelpCircle,
  Calendar,
  Award,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Loader,
  ChevronRight,
  TrendingUp,
  BookmarkCheck,
  Send,
  Zap,
  RotateCcw,
  BookMarked,
  Search,
  CheckCircle2,
  Trash2,
  ThumbsUp,
  Sliders,
  ExternalLink
} from "lucide-react";
import { prepopulatedSubject } from "./prepopulated";
import {
  SubjectSystem,
  SyllabusAnalysis,
  StudyNote,
  QuestionBank,
  StudyPlan,
  MockTestEvaluation,
  ChatMessage
} from "./types";

export default function App() {
  // Active subject state
  const [subjects, setSubjects] = useState<SubjectSystem[]>([]);
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");

  // Input states for new subject
  const [course, setCourse] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [syllabusRaw, setSyllabusRaw] = useState("");
  const [examDate, setExamDate] = useState("");
  const [studyTime, setStudyTime] = useState("2 hours");

  // App UI states
  const [activeTab, setActiveTab] = useState<"analysis" | "notes" | "questions" | "plan" | "exam">("analysis");
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number | null>(null);
  const [loadingText, setLoadingText] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Notes tab sub-states
  const [selectedNoteTopic, setSelectedNoteTopic] = useState<string>("");

  // Questions tab sub-states
  const [questionsType, setQuestionsType] = useState<"2marks" | "5marks" | "10marks" | "mcq">("mcq");
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [showMcqExplanations, setShowMcqExplanations] = useState<Record<number, boolean>>({});

  // Exam tab sub-states
  const [examQuestion, setExamQuestion] = useState("");
  const [examMarks, setExamMarks] = useState(10);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<MockTestEvaluation | null>(null);

  // Chat/Tutor sub-states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load initial state
  useEffect(() => {
    const saved = localStorage.getItem("study_master_subjects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubjects(parsed);
          setActiveSubjectId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Error loading saved state", e);
      }
    }
    // Default to prepopulated data if empty
    setSubjects([prepopulatedSubject]);
    setActiveSubjectId(prepopulatedSubject.id);
  }, []);

  // Save state on change
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem("study_master_subjects", JSON.stringify(subjects));
    }
  }, [subjects]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, chatLoading]);

  // Get active subject
  const activeSubject = subjects.find((s) => s.id === activeSubjectId);

  // Handle setting active note topic
  useEffect(() => {
    if (activeSubject && activeSubject.notes && activeSubject.notes.length > 0) {
      if (!selectedNoteTopic || !activeSubject.notes.find(n => n.topicName === selectedNoteTopic)) {
        setSelectedNoteTopic(activeSubject.notes[0].topicName);
      }
    }
  }, [activeSubjectId, activeSubject]);

  // Trigger next step logic: pipeline creation
  const handleCreateSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !subjectName || !syllabusRaw) {
      alert("தயவுசெய்து அனைத்து முக்கிய விவரங்களையும் நிரப்பவும்.");
      return;
    }

    setApiError(null);
    setIsCreatingSubject(true);

    try {
      // Step 1: Syllabus Analysis
      setLoadingStep(1);
      setLoadingText("Syllabus பகுப்பாய்வு செய்யப்படுகிறது (Step 1 of 4)...");
      const analysisRes = await fetch("/api/step1-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, subject: subjectName, syllabus: syllabusRaw, examDate, studyTime }),
      });
      if (!analysisRes.ok) throw new Error("Step 1 Analysis failed");
      const analysisData = await analysisRes.json();

      // Gather topics list to generate notes and plans
      const allTopics: string[] = [];
      analysisData.analysis.units.forEach((unit: any) => {
        unit.topics.forEach((topic: any) => {
          allTopics.push(topic.name);
        });
      });

      // Step 2: Notes Creation
      setLoadingStep(2);
      setLoadingText("பாடக் குறிப்புகள் மற்றும் நினைவக உத்திகள் உருவாக்கப்படுகின்றன (Step 2 of 4)...");
      const notesRes = await fetch("/api/step2-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, subject: analysisData.subjectName, topics: allTopics }),
      });
      if (!notesRes.ok) throw new Error("Step 2 Notes generation failed");
      const notesData = await notesRes.json();

      // Step 3: Question Generator
      setLoadingStep(3);
      setLoadingText("முக்கிய வினாக்கள் மற்றும் விடைகள் உருவாக்கப்படுகின்றன (Step 3 of 4)...");
      const questionsRes = await fetch("/api/step3-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, subject: analysisData.subjectName, syllabusBrief: syllabusRaw }),
      });
      if (!questionsRes.ok) throw new Error("Step 3 Questions generation failed");
      const questionsData = await questionsRes.json();

      // Step 4: Study Plan Generator
      setLoadingStep(4);
      setLoadingText("நாட்காட்டி மற்றும் திருப்புதல் அட்டவணை உருவாக்கப்படுகிறது (Step 4 of 4)...");
      const planRes = await fetch("/api/step4-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, subject: analysisData.subjectName, topics: allTopics, examDate, studyTime }),
      });
      if (!planRes.ok) throw new Error("Step 4 Plan generation failed");
      const planData = await planRes.json();

      const newSubject: SubjectSystem = {
        id: `sub-${Date.now()}`,
        course,
        subjectName: analysisData.subjectName,
        syllabusRaw,
        examDate,
        studyTime,
        createdAt: new Date().toISOString(),
        analysis: analysisData.analysis,
        notes: notesData.notes,
        questions: questionsData.questions,
        studyPlan: planData.studyPlan,
        completedTopics: [],
        mockExamHistory: []
      };

      setSubjects(prev => [newSubject, ...prev]);
      setActiveSubjectId(newSubject.id);
      setIsCreatingSubject(false);
      setLoadingStep(null);
      setActiveTab("analysis");

      // Reset fields
      setCourse("");
      setSubjectName("");
      setSyllabusRaw("");
      setExamDate("");
      setStudyTime("2 hours");
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.");
      setLoadingStep(null);
    }
  };

  // Toggle complete state for a topic
  const toggleTopicCompleted = (topicName: string) => {
    if (!activeSubject) return;
    const isCompleted = activeSubject.completedTopics.includes(topicName);
    const updatedCompleted = isCompleted
      ? activeSubject.completedTopics.filter((t) => t !== topicName)
      : [...activeSubject.completedTopics, topicName];

    setSubjects(prev =>
      prev.map(sub =>
        sub.id === activeSubject.id
          ? { ...sub, completedTopics: updatedCompleted }
          : sub
      )
    );
  };

  // Delete a subject workspace
  const handleDeleteSubject = (id: string, name: string) => {
    if (confirm(`"${name}" பாடத்தின் மொத்த தரவையும் நீக்க விரும்புகிறீர்களா?`)) {
      const remaining = subjects.filter(s => s.id !== id);
      setSubjects(remaining);
      if (remaining.length > 0) {
        setActiveSubjectId(remaining[0].id);
      } else {
        setActiveSubjectId("");
      }
    }
  };

  // Setup/Reset a mock exam question
  const selectMockExamQuestion = () => {
    if (!activeSubject) return;
    const qTypes = ["twoMarks", "fiveMarks", "tenMarks"];
    const randomType = qTypes[Math.floor(Math.random() * qTypes.length)] as "twoMarks" | "fiveMarks" | "tenMarks";
    const qs = activeSubject.questions[randomType];
    if (qs && qs.length > 0) {
      const q = qs[Math.floor(Math.random() * qs.length)];
      setExamQuestion(q.question);
      setExamMarks(randomType === "twoMarks" ? 2 : randomType === "fiveMarks" ? 5 : 10);
      setStudentAnswer("");
      setEvaluationResult(null);
    } else {
      // Fallback
      setExamQuestion("Explain the core data structure elements in brief. (தரவு கட்டமைப்பின் முக்கிய கூறுகளை சுருக்கமாக விளக்குக.)");
      setExamMarks(10);
      setStudentAnswer("");
      setEvaluationResult(null);
    }
  };

  // Load a question when exam tab is chosen if not set
  useEffect(() => {
    if (activeTab === "exam" && !examQuestion && activeSubject) {
      selectMockExamQuestion();
    }
  }, [activeTab, activeSubject]);

  // Evaluate mock test
  const handleEvaluateAnswer = async () => {
    if (!studentAnswer.trim()) {
      alert("தயவுசெய்து உங்கள் பதிலை தட்டச்சு செய்யவும்.");
      return;
    }
    setIsEvaluating(true);
    setApiError(null);
    try {
      const response = await fetch("/api/step5-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: examQuestion,
          marks: examMarks,
          studentAnswer,
          subjectName: activeSubject?.subjectName
        })
      });
      if (!response.ok) throw new Error("평가에 실패했습니다.");
      const evaluation: MockTestEvaluation = await response.json();
      setEvaluationResult(evaluation);

      // Add to mock exam history
      if (activeSubject) {
        const historyItem = {
          id: `eval-${Date.now()}`,
          date: new Date().toLocaleDateString("ta-IN"),
          question: examQuestion,
          marks: examMarks,
          studentAnswer,
          evaluation
        };
        setSubjects(prev =>
          prev.map(sub =>
            sub.id === activeSubject.id
              ? { ...sub, mockExamHistory: [historyItem, ...(sub.mockExamHistory || [])] }
              : sub
          )
        );
      }
    } catch (err: any) {
      setApiError("மதிப்பீடு செய்வதில் தோல்வி ஏற்பட்டது: " + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Send message to live tutor chat
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeSubject) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      text: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: activeSubject.course,
          subject: activeSubject.subjectName,
          message: userMsg.text,
          history: chatHistory.map(h => ({ role: h.role, text: h.text }))
        })
      });

      if (!response.ok) throw new Error("tutor chat error");
      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `chat-err-${Date.now()}`,
        role: "model",
        text: "மன்னிக்கவும், பதிலைப் பெற இயலவில்லை. மீண்டும் முயற்சிக்கவும்.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Calculate Preparation metrics
  const totalTopicsCount = activeSubject
    ? activeSubject.analysis.units.reduce((acc, u) => acc + u.topics.length, 0)
    : 0;
  const completedTopicsCount = activeSubject?.completedTopics?.length || 0;
  const prepProgressPercent = totalTopicsCount > 0
    ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
    : 0;

  // Find next task / recommended topic to study
  const nextRecommendedTopic = activeSubject
    ? activeSubject.analysis.units
        .flatMap(u => u.topics)
        .find(t => !activeSubject.completedTopics.includes(t.name))?.name || "All topics completed! 🎉"
    : "";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col antialiased">
      {/* Top Banner / Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Study Master AI <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium border border-indigo-100">ஸ்டடி மாஸ்டர் ஏஐ</span>
              </h1>
              <p className="text-xs text-slate-500">உங்களின் தனிப்பட்ட தேர்வுத் தயாரிப்பு துணைவன்</p>
            </div>
          </div>

          {/* Quick Select & Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {subjects.length > 0 && (
              <select
                id="subject-selector"
                value={activeSubjectId}
                onChange={(e) => {
                  setActiveSubjectId(e.target.value);
                  setEvaluationResult(null);
                  setExamQuestion("");
                }}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subjectName.substring(0, 30)}...
                  </option>
                ))}
              </select>
            )}

            <button
              id="new-workspace-btn"
              onClick={() => setIsCreatingSubject(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 text-sm flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>புதிய பாடத்திட்டம் (Add Subject)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative">
        
        {/* Left Side: Sidebar Stats & Next Task & Subjects List */}
        {activeSubject && (
          <div className="w-full lg:w-80 flex flex-col gap-5 shrink-0">
            {/* Subject Identity Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase block mb-1">
                {activeSubject.course}
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {activeSubject.subjectName}
              </h2>
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">தேர்வு நாள் (Exam Date):</span>
                  <span className="font-semibold text-slate-800">{activeSubject.examDate || "Not Set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">படிக்கும் நேரம் (Study Time):</span>
                  <span className="font-semibold text-slate-800">{activeSubject.studyTime}</span>
                </div>
              </div>
            </div>

            {/* Preparation Level Progress (📊 Preparation Level in POML) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>தயாரிப்பு நிலை (Prep Level)</span>
                </span>
                <span className="text-lg font-bold text-emerald-600">{prepProgressPercent}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${prepProgressPercent}%` }}
                ></div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                பாடத்திட்டத்தில் உள்ள <strong>{totalTopicsCount}</strong> முக்கிய தலைப்புகளில் <strong>{completedTopicsCount}</strong> தலைப்புகளை படித்து முடித்துள்ளீர்கள்.
              </p>

              {/* Next Task recommendation (➡ Next Task in POML) */}
              <div className="bg-indigo-50/70 border border-indigo-100/80 rounded-xl p-3">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  ➡ அடுத்த பணி (Next Task)
                </span>
                <p className="text-xs font-semibold text-indigo-900 line-clamp-2">
                  {nextRecommendedTopic}
                </p>
                {nextRecommendedTopic !== "All topics completed! 🎉" && (
                  <button
                    onClick={() => {
                      setActiveTab("notes");
                      setSelectedNoteTopic(nextRecommendedTopic);
                    }}
                    className="mt-2 text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    படிக்கத் தொடங்கு <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Sub-steps navigation tabs (Step 1 to 5) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-col gap-1">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "analysis"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4" />
                  <span>Syllabus பகுப்பாய்வு</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">Step 1</span>
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "notes"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>பாடக் குறிப்புகள் (Notes)</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">Step 2</span>
              </button>

              <button
                onClick={() => setActiveTab("questions")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "questions"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>வினா விடை வங்கி (Q&A)</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">Step 3</span>
              </button>

              <button
                onClick={() => setActiveTab("plan")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "plan"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>படிப்புத் திட்டம் (Schedule)</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">Step 4</span>
              </button>

              <button
                onClick={() => setActiveTab("exam")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "exam"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4" />
                  <span>தேர்வு அரங்கம் (Exam Mode)</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">Step 5</span>
              </button>
            </div>

            {/* Quick Helper Links / Workspace manager */}
            <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200/60 text-xs flex justify-between items-center text-slate-500">
              <span>சகல விவரங்களும் பாதுகாப்பாக சேமிக்கப்படும்</span>
              <button
                onClick={() => handleDeleteSubject(activeSubject.id, activeSubject.subjectName)}
                className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-0.5 cursor-pointer"
                title="வொர்க்ஸ்பேஸ் நீக்கு"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        )}

        {/* Right Side: Primary Active Step Workspace view */}
        <div className="flex-1 flex flex-col gap-6">
          {apiError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-4 flex gap-3 text-sm items-start">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">பிழை ஏற்பட்டது (Error):</span>
                <p className="mt-1">{apiError}</p>
                <button
                  onClick={() => setApiError(null)}
                  className="mt-2 text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded font-medium hover:bg-rose-200 transition-colors cursor-pointer"
                >
                  மூடு
                </button>
              </div>
            </div>
          )}

          {!activeSubject ? (
            /* Blank state workspace if no subject is loaded/created */
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-2xl mx-auto my-12">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">எந்த ஒரு பாடமும் தேர்ந்தெடுக்கப்படவில்லை</h3>
              <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
                ஸ்டடி மாஸ்டர் ஏஐ உடன் பாடக் குறிப்புகள், படிப்புத் திட்டம் மற்றும் மாதிரித் தேர்வுகளை உருவாக்க, புதிய பாடத்திட்டத்தை சேர்க்கவும் அல்லது மாதிரிப் பாடத்தைப் பார்க்கவும்.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSubjects([prepopulatedSubject]);
                    setActiveSubjectId(prepopulatedSubject.id);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  மாதிரிப் பாடம் பார்க்கவும் (Data Structures)
                </button>
                <button
                  onClick={() => setIsCreatingSubject(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-md shadow-indigo-100 transition-colors cursor-pointer"
                >
                  சொந்தப் பாடத்தைச் சேர்க்க
                </button>
              </div>
            </div>
          ) : (
            /* Sub-tab Workspaces rendered conditionally */
            <>
              {/* STEP 1: Syllabus Analysis */}
              {activeTab === "analysis" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col gap-6">
                  <div>
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                          <Compass className="text-indigo-600 w-5 h-5" />
                          <span>📚 Subject: {activeSubject.subjectName}</span>
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">பாடத்திட்டத்தில் உள்ள அலகுகள் (Units) மற்றும் தலைப்புகள் ஆகியவற்றின் விரிவான பகுப்பாய்வு.</p>
                      </div>
                    </div>
                  </div>

                  {/* Units rendering */}
                  <div className="flex flex-col gap-6">
                    {activeSubject.analysis.units.map((unit, uIdx) => (
                      <div key={uIdx} className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                        {/* Unit Header */}
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                            {unit.name}
                          </h4>
                          <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                            {unit.topics.length} தலைப்புகள்
                          </span>
                        </div>

                        {/* Topics Lists */}
                        <div className="divide-y divide-slate-100">
                          {unit.topics.map((topic, tIdx) => {
                            const isTopicDone = activeSubject.completedTopics.includes(topic.name);
                            return (
                              <div
                                key={tIdx}
                                className={`p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start transition-colors ${
                                  isTopicDone ? "bg-emerald-50/20" : "hover:bg-slate-50/40"
                                }`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                                    <h5 className="font-bold text-slate-900 text-sm">{topic.name}</h5>
                                    
                                    {/* Difficulty and Importance tags */}
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                                        topic.importance === "High"
                                          ? "bg-rose-50 text-rose-700 border border-rose-100"
                                          : topic.importance === "Medium"
                                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                                          : "bg-slate-50 text-slate-600 border border-slate-100"
                                      }`}
                                    >
                                      {topic.importance === "High" ? "⭐ முக்கியமானது (High)" : topic.importance === "Medium" ? "Medium" : "Low"}
                                    </span>

                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                        topic.difficulty === "Hard"
                                          ? "bg-red-50 text-red-600"
                                          : topic.difficulty === "Medium"
                                          ? "bg-blue-50 text-blue-600"
                                          : "bg-emerald-50 text-emerald-600"
                                      }`}
                                    >
                                      {topic.difficulty === "Hard" ? "கடினம் (Hard)" : topic.difficulty === "Medium" ? "நடுத்தரம்" : "எளிது"}
                                    </span>

                                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                                      {topic.weightagePercent}% மதிப்பெண்கள்
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                                    {topic.description}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-center sm:self-start mt-2 sm:mt-0">
                                  <button
                                    onClick={() => toggleTopicCompleted(topic.name)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                      isTopicDone
                                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                    }`}
                                  >
                                    <CheckCircle className={`w-3.5 h-3.5 ${isTopicDone ? "fill-emerald-500 text-white" : ""}`} />
                                    <span>{isTopicDone ? "படித்து முடித்தேன்" : "படித்தேன் என குறி"}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveTab("notes");
                                      setSelectedNoteTopic(topic.name);
                                    }}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                                    title="குறிப்புகள் காண்க"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Notes & Explanations */}
              {activeTab === "notes" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Notes Navigator list */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs h-fit flex flex-col gap-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider px-2 mb-2">தலைப்புகள் பட்டியல் (Topics)</h4>
                    <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-1">
                      {activeSubject.notes.map((note, idx) => {
                        const isDone = activeSubject.completedTopics.includes(note.topicName);
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedNoteTopic(note.topicName)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              selectedNoteTopic === note.topicName
                                ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-bold"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span className="truncate flex items-center gap-1.5">
                              {isDone ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 shrink-0" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></span>
                              )}
                              <span className="truncate">{note.topicName}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes Content Display */}
                  <div className="md:col-span-2 flex flex-col gap-5">
                    {(() => {
                      const note = activeSubject.notes.find((n) => n.topicName === selectedNoteTopic);
                      if (!note) {
                        return (
                          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
                            இடதுபுறமுள்ள தலைப்புகளில் ஏதேனும் ஒன்றை தேர்ந்தெடுத்து பாடக் குறிப்புகளைப் படிக்கவும்.
                          </div>
                        );
                      }

                      const isDone = activeSubject.completedTopics.includes(note.topicName);

                      return (
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col gap-6">
                          {/* Note Title */}
                          <div className="flex justify-between items-start gap-4 flex-wrap border-b border-slate-100 pb-4">
                            <div>
                              <span className="text-xs font-bold text-indigo-600 tracking-wider block uppercase mb-1">
                                பாடக் குறிப்புகள் (Notes)
                              </span>
                              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                {note.topicName}
                              </h3>
                            </div>
                            <button
                              onClick={() => toggleTopicCompleted(note.topicName)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                                isDone
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                              }`}
                            >
                              <CheckCircle className={`w-4 h-4 ${isDone ? "fill-emerald-500 text-emerald-100" : ""}`} />
                              <span>{isDone ? "படித்து முடித்தேன் (Completed)" : "படித்து முடித்தேன் என குறிக்கவும்"}</span>
                            </button>
                          </div>

                          {/* Tamil Explanation (📝 Notes in POML) */}
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
                              <span className="w-1 h-4 bg-indigo-500 rounded-sm"></span>
                              <span>எளிய தமிழ் விளக்கம் (Simple Explanation):</span>
                            </h4>
                            <div className="bg-slate-50/55 rounded-xl p-4 text-sm text-slate-700 leading-relaxed border border-slate-100">
                              {note.tamilExplanation}
                            </div>
                          </div>

                          {/* Bullet notes */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="bg-[#f0f9ff]/50 border border-[#e0f2fe] rounded-xl p-4">
                              <h5 className="font-bold text-[#0369a1] text-xs uppercase tracking-wider mb-2">
                                📌 திருப்புதல் குறிப்புகள் (Revision Notes)
                              </h5>
                              <ul className="space-y-2 text-xs text-[#0c4a6e] list-disc list-inside">
                                {note.shortNotes.map((pt, i) => (
                                  <li key={i}>{pt}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-[#f0fdf4]/50 border border-[#dcfce7] rounded-xl p-4">
                              <h5 className="font-bold text-[#15803d] text-xs uppercase tracking-wider mb-2">
                                ⭐ முக்கிய தகவல்கள் (Important Points)
                              </h5>
                              <ul className="space-y-2 text-xs text-[#14532d] list-disc list-inside">
                                {note.importantPoints.map((pt, i) => (
                                  <li key={i}>{pt}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Memory tricks (🧠 Memory Tricks in POML) */}
                          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4">
                            <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Zap className="w-4 h-4 text-amber-600" />
                              <span>நினைவக உத்தி / உவமை (Memory Trick / Analogy)</span>
                            </h4>
                            <p className="text-xs text-amber-900 leading-relaxed">
                              {note.memoryTricks}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* STEP 3: Question Generator (❓ Questions in POML) */}
              {activeTab === "questions" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col gap-6">
                  {/* Questions sub-navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 pb-4 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <HelpCircle className="text-indigo-600 w-5 h-5" />
                        <span>❓ Question Generator</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">தேர்வு மதிப்பெண்களின் அடிப்படையில் வகைப்படுத்தப்பட்ட வினா வங்கி.</p>
                    </div>

                    <div className="flex rounded-lg bg-slate-100 p-1 self-stretch sm:self-auto overflow-x-auto">
                      <button
                        onClick={() => setQuestionsType("mcq")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          questionsType === "mcq" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"
                        }`}
                      >
                        MCQ பயிற்சி
                      </button>
                      <button
                        onClick={() => setQuestionsType("2marks")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          questionsType === "2marks" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"
                        }`}
                      >
                        2 மதிப்பெண் (2 Marks)
                      </button>
                      <button
                        onClick={() => setQuestionsType("5marks")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          questionsType === "5marks" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"
                        }`}
                      >
                        5 மதிப்பெண் (5 Marks)
                      </button>
                      <button
                        onClick={() => setQuestionsType("10marks")}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          questionsType === "10marks" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"
                        }`}
                      >
                        10 மதிப்பெண் (10 Marks)
                      </button>
                    </div>
                  </div>

                  {/* Render MCQs */}
                  {questionsType === "mcq" && (
                    <div className="flex flex-col gap-6">
                      {activeSubject.questions.mcqs.map((mcq, mIdx) => {
                        const chosenAnswer = mcqAnswers[mIdx];
                        const showExplanation = showMcqExplanations[mIdx];
                        const isCorrect = chosenAnswer === mcq.correctAnswerIndex;

                        return (
                          <div key={mIdx} className="border border-slate-100 rounded-2xl p-5 shadow-xs bg-slate-50/40">
                            <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                              MCQ {mIdx + 1}
                            </span>
                            <h4 className="font-semibold text-slate-900 mt-2.5 text-sm sm:text-base leading-snug">
                              {mcq.question}
                            </h4>

                            {/* Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              {mcq.options.map((option, oIdx) => {
                                let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
                                if (chosenAnswer !== undefined) {
                                  if (oIdx === mcq.correctAnswerIndex) {
                                    btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold";
                                  } else if (chosenAnswer === oIdx) {
                                    btnStyle = "bg-rose-50 border-rose-300 text-rose-800";
                                  } else {
                                    btnStyle = "bg-white border-slate-100 text-slate-400 opacity-60";
                                  }
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    disabled={chosenAnswer !== undefined}
                                    onClick={() => {
                                      setMcqAnswers(prev => ({ ...prev, [mIdx]: oIdx }));
                                      setShowMcqExplanations(prev => ({ ...prev, [mIdx]: true }));
                                    }}
                                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${btnStyle} ${
                                      chosenAnswer === undefined ? "cursor-pointer" : ""
                                    }`}
                                  >
                                    <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-[10px] text-slate-500 shrink-0">
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span>{option}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {showExplanation && (
                              <div className={`mt-4 p-4 rounded-xl border text-xs ${
                                isCorrect ? "bg-emerald-50/50 border-emerald-100 text-emerald-900" : "bg-rose-50/50 border-rose-100 text-rose-900"
                              }`}>
                                <p className="font-bold flex items-center gap-1.5 mb-1">
                                  {isCorrect ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                                  )}
                                  <span>{isCorrect ? "சரியான விடை! (Correct)" : "தவறான விடை. சரியான விடை:"} Option {String.fromCharCode(65 + mcq.correctAnswerIndex)}</span>
                                </p>
                                <p className="leading-relaxed mt-2 pl-5">
                                  {mcq.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render 2, 5, 10 Marks */}
                  {questionsType !== "mcq" && (
                    <div className="flex flex-col gap-6">
                      {(() => {
                        const targetList =
                          questionsType === "2marks"
                            ? activeSubject.questions.twoMarks
                            : questionsType === "5marks"
                            ? activeSubject.questions.fiveMarks
                            : activeSubject.questions.tenMarks;

                        if (!targetList || targetList.length === 0) {
                          return (
                            <p className="text-center text-slate-400 py-6 text-xs">
                              இந்த பிரிவில் கேள்விகள் எதுவும் உருவாக்கப்படவில்லை.
                            </p>
                          );
                        }

                        return targetList.map((q, idx) => (
                          <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                            <div className="bg-slate-50/70 p-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
                              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                                வினா {idx + 1}
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-500">
                                {questionsType === "2marks" ? "2 Marks (மதிப்பெண்கள்)" : questionsType === "5marks" ? "5 Marks" : "10 Marks"}
                              </span>
                            </div>

                            <div className="p-4 sm:p-5 flex flex-col gap-4">
                              <h4 className="font-bold text-slate-900 text-sm leading-snug">
                                {q.question}
                              </h4>

                              <div className="bg-indigo-50/30 border border-indigo-100/60 rounded-xl p-4">
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-2">
                                  🔑 விடைக்குறிப்பு மற்றும் கட்டமைப்பு (Ideal Key / Outline)
                                </span>
                                <p className="text-xs text-indigo-955 leading-relaxed whitespace-pre-line">
                                  {q.answerTamil}
                                </p>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Study Plan & Timetable (📅 Study Plan in POML) */}
              {activeTab === "plan" && (
                <div className="flex flex-col gap-6">
                  {/* Timetable schedule list */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="text-indigo-600 w-5 h-5" />
                        <span>📅 Study Plan (படிப்புத் திட்டம்)</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">நாட்கள் வாரியாக தலைப்புகளைப் பிரித்துப் படிப்பதற்கான அட்டவணை.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeSubject.studyPlan.dailySchedule.map((day, idx) => (
                        <div key={idx} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 hover:bg-slate-50 flex flex-col justify-between transition-colors shadow-xs">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                {day.dateString}
                              </span>
                              <span className="text-xs text-slate-500 font-semibold">{day.studyDurationHours} மணிநேரம் (Hours)</span>
                            </div>

                            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">படிக்க வேண்டிய தலைப்புகள்:</h4>
                            <ul className="space-y-1.5 mb-4">
                              {day.topicsToCover.map((topic, tIdx) => {
                                const isDone = activeSubject.completedTopics.includes(topic);
                                return (
                                  <li key={tIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDone ? "bg-emerald-500" : "bg-indigo-500"}`}></span>
                                    <span className={isDone ? "line-through text-slate-400" : ""}>{topic}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          <div className="bg-white border border-slate-100 rounded-lg p-2.5 text-[11px] text-slate-600 leading-normal">
                            <span className="font-bold text-indigo-600 block mb-0.5">💡 Focus Tip:</span>
                            {day.focusTips}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revision Schedule & Improvement Tips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Revision schedule */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4 text-emerald-500" />
                        <span>🔄 திருப்புதல் அட்டவணை (Revision Schedule)</span>
                      </h4>
                      <div className="flex flex-col gap-3.5">
                        {activeSubject.studyPlan.revisionSchedule.map((rev, idx) => (
                          <div key={idx} className="border border-emerald-100 bg-[#f0fdf4]/30 rounded-xl p-3 text-xs text-slate-700">
                            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-1">
                              <span className="font-bold text-emerald-700">{rev.dateString}</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase">Active Recall</span>
                            </div>
                            <p className="mb-2"><strong>Revise:</strong> {rev.topics.join(", ")}</p>
                            <p className="text-[11px] text-slate-500 leading-normal bg-white p-2 rounded border border-emerald-50">
                              <strong>முறைகள்:</strong> {rev.method}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weak Area Tips */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-amber-500" />
                        <span>⚡ கடின பகுதிகளை எதிர்கொள்ளும் உத்திகள் (Weak Area Tips)</span>
                      </h4>
                      <ul className="space-y-3">
                        {activeSubject.studyPlan.weakAreaImprovementTips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-bold shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed mt-0.5">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Exam Mode (Mock Test / Eval) */}
              {activeTab === "exam" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Mock test panel */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col gap-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="text-indigo-600 w-5 h-5" />
                        <span>📝 Mock Test Arena (தேர்வு அரங்கம்)</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">மதிப்பீடு செய்ய பதிலை தட்டச்சு செய்து AI-மதிப்பீட்டாளரின் கருத்துக்களைப் பெறவும்.</p>
                    </div>

                    {/* Question Box */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
                          கேள்வி (Question)
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">{examMarks} Marks</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                        {examQuestion}
                      </h4>
                      <div className="flex justify-end">
                        <button
                          onClick={selectMockExamQuestion}
                          className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>வேறு கேள்வி மாற்று (Switch Question)</span>
                        </button>
                      </div>
                    </div>

                    {/* Answer area */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="student-answer-area" className="text-xs font-bold text-slate-700">உங்கள் பதில் (Type Your Answer):</label>
                      <textarea
                        id="student-answer-area"
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                        placeholder="பதிலை தமிழ் அல்லது ஆங்கிலத்தில் தட்டச்சு செய்யவும். சூத்திரங்கள், முக்கிய குறிப்புகள் மற்றும் விளக்கங்களை விரிவாக எழுத முயற்சிக்கவும்..."
                        className="w-full min-h-[160px] border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                      <p className="text-[11px] text-slate-400">குறிப்பு: உங்கள் பதிலில் ஆங்கில தொழில்நுட்பச் சொற்களையும் தாராளமாகப் பயன்படுத்தலாம்.</p>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                      <button
                        onClick={handleEvaluateAnswer}
                        disabled={isEvaluating}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl px-5 py-3 text-sm flex items-center gap-2 shadow-md shadow-indigo-100 transition-colors cursor-pointer"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>பதில் மதிப்பீடு செய்யப்படுகிறது...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>பதிலை மதிப்பிடு (Submit Answer)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Evaluation Result if submitted */}
                    {evaluationResult && (
                      <div className="border-t border-slate-200 pt-5 flex flex-col gap-5">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-xs text-slate-500 font-semibold block">உங்கள் மதிப்பெண் (Score)</span>
                            <span className="text-2xl font-extrabold text-indigo-700 mt-1 block">{evaluationResult.score} / 10</span>
                          </div>
                          <span className="text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-lg">
                            {evaluationResult.score >= 8 ? "Excellent! 🎉" : evaluationResult.score >= 5 ? "Good Progress! 👍" : "Need Improvement! 📚"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
                            <h5 className="font-bold text-emerald-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5" /> strengths (பலம்)
                            </h5>
                            <p className="text-xs text-emerald-950 leading-relaxed">
                              {evaluationResult.strengths}
                            </p>
                          </div>

                          <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-4">
                            <h5 className="font-bold text-rose-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> weaknesses (திருத்தங்கள்)
                            </h5>
                            <p className="text-xs text-rose-955 leading-relaxed">
                              {evaluationResult.weaknesses}
                            </p>
                          </div>
                        </div>

                        <div className="border border-indigo-100 rounded-xl overflow-hidden shadow-xs">
                          <div className="bg-indigo-50/60 p-3 border-b border-indigo-100 font-bold text-indigo-800 text-xs uppercase tracking-wider">
                            Perfect Model Answer (முழுமையான விடை மாதிரி)
                          </div>
                          <div className="p-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-indigo-50/20">
                            {evaluationResult.perfectAnswer}
                          </div>
                        </div>

                        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4">
                          <span className="text-xs font-bold text-amber-800 block mb-1">💡 Tutor Feedback (மதிப்பீட்டாளர் உரை):</span>
                          <p className="text-xs text-amber-955 leading-relaxed">{evaluationResult.tamilExplanation}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right column of exam mode: mock test history */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs h-fit flex flex-col gap-4">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span>முந்தைய தேர்வுகளின் வரலாறு (History)</span>
                    </h4>

                    {(!activeSubject.mockExamHistory || activeSubject.mockExamHistory.length === 0) ? (
                      <p className="text-xs text-slate-400 py-6 text-center leading-normal">
                        வரலாறு காலியாக உள்ளது. முதல் தேர்வை எழுதி உங்களை சோதித்துக் கொள்ளுங்கள்!
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                        {activeSubject.mockExamHistory.map((item, idx) => (
                          <div key={idx} className="border border-slate-100 rounded-xl p-3 text-xs bg-slate-50/55 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-mono text-[10px] text-slate-400">{item.date}</span>
                              <span className="font-extrabold text-indigo-700 bg-white border border-slate-100 px-2 py-0.5 rounded">
                                {item.evaluation.score} / 10
                              </span>
                            </div>
                            <p className="font-bold text-slate-700 line-clamp-2 mb-1.5">{item.question}</p>
                            <button
                              onClick={() => {
                                setExamQuestion(item.question);
                                setExamMarks(item.marks);
                                setStudentAnswer(item.studentAnswer);
                                setEvaluationResult(item.evaluation);
                              }}
                              className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                            >
                              முடிவுகளை மீண்டும் காண்க (View Detail)
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Persistent Live AI Tutor Floating Chatbot (💬 Client Chat in POML) */}
      {activeSubject && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          {chatOpen ? (
            <div className="w-[330px] sm:w-[380px] h-[450px] bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col mb-3 animate-fade-in-up">
              {/* Chat Header */}
              <div className="bg-indigo-600 p-3.5 text-white flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">ஸ்டடி மாஸ்டர் AI Tutor</h4>
                    <span className="text-[10px] text-indigo-200">மின்னல் வேக விளக்கம்</span>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white hover:text-indigo-100 text-lg cursor-pointer"
                  title="மூடு"
                >
                  ✕
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50">
                {chatHistory.length === 0 && (
                  <div className="text-center text-slate-400 py-12 px-4 flex flex-col items-center">
                    <MessageSquare className="w-8 h-8 text-slate-300 mb-2.5" />
                    <p className="text-xs leading-relaxed">
                      வணக்கம்! நான் உங்கள் <strong>Study Master AI Tutor</strong>. பாடத்திட்டம் மற்றும் குறிப்புகள் குறித்து ஏதேனும் கேள்விகள் இருந்தால் கேளுங்கள்.
                    </p>
                  </div>
                )}

                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex flex-col ${chat.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      chat.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"
                    }`}>
                      {chat.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{chat.timestamp}</span>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    <span>பதில் டைப் செய்யப்படுகிறது...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 flex gap-2 bg-white">
                <input
                  id="chat-input-box"
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="ஏதேனும் சந்தேகம் உள்ளதா? கேளுங்கள்..."
                  className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : null}

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full p-4 shadow-lg hover:shadow-indigo-200/50 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">சந்தேகம் கேளுங்கள் (AI Tutor)</span>
          </button>
        </div>
      )}

      {/* New Subject Dialog / Form */}
      {isCreatingSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 animate-scale-up">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                  <BookMarked className="text-indigo-600 w-5 h-5" />
                  <span>புதிய பாடத்திட்டத்தைச் சேர்</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">உங்கள் பாடத்திட்டத்தின் அடிப்படையில் தனிப்பயன் படிப்புத் திட்டத்தை உருவாக்குங்கள்.</p>
              </div>
              <button
                onClick={() => {
                  if (loadingStep === null) setIsCreatingSubject(false);
                }}
                disabled={loadingStep !== null}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer disabled:opacity-40"
              >
                ✕
              </button>
            </div>

            {loadingStep !== null ? (
              /* Loading pipeline screen */
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-6">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                  <span className="absolute font-bold text-xs text-indigo-700">{loadingStep}/4</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">AI பகுப்பாய்வு செய்கிறது...</h4>
                  <p className="text-xs text-indigo-700 font-semibold mt-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full inline-block">
                    {loadingText}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-3 max-w-xs leading-normal">
                    Gemini 3.5 Flash உங்களின் பாடத்திட்டத்தை ஆராய்ந்து எளிய தமிழ் விளக்கங்கள், வினா வங்கிகள் மற்றும் உகந்த நாட்காட்டியை தயார் செய்கிறது. இதற்குச் சில வினாடிகள் ஆகலாம்.
                  </p>
                </div>
              </div>
            ) : (
              /* Actual input fields */
              <form onSubmit={handleCreateSystem} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="course-input" className="text-xs font-bold text-slate-700">வகுப்பு / கல்வி நிலை (Course/Class):</label>
                  <input
                    id="course-input"
                    type="text"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="எ.கா. B.E. Computer Science, Class 10, Class 12..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject-input" className="text-xs font-bold text-slate-700">பாடம் (Subject Name):</label>
                  <input
                    id="subject-input"
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="எ.கா. Engineering Physics, கணிதம், Computer Networks..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="syllabus-input" className="text-xs font-bold text-slate-700">பாடத்திட்டம் அல்லது குறிப்புகள் (Syllabus or Notes):</label>
                  <textarea
                    id="syllabus-input"
                    required
                    value={syllabusRaw}
                    onChange={(e) => setSyllabusRaw(e.target.value)}
                    placeholder="பாடத்திட்டம், அலகுகள், முக்கியத் தலைப்புகள் அல்லது சுருக்கக் குறிப்புகளை இங்கே ஒட்டவும்..."
                    className="w-full min-h-[120px] border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="examdate-input" className="text-xs font-bold text-slate-700">தேர்வு தேதி (Exam Date):</label>
                    <input
                      id="examdate-input"
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="studytime-input" className="text-xs font-bold text-slate-700">கிடைக்கும் படிப்பு நேரம் (Study Time):</label>
                    <input
                      id="studytime-input"
                      type="text"
                      value={studyTime}
                      onChange={(e) => setStudyTime(e.target.value)}
                      placeholder="எ.கா. 2 hours per day, 5 hours"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingSubject(false)}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    ரத்துசெய் (Cancel)
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-colors cursor-pointer"
                  >
                    படிப்பு முறையைத் தொடங்கு
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
