const homeSection = document.querySelector(".home");
const quizSection = document.querySelector(".quiz");
const startBtn = document.querySelector(".home__start");
const questionDiv = document.querySelector(".quiz__question");
const answersLiItems = document.querySelectorAll(".quiz__answers-item");
const scoreDiv = document.querySelector(".quiz__score");
const questionNoSpan = document.querySelector(".quiz__question-no");

let score = 0;
let questionIndex = 0;
const questions = [];

const toggleQuizVisibility = () => {
  console.log("toggle");
  homeSection.classList.toggle("is-hidden");
  quizSection.classList.toggle("is-hidden");
}

const getQuestions = async () => {
  const endpoint = `https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple&category=19`;
  await fetch(endpoint)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw Error("Response status code is not 200");
      }
    })
    .then(data => {
      return questions.push(...data.results)
    })
    .catch(err => console.log(err));
}

const startQuiz = () => {
  toggleQuizVisibility();
  getQuestions();
  console.log(questions);
}

startBtn.addEventListener("click", startQuiz);