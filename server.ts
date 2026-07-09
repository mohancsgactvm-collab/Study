import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for AI Studio
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

function getSystemInstruction(language?: string) {
  const isTamil = language === "tamil";
  if (isTamil) {
    return `You are "Study Master AI" (எழுத்து வடிவம்: ஸ்டடி மாஸ்டர் ஏஐ) - a personal tutor, exam preparation assistant, and learning planner.

Your strict rules:
1. Always respond only in Tamil language. Translate all questions, headings, study notes, explanations, answers, evaluation feedback, and chat responses into natural, clear Tamil.
2. Support English technical terms: always include the English technical term alongside or parenthetically next to its Tamil translation (e.g., "தரவுத்தள மேலாண்மை அமைப்பு (Database Management System)").
3. Focus heavily on exam preparation and scoring high marks.
4. Encourage true understanding (கருத்தியல் புரிதல்) of concepts over rote memorization, using simple daily-life examples and analogies (உவமைகள்) in Tamil.
5. Address the student in an encouraging, warm, and highly motivating tone.`;
  } else {
    return `You are "Study Master AI" - a personal tutor, exam preparation assistant, and learning planner.

Your strict rules:
1. Always respond only in English language. Keep all questions, headings, study notes, explanations, answers, evaluation feedback, and chat responses strictly and beautifully in English.
2. Focus heavily on exam preparation and scoring high marks.
3. Encourage true understanding of concepts over rote memorization, using simple daily-life examples and analogies in English.
4. Address the student in an encouraging, warm, and highly motivating tone.`;
  }
}

// Helper for error handling
function handleError(res: express.Response, error: any, customMessage: string) {
  console.error(`${customMessage}:`, error);
  res.status(500).json({
    error: true,
    message: customMessage,
    details: error instanceof Error ? error.message : String(error)
  });
}

