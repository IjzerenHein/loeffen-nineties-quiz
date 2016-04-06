import C from './constants';
import Firebase from 'firebase';
import monitor from '../redux-monitor';
import FirebaseSmartRef from '../firebase-smart-ref'

const ref = new Firebase('https://loeffen-reunie-quiz.firebaseio.com');
const quizRef = ref.child('quiz');
const questionsRef = ref.child('questions');
const votesRef = ref.child('votes');
const usersRef = ref.child('users');

export default class {
	static init(store) {
		const dispatch = store.dispatch;

		//
		// quiz.state
		//
		const result = {
			questions: new FirebaseSmartRef(),
			votes: new FirebaseSmartRef(),
			users: new FirebaseSmartRef()
		};
		quizRef.child('status').on('value', (snapshot) => {
			const status = snapshot.val();
			dispatch({
				type: C.SET_STATUS,
				status: status
			});
			
			// when finished, update end results
			if (status === 'finished') {
				result.questions.setRef(questionsRef);
				result.votes.setRef(votesRef);
				result.users.setRef(usersRef);
				Promise.all([
					result.questions.onValue(),
					result.votes.onValue(),
					result.users.onValue()
					]).then(([questions, votes, users]) => {
					users = users.val();
					questions = questions.val();
					votes = votes.val();
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
					results.sort((a, b) => a.totalAnsweredCorrect < b.totalAnsweredCorrect);
					dispatch({
						type: C.SET_RESULTS,
						results: results
					});
					result.questions.onValue();
					result.votes.onValue();
					result.users.onValue();
					result.questions.setRef(undefined);
					result.votes.setRef(undefined);
					result.users.setRef(undefined);
				});	
			}
		});

		//
		// quiz.activeQuestion
		//
		const activeQuestionRef = new FirebaseSmartRef();
		const myVoteRef = new FirebaseSmartRef();
		const activeQuestionVotesRef = new FirebaseSmartRef();
		quizRef.child('activeQuestionId').on('value', (snapshot) => {
			dispatch({
				type: C.SET_ACTIVE_QUESTION_ID,
				id: snapshot.val()
			});
		});
		monitor(store, ['quiz.activeQuestionId', 'auth.uid', 'auth.admin'], ({quiz, auth}) => { 
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
				return activeQuestion && myVote && dispatch({
					type: C.SET_ACTIVE_QUESTION,
					id: activeQuestion.key(),
					data: {
						...activeQuestion.val(),
						vote: myVote.val(),
						votes: votes ? votes.val() : {}
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
		// quiz.questionIds (admins only)
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
		monitor(store, ['auth.admin'], ({auth}) => {
			if (!auth.admin) {
				adminQuestionsRef.setRef(undefined);
				dispatch({
					type: C.SET_QUESTION_IDS,
					questionIds: []
				});
			}
			else {
				adminQuestionsRef.setRef(questionsRef);
			}
		});
	}

	static vote(questionId, optionId) {
		return function(dispatch, getState) {
			const quiz = getState().quiz;
			questionId = quiz.activeQuestion.id;
			votesRef.child(questionId).child(getState().auth.uid).set(optionId);
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
}