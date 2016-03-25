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
        case C.SET_ACTIVE_QUESTION:
            return Object.assign({}, state, {
                activeQuestion: (action.id && action.data) ? {
                    ...action.data,
                    id: action.id
                } : undefined
            });
        case C.SET_ACTIVE_QUESTION_VOTE:
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
            });
        case C.SET_ONLINE_USERS_COUNT:
            return Object.assign({}, state, {
                onlineUserCount: action.count
            });
		default:
			return state;
	}
}
