// if we click on the start/reset
	// if we are playing 
		//reload page
	// if we are not playing 
		// set score to 0
		//show countdown box
		// reduce time by 1 sec in loops
			// time left? 
				// yes -> continue
				// no gameover
		//change button to reset
		// generate new q&a

// if we click answer box 
	// if we are playing 
		//correct?
			//yes
				// increase score
				//show correct box for 1 sec
				//generate new Q&A
			// no
				//show try again box for 1 sec

var dataController = (function () {
	var data = {
		questions: [
			{
				question: '5x2',
				answers: [7, 2.5, 10, 14],
				correct: 10
			},
			{
				question: '15/2',
				answers: [7, 7.5, 10, 14],
				correct: 7.5
			},
			{
				question: '4+2',
				answers: [6, 2.5, 10, 14],
				correct: 6
			},
			{
				question: '52-26',
				answers: [22, 25, 26, 56],
				correct: 26
			},
			{
				question: '5x5',
				answers: [10, 2.5, 125, 25],
				correct: 25
			},{
				question: '3-3',
				answers: [0, 4.5, 6, 9],
				correct: 0
			},{
				question: '9x9',
				answers: [18, 81, 9, 99],
				correct: 81
			}
		],
		score: 0,
		remainingTime: 60,
		arePlaying: false
	}

	return {
		getScore: function() {
			return data.score
		},
		getRemainingTime: function() {
			return {
				time: data.remainingTime
			}
		},
		decrimentRemainingTime: function() {
			data.remainingTime--;
			return data.remainingTime;
		},
		setInitialState: function() {
			data.score = 0;
			data.remainingTime = 60;
			this.setStateOfTheGame(true);
			return {
				score: data.score,
				remainingTime: data.remainingTime,
				arePlaying: data.arePlaying
			}
		},
		addQuestion: function (question) {
			if(question.question && question.answers && question.correct) {
				if(question.answers[0] && question.answers[1]  && question.answers[2]  && question.answers[3]) {
					return data.questions.push(question);
				}
				return console.err('Form of question object is incorrect');
			}
			return console.err('Form of question object is incorrect');
		},
		getRandomQuestion: function () {
			var length = data.questions.length;
			return data.questions[Math.floor(Math.random() * length)]
		},
		getStateOfTheGame: function () {
			return data.arePlaying;
		},
		setStateOfTheGame: function(state) {
			data.arePlaying = state;
		},
		incrementScore: function() {
			data.score = data.score + 1;
			return data.score;
		}
	}
})();

var UIController = (function () {
	var DOMStrings = {
		correct: '#correct',
		wrong: '#wrong',
		scorevalue: '#scorevalue',
		question: '#question',
		startResetButton: '#startreset',
		timeremainingvalue: '#timeremainingvalue',
		scoreResult: '#scoreResult',
		box1: '#box1',
		box2: '#box2',
		box3: '#box3',
		box4: '#box4',
		timeremaining: '#timeremaining',
		choices: '#choices',
		gameover: "#gameover"
	};

	var remainingTime = document.querySelector(DOMStrings.timeremainingvalue);
	var score = document.querySelector(DOMStrings.scorevalue);

	return {
		checkAnswer: function(isCorrect) {
			if(isCorrect) {
				var el = document.querySelector(DOMStrings.correct);
				el.style.display = 'inline-block';
				setTimeout(function() {
					el.style.display = 'none';
				} ,1000)
			} else {
				var el = document.querySelector(DOMStrings.wrong);
				el.style.display = 'inline-block';
				setTimeout(function() {
					el.style.display = 'none';
				} ,1000)
			}
		},
		changeRemainingTime: function(value) {
			remainingTime.innerHTML = value;
		},
		changeScore: function (value) {
			score.innerHTML = value;
		},
		getDOMStrings: function () {
			return DOMStrings;
		},
		showTimer: function() {
			document.querySelector(DOMStrings.timeremaining).style.display = 'inline-block';
		},
		fillOutForm: function (question) {
			document.querySelector(DOMStrings.question).innerHTML = question.question;
			document.querySelector(DOMStrings.box1).innerHTML = question.answers[0];
			document.querySelector(DOMStrings.box2).innerHTML = question.answers[1];
			document.querySelector(DOMStrings.box3).innerHTML = question.answers[2];
			document.querySelector(DOMStrings.box4).innerHTML = question.answers[3];
		}
	}
})();

var controller = (function(dataCtrl, UICtrl) {
	var remainingTimer;
	var ques;
	var setupEventListener = function () {
		document.querySelector(UICtrl.getDOMStrings().startResetButton).addEventListener('click', startOrReset);
		document.querySelector(UICtrl.getDOMStrings().choices).addEventListener('click', checkAnswer);
	}

	var checkAnswer = function(e) {
		if(dataCtrl.getStateOfTheGame() && ques) {
			var elCorrect = document.querySelector(UICtrl.getDOMStrings().correct);
			var elWrong = document.querySelector(UICtrl.getDOMStrings().wrong);
			if(+e.target.innerHTML === ques.correct) {
				elCorrect.style.display = 'inline-block';
				//Update the score
				UICtrl.changeScore(dataCtrl.incrementScore());
				getNewQuestion();
				setTimeout(function() {
					elCorrect.style.display = 'none';
				} ,1000);
			} else {
				elWrong.style.display = 'inline-block';
				setTimeout(function() {
					elWrong.style.display = 'none';
				} ,1000);
			}
		}
		console.log(e.target.innerHTML)
	}

	var setupInterval = function () {
		remainingTimer = setInterval(function() {
			var rm = dataCtrl.decrimentRemainingTime();
			UICtrl.changeRemainingTime(rm);
			if(rm === 0) {
				gameover();
			}
		}, 1000);
	}

	var clearTimerInterval = function() {
		clearInterval(remainingTimer);
	}

	var getNewQuestion = function() {
		ques = dataCtrl.getRandomQuestion();
		UICtrl.fillOutForm(ques);
	}

	var gameover = function() {
		clearTimerInterval();
		dataCtrl.setStateOfTheGame(false);
		document.querySelector(UICtrl.getDOMStrings().scoreResult).innerHTML = dataCtrl.getScore();
		document.querySelector(UICtrl.getDOMStrings().gameover).style.display = 'inline-block';
	}
	var loadInitialState = function() {
		// Hide gameover table
		document.querySelector(UICtrl.getDOMStrings().gameover).style.display = 'none';
		
		// accept an answer
		getNewQuestion();

		// fill out timer and score
		var initValues = dataCtrl.setInitialState();
		UICtrl.changeRemainingTime(initValues.remainingTime);
		UICtrl.changeScore(initValues.score);
		UICtrl.showTimer();
		setupInterval();
	}

	var startOrReset = function () {
		var state = dataCtrl.getStateOfTheGame();
		if(state) {
			if(confirm('Do you really want restart the game?')){
				clearTimerInterval();
				loadInitialState();
			}
		} else {
			loadInitialState();
		}
	}

	return {
		init: function() {
			setupEventListener();
		}
	}
})(dataController, UIController);


controller.init();