import React, { useEffect, useState } from "react";
import { FaClock, FaFileUpload } from "react-icons/fa";

const StudentContentView = () => {
  // ✅ TEMP STUDENT (later from login)
  const student = {
    id: "stu_101",
    name: "Rahul Sharma",
  };

  const [contentType, setContentType] = useState("quiz"); // DEFAULT
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("assignments")) || [];
    setAssignments(data.filter((a) => a.status === "published"));
  }, []);



  /* ======================
     MOCK QUIZ DATA
  ====================== */
  const quiz = {
    quizInfo: {
      title: "React Basics Quiz",
      course: "React Fundamentals",
      timeLimit: 30,
      passingMarks: 60,
    },
    totalMarks: 12,
    questions: [
      {
        question: "What is React?",
        options: [
          "A JavaScript library",
          "A database",
          "A CSS framework",
          "A backend language",
        ],
        correctAnswer: 0,
        marks: 5,
      },
      {
        question: "Which hook is used for state?",
        options: ["useFetch", "useEffect", "useState", "useRef"],
        correctAnswer: 2,
        marks: 5,
      },
      {
        question: "JSX is mandatory in React.",
        options: ["True", "False"],
        correctAnswer: 1,
        marks: 2,
      },
    ],
  };

  /* ======================
     QUIZ STATE
  ====================== */
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.quizInfo.timeLimit * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  /* ======================
     TIMER
  ====================== */
  useEffect(() => {
    if (submitted || contentType !== "quiz") return;
    if (timeLeft <= 0) {
      handleQuizSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, contentType]);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${sec % 60 < 10 ? "0" : ""}${sec % 60}`;

  const handleOptionChange = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const handleQuizSubmit = () => {
    let total = 0;

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        total += q.marks;
      }
    });

    const percentage = (total / quiz.totalMarks) * 100;

    // ✅ CREATE SUBMISSION OBJECT
    const submission = {
      studentId: student.id,
      studentName: student.name,
      quizTitle: quiz.quizInfo.title,
      score: total,
      totalMarks: quiz.totalMarks,
      percentage,
      passed: percentage >= quiz.quizInfo.passingMarks,
      submittedAt: new Date().toISOString(),
    };

    // ✅ SAVE TO LOCAL STORAGE
    const existingSubmissions =
      JSON.parse(localStorage.getItem("quizSubmissions")) || [];

    existingSubmissions.push(submission);

    localStorage.setItem(
      "quizSubmissions",
      JSON.stringify(existingSubmissions)
    );

    // ✅ UPDATE UI STATE
    setScore(total);
    setSubmitted(true);

    console.log("QUIZ SUBMITTED:", submission);
  };

  // ======================
// ASSIGNMENT SUBMIT HANDLER
// ======================
  const handleAssignmentSubmit = (assignment) => {
  if (!selectedFile) {
    alert("Please upload your solution file");
    return;
  }

  const submission = {
    assignmentId: assignment.id,
    assignmentTitle: assignment.title,
    studentId: student.id,
    studentName: student.name,
    fileName: selectedFile.name,
    submittedAt: new Date().toISOString(),
  };

  const existing =
    JSON.parse(localStorage.getItem("assignmentSubmissions")) || [];

  existing.push(submission);

  localStorage.setItem(
    "assignmentSubmissions",
    JSON.stringify(existing)
  );

  alert("Assignment submitted successfully ✅");
  setSelectedFile(null);
};



  /* ======================
     PROGRESS LOGIC
  ====================== */
  const progress =
    (Object.keys(answers).length / quiz.questions.length) * 100;

  const percentage = (score / quiz.totalMarks) * 100;
  const isPassed = submitted && percentage >= quiz.quizInfo.passingMarks;

  const progressColor = !submitted
    ? "bg-[rgba(37,150,190,1)]"
    : isPassed
      ? "bg-green-500"
      : "bg-red-500";

  return (
    <div className="flex h-screen bg-[#f4fbfd]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">

            {/* CONTENT SWITCH */}
            <div className="mb-6">
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="border px-4 py-2 rounded-lg"
              >
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>

            {/* ================= QUIZ VIEW ================= */}
            {contentType === "quiz" && (
              <>
                {/* QUIZ HEADER */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 relative">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {quiz.quizInfo.title}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Course: {quiz.quizInfo.course}
                  </p>

                  {/* TIMER */}
                  <div className="absolute top-6 right-6 bg-red-50 text-red-600 px-4 py-2 rounded-full flex items-center gap-2">
                    <FaClock />
                    {formatTime(timeLeft)}
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="mt-4">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                      {Math.round(progress)}% completed
                    </p>
                  </div>
                </div>

                {!submitted ? (
                  <div className="space-y-6">
                    {quiz.questions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        className="bg-white rounded-xl shadow-md p-6"
                      >
                        <p className="font-semibold mb-4">
                          {qIndex + 1}. {q.question}
                        </p>

                        {q.options.map((opt, optIndex) => (
                          <label
                            key={optIndex}
                            className="flex items-center gap-3 p-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`q-${qIndex}`}
                              checked={answers[qIndex] === optIndex}
                              onChange={() =>
                                handleOptionChange(qIndex, optIndex)
                              }
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    ))}

                    <div className="flex justify-end">
                      <button
                        onClick={handleQuizSubmit}
                        className="bg-[rgba(37,150,190,1)] hover:bg-[#115269]
                                   text-white font-semibold px-8 py-3 rounded-lg"
                      >
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                      Quiz Result
                    </h2>
                    <p className="text-xl">
                      Score: {score} / {quiz.totalMarks}
                    </p>
                    <p
                      className={`text-2xl font-bold mt-4 ${isPassed ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {isPassed ? "🎉 Passed" : "❌ Failed"}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ================= ASSIGNMENT VIEW ================= */}
            {contentType === "assignment" && (
              <div className="space-y-6">
                {assignments.length === 0 ? (
                  <p className="text-gray-500">No assignments available.</p>
                ) : (
                  assignments.map((a) => (
                    <div
                      key={a.id}
                      className="bg-white rounded-2xl shadow-lg p-8"
                    >
                      <h1 className="text-2xl font-bold mb-2">{a.title}</h1>
                      <p className="mb-2">{a.description}</p>
                      <p className="text-sm mb-4">
                        Due Date: {a.dueDate}
                      </p>

                      {a.fileName && (
                        <p className="text-sm text-gray-600 mb-4">
                          📄 Attachment: {a.fileName}
                        </p>
                      )}

                      <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="mb-4"
                      />

                      <button
                        onClick={() => handleAssignmentSubmit(a)}
                        className="bg-[rgba(37,150,190,1)]
                       hover:bg-[#115269]
                       text-white px-6 py-3 rounded-lg"
                      >
                        Submit Assignment
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
  );
};

export default StudentContentView;
