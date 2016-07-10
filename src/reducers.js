import { combineReducers } from 'redux'
import * as act from './actions'

function user(state = {}, action) {
    switch (action.type) {
        case act.FETCH_USER_SUCCESS:
        case act.CREATE_USER_SUCCESS:
            return { email: action.email, token: action.token }
        case act.UPDATE_TOKEN:
            return Object.assign({}, state, { token })
        case act.LOGOUT:
            return {}
        default:
            return state
    }
}

function showLoginSpinner(state = false, action) {
    switch (action.type) {
        case act.FETCH_USER_REQUEST:
        case act.CREATE_USER_REQUEST:
            return true
        case act.FETCH_USER_SUCCESS:
        case act.FETCH_USER_FAILED:
        case act.CREATE_USER_SUCCESS:
        case act.CREATE_USER_FAILED:
            return false
        default:
            return state
    }
}

function signupForm(state = {}, action) {
    switch(action.type) {
        case act.SIGNUP_FORM_MESSAGE:
            return Object.assign({}, state, { message: action.message })
        default:
            return state
    }
}

function status(state = {}, action) {
    switch(action.type) {
        case act.FETCH_LEVEL_STATUS_SUCCESS:
        case act.PUT_LEVEL_STATUS_SUCCESS:
            return Object.assign({}, state, {
                id: action.id, completed: action.completed
            })
        default:
            return state
    }
}

function levelStatus(state = {}, action) {
    switch (action.type) {
        case act.FETCH_LEVEL_STATUS_SUCCESS:
        case act.PUT_LEVEL_STATUS_SUCCESS:
            return Object.assign({}, state, {
                [action.id] : status(state[action.id], action)
            })
        case act.RECEIVE_PROGRESS_ALL_LEVELS:
            const nextState = {}
            action.progress.forEach((el) => {
                const { levelId: id, completed } = el
                nextState[id] = { id, completed }
            })
            return nextState
        default:
            return state
    }
}

const moleMarch = combineReducers({
    user,
    showLoginSpinner,
    signupForm,
    levelStatus
})
export default moleMarch

/*
{
    user: {
        email: 'alfjlsd',
        token: 'afljlfd'
    },
    loggingIn: true,
    signupForm: {
        message: 'adfljssdf'
    },
    currentLevel: {
        id: 1,
        code: '',
        completed: true,
        savingCode: false,
        loadingCode: false,
    },
    levels: { id: {}}
    levelStatus: { id: true }
}
*/
