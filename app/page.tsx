'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FlaskConical,
  GraduationCap,
  Home,
  ListChecks,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Languages,
  Moon,
  Sun,
  XCircle,
} from 'lucide-react';
import { topics } from '@/lib/course-content';
import {
  buildQuestionBank,
  questionCountForTopic,
  totalQuestionCount,
} from '@/lib/question-bank';
import { buildLectureSections } from '@/lib/lecture-notes';
import { supabase } from '@/lib/supabase';
import { type Locale, ui } from '@/lib/i18n';
import { topicsForLocale } from '@/lib/localized-course';
import type { User } from '@supabase/supabase-js';

type Screen = 'home' | 'lesson' | 'quiz' | 'result';
type Theme = 'light' | 'dark';

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>('home');
  const [topicIndex, setTopicIndex] = useState(0);
  const [quizRun, setQuizRun] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [locale, setLocale] = useState<Locale>('ru');
  const [theme, setTheme] = useState<Theme>('light');
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const courseTopics = useMemo(() => topicsForLocale(locale), [locale]);
  const topic = courseTopics[topicIndex];
  const questions = useMemo(() => {
    const items = [...buildQuestionBank(topic, courseTopics, locale)];
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [items[index], items[swap]] = [items[swap], items[index]];
    }
    return items;
  }, [topic, courseTopics, locale, quizRun]);
  const question = questions[questionIndex];

  useEffect(() => {
    const savedLocale = localStorage.getItem('in2020-locale') as Locale | null;
    if (savedLocale && ['ru', 'en', 'no'].includes(savedLocale))
      setLocale(savedLocale);
    const savedTheme = localStorage.getItem('in2020-theme') as Theme | null;
    const initialTheme =
      savedTheme ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    setTheme(initialTheme);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      const progress = session?.user?.user_metadata?.progress;
      if (progress) {
        setCompletedLessons(progress.completedLessons ?? []);
        setBestScores(progress.bestScores ?? {});
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('in2020-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('in2020-locale', locale);
  }, [locale]);

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => {
      supabase.auth.updateUser({
        data: { progress: { completedLessons, bestScores } },
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [completedLessons, bestScores, user]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('in2020-progress-v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompletedLessons(parsed.completedLessons ?? []);
        setBestScores(parsed.bestScores ?? {});
      }
    } catch {
      /* Progress is optional. */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'in2020-progress-v2',
        JSON.stringify({ completedLessons, bestScores }),
      );
    } catch {
      /* Progress is optional. */
    }
  }, [completedLessons, bestScores]);

  const openLesson = (index: number) => {
    setTopicIndex(index);
    setScreen('lesson');
    window.scrollTo(0, 0);
  };
  const openQuiz = (index: number) => {
    setTopicIndex(index);
    setQuizRun((run) => run + 1);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setScreen('quiz');
    window.scrollTo(0, 0);
  };
  const goHome = () => {
    setScreen('home');
    window.scrollTo(0, 0);
  };

  const submitAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    const isRight = index === question.answer;
    const nextAnswers = [...answers, isRight];
    setSelectedAnswer(index);
    setAnswers(nextAnswers);
    if (isRight) {
      window.setTimeout(() => advanceQuiz(nextAnswers), 420);
    }
  };

  const advanceQuiz = (currentAnswers = answers) => {
    if (questionIndex === questions.length - 1) {
      const finalScore = currentAnswers.filter(Boolean).length;
      setBestScores((scores) => ({
        ...scores,
        [topicIndex]: Math.max(scores[topicIndex] ?? 0, finalScore),
      }));
      setScreen('result');
    } else {
      setQuestionIndex((value) => value + 1);
      setSelectedAnswer(null);
      window.scrollTo(0, 0);
    }
  };

  const nextQuestion = () => advanceQuiz(answers);

  const markLessonComplete = () => {
    setCompletedLessons((items) =>
      items.includes(topicIndex) ? items : [...items, topicIndex],
    );
    goHome();
  };

  if (screen === 'home')
    return (
      <Dashboard
        onLesson={openLesson}
        onQuiz={openQuiz}
        completedLessons={completedLessons}
        bestScores={bestScores}
        locale={locale}
        onLocale={setLocale}
        theme={theme}
        onTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
        user={user}
        onAuth={() => setAuthOpen(true)}
        onSignOut={() => supabase.auth.signOut()}
        authOpen={authOpen}
        onCloseAuth={() => setAuthOpen(false)}
      />
    );
  if (screen === 'lesson')
    return (
      <Lesson
        topicIndex={topicIndex}
        locale={locale}
        onHome={goHome}
        onQuiz={() => openQuiz(topicIndex)}
        onComplete={markLessonComplete}
        theme={theme}
        onTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
      />
    );
  if (screen === 'result')
    return (
      <Result
        topicIndex={topicIndex}
        locale={locale}
        correct={answers.filter(Boolean).length}
        total={questions.length}
        onRetry={() => openQuiz(topicIndex)}
        onHome={goHome}
        onLesson={() => openLesson(topicIndex)}
        theme={theme}
        onTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
      />
    );

  const correct = selectedAnswer === question.answer;
  const copy = ui[locale];
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#112838] transition-colors dark:bg-[#151917] dark:text-[#f2f5f1]">
      <LearningHeader
        title={topic.title}
        label={copy.knowledgeCheck}
        progress={(questionIndex + 1) / questions.length}
        onHome={goHome}
        theme={theme}
        onTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
      />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-6 flex items-center justify-between text-sm font-semibold text-slate-500 dark:text-[#aeb8b0]">
          <span>
            {copy.question} {questionIndex + 1} / {questions.length}
          </span>
          <span>
            {answers.filter(Boolean).length} {copy.correct}
          </span>
        </div>
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(18,43,60,.08)] sm:p-9 dark:border-white/10 dark:bg-[#191e1b]">
          <div className="mb-7 flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e3f5f1] text-[#13877f] dark:bg-[#243b34] dark:text-[#91d7be]">
              <CircleHelp size={22} />
            </span>
            <h1 className="text-xl font-bold leading-8 sm:text-2xl sm:leading-9">
              {question.prompt}
            </h1>
          </div>
          <div className="space-y-3">
            {question.choices.map((choice, index) => {
              const chosen = selectedAnswer === index;
              const right =
                selectedAnswer !== null && index === question.answer;
              return (
                <button
                  key={`${questionIndex}-${choice}`}
                  onClick={() => submitAnswer(index)}
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left text-base leading-6 transition sm:p-5 ${right ? 'border-[#22a495] bg-[#e1f7f1] dark:bg-[#153c35]' : chosen ? 'border-[#e36b60] bg-[#fff0ed] dark:bg-[#3a211f]' : 'border-slate-200 bg-white hover:border-[#f2aa35] hover:bg-[#fffaf0] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'}`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold dark:bg-white/10 dark:text-white">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{choice}</span>
                  {right && (
                    <CheckCircle2 className="shrink-0 text-[#16877e]" />
                  )}
                  {chosen && !right && (
                    <XCircle className="shrink-0 text-[#c8544b]" />
                  )}
                </button>
              );
            })}
          </div>
          {selectedAnswer !== null && (
            <div
              className={`mt-6 rounded-2xl p-5 ${correct ? 'bg-[#e1f7f1] text-[#075f58] dark:bg-[#19362f] dark:text-[#b8ebd8]' : 'bg-[#fff0ed] text-[#7f3b36] dark:bg-[#3a2422] dark:text-[#ffc7c1]'}`}
            >
              <p className="font-bold">
                {correct ? copy.right : copy.wrong}
              </p>
              <p className="mt-2 leading-7">{question.explanation}</p>
            </div>
          )}
        </section>
        <div className="mt-6 flex justify-end">
          {selectedAnswer !== null && (
            <button
              onClick={nextQuestion}
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#123b53] px-6 py-3 font-bold text-white shadow-lg hover:bg-[#19516b]"
            >
              {questionIndex === questions.length - 1 ? copy.result : copy.next}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function Dashboard({
  onLesson,
  onQuiz,
  completedLessons,
  bestScores,
  locale,
  onLocale,
  theme,
  onTheme,
  user,
  onAuth,
  onSignOut,
  authOpen,
  onCloseAuth,
}: {
  onLesson: (index: number) => void;
  onQuiz: (index: number) => void;
  completedLessons: number[];
  bestScores: Record<number, number>;
  locale: Locale;
  onLocale: (locale: Locale) => void;
  theme: Theme;
  onTheme: () => void;
  user: User | null;
  onAuth: () => void;
  onSignOut: () => void;
  authOpen: boolean;
  onCloseAuth: () => void;
}) {
  const copy = ui[locale];
  const courseTopics = topicsForLocale(locale);
  const completion = Math.round(
    (completedLessons.length / courseTopics.length) * 100,
  );
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#37352f] transition-colors dark:bg-[#151917] dark:text-[#f2f5f1]">
      <header className="border-b border-[#e8e7e3] bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#151917]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef2ed] text-[#526451] dark:bg-[#29322d] dark:text-[#91d7be]">
              <FlaskConical />
            </span>
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[#778174] dark:text-[#9ca9a0]">
                UNIVERSITY OF OSLO · IN2020
              </p>
              <h1 className="text-lg font-bold">
                Methods in Interaction Design
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeButton theme={theme} onClick={onTheme} />
            <label className="flex items-center gap-2 rounded-xl border border-[#e5e4df] bg-white px-3 py-2 text-sm font-semibold dark:border-white/10 dark:bg-white/5">
              <Languages size={16} />
              <select
                value={locale}
                onChange={(event) => onLocale(event.target.value as Locale)}
                className="bg-transparent outline-none"
              >
                <option value="ru">RU</option>
                <option value="en">EN</option>
                <option value="no">NO</option>
              </select>
            </label>
            <button
              onClick={user ? onSignOut : onAuth}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e5e4df] bg-white px-3 text-sm font-semibold hover:bg-[#f4f4f1] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <UserRound size={16} />
              {user ? user.email?.split('@')[0] : copy.signIn}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <section className="grid gap-8 rounded-[24px] border border-[#e3e2dd] bg-white p-7 shadow-[0_8px_30px_rgba(55,53,47,.06)] sm:p-10 lg:grid-cols-[1fr_320px] dark:border-white/10 dark:bg-[#1e2421] dark:shadow-[0_18px_60px_rgba(0,0,0,.22)]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#7d8979] dark:text-[#91d7be]">
              {copy.map}
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {copy.headline}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6b6963] dark:text-[#bdc6bf]">
              {copy.intro}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-[#f4f5f1] p-6 dark:bg-[#29302c]">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-[#77746d] dark:text-[#aeb8b0]">{copy.progress}</p>
                <p className="mt-1 text-4xl font-bold">{completion}%</p>
              </div>
              <Target className="text-[#7b9078] dark:text-[#91d7be]" size={38} />
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#deded8] dark:bg-black/25">
              <div
                className="h-full rounded-full bg-[#81947e] transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[#77746d] dark:text-[#aeb8b0]">
              {completedLessons.length} / {courseTopics.length} {copy.studied}
            </p>
          </div>
        </section>
        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-[#7d8979] dark:text-[#91d7be]">
              {copy.topicsAndQuestions(courseTopics.length, totalQuestionCount)}
            </p>
            <h2 className="mt-2 text-3xl font-bold">{copy.choose}</h2>
          </div>
          <p className="hidden max-w-md text-right text-sm leading-6 text-slate-400 md:block dark:text-[#9ca9a0]">
            {copy.quickQuiz}
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courseTopics.map((topic, index) => {
            const score = bestScores[index] ?? 0;
            const questionCount = questionCountForTopic(topic);
            return (
              <article
                key={topic.id}
                className="group flex min-h-[320px] flex-col rounded-[20px] border border-[#e3e2dd] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#c9cec5] hover:shadow-[0_10px_30px_rgba(55,53,47,.08)] dark:border-white/10 dark:bg-[#1e2421] dark:hover:border-[#5f766b] dark:hover:bg-[#222925] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,.24)]"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f1f3ee] font-bold text-[#657362] dark:bg-[#2c3530] dark:text-[#b8c9be]">
                    {String(topic.chapter).padStart(2, '0')}
                  </span>
                  {completedLessons.includes(index) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#65d7c7]/15 px-3 py-1 text-xs font-bold text-[#65d7c7]">
                      <Check size={14} />
                      {copy.completed}
                    </span>
                  )}
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-slate-400 dark:text-[#91a097]">
                  {locale === 'en' ? `IN2020 · Topic ${topic.chapter}` : topic.english}
                </p>
                <h3 className="mt-2 text-2xl font-bold leading-8">
                  {topic.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-base leading-7 text-[#6f6c65] dark:text-[#b9c2bc]">
                  {topic.summary}
                </p>
                <div className="mt-auto pt-6">
                  <div className="mb-3 flex items-center justify-between text-sm text-slate-400 dark:text-[#98a59d]">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={15} />
                      {copy.minutes}
                    </span>
                    {score > 0 && (
                      <span>
                        {copy.best}: {score}/{questionCount}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onLesson(index)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-3 font-bold text-[#102b3d] hover:bg-slate-100 dark:bg-[#303934] dark:text-[#edf3ee] dark:hover:bg-[#39453f]"
                    >
                      <BookOpen size={17} />
                      {copy.study}
                    </button>
                    <button
                      onClick={() => onQuiz(index)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#e9eee6] px-3 font-bold text-[#445141] hover:bg-[#dfe7dc] dark:bg-[#28473d] dark:text-[#bcebd9] dark:hover:bg-[#31584b]"
                    >
                      <ListChecks size={17} />
                      {copy.test} · {questionCount}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <section className="mt-12 rounded-[28px] border border-[#e3e2dd] bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-[#1e2421]">
          <h2 className="text-xl font-bold">{copy.sources}</h2>
          <p className="mt-2 max-w-3xl leading-7 text-[#6f6c65] dark:text-[#b9c2bc]">
            {copy.sourceNote}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <a
              className="rounded-xl bg-[#eef2ed] px-4 py-2 text-[#526451] hover:bg-[#e4ebe2] dark:bg-white/6 dark:text-[#91d7be] dark:hover:bg-white/10"
              href="https://shop.elsevier.com/books/book-companion/9780128053904"
              target="_blank"
              rel="noreferrer"
            >
              Elsevier Book Companion
            </a>
            <a
              className="rounded-xl bg-[#eef2ed] px-4 py-2 text-[#526451] hover:bg-[#e4ebe2] dark:bg-white/6 dark:text-[#91d7be] dark:hover:bg-white/10"
              href="https://www.nngroup.com/articles/ten-usability-heuristics/"
              target="_blank"
              rel="noreferrer"
            >
              Nielsen heuristics
            </a>
            <a
              className="rounded-xl bg-[#eef2ed] px-4 py-2 text-[#526451] hover:bg-[#e4ebe2] dark:bg-white/6 dark:text-[#91d7be] dark:hover:bg-white/10"
              href="https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/"
              target="_blank"
              rel="noreferrer"
            >
              Belmont Report
            </a>
          </div>
        </section>
      </main>
      {authOpen && <AuthDialog locale={locale} onClose={onCloseAuth} />}
    </div>
  );
}

function AuthDialog({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  const copy = ui[locale];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const authenticate = async (mode: 'login' | 'signup') => {
    setBusy(true);
    setMessage('');
    const result =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (result.data.session) onClose();
    else
      setMessage(
        locale === 'ru'
          ? 'Проверьте почту для подтверждения аккаунта.'
          : locale === 'no'
            ? 'Sjekk e-posten for å bekrefte kontoen.'
            : 'Check your email to confirm the account.',
      );
  };
  const authenticateWithGoogle = async () => {
    setBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-[24px] border border-[#e3e2dd] bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#191e1b] dark:text-[#edf1ec]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-[#7d8979] dark:text-[#91d7be]">IN2020</p>
            <h2 className="mt-1 text-2xl font-bold">{copy.profile}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-[#77746d] dark:text-[#b9c2bc]"
          >
            ×
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#77746d] dark:text-[#b9c2bc]">{copy.sync}</p>
        <button
          disabled={busy}
          onClick={authenticateWithGoogle}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#deddd8] bg-white px-4 font-bold text-[#37352f] transition hover:bg-[#f7f7f5] disabled:opacity-50 dark:border-white/15 dark:bg-white/7 dark:text-[#f2f5f1] dark:hover:bg-white/12"
        >
          <GoogleMark />
          {copy.continueGoogle}
        </button>
        <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.12em] text-[#8a8983] dark:text-[#929f97]">
          <span className="h-px flex-1 bg-[#e5e4df] dark:bg-white/10" />
          {copy.or}
          <span className="h-px flex-1 bg-[#e5e4df] dark:bg-white/10" />
        </div>
        <div className="space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder={copy.email}
            className="min-h-12 w-full rounded-xl border border-[#deddd8] bg-transparent px-4 outline-none focus:border-[#879984] dark:border-white/15"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder={copy.password}
            className="min-h-12 w-full rounded-xl border border-[#deddd8] bg-transparent px-4 outline-none focus:border-[#879984] dark:border-white/15"
          />
        </div>
        {message && (
          <p className="mt-4 rounded-xl bg-[#f4f5f1] p-3 text-sm text-[#5f5d57] dark:bg-white/6 dark:text-[#d4dbd6]">
            {message}
          </p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            disabled={busy}
            onClick={() => authenticate('login')}
            className="min-h-12 rounded-xl bg-[#4f5f4c] font-bold text-white disabled:opacity-50"
          >
            {copy.login}
          </button>
          <button
            disabled={busy}
            onClick={() => authenticate('signup')}
            className="min-h-12 rounded-xl border border-[#d8d8d2] font-bold disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/5"
          >
            {copy.signup}
          </button>
        </div>
      </div>
    </div>
  );
}

function Lesson({
  topicIndex,
  locale,
  onHome,
  onQuiz,
  onComplete,
  theme,
  onTheme,
}: {
  topicIndex: number;
  locale: Locale;
  onHome: () => void;
  onQuiz: () => void;
  onComplete: () => void;
  theme: Theme;
  onTheme: () => void;
}) {
  const courseTopics = topicsForLocale(locale);
  const topic = courseTopics[topicIndex];
  const copy = ui[locale];
  const sections = buildLectureSections(topic, locale);
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#112838] transition-colors dark:bg-[#151917] dark:text-[#f2f5f1]">
      <LearningHeader
        title={topic.title}
        label={copy.lecture(topic.chapter, courseTopics.length)}
        progress={0}
        onHome={onHome}
        theme={theme}
        onTheme={onTheme}
      />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
        <div className="mb-7 flex items-center gap-2 text-sm font-semibold text-[#16877e] dark:text-[#91d7be]">
          <GraduationCap size={18} />
          {topic.english}
        </div>
        <header className="mb-12">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            {topic.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-600 dark:text-slate-300">
            {topic.summary}
          </p>
        </header>
        <section className="mb-12 rounded-[28px] bg-[#10364d] p-6 text-white sm:p-9 dark:border dark:border-white/10 dark:bg-[#1d302a]">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#65d7c7]">
            {copy.goal}
          </p>
          <p className="mt-4 text-xl font-semibold leading-8">
            {copy.learningGoal}
          </p>
        </section>
        <article className="space-y-16">
          {sections.map((section, index) => (
            <section
              key={section.heading}
              className="border-b border-slate-200 pb-14 last:border-0 dark:border-white/10"
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-[.14em] text-[#16877e] dark:text-[#91d7be]">
                {String(index + 1).padStart(2, '0')} · {copy.sections}
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {section.heading}
              </h2>
              <div className="mt-7 space-y-6 text-[1.06rem] leading-8 text-slate-700 sm:text-lg sm:leading-9 dark:text-slate-300">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
              <aside className="mt-8 border-l-4 border-[#ffb33f] pl-5 text-base font-semibold leading-7 text-slate-700 dark:text-slate-200">
                {section.takeaway}
              </aside>
            </section>
          ))}
        </article>
        <section className="mt-14 rounded-[28px] bg-[#e3f5f1] p-6 sm:p-9 dark:border dark:border-[#315a4d] dark:bg-[#1b322b] dark:text-[#eaf5ef]">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#137d75] dark:text-[#91d7be]">
            {copy.keyTakeaways}
          </p>
          <ul className="mt-5 space-y-4">
            {topic.keyPoints.map((point) => (
              <li key={point} className="flex gap-3 text-lg leading-8">
                <CheckCircle2
                  className="mt-1 shrink-0 text-[#159087]"
                  size={21}
                />
                {point}
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-8 rounded-[28px] border border-[#efc472] bg-[#fff7e4] p-6 sm:p-9 dark:border-[#66522d] dark:bg-[#2d281d] dark:text-[#f4ead3]">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#8e5b00] dark:text-[#e9bd72]">
            {copy.examGuide}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-9">
            {topic.examPrompt}
          </h2>
          <ol className="mt-6 space-y-3 text-base leading-7 text-slate-700 dark:text-slate-200">
            {copy.answerSteps.map((step, index) => <li key={step}><b>{index + 1}.</b> {step}</li>)}
          </ol>
        </section>
        <section className="mt-12 rounded-[32px] bg-[#0e3147] p-7 text-center text-white sm:p-10">
          <Sparkles className="mx-auto text-[#ffb33f]" size={32} />
          <h2 className="mt-4 text-3xl font-bold">{copy.ready}</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-slate-300">
            {copy.quizLearning(questionCountForTopic(topic))}
          </p>
          <button
            onClick={onQuiz}
            className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-[#ffb33f] px-7 py-4 font-bold text-[#102b3d] hover:bg-[#f4a72d]"
          >
            {copy.start}
            <ListChecks size={19} />
          </button>
        </section>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <button
            onClick={onHome}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
          >
            <ArrowLeft size={18} />
            {copy.exit}
          </button>
          <button
            onClick={onComplete}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#16877e] px-5 font-bold text-white"
          >
            <CheckCircle2 size={19} />
            {copy.complete}
          </button>
        </div>
      </main>
    </div>
  );
}

function Result({
  topicIndex,
  locale,
  correct,
  total,
  onRetry,
  onHome,
  onLesson,
  theme,
  onTheme,
}: {
  topicIndex: number;
  locale: Locale;
  correct: number;
  total: number;
  onRetry: () => void;
  onHome: () => void;
  onLesson: () => void;
  theme: Theme;
  onTheme: () => void;
}) {
  const percent = Math.round((correct / total) * 100);
  const passed = percent >= 75;
  const copy = ui[locale];
  const resultTopic = topicsForLocale(locale)[topicIndex];
  return (
    <div className="grid min-h-screen place-items-center bg-[#081d2d] px-4 py-10 text-white">
      <main className="relative w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0d2a3e] p-7 text-center shadow-2xl sm:p-12">
        <div className="absolute right-5 top-5"><ThemeButton theme={theme} onClick={onTheme} /></div>
        <span
          className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${passed ? 'bg-[#65d7c7] text-[#082237]' : 'bg-[#ffb33f] text-[#082237]'}`}
        >
          {passed ? <Trophy size={38} /> : <Target size={38} />}
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[.15em] text-[#65d7c7]">
          {resultTopic.title}
        </p>
        <h1 className="mt-2 text-4xl font-bold">
          {passed ? copy.mastered : copy.review}
        </h1>
        <p className="mt-5 text-6xl font-bold text-[#ffb33f]">{percent}%</p>
        <p className="mt-2 text-lg text-slate-300">
          {copy.correctOf(correct, total)}
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <button
            onClick={onHome}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white/8 px-4 font-bold"
          >
            <Home size={17} />{copy.back}
          </button>
          <button
            onClick={onLesson}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-4 font-bold text-[#102b3d]"
          >
            <BookOpen size={17} />
            {copy.repeatLesson}
          </button>
          <button
            onClick={onRetry}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#ffb33f] px-4 font-bold text-[#102b3d]"
          >
            <RotateCcw size={17} />
            {copy.retry}
          </button>
        </div>
      </main>
    </div>
  );
}

function LearningHeader({
  title,
  label,
  progress,
  onHome,
  theme,
  onTheme,
}: {
  title: string;
  label: string;
  progress: number;
  onHome: () => void;
  theme: Theme;
  onTheme: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#151917]/95">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
        <button
          onClick={onHome}
          aria-label="Back to topics"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/7 dark:text-[#dce4de] dark:hover:bg-white/12"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-3 text-xs font-bold uppercase tracking-[.1em] text-slate-500 dark:text-[#aeb8b0]">
            <span className="truncate">{label}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[#23a697] transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        <p className="hidden max-w-52 truncate text-sm font-bold text-[#123b53] sm:block dark:text-[#e2e8e3]">
          {title}
        </p>
        <ThemeButton theme={theme} onClick={onTheme} />
      </div>
    </header>
  );
}

function ThemeButton({ theme, onClick }: { theme: Theme; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
      title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e5e4df] bg-white text-[#5d665a] transition hover:bg-[#f4f4f1] dark:border-white/10 dark:bg-white/5 dark:text-[#dce6dc] dark:hover:bg-white/10"
    >
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.04H12v3.86h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.35Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.42l-3.25-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.9A6 6 0 0 1 6.07 12c0-.66.11-1.3.32-1.9V7.51H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.49l3.35-2.59Z" />
      <path fill="#EA4335" d="M12 5.97c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.51l3.35 2.59C7.18 7.73 9.39 5.97 12 5.97Z" />
    </svg>
  );
}
