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

export const LOGOUT = 'LOGOUT'

export function logout() {
    return { type: LOGOUT }
}

export const FETCH_LEVEL_STATUS_REQUEST = 'FETCH_LEVEL_STATUS_REQUEST'
export const FETCH_LEVEL_STATUS_SUCCESS = 'FETCH_LEVEL_STATUS_SUCCESS'
export const FETCH_LEVEL_STATUS_FAILED = 'FETCH_LEVEL_STATUS_FAILED'

export function fetchLevelStatusRequest() {
    return { type: FETCH_LEVEL_STATUS_REQUEST }
}

export function fetchLevelStatusSuccess(id, completed) {
    return { type: FETCH_LEVEL_STATUS_SUCCESS, completed, id }
}

export const FETCH_PROGRESS_ALL_LEVELS_SUCCESS = 'FETCH_PROGRESS_ALL_LEVELS_SUCCESS'

export function fetchProgressAllLevelsSuccess(progress) {
    return { type: FETCH_PROGRESS_ALL_LEVELS_SUCCESS, progress }
}


export const PUT_LEVEL_STATUS_REQUEST = 'PUT_LEVEL_STATUS_REQUEST'
export const PUT_LEVEL_STATUS_SUCCESS = 'PUT_LEVEL_STATUS_SUCCESS'

export function putLevelStatusRequest() {
    return { type: PUT_LEVEL_STATUS_REQUEST }
}

export function putLevelStatusSuccess(id, completed) {
    return { type: PUT_LEVEL_STATUS_SUCCESS, id, completed }
}
