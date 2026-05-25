import { useState } from 'react';
import useAppStore from '../../store/useAppStore.js';
import { translations } from '../../data/translations.js';

function LoginForm() {
  const language = useAppStore((state) => state.language);
  const login = useAppStore((state) => state.login);
  const showNotification = useAppStore((state) => state.showNotification);
  const t = translations[language];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (login(username, password)) {
      showNotification(t.welcome, 'success');
      return;
    }

    showNotification(t.loginFailed, 'error');
  };

  return (
    <div className="view" id="login-view">
      <div className="login-card" style={{ maxWidth: 400, margin: '4rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{t.loginTitle}</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="text"
            autoComplete="username"
            required
            placeholder="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            className="login-input"
            type="password"
            autoComplete="current-password"
            required
            placeholder="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-full">
            {t.loginBtn}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
