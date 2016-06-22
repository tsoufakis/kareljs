import { combineReducers } from 'redux'
import * as act from './actions'

function user(state = {}, action) {
    switch (action.type) {
        case act.FETCH_USER_SUCCESS:
        case act.CREATE_USER_SUCCESS:
            return { email: action.email, token: action.token }
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

const moleMarch = combineReducers({user, showLoginSpinner, signupForm})
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
    }
}
*/
