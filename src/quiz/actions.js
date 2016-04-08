import C from './constants';
import Firebase from 'firebase';
import monitor from '../redux-monitor';
import FirebaseSmartRef from '../firebase-smart-ref'

const ref = new Firebase('https://loeffen-reunie-quiz.firebaseio.com');
const quizRef = ref.child('quiz');
const questionsRef = ref.child('questions');
const votesRef = ref.child('votes');
const usersRef = ref.child('users');

export default class Actions {
	static init(store) {
		const dispatch = store.dispatch;

		//
		// quiz.state
		//
		quizRef.child('status').on('value', (snapshot) => {
			const status = snapshot.val();
			dispatch({
				type: C.SET_STATUS,
				status: status
			});
		});

		//
		// quiz.activeQuestion
		//
		const activeQuestionRef = new FirebaseSmartRef();
		const myVoteRef = new FirebaseSmartRef();
		const activeQuestionVotesRef = new FirebaseSmartRef();
		quizRef.child('activeQuestionId').on('value', (snapshot) => {
			dispatch({
				type: C.SET_REMOTE_ACTIVE_QUESTION_ID,
				id: snapshot.val()
			});
		});
		monitor(store, ['quiz.status', 'quiz.activeQuestionId', 'auth.uid', 'auth.admin'], ({quiz, auth}) => { 
			activeQuestionRef.onValue();
			myVoteRef.onValue();
			activeQuestionVotesRef.onValue();
			activeQuestionRef.setRef(quiz.activeQuestionId ? questionsRef.child(quiz.activeQuestionId) : undefined);
			myVoteRef.setRef((quiz.activeQuestionId && auth.uid) ? votesRef.child(quiz.activeQuestionId).child(auth.uid) : undefined);
			activeQuestionVotesRef.setRef((quiz.activeQuestionId && auth.uid && auth.admin) ? votesRef.child(quiz.activeQuestionId) : undefined);
			const promises = [
				activeQuestionRef.onValue((snapshot) => {
					return snapshot && dispatch({
						type: C.UPDATE_ACTIVE_QUESTION,
						id: snapshot.key(),
						data: snapshot.val()
					});
				}),
				myVoteRef.onValue((snapshot) => {
					return snapshot && dispatch({
						type: C.UPDATE_ACTIVE_QUESTION,
						id: quiz.activeQuestionId,
						data: {
							vote: snapshot.val()
						}
					});
				}),
				activeQuestionVotesRef.onValue((snapshot) => {
					return snapshot && dispatch({
						type: C.UPDATE_ACTIVE_QUESTION,
						id: quiz.activeQuestionId,
						data: {
							votes: snapshot.val()
						}
					});
				})
			];
			Promise.all(promises).then(([activeQuestion, myVote, votes]) => {
				return activeQuestion.snapshot && myVote.snapshot && dispatch({
					type: C.SET_ACTIVE_QUESTION,
					id: activeQuestion.snapshot.key(),
					data: {
						...activeQuestion.snapshot.val(),
						vote: myVote.snapshot.val(),
						votes: votes.snapshot ? votes.snapshot.val() : {}
					}
				});
			});
		});

		//
		// quiz.onlineUserCount (admins only)
		//
		let onlineUsersCount = 0;
		const onlineUsersRef = new FirebaseSmartRef();
		onlineUsersRef.on('child_added', () => {
			onlineUsersCount++;
			dispatch({
				type: C.SET_ONLINE_USERS_COUNT,
				count: onlineUsersCount
			});
		});
		onlineUsersRef.on('child_removed', () => {
			onlineUsersCount--;
			dispatch({
				type: C.SET_ONLINE_USERS_COUNT,
				count: onlineUsersCount
			});
		});
		monitor(store, ['auth.admin'], ({auth}) => { 
			if (!auth.admin) {
				onlineUsersRef.setRef(undefined);
				onlineUsersCount = 0;
				dispatch({
					type: C.SET_ONLINE_USERS_COUNT,
					count: onlineUsersCount
				});
			}
			else {
				onlineUsersCount = 0;
				onlineUsersRef.setRef(ref.child('users').orderByChild('online').equalTo(true));
			}
		});

		//
		// quiz.questionIds
		//
		const adminQuestionsRef = new FirebaseSmartRef();
		adminQuestionsRef.on('value', (snapshot) => {
			const ids = [];
			snapshot.forEach((questionSnapshot) => {
				ids.push(questionSnapshot.key());
			});
			dispatch({
				type: C.SET_QUESTION_IDS,
				questionIds: ids
			});
		});
		monitor(store, ['auth.admin', 'quiz.status'], ({auth, quiz}) => {
			if (auth.admin || (quiz.status === 'finished')) {
				adminQuestionsRef.setRef(questionsRef);
			} else {
				adminQuestionsRef.setRef(undefined);
				dispatch({
					type: C.SET_QUESTION_IDS,
					questionIds: []
				});
			}
		});

		//
		// quiz.results
		//
		monitor(store, ['auth.status', 'auth.quizStatus', 'quiz.status'], ({auth, quiz}) => {
			if ((auth.status === 'loggedIn') && (quiz.status === 'finished') && auth.quizStatus) {
				dispatch(Actions.updateResults());
			}
		});
	}

