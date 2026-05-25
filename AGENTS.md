# AGENTS.md — LecturePod React + Vite Migration Guide

> Bu dosya, LecturePod uygulamasının Vanilla JS'den React + Vite'a taşınması sürecinde
> çalışan tüm AI agent'lar ve geliştiriciler için tek referans kaynağıdır.
> Her PR, commit veya kod değişikliğinden önce bu dosya okunmalıdır.

---

## 1. Proje Kimliği

| Alan | Değer |
|---|---|
| Proje Adı | LecturePod |
| Tür | E-Öğrenme / Sınav Uygulaması |
| Mevcut Stack | Vanilla JS + ES Modules |
| Hedef Stack | React 18 + Vite 5 + Zustand |
| Dil | Türkçe UI, Türkçe/İngilizce içerik |

---

## 2. Klasör Yapısı (Hedef)

```
lecturepod/
├── public/
│   └── data/                  # JSON ders dosyaları (statik)
│       ├── lecture_one.json
│       ├── lecture_two.json
│       ├── lecture_three.json
│       ├── lecture_four.json
│       ├── lecture_five.json
│       ├── lecture_six.json
│       └── lecture_seven.json
├── src/
│   ├── assets/                # Görseller, fontlar
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginForm.jsx
│   │   ├── lecture/
│   │   │   └── LectureList.jsx
│   │   ├── mode/
│   │   │   └── ModeSelection.jsx
│   │   ├── session/
│   │   │   ├── SessionSetup.jsx
│   │   │   ├── QuestionView.jsx
│   │   │   ├── LearnView.jsx
│   │   │   ├── ReadView.jsx
│   │   │   └── ResultsView.jsx
│   │   └── ui/
│   │       ├── Notification.jsx
│   │       └── StreakPopup.jsx
│   ├── store/
│   │   └── useAppStore.js     # Zustand store (state.js'in karşılığı)
│   ├── data/
│   │   ├── lectures.js        # Ders listesi sabitleri
│   │   ├── translations.js    # TR/EN çeviriler (genişletilmiş)
│   │   └── messages.js        # Streak mesajları
│   ├── hooks/
│   │   └── useLecture.js      # fetchLectureData hook'u
│   ├── utils/
│   │   ├── engine.js          # prepareActiveQuestions (saf fonksiyon)
│   │   └── formatAnswer.js    # formatAnswerText (saf fonksiyon)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                       # VITE_APP_USERNAME, VITE_APP_PASSWORD
├── .gitignore
├── index.html
├── vite.config.js
└── AGENTS.md
```

---

## 3. Modül Eşleme Tablosu (Eski → Yeni)