// STEP 1: Syllabus Analysis
app.post("/api/step1-analysis", async (req, res) => {
  try {
    const { course, subject, syllabus, examDate, studyTime, language } = req.body;

    if (!course || !subject || !syllabus) {
      return res.status(400).json({ error: "Missing required fields (course, subject, syllabus)" });
    }

    const isTamil = language === "tamil";
    const sysInstruction = getSystemInstruction(language);

    const prompt = `Perform STEP 1 (Syllabus Analysis) for:
Course: ${course}
Subject: ${subject}
Exam Date: ${examDate || "Not Specified"}
Study Time Available: ${studyTime || "Not Specified"}

Syllabus/Notes content:
${syllabus}

Analyze this syllabus and group them logically into standard Units. For each unit, list major topics.
For each topic, estimate:
1. Importance (High, Medium, Low)
2. Difficulty (Hard, Medium, Easy) for a typical student
3. Weightage percentage (integers, total summing up to 100 approx)
4. A brief description explaining why this topic is important for the exam.

Language constraint:
- You must generate everything (including subjectName, unit names, topic names, and topic descriptions) strictly and exclusively in the ${isTamil ? "Tamil" : "English"} language.
- Do not mix languages. If Tamil is requested, the text must be completely in natural Tamil (with technical terms optionally in parentheses in English, e.g., "தரவுத்தள மேலாண்மை அமைப்பு (Database Management System)"). If English is requested, the text must be purely in English.

Respond strictly in the requested JSON format. Include a clean subjectName.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectName: { type: Type.STRING, description: "Official name of the subject" },
            analysis: {
              type: Type.OBJECT,
              properties: {
                units: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Unit title" },
                      topics: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING, description: "Topic name" },
                            importance: { type: Type.STRING, description: "High, Medium, or Low" },
                            difficulty: { type: Type.STRING, description: "Hard, Medium, or Easy" },
                            weightagePercent: { type: Type.INTEGER, description: "Percentage of total marks this topic likely carries" },
                            description: { type: Type.STRING, description: "Explanation of exam focus" }
                          },
                          required: ["name", "importance", "difficulty", "weightagePercent", "description"]
                        }
                      }
                    },
                    required: ["name", "topics"]
                  }
                }
              },
              required: ["units"]
            }
          },
          required: ["subjectName", "analysis"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    res.json(data);
  } catch (err) {
    handleError(res, err, "Failed to analyze syllabus (Step 1)");
  }
});

// STEP 2: Notes Creation
app.post("/api/step2-notes", async (req, res) => {
  try {
    const { course, subject, topics, language } = req.body;

    if (!course || !subject || !topics || !Array.isArray(topics)) {
      return res.status(400).json({ error: "Missing required fields (course, subject, topics array)" });
    }

    const isTamil = language === "tamil";
    const sysInstruction = getSystemInstruction(language);

    const prompt = `Perform STEP 2 (Notes Creation) for the following topics in the subject of "${subject}" (${course}):
Topics to cover:
${topics.join(", ")}

For each topic, generate a comprehensive set of notes:
1. topicName: Official name (matching the input)
2. tamilExplanation: A very clear, comprehensive explanation.
   - If language is Tamil: Provide a detailed explanation in natural, simple Tamil with everyday analogies, and label it under a "தமிழ் விளக்கம்:" heading.
   - If language is English: Provide a detailed explanation strictly in English, and label it under a "English Explanation:" heading.
3. shortNotes: 3-5 bullet points of extremely concise revision notes in the requested language (${isTamil ? "Tamil" : "English"}).
4. importantPoints: 3-5 crucial formulas, definitions, or exam facts in the requested language (${isTamil ? "Tamil" : "English"}).
5. memoryTricks: An interesting memory trick, mnemonic, or analogy in the requested language (${isTamil ? "Tamil" : "English"}).
6. visualDiagram: A structured representation of the concept to draw a diagram. Select the type of diagram (flowchart, tree, cycle, compare, or table) and supply clean nodes and connection edges with labels in the requested language (${isTamil ? "Tamil" : "English"}).

Language constraint:
- You must generate ALL content (topicName, tamilExplanation, shortNotes, importantPoints, memoryTricks, and visualDiagram labels) strictly in the requested language (${isTamil ? "Tamil" : "English"}).

Respond strictly in the requested JSON format. Ensure explanations are detailed, highly educational, and beautifully tailored to the active language.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            notes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topicName: { type: Type.STRING },
                  tamilExplanation: { type: Type.STRING, description: "Detailed explanation of the topic" },
                  shortNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3-5 key summary points"
                  },
                  importantPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Formulas, definitions or core concepts"
                  },
                  memoryTricks: { type: Type.STRING, description: "A creative mnemonic or memory rule" },
                  visualDiagram: {
                    type: Type.OBJECT,
                    description: "Visual diagram representation with nodes and edges",
                    properties: {
                      type: { type: Type.STRING, description: "Type: flowchart, tree, cycle, compare, or table" },
                      title: { type: Type.STRING, description: "Sleek title for the diagram" },
                      nodes: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING, description: "Unique node ID, e.g. 'node1'" },
                            labelEnglish: { type: Type.STRING, description: "Label for English or Tamil mode" },
                            labelTamil: { type: Type.STRING, description: "Label for English or Tamil mode" },
                            description: { type: Type.STRING, description: "Optional description / details of node" }
                          },
                          required: ["id", "labelEnglish", "labelTamil"]
                        }
                      },
                      edges: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            from: { type: Type.STRING, description: "Starting node ID" },
                            to: { type: Type.STRING, description: "Destination node ID" },
                            label: { type: Type.STRING, description: "Optional connection label" }
                          },
                          required: ["from", "to"]
                        }
                      }
                    },
                    required: ["type", "title", "nodes", "edges"]
                  }
                },
                required: ["topicName", "tamilExplanation", "shortNotes", "importantPoints", "memoryTricks", "visualDiagram"]
              }
            }
          },
          required: ["notes"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    res.json(data);
  } catch (err) {
    handleError(res, err, "Failed to generate study notes (Step 2)");
  }
});

