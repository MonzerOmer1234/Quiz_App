// Select Elements
let countSpan = document.querySelector(".quiz-app .count span");
let bullets = document.querySelector(".bullets");
let bulletsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let successAudio = document.createElement("audio");
successAudio.src = "success.mp3";
successAudio.type = "audio/mp3";
let failAudio = document.createElement("audio");
failAudio.src = "fail.mp3";
failAudio.type = "audio/mp3";
let counterdownDiv = document.querySelector(".counter-down");

// Initilaize indexes
let currentIndex = 0;
// Initialize Right Answers
let rightAnswers = 0;
// Initialize Counterdown Interval
let counterdownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;
      //  Create Bullets && Set Questions Count
      createBullets(questionsCount);
      //   Add Question Data
      AddQuestionData(questionsObject[currentIndex], questionsCount);
      // Countdown
      counterdown(180,  questionsCount)
      // Click On The Submit
      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex]["right_answer"];
        // Increase Current Index
        currentIndex++;
        // Make Check Function
        checkAnswer(theRightAnswer, questionsCount);
        // Remove Quiz + Answers Areas
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        // Add The Next Quiz And Answers Area
        AddQuestionData(questionsObject[currentIndex], questionsCount);

        // Handle Bullets Classes
        handleBulletsClasses();
        clearInterval(counterdownInterval)
        // Start Countdown
        counterdown(180, questionsCount)
        // Show Results

        showResults(questionsCount);
      };
    }
  };
}
getQuestions();
function createBullets(num) {
  countSpan.innerHTML = num;
  //   Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }
    // Append The Bullet To Bullets Container
    bulletsContainer.append(theBullet);
  }
}
function AddQuestionData(obj, count) {
  if (currentIndex < count) {
    //    Create Question Title

    let questionTitle = document.createElement("h2");
    // Create Question Text
    let questionText = document.createTextNode(obj.title);
    //   Append Question Text To Question Title
    questionTitle.appendChild(questionText);
    //   Append Question Title to Quiz Area
    quizArea.appendChild(questionTitle);
    // Create Answers
    for (let i = 1; i <= 4; i++) {
      //    Create Main Answers Div
      let mainDiv = document.createElement("div");
      // Add Class To Main Div
      mainDiv.className = "answer";
      // Create Radio Input
      let radioInput = document.createElement("input");

      //  Add Type + Name + Id + Data-Attribute
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // Let The First Input Checked
      if (i === 1) {
        radioInput.checked = true;
      }
      // Create Label Tag
      let theLabel = document.createElement("label");
      // Add For Attribute To The Label
      theLabel.htmlFor = `answer_${i}`;
      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To The Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Add Main Div To The Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  // Get Answers
  let answers = document.getElementsByName("question");
  //  Make Chosen Answer
  let theChoosenAnswer;
  for (i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}
function handleBulletsClasses() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class = "good"> Good </span>, You received ${rightAnswers} / ${count}`;
      if (count){

      }
    } else if (rightAnswers === count) {
      theResults = `<span class = "perfect">Congrats</span>, All Questions Are Answered Correctly!`;
      successAudio.play();
    } else {
      theResults = `<span class = "bad"> Oops! </span>, You received ${rightAnswers} / ${count}, You Can Try Again`;
      if (count) {
        failAudio.play();
      }
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "White";
    resultsContainer.style.marginTop = "10px";
  }
}
function counterdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    counterdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      if(minutes < 10){
        minutes = '0'+ minutes
      }
      seconds = parseInt(duration % 60);
      if (seconds < 10){
        seconds = '0' + seconds
      }
      counterdownDiv.innerHTML = `${minutes}:${seconds}`;
      counterdownDiv.style.color = 'red'
      counterdownDiv.style.boxShadow = '0 0 10px #ddd'
      counterdownDiv.style.padding = '10px 20px'
      if (--duration < 0) {
        clearInterval(counterdownInterval);
        submitButton.click()
      }
    }, 1000);
  }
}
