import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaPlus,
  FaTrash,
  FaEllipsisV,
  FaChevronDown,
} from "react-icons/fa";
const API = "http://localhost:5000/api";

const InstructorQuiz = () => {
  const [contentType, setContentType] = useState("quiz"); // quiz | assignment
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [submissions, setSubmissions] = useState([]);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);

  /* ======================
       FETCH RESULTS
    ====================== */
  useEffect(() => {
    if (activeTab !== "results") return;

    fetch(`${API}/submissions/quiz`)
      .then((res) => res.json())
      .then(setSubmissions)
      .catch(console.error);

    fetch(`${API}/submissions/assignment`)
      .then((res) => res.json())
      .then(setAssignmentSubmissions)
      .catch(console.error);
  }, [activeTab]);

  /* ======================
     QUIZ META
  ====================== */
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    course: "",
    timeLimit: 30,
    passingMarks: 60,
  });
  // 🔥 ADD THIS USEEFFECT HERE
  useEffect(() => {
    fetch(`${API}/quizzes`)
      .then(res => res.json())
      .then(data => {
        console.log("QUIZZES FROM DB:", data);
        if (data.length > 0) {
          const quiz = data[0]; // latest quiz
          setQuizInfo({
            title: quiz.title,
            course: quiz.course,
            timeLimit: quiz.time_limit,
            passingMarks: quiz.passing_marks,
          });
        }
      })
      .catch(console.error);
  }, []);

  /* ======================
     QUESTIONS
  ====================== */
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", ""],
      correctAnswer: 0,
      marks: 1,
    },
  ]);
  /* ======================
   ASSIGNMENT META
====================== */
  const [assignmentInfo, setAssignmentInfo] = useState({
    title: "",
    description: "",
    dueDate: "",
    file: null,
    status: "draft",
  });

  const handleAssignmentChange = (e) => {
    const { name, value, files } = e.target;
    setAssignmentInfo((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSaveAssignment = async () => {
    try {
      const res = await fetch(`${API}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: assignmentInfo.title,
          description: assignmentInfo.description,
          dueDate: assignmentInfo.dueDate,
          fileName: assignmentInfo.file?.name || null,
          status: assignmentInfo.status,
        }),
      });
      if (!res.ok) throw new Error("Assignment save failed");

      alert("Assignment saved successfully 📘");

      setAssignmentInfo({
        title: "",
        description: "",
        dueDate: "",
        file: null,
        status: "draft",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  /* ======================
     PREVIEW STATE
  ====================== */
  const totalMarks = questions.reduce((s, q) => s + Number(q.marks), 0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quizInfo.timeLimit * 60);
  const [submitted, setSubmitted] = useState(false);

  /* ======================
     PREVIEW MENU
  ====================== */
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [editQuestionIndex, setEditQuestionIndex] = useState(null);

  /* ======================
     TIMER (PREVIEW)
  ====================== */
  useEffect(() => {
    if (activeTab !== "preview" || submitted || contentType !== "quiz") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, submitted, contentType]);

  useEffect(() => {
    setTimeLeft(quizInfo.timeLimit * 60);
    setAnswers({});
    setSubmitted(false);
  }, [quizInfo.timeLimit, activeTab]);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${sec % 60 < 10 ? "0" : ""}${sec % 60}`;

  /* ======================
     QUIZ HANDLERS
  ====================== */
  const updateQuestion = (i, field, value) => {
    const updated = [...questions];
    updated[i][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qi, oi, value) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  const addOption = (i) => {
    const updated = [...questions];
    updated[i].options.push("");
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", ""],
        correctAnswer: 0,
        marks: 1,
      },
    ]);
  };

  const removeQuestion = (i) => {
    setQuestions(questions.filter((_, idx) => idx !== i));
  };

  const handleEditFromPreview = (index) => {
    setEditQuestionIndex(index);
    setActiveTab("create");
    setOpenMenuIndex(null);
  };

  const handleDeleteFromPreview = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setOpenMenuIndex(null);
  };

  const progress =
    (Object.keys(answers).length / questions.length) * 100;

  const handlePublishQuiz = async () => {
    // 🔒 FRONTEND VALIDATION
    if (!quizInfo.title.trim()) {
      return alert("Quiz title is required");
    }

    if (!quizInfo.course.trim()) {
      return alert("Course name is required");
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        return alert(`Question ${i + 1} cannot be empty`);
      }

      if (questions[i].options.some(opt => !opt.trim())) {
        return alert(`All options in Question ${i + 1} must be filled`);
      }
    }

    try {
      const res = await fetch(`${API}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizInfo, questions }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Quiz published successfully 🚀");

      // reset form
      setQuizInfo({
        title: "",
        course: "",
        timeLimit: 30,
        passingMarks: 60,
      });

      setQuestions([
        { question: "", options: ["", ""], correctAnswer: 0, marks: 1 },
      ]);

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">


      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* ================= CONTENT TYPE DROPDOWN ================= */}
          <div className="relative mb-6 w-64">
            <button
              onClick={() =>
                setShowTypeDropdown(!showTypeDropdown)
              }
              className="w-full bg-white shadow px-4 py-3 rounded-lg flex justify-between items-center font-semibold"
            >
              {contentType === "quiz" ? "Quiz" : "Assignment"}
              <FaChevronDown />
            </button>

            {showTypeDropdown && (
              <div className="absolute mt-2 w-full bg-white border rounded-lg shadow z-10">
                <button
                  onClick={() => {
                    setContentType("quiz");
                    setActiveTab("create");
                    setShowTypeDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Quiz
                </button>
                <button
                  onClick={() => {
                    setContentType("assignment");
                    setShowTypeDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Assignment
                </button>
              </div>
            )}
          </div>

          {/* ================= QUIZ FLOW ================= */}
          {contentType === "quiz" && (
            <>
              {/* TABS */}
              <div className="flex gap-4 mb-6">
                {["create", "preview", "publish", "results"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-lg font-semibold ${activeTab === tab
                      ? "bg-[rgba(37,150,190,1)] text-white"
                      : "bg-white shadow"
                      }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* ================= CREATE ================= */}
              {activeTab === "create" && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    Create Quiz
                  </h2>

                  <input
                    className="w-full border p-3 rounded-lg mb-3"
                    placeholder="Quiz Title"
                    value={quizInfo.title}
                    onChange={(e) =>
                      setQuizInfo({
                        ...quizInfo,
                        title: e.target.value,
                      })
                    }
                  />

                  <input
                    className="w-full border p-3 rounded-lg mb-3"
                    placeholder="Course"
                    value={quizInfo.course}
                    onChange={(e) =>
                      setQuizInfo({
                        ...quizInfo,
                        course: e.target.value,
                      })
                    }
                  />

                  <div className="flex gap-3 mb-6">
                    <input
                      type="number"
                      className="w-1/2 border p-3 rounded-lg"
                      placeholder="Time (min)"
                      value={quizInfo.timeLimit}
                      onChange={(e) =>
                        setQuizInfo({
                          ...quizInfo,
                          timeLimit: e.target.value,
                        })
                      }
                    />
                    <input
                      type="number"
                      className="w-1/2 border p-3 rounded-lg"
                      placeholder="Passing %"
                      value={quizInfo.passingMarks}
                      onChange={(e) =>
                        setQuizInfo({
                          ...quizInfo,
                          passingMarks: e.target.value,
                        })
                      }
                    />
                  </div>

                  {questions.map((q, i) => (
                    <div
                      key={i}
                      className={`border rounded-xl p-4 mb-4 ${editQuestionIndex === i
                        ? "border-blue-500 bg-blue-50"
                        : ""
                        }`}
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">
                          Question {i + 1}
                        </h3>
                        <FaTrash
                          className="text-red-500 cursor-pointer"
                          onClick={() => removeQuestion(i)}
                        />
                      </div>

                      <input
                        className="w-full border p-2 rounded mb-2"
                        placeholder="Question"
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(
                            i,
                            "question",
                            e.target.value
                          )
                        }
                      />

                      {q.options.map((opt, oi) => (
                        <div
                          key={oi}
                          className="flex gap-2 mb-2"
                        >
                          <input
                            type="radio"
                            checked={q.correctAnswer === oi}
                            onChange={() =>
                              updateQuestion(
                                i,
                                "correctAnswer",
                                oi
                              )
                            }
                          />
                          <input
                            className="flex-1 border p-2 rounded"
                            placeholder={`Option ${oi + 1}`}
                            value={opt}
                            onChange={(e) =>
                              updateOption(
                                i,
                                oi,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => addOption(i)}
                        className="text-sm text-blue-600"
                      >
                        + Add Option
                      </button>

                      <input
                        type="number"
                        className="w-full border p-2 rounded mt-3"
                        placeholder="Marks"
                        value={q.marks}
                        onChange={(e) =>
                          updateQuestion(
                            i,
                            "marks",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}

                  <button
                    onClick={addQuestion}
                    className="flex items-center gap-2 bg-[rgba(37,150,190,1)] text-white px-4 py-2 rounded-lg"
                  >
                    <FaPlus /> Add Question
                  </button>
                </div>
              )}

              {/* ================= PREVIEW ================= */}
              {activeTab === "preview" && (
                <>

                  {/* HEADER */}
                  {/* QUIZ HEADER */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 relative">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {quizInfo.title || "Quiz Title"}
                    </h1>

                    <p className="text-sm text-gray-500">
                      Course: {quizInfo.course || "Course Name"}
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
                          className="h-full bg-[rgba(37,150,190,1)] transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-gray-500">
                        {Math.round(progress)}% completed
                      </p>
                    </div>
                  </div>

                  {/* TIMER */}
                  <div className="absolute top-6 right-6 bg-red-50 text-red-600 px-4 py-2 rounded-full flex items-center gap-2">
                    <FaClock />
                    {formatTime(timeLeft)}
                  </div>


                  {/* QUESTIONS */}
                  {questions.map((q, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-md p-6 mb-6 relative"
                    >
                      {/* EDIT / DELETE (Instructor only) */}
                      <div className="absolute top-4 right-4">
                        <FaEllipsisV
                          className="cursor-pointer"
                          onClick={() =>
                            setOpenMenuIndex(openMenuIndex === i ? null : i)
                          }
                        />
                        {openMenuIndex === i && (
                          <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow">
                            <button
                              onClick={() => handleEditFromPreview(i)}
                              className="block w-full px-4 py-2 hover:bg-gray-100"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFromPreview(i)}
                              className="block w-full px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="font-semibold mb-3">
                        {i + 1}. {q.question}
                      </p>

                      {/* OPTIONS (Student only selectable) */}
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          className="flex items-center gap-3 p-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            checked={false}
                            readOnly
                          />

                          {opt}
                        </label>
                      ))}
                    </div>
                  ))}
                </>
              )}


              {/* ================= PUBLISH ================= */}
              {activeTab === "publish" && (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Publish?
                  </h2>
                  <p>Total Questions: {questions.length}</p>
                  <p className="mb-6">
                    Total Marks: {totalMarks}
                  </p>

                  <button
                    onClick={handlePublishQuiz}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    Publish Quiz 🚀
                  </button>
                </div>
              )}
            </>
          )}

          {/* ================= RESULTS ================= */}
          {activeTab === "results" && (
            <div className="space-y-10">

              {/* ================= QUIZ RESULTS ================= */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Student Quiz Results
                </h2>

                {submissions.length === 0 ? (
                  <p className="text-gray-500">No quiz submissions yet.</p>
                ) : (
                  <table className="w-full border rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100 text-sm">
                        <th className="p-3 border">Student</th>
                        <th className="p-3 border">Score</th>
                        <th className="p-3 border">Percentage</th>
                        <th className="p-3 border">Status</th>
                        <th className="p-3 border">Submitted At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {submissions.map((s, i) => (
                        <tr key={i} className="text-center text-sm">
                          <td className="p-3 border">{s.studentName}</td>
                          <td className="p-3 border">
                            {s.score}/{s.totalMarks}
                          </td>
                          <td className="p-3 border">
                            {s.percentage.toFixed(1)}%
                          </td>
                          <td className="p-3 border">
                            {s.passed ? "✅ Passed" : "❌ Failed"}
                          </td>
                          <td className="p-3 border">
                            {new Date(s.submittedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* ================= ASSIGNMENT SUBMISSIONS ================= */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Assignment Submissions
                </h2>

                {assignmentSubmissions.length === 0 ? (
                  <p className="text-gray-500">
                    No assignment submissions yet.
                  </p>
                ) : (
                  <table className="w-full border rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100 text-sm">
                        <th className="p-3 border">Student</th>
                        <th className="p-3 border">Assignment</th>
                        <th className="p-3 border">File</th>
                        <th className="p-3 border">Submitted At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {assignmentSubmissions.map((a, i) => (
                        <tr key={i} className="text-center text-sm">
                          <td className="p-3 border">{a.studentName}</td>
                          <td className="p-3 border">{a.assignmentTitle}</td>
                          <td className="p-3 border">{a.fileName}</td>
                          <td className="p-3 border">
                            {new Date(a.submittedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          )}


          {/* ================= ASSIGNMENT ================= */}
          {contentType === "assignment" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">
                Create Assignment
              </h2>

              {/* TITLE + DESCRIPTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Assignment Title */}
                <input
                  name="title"
                  placeholder="Assignment Title"
                  value={assignmentInfo.title}
                  onChange={handleAssignmentChange}
                  className="w-full h-[56px] rounded-xl border border-gray-300 px-4 text-sm
      focus:border-[#2596be] focus:ring-2 focus:ring-[#2596be]/30 outline-none"
                />

                {/* Assignment Description */}
                <input
                  name="description"
                  placeholder="Assignment Description"
                  value={assignmentInfo.description}
                  onChange={handleAssignmentChange}
                  className="w-full h-[56px] rounded-xl border border-gray-300 px-4 text-sm
      focus:border-[#2596be] focus:ring-2 focus:ring-[#2596be]/30 outline-none"
                />
              </div>


              {/* DUE DATE + FILE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <input
                  type="date"
                  name="dueDate"
                  value={assignmentInfo.dueDate}
                  onChange={handleAssignmentChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
          focus:border-[#2596be] focus:ring-2 focus:ring-[#2596be]/30 outline-none"
                />

                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#043d52]">
                    Assignment File
                  </label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleAssignmentChange}
                    className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2.5 file:px-5
            file:rounded-xl file:border-0
            file:font-semibold
            file:bg-[#2596be]/10
            file:text-[#2596be]"
                  />
                </div>
              </div>

              {/* STATUS */}
              <div className="flex justify-end mb-6">
                <select
                  name="status"
                  value={assignmentInfo.status}
                  onChange={handleAssignmentChange}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Publish</option>
                </select>
              </div>

              {/* SAVE BUTTON */}
              <div className="flex justify-end border-t pt-6">
                <button
                  onClick={handleSaveAssignment}
                  className="bg-[rgba(37,150,190,1)] hover:bg-[#115269]
             text-white font-semibold px-8 py-3 rounded-lg shadow-md"
                >
                  Save Assignment
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InstructorQuiz;