| Eski Dosya | Yeni Karşılık | Notlar |
|---|---|---|
| `js/state.js` | `src/store/useAppStore.js` | Zustand store |
| `js/auth.js` | `src/store/useAppStore.js` → `login()` / `logout()` | Store action'ı olarak |
| `js/config.js` | `.env` dosyası | `VITE_APP_USERNAME`, `VITE_APP_PASSWORD` |
| `js/engine.js` | `src/utils/engine.js` | Saf fonksiyon, React bağımsız |
| `js/ui.js` | Bölündü → `components/` altına | Her view ayrı component |
| `js/main.js` | `src/App.jsx` | View routing + event orchestration |
| `js/messages.js` | `src/data/messages.js` | Değişmeden taşınır |
| `js/translations.js` | `src/data/translations.js` | Genişletilmiş (eksik key'ler eklendi) |
| `js/utils/ui-helpers.js` | `src/components/ui/Notification.jsx` | React state ile yönetilir |

---

## 4. Zustand Store Yapısı

```js
// src/store/useAppStore.js
import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // --- STATE ---
  language: 'tr',
  theme: 'dark',
  isLoggedIn: false,
  currentView: 'login',
  // 'login' | 'lectureSelection' | 'modeSelection' | 'sessionSetup'
  // | 'question' | 'learn' | 'readMode' | 'results'
  selectedLectureData: null,
  currentMode: null,          // 'read' | 'quiz' | 'practice' | 'learn'
  activeQuestions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  rangeType: 'all',           // 'all' | 'random' | 'range'
  successStreak: 0,
  failureStreak: 0,
  notification: null,         // { message, type } | null

  // --- ACTIONS ---
  login: (username, password) => {
    const validUser = import.meta.env.VITE_APP_USERNAME;
    const validPass = import.meta.env.VITE_APP_PASSWORD;
    if (username === validUser && password === validPass) {
      set({ isLoggedIn: true, currentView: 'lectureSelection' });
      return true;
    }
    return false;
  },
  logout: () => set({
    isLoggedIn: false,
    currentView: 'login',
    selectedLectureData: null,
    currentMode: null,
    activeQuestions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    successStreak: 0,
    failureStreak: 0,
  }),
  setView: (view) => set({ currentView: view }),
  setLanguage: (lang) => set({ language: lang }),
  setTheme: (theme) => set({ theme }),
  selectLecture: (data) => set({ selectedLectureData: data }),
  setMode: (mode) => set({ currentMode: mode }),
  setRangeType: (type) => set({ rangeType: type }),
  setActiveQuestions: (questions) => set({
    activeQuestions: questions,
    userAnswers: new Array(questions.length).fill(null),
    currentQuestionIndex: 0,
  }),
  answerQuestion: (index, answer) => set((s) => {
    const updated = [...s.userAnswers];
    updated[index] = answer;
    return { userAnswers: updated };
  }),
  nextQuestion: () => set((s) => ({
    currentQuestionIndex: s.currentQuestionIndex + 1,
  })),
  prevQuestion: () => set((s) => ({
    currentQuestionIndex: s.currentQuestionIndex - 1,
  })),
  incrementSuccessStreak: () => set((s) => ({
    successStreak: s.successStreak + 1,
    failureStreak: 0,
  })),
  incrementFailureStreak: () => set((s) => ({
    failureStreak: s.failureStreak + 1,
    successStreak: 0,
  })),
  showNotification: (message, type = 'info') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },
}));

export default useAppStore;
```

---

## 5. Ortam Değişkenleri (.env)

```env
VITE_APP_USERNAME=admin
VITE_APP_PASSWORD=1234
```

> **KURAL:** Şifre/kullanıcı adı asla kaynak kodda hardcode edilmez.
> `import.meta.env.VITE_APP_USERNAME` ile erişilir.
> `.env` dosyası `.gitignore`'a eklenmiş olmalıdır.

---

## 6. Kritik Kurallar (Agent'lar için ZORUNLU)

### 6.1 Kimlik Doğrulama
- Login kontrolü `useAppStore` içindeki `login()` action'ında yapılır
- Karşılaştırma: `import.meta.env.VITE_APP_USERNAME` ve `VITE_APP_PASSWORD`
- Parametre adı asla store dışındaki değişken adıyla çakışmamalı
- `config.js` ve `auth.js` artık kullanılmaz, silinir

### 6.2 Soru Tipleri ve Mod Kısıtlamaları
```
quiz     → SADECE multiple-choice
practice → SADECE multiple-choice
learn    → multiple-choice + short-answer
read     → multiple-choice + short-answer (filtresiz)
```
Bu kural `src/utils/engine.js` içinde korunur, component'larda tekrarlanmaz.

### 6.3 Çeviri Anahtarları (Zorunlu — ikisi de eksikse undefined çıkar)
```js
// translations.js'te her iki dilde de BU ANAHTARLAR OLMALI:
knewItLabel        // "Biliyordum" / "I Knew It"
didntKnowLabel     // "Bilmiyordum" / "Didn't Know"
notAnsweredLabel   // "Cevaplanmadı" / "Not Answered"
yourAnswerLabel    // "Senin" / "Yours"
correctAnswerLabel // "Doğru" / "Correct"
mainTitle          // "LecturePod"
mainSubtitle
selectLecture
readMode, quizMode, practiceMode, learnMode
startSession, finishEarly, reviewMistakes
sessionSetupTitle, backToModes, backToLectures
optAll, optRandom, optRange
loginTitle, loginBtn, errorLogin, successLogin, quitConfirm
```

### 6.4 Component Yazım Kuralları
- Her component kendi klasöründe, `ComponentAdi.jsx` olarak adlandırılır
- Callback prop'ları `on` prefix'i ile: `onAnswer`, `onNext`, `onSelect`
- `useState` yalnızca lokal UI state için (input değerleri, animasyon vs.)
- Global state her zaman `useAppStore`'dan çekilir
- `document.getElementById()` **kesinlikle yasak** — React ref veya state kullan

### 6.5 Tema Sistemi
- CSS değişkenleri `src/index.css`'te `[data-theme="dark"]` ve `[data-theme="light"]` altında tanımlanır
- `App.jsx` içinde `useEffect` ile tema DOM'a yazılır:
  ```js
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  ```

### 6.6 Engine Fonksiyonları (Saf Fonksiyon Kuralı)
`src/utils/engine.js` içindeki fonksiyonlar React'a bağımlı olmamalıdır.
Input olarak `state` nesnesi alır, output olarak filtrelenmiş soru dizisi döner.
`document.getElementById()` içinde **kesinlikle çağrılmaz**.

```js
// Doğru imza:
export function filterQuestions(questions, mode) { ... }
export function selectByRange(questions, rangeType, options) { ... }
```

### 6.7 Vite Config
```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // Relatif path — GitHub Pages / yerel dosya sistemi uyumluluğu
});
```

---

## 7. Migration Adımları (Sıralı)

| # | Adım | Dosyalar |
|---|---|---|
| 1 | Vite projesi oluştur | `npm create vite@latest lecturepod -- --template react` |
| 2 | Bağımlılık ekle | `npm install zustand` |
| 3 | JSON verilerini taşı | `public/data/*.json` |
| 4 | `.env` oluştur, `.gitignore`'a ekle | `.env`, `.gitignore` |
| 5 | Store oluştur | `src/store/useAppStore.js` |
| 6 | Data dosyalarını taşı | `src/data/translations.js`, `messages.js`, `lectures.js` |
| 7 | Util fonksiyonları taşı | `src/utils/engine.js`, `src/utils/formatAnswer.js` |
| 8 | Component'ları yaz | `src/components/**` |
| 9 | App.jsx routing | `src/App.jsx` — `currentView`'e göre render |
| 10 | Global UI bileşenleri | `Notification.jsx`, `StreakPopup.jsx` |
| 11 | CSS taşı | `src/index.css` |
| 12 | Test et | Bkz. Bölüm 8 |

---

## 8. Test Kontrol Listesi

Her migration adımından sonra şunlar kontrol edilmeli:

- [ ] Login: Yanlış şifre → hata notification gösteriyor
- [ ] Login: Doğru şifre → lecture selection'a geçiyor
- [ ] Logout: Tüm state sıfırlanıyor, login ekranına dönüyor
- [ ] Quiz/Practice modunda SADECE multiple-choice geldiği doğrulanıyor
- [ ] Learn/Read modunda short-answer da geldiği doğrulanıyor
- [ ] Rastgele / Aralık / Tümü: Doğru soru sayısı seçiliyor
- [ ] Streak popup: 3 doğru → ateş popup, 2 yanlış → buz popup
- [ ] Sonuç ekranı: `knewItLabel`, `didntKnowLabel`, `notAnsweredLabel` undefined değil
- [ ] Tema toggle: dark ↔ light çalışıyor
- [ ] Dil toggle: TR ↔ EN çalışıyor
- [ ] `formatAnswerText`: tablo, liste, düz metin doğru render ediliyor

---

## 9. Bilinen Eski Buglar (Migration'da Düzeltilmesi ZORUNLU)

| # | Bug | Konum | Düzeltme |
|---|---|---|---|
| 1 | `password === password` her zaman true | `auth.js` | `.env` + store action'ı ile yeniden yaz |
| 2 | `config.js` hiç kullanılmıyor | `auth.js` | `config.js` ve `auth.js` silinir |
| 3 | `knewItLabel`, `didntKnowLabel`, `notAnsweredLabel` eksik | `translations.js` | Her iki dile de eklenir |
| 4 | `state.successMessages` / `state.failureMessages` dead code | `state.js` | Store'a taşınmaz, sadece `messages.js` kullanılır |
| 5 | `engine.js` içinde `document.getElementById()` var | `engine.js` | Saf fonksiyon yapısına geçilir, DOM bağımlılığı kaldırılır |
| 6 | `read` modu setup'ta filtresiz ama engine'de filtre yok | `engine.js` | `read` için ayrı dal eklenir |

---

## 10. Versiyon

| Alan | Değer |
|---|---|
| AGENTS.md Versiyonu | v1.0 |
| Oluşturulma Tarihi | 2026-03-25 |
| Hedef React Versiyonu | 18.x |
| Hedef Vite Versiyonu | 5.x |
| Zustand | 4.x |