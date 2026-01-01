//js/utils/ui-helpers.js
import { state } from '../state.js';

export function showNotification(message, type = 'info') {
    const existing = document.querySelector('.app-notification');
    if (existing) existing.remove();
    const notif = document.createElement('div');
    notif.className = `app-notification ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => { notif.classList.remove('show'); setTimeout(() => notif.remove(), 400); }, 3000);
}

export function showStreak(type) {
    const popup = document.getElementById('streak-popup');
    const emojiEl = document.getElementById('streak-emoji');
    const msgEl = document.getElementById('streak-message');
    const messages = type === 'success' ? state.successMessages : state.failureMessages;
    const msg = messages[Math.floor(Math.random() * messages.length)];

    emojiEl.textContent = msg.emoji;
    msgEl.textContent = msg.text[state.language];
    popup.className = `streak-popup active ${type === 'failure' ? 'failure' : ''}`;
    setTimeout(() => { popup.classList.remove('active'); }, 3500);
}