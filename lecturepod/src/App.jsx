import { useEffect } from 'react';
import useAppStore from './store/useAppStore.js';
import { translations } from './data/translations.js';
import LoginForm from './components/auth/LoginForm.jsx';
import SemesterSelection from './components/semester/SemesterSelection.jsx';
import LectureList from './components/lecture/LectureList.jsx';
import ModeSelection from './components/mode/ModeSelection.jsx';
import SessionSetup from './components/session/SessionSetup.jsx';
import QuestionView from './components/session/QuestionView.jsx';
import LearnView from './components/session/LearnView.jsx';
import ReadView from './components/session/ReadView.jsx';
import ResultsView from './components/session/ResultsView.jsx';
import Notification from './components/ui/Notification.jsx';
import StreakPopup from './components/ui/StreakPopup.jsx';
import InfoBanner from './components/ui/InfoBanner.jsx';

function App() {
  const language = useAppStore((state) => state.language);
  const theme = useAppStore((state) => state.theme);
  const currentView = useAppStore((state) => state.currentView);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const setTheme = useAppStore((state) => state.setTheme);
  const logout = useAppStore((state) => state.logout);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.lang = language;
  }, [language, theme]);

  const renderView = () => {
    if (!isLoggedIn) return <LoginForm />;
    if (currentView === 'semesterSelection') return <SemesterSelection />;
    if (currentView === 'lectureSelection') return <LectureList />;
    if (currentView === 'modeSelection') return <ModeSelection />;
    if (currentView === 'sessionSetup') return <SessionSetup />;
    if (currentView === 'question') return <QuestionView />;
    if (currentView === 'learn') return <LearnView />;
    if (currentView === 'readMode') return <ReadView />;
    if (currentView === 'results') return <ResultsView />;
    return <LoginForm />;
  };

  return (
    <div className="container">
      <header>
        <h1>{t.mainTitle}</h1>
        <p>{t.mainSubtitle}</p>
        <div className="header-controls">
          <button
            type="button"
            id="lang-toggle-btn"
            className="btn-icon"
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
          >
            {language.toUpperCase()}
          </button>
          <button
            type="button"
            id="theme-toggle-btn"
            className="btn-icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <span className="material-symbols-outlined" id="theme-icon">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          {isLoggedIn ? (
            <button type="button" id="logout-btn" className="btn-icon" onClick={logout}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          ) : null}
        </div>
      </header>

      <main id="app-container">
        {isLoggedIn ? <InfoBanner /> : null}
        {renderView()}
      </main>

      <StreakPopup />
      <Notification />
    </div>
  );
}

export default App;
