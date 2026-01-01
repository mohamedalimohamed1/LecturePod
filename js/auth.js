//js/auth.js
import { state } from './state.js';

const User = 'admin'
const password = 1234

export function performLogin(username, password) {
    if (username === User && password === password) {
        state.isLoggedIn = true;
        return true;
    }
    return false;
}

export function performLogout() {
    state.isLoggedIn = false;
    location.reload();
}