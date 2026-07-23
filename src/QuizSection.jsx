import { useState } from "react";
import "./QuizSection.css";

const quizData = [
  {
    question: "What is the primary purpose of e-learning?",
    options: ["Entertainment", "Knowledge Transfer", "Social Media", "Gaming"],
    correct: 1,
  },
  {
    question: "Which tool enhances interactive learning?",
    options: ["AI & VR", "Typewriters", "Manual Notes", "Fax Machines"],
    correct: 0,
  },
  {
    question: "What does LMS stand for?",
    options: [
      "Learning Media Software",
      "Learning Management System",
      "Live Module Source",
      "Logical Memory System",
    ],
    correct: 1,
  },
];

const QuizSection = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quizData[current];
  const progress = ((current + 1) / quizData.length) * 100;

  const handleSubmit = () => {
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current + 1 < quizData.length) {
      setCurrent(current + 1);
      setSelected(answers[current + 1] ?? null);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (current === 0) return;
    setCurrent(current - 1);
    setSelected(answers[current - 1] ?? null);
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
  };

  const score = answers.reduce(
    (acc, ans, i) => (ans === quizData[i].correct ? acc + 1 : acc),
    0
  );

  const answered = answers[current] !== undefined;

  return (
    <section className="quiz-flow">
      <h2 className="section-title">Interactive <span>Quiz</span></h2>

      {/* PROGRESS */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {!showResult ? (
        <div className="quiz-card">
          <p className="quiz-count">
            Question {current + 1} of {quizData.length}
          </p>

          <h3 className="quiz-question">{currentQuestion.question}</h3>

          <div className="quiz-options">
            {currentQuestion.options.map((opt, index) => {
              let state = "";

              if (answered) {
                if (index === currentQuestion.correct) state = "correct";
                else if (index === answers[current]) state = "wrong";
              } else if (index === selected) {
                state = "selected";
              }

              return (
                <button
                  key={index}
                  className={`quiz-option ${state}`}
                  onClick={() => !answered && setSelected(index)}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* NAVIGATION */}
          <div className="quiz-nav">
            <button
              className="quiz-btn secondary"
              onClick={handlePrev}
              disabled={current === 0}
            >
              Previous
            </button>

            {!answered ? (
              <button
                className="quiz-btn"
                disabled={selected === null}
                onClick={handleSubmit}
              >
                Submit
              </button>
            ) : (
              <button className="quiz-btn next" onClick={handleNext}>
                {current + 1 === quizData.length
                  ? "View Result"
                  : "Next"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="quiz-result">
          <h3>Your Score</h3>
          <p className="score">
            {score} / {quizData.length}
          </p>
          <p className="feedback">
            {score === quizData.length
              ? "Outstanding! 🎯"
              : score >= quizData.length / 2
              ? "Good job! 🚀"
              : "Keep practicing 💪"}
          </p>

          <button className="quiz-btn restart" onClick={handleRestart}>
            Retake Quiz
          </button>
        </div>
      )}
    </section>
  );
};

export default QuizSection;
