import C from './constants';
import Firebase from 'firebase';
import monitor from '../redux-monitor';
import FirebaseSmartRef from '../firebase-smart-ref'

const ref = new Firebase('https://loeffen-reunie-quiz.firebaseio.com');
const quizRef = ref.child('quiz');
const questionsRef = ref.child('questions');
const votesRef = ref.child('votes');

export default class {
	static init(store) {
		const dispatch = store.dispatch;

		//
		// quiz.state
		//
		quizRef.child('status').on('value', (snapshot) => dispatch({
			type: C.SET_STATUS,
			status: snapshot.val()
		}));

		//
		// quiz.activeQuestion
		//
		let questionId;
		const activeQuestionRef = new FirebaseSmartRef();
		activeQuestionRef.on('value', (snapshot) => {
			dispatch({
				type: C.SET_ACTIVE_QUESTION,
				id: questionId,
				data: snapshot.val()
			});
		});
		quizRef.child('activeQuestionId').on('value', (snapshot) => {
			questionId = snapshot.val();
			if (questionId) {
				activeQuestionRef.setRef(questionsRef.child(questionId));
			}
			else {
				activeQuestionRef.setRef(undefined);
				dispatch({
					type: C.SET_ACTIVE_QUESTION,
					id: undefined,
					data: undefined
				});
			}
		});

		//
		// quiz.activeQuestion.vote
		//
		const myVoteRef = new FirebaseSmartRef();
		myVoteRef.on('value', (snapshot) => {
			dispatch({
				type: C.SET_ACTIVE_QUESTION_VOTE,
				vote: snapshot.val()
			});
		});
		monitor(store, ['quiz.activeQuestion.id', 'auth.uid'], ({quiz, auth}) => {
			myVoteRef.setRef((quiz.activeQuestion && auth.uid) ? votesRef.child(quiz.activeQuestion.id).child(auth.uid) : undefined);
		});

		//
		// quiz.activeQuestion.votes
		//
		const activeQuestionVotesRef = new FirebaseSmartRef();
		activeQuestionVotesRef.on('value', (snapshot) => {
			dispatch({
				type: C.SET_ACTIVE_QUESTION_VOTES,
				votes: snapshot.val()
			});
		});
		monitor(store, ['quiz.activeQuestion.id', 'auth.uid'], ({quiz, auth}) => {
			activeQuestionVotesRef.setRef((quiz.activeQuestion && auth.uid) ? votesRef.child(quiz.activeQuestion.id) : undefined);
		});

		//
		// quiz.onlineUserCount
		//
		let onlineUsersCount = 0;
		const onlineUsersRef = ref.child('users').orderByChild('online').equalTo(true);
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

		//
		// quiz.questionIds
		//
		questionsRef.on('value', (snapshot) => {
			const ids = [];
			snapshot.forEach((questionSnapshot) => {
				ids.push(questionSnapshot.key());
			});
			dispatch({
				type: C.SET_QUESTION_IDS,
				questionIds: ids
			});
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