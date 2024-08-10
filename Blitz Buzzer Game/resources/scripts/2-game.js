document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.querySelector('.question-container');
    const nextButton = document.getElementById('next-button');
    const passButton = document.getElementById('pass-button');
    const timerElement = document.getElementById('timer');
    const timerDisplay = document.getElementById('timer-container');
    const questionTitle = document.getElementById('question-title');
    const questionText = document.getElementById('question-text');
    const passDisplay = document.getElementById('pass-button-display');
    const answersContainer = document.querySelector('.answers');
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const difficulty = urlParams.get('difficulty');

    let currentQuestionIndex = 0;
    let questionQueue = [];
    let passedQuestions = [];
    let currentSeriesIndex = 0;
    let questionsToLoad = [];
    let score = 0;
    let streak = 1;
    let totalTimeScore = 0;
    let countdownDuration = 15;
    let countdownStartTime;
    let countdownRequestId;
    let remainingTime = 15;
    let currentQuestion;
    let passButtonUsed = false;
    let timerActive = false; 
    let answerSubmitted = false;

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function startTimer() {
        countdownStartTime = performance.now();
        timerActive = true; 
        countdownRequestId = requestAnimationFrame(updateTimer);
    }

    function updateTimer(currentTime) {
        if (!timerActive) return; 
    
        const elapsedTime = (currentTime - countdownStartTime) / 1000;
        remainingTime = Math.max(countdownDuration - elapsedTime, 0);
    
        timerElement.textContent = `${Math.ceil(remainingTime)}s`;
    
        if (remainingTime <= 5) {
            timerElement.style.color = '#e74c3c';
        } else {
            timerElement.style.color = '';
        }
    
        if (remainingTime > 0) {
            countdownRequestId = requestAnimationFrame(updateTimer);
        } else {
            handleTimeUp();
        }
    }

    function handleTimeUp() {
        calculateTimePoints();
        applyAnswerStyles();
        streak = 1;
        if (!currentQuestion) return;
    
        const answerDivs = document.querySelectorAll('.answers div');
        const correctAnswer = decodeHTML(currentQuestion.correct_answer).trim();
    
        nextButton.style.display = 'block';
    }

    function resetAnswerDivs() {
        const answerDivs = document.querySelectorAll('.answers div');
        answerDivs.forEach(div => {
            div.classList.remove('correct', 'incorrect');
            div.style.pointerEvents = 'auto';
        });
    }

    function displayEndScreen() {
        const quizContainer = document.getElementById('quiz-container');
        const quizEndContainer = document.getElementById('quiz-end-container');
        const questionContainer = document.querySelector('.question-container');
        const scoreElement = document.getElementById('score');
        const timeScoreElement = document.getElementById('time-score');
    
        if (questionContainer) {
            questionContainer.style.display = 'none';
        }
    
        scoreElement.textContent = `${score}/10`;
        timeScoreElement.textContent = `Score : ${totalTimeScore}`;
        quizEndContainer.style.display = 'block';
    }

    function displayQuestion() {
        if (questionQueue.length > 0) {
            timerActive = false; 
            answerSubmitted = false;
            currentQuestion = questionQueue.shift();
            currentQuestionIndex++;
        
            questionTitle.textContent = `Question ${currentQuestionIndex}`;
            questionText.textContent = decodeHTML(currentQuestion.question);
        
            answersContainer.innerHTML = getAnswersHtml(currentQuestion);
        
            resetAnswerDivs();
            setupAnswerDivs(currentQuestion);
            nextButton.style.display = 'none';
            timerElement.style.display = 'block';
            passButton.style.display = 'block';
            passDisplay.style.zIndex = 99;
            startTimer(); 
        } else if (passedQuestions.length > 0) {
            questionQueue = passedQuestions;
            passedQuestions = [];
            displayQuestion();
        } else {
            displayEndScreen();
            nextButton.style.display = 'none';
            passButton.style.display = 'none';
            timerElement.style.display = 'none';
            timerDisplay.style.display = 'none';
        }
    }

    passButton.addEventListener('click', () => {
        passedQuestions.push(currentQuestion);
        passQuestion();
    });

    function passQuestion() {
        if (passButtonUsed) return;
        timerActive = false;
    
        passButtonUsed = true;
        passButton.disabled = true;
        passButton.style.pointerEvents = 'none';
        passButton.style.textDecoration = 'line-through';

        animateIcon();
        setTimeout(function() {
          displayQuestion();
        }, 1000); 
    }
    function animateIcon() {
      const icon = document.getElementById('skip-icon');
      
      icon.classList.add('move-right');
    }

    function getAnswersHtml(question) {
        const allAnswers = [...question.incorrect_answers, question.correct_answer];
        allAnswers.sort(() => Math.random() - 0.5);
    
        return allAnswers.map(answer => `
            <div data-correct="${answer === question.correct_answer}">${decodeHTML(answer)}</div>
        `).join('');
    }

    function applyAnswerStyles() {
        const answerDivs = document.querySelectorAll('.answers div');
    
        answerDivs.forEach(div => {
            if (div.getAttribute('data-correct') === 'true') {
                div.classList.add('correct');
            } else {
                div.classList.add('incorrect');
            }
            div.style.pointerEvents = 'none';
        });
    
        nextButton.style.display = 'block';
        passDisplay.style.zIndex = 101;

        answerSubmitted = true;
    }

    function setupAnswerDivs() {
        const answerDivs = document.querySelectorAll('.answers div');
    
        answerDivs.forEach(div => {
            div.addEventListener('click', (event) => {
                timerActive = false; 
            
                const elapsedTime = (performance.now() - countdownStartTime) / 1000;
                const remainingTime = Math.max(countdownDuration - elapsedTime, 0);
                const timePoints = Math.floor(remainingTime) * 10 - 50;
            
                console.log(`Temps restant : ${Math.ceil(remainingTime)}s`);
                console.log(`Points de temps calculés : ${timePoints}`);
            
                const selectedAnswerIsCorrect = div.getAttribute('data-correct') === 'true';
            
                applyAnswerStyles();
            
                if (selectedAnswerIsCorrect) {
                    score++;
                
                    totalTimeScore += timePoints + (100 * streak);
                    console.log(`Score de précision : ${score}`);
                    console.log(`Score après ajout des points de temps : ${totalTimeScore}`);
                    streak++;
                } else {
                    totalTimeScore -= 50;
                    streak = 1;
                    console.log(`Pénalité de -50 points.`);
                    console.log(`Score après pénalité : ${totalTimeScore}`);
                }
            });
        });
    }

    function calculateTimePoints() {
        let pointsForTime = Math.max(100 - (15 - remainingTime) * 10, -50);
        totalTimeScore += pointsForTime;
        console.log(`Points pour cette question: ${pointsForTime}`);
    }

    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    async function loadQuestions(apiUrl) {
        let success = false;

        while (!success) {
            try {
                console.log(`Tentative de récupération des questions depuis: ${apiUrl}`);
                const response = await fetch(apiUrl);
            
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            
                const data = await response.json();
            
                if (data.results && data.results.length > 0) {
                    questionQueue = questionQueue.concat(data.results);
                    if (currentQuestionIndex === 0) {
                        displayQuestion();
                    }
                    success = true; 
                    console.log(`Réussite pour l'URL: ${apiUrl}`);
                } else {
                    console.warn(`Aucune question trouvée pour ${apiUrl}`);
                    success = true; 
                }
            
                if (success && currentSeriesIndex < questionsToLoad.length - 1) {
                    currentSeriesIndex++;
                    await delay(5000); 
                    loadQuestions(questionsToLoad[currentSeriesIndex]);
                }
            
            } catch (error) {
                console.error('Erreur lors de la récupération des questions:', error);
                console.log(`Réessai de la même URL après 5 secondes: ${apiUrl}`);
                await delay(5000); 
            }
        }
    }

    async function fetchQuestions() {
        const baseUrl = 'https://opentdb.com/api.php';
        let apiUrls = [];
    
        if (difficulty === 'facile') {
            apiUrls = [
                `${baseUrl}?amount=6&difficulty=easy${category ? `&category=${category}` : ''}`,
                `${baseUrl}?amount=4&difficulty=medium${category ? `&category=${category}` : ''}`
            ];
        } else if (difficulty === 'moyen') {
            apiUrls = [
                `${baseUrl}?amount=3&difficulty=easy${category ? `&category=${category}` : ''}`,
                `${baseUrl}?amount=4&difficulty=medium${category ? `&category=${category}` : ''}`,
                `${baseUrl}?amount=3&difficulty=hard${category ? `&category=${category}` : ''}`
            ];
        } else if (difficulty === 'difficile') {
            apiUrls = [
                `${baseUrl}?amount=4&difficulty=medium${category ? `&category=${category}` : ''}`,
                `${baseUrl}?amount=6&difficulty=hard${category ? `&category=${category}` : ''}`
            ];
        }
    
        questionsToLoad = apiUrls;
        loadQuestions(questionsToLoad[currentSeriesIndex]);
    }

    function pauseTimer() {
        timerActive = false;
        cancelAnimationFrame(countdownRequestId);
    }

    function resumeTimer() {
        if (answerSubmitted) return; 

        timerActive = true;
        countdownStartTime = performance.now() - (countdownDuration - remainingTime) * 1000;
        countdownRequestId = requestAnimationFrame(updateTimer);
    }

    nextButton.addEventListener('click', () => {
        displayQuestion();
    });

    fetchQuestions();

    document.getElementById('show-menu-popup').addEventListener('click', () => {
        document.getElementById('menu-popup-overlay').style.display = 'block';
        document.getElementById('menu-popup-container').style.display = 'block';
        pauseTimer();
    });

    document.getElementById('menu-popup-close').addEventListener('click', () => {
        document.getElementById('menu-popup-overlay').style.display = 'none';
        document.getElementById('menu-popup-container').style.display = 'none';
        resumeTimer();
    });

    document.getElementById('menu-popup-overlay').addEventListener('click', () => {
        document.getElementById('menu-popup-overlay').style.display = 'none';
        document.getElementById('menu-popup-container').style.display = 'none';
        resumeTimer();
    });
    document.getElementById('show-popup').addEventListener('click', () => {
        document.getElementById('popup-overlay').style.display = 'block';
        document.getElementById('popup-container').style.display = 'block';
    });

    document.getElementById('popup-close').addEventListener('click', () => {
        document.getElementById('popup-overlay').style.display = 'none';
        document.getElementById('popup-container').style.display = 'none';
    });

    document.getElementById('popup-overlay').addEventListener('click', () => {
        document.getElementById('popup-overlay').style.display = 'none';
        document.getElementById('popup-container').style.display = 'none';
    });
    function updateVh() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    window.addEventListener('resize', updateVh);
    window.addEventListener('load', updateVh);
    updateVh();
});