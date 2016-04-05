import C from './constants';

export default (state = {
    status: 'notInitialized',
    activeQuestion: undefined,
    onlineUserCount: 0,
    questionIds: [],
    results: []
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
            //console.log('setting active question: ', activeQuestion);
            return Object.assign({}, state, {activeQuestion});
        case C.UPDATE_ACTIVE_QUESTION:
            if (state.activeQuestion && (state.activeQuestion.id === action.id)) {
                const activeQuestion = action.data ? Object.assign({}, state.activeQuestion, {
                    ...action.data,
                    id: action.id
                }) : undefined;
                //console.log('updating active question: ', activeQuestion);
                return Object.assign({}, state, {activeQuestion});
            }
            return state;
        case C.SET_ONLINE_USERS_COUNT:
            return Object.assign({}, state, {
                onlineUserCount: action.count
            });
        case C.SET_RESULTS:
            return Object.assign({}, state, {
                results: action.results
            });
		default:
			return state;
	}
}
