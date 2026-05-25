// FIXED: BUG-1
import { state } from './state.js';
import { AUTH_CONFIG } from './config.js';

export function performLogin(inputUsername, inputPassword) {
    if (inputUsername === AUTH_CONFIG.username && inputPassword === AUTH_CONFIG.password) {
        state.isLoggedIn = true;
        return true;
    }

    return false;
}

export function performLogout() {
    state.isLoggedIn = false;
    location.reload();
}
