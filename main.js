const homeSection = document.querySelector(".home");
const quizSection = document.querySelector(".quiz");
const startBtn = document.querySelector(".home__start");
const questionDiv = document.querySelector(".question__content");
const answersLiItems = document.querySelectorAll(".question__answers-item");
const scoreDiv = document.querySelector(".panel__score");
const questionNoSpan = document.querySelector(".panel__question-no");
const questionTotalSpan = document.querySelector(".panel__total");
const progressDiv = document.querySelector(".panel__progress");

let score = 0;
let questionIndex = 0;
const questionTotal = 10;
const questions = [];
questionTotalSpan.innerText = questionTotal;

const toggleQuizVisibility = () => {
  homeSection.classList.toggle("is-hidden");
  quizSection.classList.toggle("is-hidden");
}

const getQuestions = async () => {
  const endpoint = `https://opentdb.com/api.php?amount=${questionTotal}&difficulty=easy&type=multiple`;
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

const shuffleArr = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    let j = Math.floor(Math.random() * 4);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const startQuiz = () => {
  toggleQuizVisibility();
  getQuestions().then(() => getQuestion());
}

const getQuestion = () => {
  if (questionIndex < questions.length) {
    questionNoSpan.innerText = questionIndex + 1;
    progressDiv.style.width = `${(questionIndex + 1) * 100 / questionTotal}%`;
    const questionObj = questions[questionIndex];
    const answersList = [questionObj.correct_answer].concat(questionObj.incorrect_answers);
    shuffleArr(answersList);
    const correctAnswerIndex = answersList.indexOf(questionObj.correct_answer);

    questionDiv.innerHTML = questionObj.question;
    answersLiItems.forEach((answer, i) => {
      answer.className = "question__answers-item";
      answer.innerHTML = answersList[i];
      answer.addEventListener("click", processAnswer);
      answer.correctAnswerIndex = correctAnswerIndex;
    });
  }
}

const processAnswer = (e) => {
  let answerCorrect = e.target.dataset.index == e.target.correctAnswerIndex ? true : false;
  if (answerCorrect) {
    score += 10;
    scoreDiv.innerText = score;
  }
  answersLiItems.forEach((answer, i) => {
    if (!answerCorrect && i == e.target.dataset.index) {
      answer.classList.add('question__answers-item--wrong');
    } else if (i === e.target.correctAnswerIndex) {
      answer.classList.add('question__answers-item--correct');
    }
    answer.classList.add('question__answers-item--disabled');
  });

  answersLiItems.forEach((answer, ind) => {
    answer.removeEventListener("click", processAnswer);
  })

  setTimeout(() => {
    questionIndex++;
    getQuestion();
  }, 1000)

}

startBtn.addEventListener("click", startQuiz);