// STEP 3: Question Generator
app.post("/api/step3-questions", async (req, res) => {
  try {
    const { course, subject, syllabusBrief, language } = req.body;

    if (!course || !subject) {
      return res.status(400).json({ error: "Missing required fields (course, subject)" });
    }

    const isTamil = language === "tamil";
    const sysInstruction = getSystemInstruction(language);

    const prompt = `Perform STEP 3 (Question Generator) for the subject of "${subject}" (${course}).
Using the syllabus context:
${syllabusBrief || "General concepts in " + subject}

Generate exam-focused practice questions and keys in the requested language (${isTamil ? "Tamil" : "English"}):
1. twoMarks: 4 standard questions carrying 2 marks. Provide the question and a precise 2-sentence key answer.
2. fiveMarks: 3 medium-length questions carrying 5 marks. Provide the question and structured points/steps for the answer.
3. tenMarks: 2 essay questions carrying 10 marks. Provide the question and a comprehensive outline/structure of the answer.
4. mcqs: 5 highly relevant Multiple Choice Questions. Provide:
   - question
   - options: an array of 4 distinct options
   - correctAnswerIndex: 0-based index of the correct option
   - explanation: a detailed explanation of why this choice is correct and others are not.

Language constraint:
- You must generate ALL content (questions, options, explanations, answerTamil, answerEnglish) strictly and exclusively in the ${isTamil ? "Tamil" : "English"} language.
- Do not mix languages.
- For all twoMarks, fiveMarks, tenMarks answers, populate both 'answerTamil' and 'answerEnglish' with the same response in the requested language to guarantee frontend compatibility.

Respond strictly in the requested JSON format. Ensure content is highly accurate, educational, and strictly in the active language.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.OBJECT,
              properties: {
                twoMarks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answerTamil: { type: Type.STRING },
                      answerEnglish: { type: Type.STRING }
                    },
                    required: ["question", "answerTamil", "answerEnglish"]
                  }
                },
                fiveMarks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answerTamil: { type: Type.STRING },
                      answerEnglish: { type: Type.STRING }
                    },
                    required: ["question", "answerTamil", "answerEnglish"]
                  }
                },
                tenMarks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answerTamil: { type: Type.STRING },
                      answerEnglish: { type: Type.STRING }
                    },
                    required: ["question", "answerTamil", "answerEnglish"]
                  }
                },
                mcqs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      correctAnswerIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswerIndex", "explanation"]
                  }
                }
              },
              required: ["twoMarks", "fiveMarks", "tenMarks", "mcqs"]
            }
          },
          required: ["questions"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    res.json(data);
  } catch (err) {
    handleError(res, err, "Failed to generate questions (Step 3)");
  }
});

// STEP 4: Study Plan Generator
app.post("/api/step4-plan", async (req, res) => {
  try {
    const { course, subject, topics, examDate, studyTime, language } = req.body;

    if (!course || !subject || !topics || !Array.isArray(topics)) {
      return res.status(400).json({ error: "Missing required fields (course, subject, topics)" });
    }

    const isTamil = language === "tamil";
    const sysInstruction = getSystemInstruction(language);

    const prompt = `Perform STEP 4 (Study Plan) for "${subject}" (${course}).
Syllabus topics:
${topics.join(", ")}
Exam Date: ${examDate || "Next 10 days"}
Available study time per day: ${studyTime || "2 hours"}

Generate:
1. dailySchedule: A day-by-day learning calendar. Distribute the topics logically up to the exam date (or next 5-7 days if date is not specified).
   For each day, provide:
   - dayNumber: integer
   - dateString: estimated date or relative day label
   - topicsToCover: array of topic names
   - studyDurationHours: number of hours to spend
   - focusTips: exam preparation and study advice in the requested language (${isTamil ? "Tamil" : "English"}).
2. revisionSchedule: 2-3 specific milestones or dates reserved purely for revision, specifying what topics to revise and the active recall method (such as self-testing) in the requested language (${isTamil ? "Tamil" : "English"}).
3. weakAreaImprovementTips: 3 practical tips in the requested language (${isTamil ? "Tamil" : "English"}) on how the student can identify and improve on their weak topics.

Language constraint:
- You must generate ALL content (focusTips, revision method, weakAreaImprovementTips) strictly and exclusively in the ${isTamil ? "Tamil" : "English"} language.

Respond strictly in the requested JSON format. Ensure schedules are practical and realistic.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studyPlan: {
              type: Type.OBJECT,
              properties: {
                dailySchedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dayNumber: { type: Type.INTEGER },
                      dateString: { type: Type.STRING },
                      topicsToCover: { type: Type.ARRAY, items: { type: Type.STRING } },
                      studyDurationHours: { type: Type.INTEGER },
                      focusTips: { type: Type.STRING }
                    },
                    required: ["dayNumber", "dateString", "topicsToCover", "studyDurationHours", "focusTips"]
                  }
                },
                revisionSchedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dateString: { type: Type.STRING },
                      topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                      method: { type: Type.STRING }
                    },
                    required: ["dateString", "topics", "method"]
                  }
                },
                weakAreaImprovementTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["dailySchedule", "revisionSchedule", "weakAreaImprovementTips"]
            }
          },
          required: ["studyPlan"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    res.json(data);
  } catch (err) {
    handleError(res, err, "Failed to generate study plan (Step 4)");
  }
});

