export interface TopicAnalysis {
  name: string;
  importance: "High" | "Medium" | "Low" | string;
  difficulty: "Hard" | "Medium" | "Easy" | string;
  weightagePercent: number;
  description: string;
}

export interface UnitAnalysis {
  name: string;
  topics: TopicAnalysis[];
}

export interface SyllabusAnalysis {
  subjectName: string;
  analysis: {
    units: UnitAnalysis[];
  };
}

export interface VisualDiagramNode {
  id: string;
  labelEnglish: string;
  labelTamil: string;
  description?: string;
}

export interface VisualDiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface VisualDiagram {
  type: "flowchart" | "tree" | "cycle" | "compare" | "table" | string;
  title: string;
  nodes: VisualDiagramNode[];
  edges: VisualDiagramEdge[];
}

export interface StudyNote {
  topicName: string;
  tamilExplanation: string;
  shortNotes: string[];
  importantPoints: string[];
  memoryTricks: string;
  visualDiagram?: VisualDiagram;
}

export interface TwoFiveTenMarkQuestion {
  question: string;
  answerTamil: string;
  answerEnglish?: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuestionBank {
  twoMarks: TwoFiveTenMarkQuestion[];
  fiveMarks: TwoFiveTenMarkQuestion[];
  tenMarks: TwoFiveTenMarkQuestion[];
  mcqs: MCQQuestion[];
}

export interface DailyPlanDay {
  dayNumber: number;
  dateString: string;
  topicsToCover: string[];
  studyDurationHours: number;
  focusTips: string;
}

export interface RevisionMilestone {
  dateString: string;
  topics: string[];
  method: string;
}

export interface StudyPlan {
  dailySchedule: DailyPlanDay[];
  revisionSchedule: RevisionMilestone[];
  weakAreaImprovementTips: string[];
}

export interface MockTestEvaluation {
  score: number;
  strengths: string;
  weaknesses: string;
  perfectAnswer: string;
  tamilExplanation: string;
}

export interface SubjectSystem {
  id: string;
  course: string;
  subjectName: string;
  syllabusRaw: string;
  examDate: string;
  studyTime: string;
  createdAt: string;
  analysis: SyllabusAnalysis["analysis"];
  notes: StudyNote[];
  questions: QuestionBank;
  studyPlan: StudyPlan;
  completedTopics: string[]; // Set of completed topic names
  mockExamHistory: Array<{
    id: string;
    date: string;
    question: string;
    marks: number;
    studentAnswer: string;
    evaluation: MockTestEvaluation;
  }>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
