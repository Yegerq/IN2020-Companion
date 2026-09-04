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
import { type Locale, topicTitle, ui } from '@/lib/i18n';
import type { User } from '@supabase/supabase-js';

type Screen = 'home' | 'lesson' | 'quiz' | 'result';

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
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const topic = topics[topicIndex];
  const questions = useMemo(() => {
    const items = [...buildQuestionBank(topic)];
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [items[index], items[swap]] = [items[swap], items[index]];
    }
    return items;
  }, [topic, quizRun]);
  const question = questions[questionIndex];

  useEffect(() => {
    const savedLocale = localStorage.getItem('in2020-locale') as Locale | null;
    if (savedLocale && ['ru', 'en', 'no'].includes(savedLocale))
      setLocale(savedLocale);
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
      />
    );

  const correct = selectedAnswer === question.answer;
  const copy = ui[locale];
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#112838]">
      <LearningHeader
        title={topic.title}
        label="Проверка знаний"
        progress={(questionIndex + 1) / questions.length}
        onHome={goHome}
      />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-6 flex items-center justify-between text-sm font-semibold text-slate-500">
          <span>
            {copy.question} {questionIndex + 1} / {questions.length}
          </span>
          <span>
            {answers.filter(Boolean).length} {copy.correct}
          </span>
        </div>
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(18,43,60,.08)] sm:p-9">
          <div className="mb-7 flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e3f5f1] text-[#13877f]">
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
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left text-base leading-6 transition sm:p-5 ${right ? 'border-[#22a495] bg-[#e1f7f1]' : chosen ? 'border-[#e36b60] bg-[#fff0ed]' : 'border-slate-200 bg-white hover:border-[#f2aa35] hover:bg-[#fffaf0]'}`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold">
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
              className={`mt-6 rounded-2xl p-5 ${correct ? 'bg-[#e1f7f1] text-[#075f58]' : 'bg-[#fff0ed] text-[#7f3b36]'}`}
            >
              <p className="font-bold">
                {correct ? 'Верно!' : 'Почти. Посмотри объяснение:'}
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
  user: User | null;
  onAuth: () => void;
  onSignOut: () => void;
  authOpen: boolean;
  onCloseAuth: () => void;
}) {
  const copy = ui[locale];
  const completion = Math.round(
    (completedLessons.length / topics.length) * 100,
  );
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#37352f]">
      <header className="border-b border-[#e8e7e3] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef2ed] text-[#526451]">
              <FlaskConical />
            </span>
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[#778174]">
                UNIVERSITY OF OSLO · IN2020
              </p>
              <h1 className="text-lg font-bold">
                Methods in Interaction Design
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 rounded-xl border border-[#e5e4df] bg-white px-3 py-2 text-sm font-semibold">
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
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e5e4df] bg-white px-3 text-sm font-semibold hover:bg-[#f4f4f1]"
            >
              <UserRound size={16} />
              {user ? user.email?.split('@')[0] : copy.signIn}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <section className="grid gap-8 rounded-[24px] border border-[#e3e2dd] bg-white p-7 shadow-[0_8px_30px_rgba(55,53,47,.06)] sm:p-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#7d8979]">
              {copy.map}
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {copy.headline}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6b6963]">
              {copy.intro}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-[#f4f5f1] p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-[#77746d]">{copy.progress}</p>
                <p className="mt-1 text-4xl font-bold">{completion}%</p>
              </div>
              <Target className="text-[#7b9078]" size={38} />
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#deded8]">
              <div
                className="h-full rounded-full bg-[#81947e] transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[#77746d]">
              {completedLessons.length} / {topics.length} {copy.studied}
            </p>
          </div>
        </section>
        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-[#7d8979]">
              16 тем · {totalQuestionCount} вопросов
            </p>
            <h2 className="mt-2 text-3xl font-bold">{copy.choose}</h2>
          </div>
          <p className="hidden max-w-md text-right text-sm leading-6 text-slate-400 md:block">
            Жёлтая кнопка открывает тест сразу — проходить лекцию перед этим
            необязательно.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic, index) => {
            const score = bestScores[index] ?? 0;
            const questionCount = questionCountForTopic(topic);
            return (
              <article
                key={topic.id}
                className="group flex min-h-[320px] flex-col rounded-[20px] border border-[#e3e2dd] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#c9cec5] hover:shadow-[0_10px_30px_rgba(55,53,47,.08)]"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f1f3ee] font-bold text-[#657362]">
                    {String(topic.chapter).padStart(2, '0')}
                  </span>
                  {completedLessons.includes(index) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#65d7c7]/15 px-3 py-1 text-xs font-bold text-[#65d7c7]">
                      <Check size={14} />
                      Изучено
                    </span>
                  )}
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-slate-400">
                  {topic.english}
                </p>
                <h3 className="mt-2 text-2xl font-bold leading-8">
                  {topicTitle(index, locale, topic.title, topic.english)}
                </h3>
                <p className="mt-3 line-clamp-3 text-base leading-7 text-[#6f6c65]">
                  {topic.summary}
                </p>
                <div className="mt-auto pt-6">
                  <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={15} />
                      15–25 мин
                    </span>
                    {score > 0 && (
                      <span>
                        Лучший тест: {score}/{questionCount}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onLesson(index)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-3 font-bold text-[#102b3d] hover:bg-slate-100"
                    >
                      <BookOpen size={17} />
                      {copy.study}
                    </button>
                    <button
                      onClick={() => onQuiz(index)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#e9eee6] px-3 font-bold text-[#445141] hover:bg-[#dfe7dc]"
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
        <section className="mt-12 rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-xl font-bold">Источники текущей версии</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-300">
            Структура курса основана на открытых companion-материалах второго
            издания Research Methods in Human–Computer Interaction и
            опубликованном описании заданий IN2020. Дополнительные ориентиры:
            Nielsen Norman Group для usability и heuristic evaluation, Belmont
            Report для исследовательской этики. После загрузки книги профессора
            содержание будет сверено с точным pensum.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <a
              className="rounded-xl bg-white/8 px-4 py-2 text-[#65d7c7] hover:bg-white/12"
              href="https://shop.elsevier.com/books/book-companion/9780128053904"
              target="_blank"
              rel="noreferrer"
            >
              Elsevier Book Companion
            </a>
            <a
              className="rounded-xl bg-white/8 px-4 py-2 text-[#65d7c7] hover:bg-white/12"
              href="https://www.nngroup.com/articles/ten-usability-heuristics/"
              target="_blank"
              rel="noreferrer"
            >
              Nielsen heuristics
            </a>
            <a
              className="rounded-xl bg-white/8 px-4 py-2 text-[#65d7c7] hover:bg-white/12"
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
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-[24px] border border-[#e3e2dd] bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-[#7d8979]">IN2020</p>
            <h2 className="mt-1 text-2xl font-bold">{copy.profile}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-[#77746d]"
          >
            ×
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#77746d]">{copy.sync}</p>
        <div className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder={copy.email}
            className="min-h-12 w-full rounded-xl border border-[#deddd8] px-4 outline-none focus:border-[#879984]"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder={copy.password}
            className="min-h-12 w-full rounded-xl border border-[#deddd8] px-4 outline-none focus:border-[#879984]"
          />
        </div>
        {message && (
          <p className="mt-4 rounded-xl bg-[#f4f5f1] p-3 text-sm text-[#5f5d57]">
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
            className="min-h-12 rounded-xl border border-[#d8d8d2] font-bold disabled:opacity-50"
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
}: {
  topicIndex: number;
  locale: Locale;
  onHome: () => void;
  onQuiz: () => void;
  onComplete: () => void;
}) {
  const topic = topics[topicIndex];
  const copy = ui[locale];
  const sections = buildLectureSections(topic);
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#112838]">
      <LearningHeader
        title={topicTitle(topicIndex, locale, topic.title, topic.english)}
        label={`Лекция ${topic.chapter} из ${topics.length}`}
        progress={0}
        onHome={onHome}
      />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-8 sm:px-8 sm:pt-14">
        <div className="mb-7 flex items-center gap-2 text-sm font-semibold text-[#16877e]">
          <GraduationCap size={18} />
          {topic.english}
        </div>
        <header className="mb-12">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            {topic.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-600">
            {topic.summary}
          </p>
        </header>
        <section className="mb-12 rounded-[28px] bg-[#10364d] p-6 text-white sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#65d7c7]">
            {copy.goal}
          </p>
          <p className="mt-4 text-xl font-semibold leading-8">
            После изучения ты сможешь объяснить ключевые понятия своими словами,
            сравнить альтернативы и обосновать выбор метода в экзаменационном
            кейсе.
          </p>
        </section>
        <article className="space-y-16">
          {sections.map((section, index) => (
            <section
              key={section.heading}
              className="border-b border-slate-200 pb-14 last:border-0"
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-[.14em] text-[#16877e]">
                {String(index + 1).padStart(2, '0')} · {copy.sections}
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {section.heading}
              </h2>
              <div className="mt-7 space-y-6 text-[1.06rem] leading-8 text-slate-700 sm:text-lg sm:leading-9">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </div>
              <aside className="mt-8 border-l-4 border-[#ffb33f] pl-5 text-base font-semibold leading-7 text-slate-700">
                {section.takeaway}
              </aside>
            </section>
          ))}
        </article>
        <section className="mt-14 rounded-[28px] bg-[#e3f5f1] p-6 sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#137d75]">
            Ключевые выводы
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
        <section className="mt-8 rounded-[28px] border border-[#efc472] bg-[#fff7e4] p-6 sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#8e5b00]">
            Подсказка для развёрнутого ответа
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-9">
            {topic.examPrompt}
          </h2>
          <ol className="mt-6 space-y-3 text-base leading-7 text-slate-700">
            <li>
              <b>1. Определи понятие</b> одним точным предложением.
            </li>
            <li>
              <b>2. Объясни механизм:</b> что делает исследователь и какие
              данные получает.
            </li>
            <li>
              <b>3. Сравни альтернативу</b> по преимуществам и ограничениям.
            </li>
            <li>
              <b>4. Примени к кейсу</b> и явно обоснуй решение.
            </li>
          </ol>
        </section>
        <section className="mt-12 rounded-[32px] bg-[#0e3147] p-7 text-center text-white sm:p-10">
          <Sparkles className="mx-auto text-[#ffb33f]" size={32} />
          <h2 className="mt-4 text-3xl font-bold">{copy.ready}</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-slate-300">
            В тесте {questionCountForTopic(topic)} вопросов. После каждого
            ответа появится объяснение, поэтому тест тоже является частью
            обучения.
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
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 font-bold text-slate-700"
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
}: {
  topicIndex: number;
  locale: Locale;
  correct: number;
  total: number;
  onRetry: () => void;
  onHome: () => void;
  onLesson: () => void;
}) {
  const percent = Math.round((correct / total) * 100);
  const passed = percent >= 75;
  return (
    <div className="grid min-h-screen place-items-center bg-[#081d2d] px-4 py-10 text-white">
      <main className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0d2a3e] p-7 text-center shadow-2xl sm:p-12">
        <span
          className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${passed ? 'bg-[#65d7c7] text-[#082237]' : 'bg-[#ffb33f] text-[#082237]'}`}
        >
          {passed ? <Trophy size={38} /> : <Target size={38} />}
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[.15em] text-[#65d7c7]">
          {topics[topicIndex].title}
        </p>
        <h1 className="mt-2 text-4xl font-bold">
          {passed ? 'Тема усвоена' : 'Стоит повторить материал'}
        </h1>
        <p className="mt-5 text-6xl font-bold text-[#ffb33f]">{percent}%</p>
        <p className="mt-2 text-lg text-slate-300">
          {correct} правильных ответов из {total}
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <button
            onClick={onHome}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white/8 px-4 font-bold"
          >
            <Home size={17} />К темам
          </button>
          <button
            onClick={onLesson}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-4 font-bold text-[#102b3d]"
          >
            <BookOpen size={17} />
            Повторить
          </button>
          <button
            onClick={onRetry}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#ffb33f] px-4 font-bold text-[#102b3d]"
          >
            <RotateCcw size={17} />
            Ещё раз
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
}: {
  title: string;
  label: string;
  progress: number;
  onHome: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
        <button
          onClick={onHome}
          aria-label="Вернуться к темам"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-3 text-xs font-bold uppercase tracking-[.1em] text-slate-500">
            <span className="truncate">{label}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#23a697] transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        <p className="hidden max-w-52 truncate text-sm font-bold text-[#123b53] sm:block">
          {title}
        </p>
      </div>
    </header>
  );
}
