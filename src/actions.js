export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_FAILED = 'FETCH_USER_FAILED'

export function fetchUserRequest() {
    return { type: FETCH_USER_REQUEST }
}

export function fetchUserSuccess(email, token) {
    return { type: FETCH_USER_SUCCESS, email, token }
}

export function fetchUserFailed() {
    return { type: FETCH_USER_FAILED }
}

export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST'
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS'
export const CREATE_USER_FAILED = 'CREATE_USER_FAILED'

export const SIGNUP_FORM_MESSAGE = 'SIGNUP_FORM_MESSAGE'

export function signupFormMessage(message) {
    return { type: SIGNUP_FORM_MESSAGE, message }
}

export function createUserRequest() {
    return { type: CREATE_USER_REQUEST }
}

export function createUserSuccess(email, token) {
    return { type: CREATE_USER_SUCCESS, email, token }
}

export function createUserFailed() {
    return { type: CREATE_USER_FAILED }
}