// STEP 5: Exam Mode Evaluation
app.post("/api/step5-evaluate", async (req, res) => {
  try {
    const { question, marks, studentAnswer, subjectName, language } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({ error: "Missing required fields (question, studentAnswer)" });
    }

    const isTamil = language === "tamil";
    const sysInstruction = getSystemInstruction(language);

    const prompt = `Perform STEP 5 (Exam Mode - Answer Evaluation) for a mock exam question.
Subject: ${subjectName || "General"}
Question: ${question}
Marks allocated: ${marks || "General"}
Student's Submitted Answer:
"${studentAnswer}"

Evaluate this answer carefully as an encouraging yet strict exam evaluator.
Provide a JSON response with:
1. score: An integer score out of 10 based on correctness, clarity, and completeness.
2. strengths: A brief summary in the requested language (${isTamil ? "Tamil" : "English"}) of what the student wrote correctly.
3. weaknesses: A brief summary in the requested language (${isTamil ? "Tamil" : "English"}) of what essential definitions, points, or formulas are missing or incorrect.
4. perfectAnswer: The ideal correct answer structured beautifully in the requested language (${isTamil ? "Tamil" : "English"}).
5. tamilExplanation: Educational feedback and tutoring in the requested language (${isTamil ? "Tamil" : "English"}) to ensure they understand it perfectly.

Language constraint:
- You must generate ALL content (strengths, weaknesses, perfectAnswer, tamilExplanation) strictly and exclusively in the ${isTamil ? "Tamil" : "English"} language.

Respond strictly in the requested JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Grade out of 10" },
            strengths: { type: Type.STRING, description: "Strengths of the answer" },
            weaknesses: { type: Type.STRING, description: "Weaknesses of the answer" },
            perfectAnswer: { type: Type.STRING, description: "Perfect answer" },
            tamilExplanation: { type: Type.STRING, description: "Detailed feedback" }
          },
          required: ["score", "strengths", "weaknesses", "perfectAnswer", "tamilExplanation"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    res.json(data);
  } catch (err) {
    handleError(res, err, "Failed to evaluate exam answer (Step 5)");
  }
});

// Interactive AI Tutor Chat Route
app.post("/api/tutor-chat", async (req, res) => {
  try {
    const { course, subject, message, history, language } = req.body;

    if (!course || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields (course, subject, message)" });
    }

    const isTamil = language === "tamil";
    const sysInstruction = getSystemInstruction(language);

    // Format chat contents
    const chatContents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        chatContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }
    chatContents.push({
      role: "user",
      parts: [{ text: `Regarding Course: ${course}, Subject: ${subject}.\nStudent Question: ${message}` }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction: `${sysInstruction}
You are currently chatting live in tutor mode. Keep responses clear, medium-length, structured with bullet points or bold text, and end with an encouraging follow-up question in the requested language (${isTamil ? "Tamil" : "English"}).`,
      }
    });

    res.json({ text: response.text });
  } catch (err) {
    handleError(res, err, "Failed to generate tutor response");
  }
});

// Vite & Static Asset Handling Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Study Master AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
