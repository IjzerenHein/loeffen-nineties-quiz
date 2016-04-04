import C from './constants';

export default (state = {
    status: 'notInitialized',
    activeQuestion: undefined,
    onlineUserCount: 0,
    questionIds: []
}, action) => {
	switch (action.type) {
		case C.SET_STATUS:
            return Object.assign({}, state, {
                status: action.status
            });
        case C.SET_QUESTION_IDS:
            return Object.assign({}, state, {
                questionIds: action.questionIds
            });
        case C.SET_ACTIVE_QUESTION_ID:
            return Object.assign({}, state, {
                activeQuestionId: action.id
            });
        case C.SET_ACTIVE_QUESTION:
            const activeQuestion = (action.id && action.data) ? {
                ...action.data,
                id: action.id
            } : undefined;
            console.log('setting active question: ', activeQuestion);
            return Object.assign({}, state, {activeQuestion});
        case C.UPDATE_ACTIVE_QUESTION:
            if (state.activeQuestion && (state.activeQuestion.id === action.id)) {
                const activeQuestion = action.data ? Object.assign({}, state.activeQuestion, {
                    ...action.data,
                    id: action.id
                }) : undefined;
                console.log('updating active question: ', activeQuestion);
                return Object.assign({}, state, {activeQuestion});
            } else {
                return state;
            }
        /*case C.SET_ACTIVE_QUESTION_VOTE:
            return Object.assign({}, state, {
                activeQuestion: {
                    ...state.activeQuestion,
                    vote: action.vote
                }
            });
        case C.SET_ACTIVE_QUESTION_VOTES:
            return Object.assign({}, state, {
                activeQuestion: {
                    ...state.activeQuestion,
                    votes: action.votes
                }
            });*/
        case C.SET_ONLINE_USERS_COUNT:
            return Object.assign({}, state, {
                onlineUserCount: action.count
            });
		default:
			return state;
	}
}