	static vote(questionId, optionId) {
		return function(dispatch, getState) {
			const {quiz, auth} = getState();
			questionId = quiz.activeQuestion.id;
			votesRef.child(questionId).child(getState().auth.uid).set(optionId);
			if (!auth.quizStatus) {
				setTimeout(() => {
					let questionIdx = quiz.questionIds.indexOf(questionId);
					if ((questionIdx >= 0) && (questionIdx < (quiz.questionIds.length - 1))) {
						dispatch({
							type: C.SET_LOCAL_ACTIVE_QUESTION_ID,
							id: quiz.questionIds[questionIdx + 1]
						});
					} else if (questionIdx >= 0) {
						ref.child('users').child(auth.uid).child('quizStatus').set('completedAfterwards');
					}
				}, 100);
			}
		}
	}

	static start() {
		return function() {
			quizRef.child('status').set('started');
		}
	}

	static finish() {
		return function() {
			quizRef.child('status').set('finished');
		}
	}

	static nextQuestion() {
		return function(dispatch, getState) {
			const quiz = getState().quiz;
			const questionIds = quiz.questionIds;
			let questionIdx = Math.min((quiz.activeQuestion ? questionIds.indexOf(quiz.activeQuestion.id) : 0) + 1, questionIds.length - 1);
			quizRef.child('activeQuestionId').set(quiz.questionIds[questionIdx]);
		}
	}

	static previousQuestion() {
		return function(dispatch, getState) {
			const quiz = getState().quiz;
			const questionIds = quiz.questionIds;
			let questionIdx = Math.max((quiz.activeQuestion ? questionIds.indexOf(quiz.activeQuestion.id) : 0) - 1, 0);
			quizRef.child('activeQuestionId').set(quiz.questionIds[questionIdx]);
		}
	}

	static closeQuestion() {
		return function(dispatch, getState) {
			const quiz = getState().quiz;
			const questionId = quiz.activeQuestion.id;
			questionsRef.child(questionId).child('status').set('closed');
		}
	}

	static reopenQuestion() {
		return function(dispatch, getState) {
			const quiz = getState().quiz;
			const questionId = quiz.activeQuestion.id;
			questionsRef.child(questionId).child('status').set('open');
			questionsRef.child(questionId).child('resultsVisible').set(false);
			questionsRef.child(questionId).child('answerVisible').set(false);
		}
	}

	static showResults(show) {
		return function(dispatch, getState) {
			const quiz = getState().quiz;
			const questionId = quiz.activeQuestion.id;
			questionsRef.child(questionId).child('resultsVisible').set(show);
		}
	}

	static showAnswer(show) {
		return function(dispatch, getState) {
			const quiz = getState().quiz;
			const questionId = quiz.activeQuestion.id;
			questionsRef.child(questionId).child('answerVisible').set(show);
		}
	}

	static updateResults() {
		return function(dispatch) {
			const questionsSmartRef = new FirebaseSmartRef(questionsRef);
			const votesSmartRef = new FirebaseSmartRef(votesRef);
			const usersSmartRef = new FirebaseSmartRef(usersRef);
			Promise.all([questionsSmartRef.onValue(), votesSmartRef.onValue(), usersSmartRef.onValue()]).then(([questions, votes, users]) => {
				users = users.snapshot ? users.snapshot.val() : {};
				questions = questions.snapshot ? questions.snapshot.val() : {};
				votes = votes.snapshot ? votes.snapshot.val() : {};
				const questionIds = Object.keys(questions);
				const uids = Object.keys(users);
				const results = [];
				for (let i = 0; i < uids.length; i++) {
					const uid = uids[i];
					if (!users[uid].admin) {
						let totalQuestions = 0;
						let totalQuestionsWithAnswer = 0;
						let totalAnswered = 0;
						let totalAnsweredCorrect = 0;
						for (let j = 0; j < questionIds.length; j++) {
							const question = questions[questionIds[j]];
							totalQuestions++;
							totalQuestionsWithAnswer += question.answer ? 1 : 0;
							const answer = votes[questionIds[j]][uid];
							totalAnswered += (answer ? 1 : 0);
							totalAnsweredCorrect += (question.answer && answer && (answer === question.answer)) ? 1 : 0;
						}
						results.push({
							uid: uids[i],
							name: users[uid].name,
							totalQuestions,
							totalQuestionsWithAnswer,
							totalAnswered,
							totalAnsweredCorrect
						});
					}
				}
				results.sort((a, b) => {
					if (a.totalAnsweredCorrect > b.totalAnsweredCorrect) {
						return -1;
					} else if (a.totalAnsweredCorrect < b.totalAnsweredCorrect) {
						return 1;
					} else {
						return 0;
					}
				});
				dispatch({
					type: C.SET_RESULTS,
					results: results
				});
				questionsSmartRef.onValue();
				votesSmartRef.onValue();
				usersSmartRef.onValue();
				questionsSmartRef.setRef(undefined);
				votesSmartRef.setRef(undefined);
				usersSmartRef.setRef(undefined);
			});
		};
	}
}