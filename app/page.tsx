'use client';

import { useMemo, useState } from 'react';
import { BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, FlaskConical, ListChecks, RotateCcw, XCircle } from 'lucide-react';
import { topics, totalQuestions } from '@/lib/course-content';

type View = 'study' | 'quiz';

export default function Home() {
  const [topicIndex, setTopicIndex] = useState(0);
  const [view, setView] = useState<View>('study');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const topic = topics[topicIndex];
  const question = topic.quiz[questionIndex];
  const progress = Math.round((completed.length / topics.length) * 100);
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.answer;
  const quizProgress = useMemo(() => `${questionIndex + 1} / ${topic.quiz.length}`, [questionIndex, topic.quiz.length]);

  const chooseTopic = (index: number) => {
    setTopicIndex(index);
    setView('study');
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
  };

  const answerQuestion = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    if (index === question.answer) setScore((value) => value + 1);
  };

  const nextQuestion = () => {
    if (questionIndex < topic.quiz.length - 1) {
      setQuestionIndex((value) => value + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#071b2b] text-slate-100">
      <header className="border-b border-white/10 bg-[#071b2b]/95">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ffb23e] text-[#071b2b]"><FlaskConical size={22} /></div>
            <div><p className="text-sm font-bold tracking-[.12em] text-[#ffb23e]">IN2020</p><h1 className="text-lg font-bold">Exam Companion</h1></div>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="rounded-full bg-white/8 px-4 py-2"><b>{topics.length}</b> тем</span>
            <span className="rounded-full bg-white/8 px-4 py-2"><b>{totalQuestions}</b> вопросов</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 lg:grid-cols-[310px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-3xl border border-white/10 bg-[#0c2638] p-3 lg:sticky lg:top-5 lg:h-[calc(100vh-40px)] lg:overflow-y-auto">
          <div className="mb-3 px-3 pt-2">
            <div className="mb-2 flex justify-between text-sm"><span className="text-slate-400">Пройдено</span><b>{progress}%</b></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#65d7c7] transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
          <nav className="space-y-1" aria-label="Темы курса">
            {topics.map((item, index) => (
              <button key={item.id} onClick={() => chooseTopic(index)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${topicIndex === index ? 'bg-[#19506b] text-white' : 'text-slate-300 hover:bg-white/5'}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-bold ${completed.includes(index) ? 'bg-[#65d7c7] text-[#071b2b]' : 'bg-white/10'}`}>{completed.includes(index) ? <Check size={16} /> : String(item.chapter).padStart(2, '0')}</span>
                <span className="min-w-0"><span className="block text-sm font-semibold">{item.title}</span><span className="block truncate text-xs text-slate-400">{item.english}</span></span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400"><span>Глава {topic.chapter}</span><ChevronRight size={15} /><span>{topic.english}</span></div>
            <div className="flex rounded-xl bg-white/8 p-1" role="tablist" aria-label="Режим изучения">
              <button onClick={() => setView('study')} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${view === 'study' ? 'bg-[#f7f6f0] text-[#102737]' : 'text-slate-300'}`}><BookOpen size={16} />Материал</button>
              <button onClick={() => { setView('quiz'); setQuestionIndex(0); setSelectedAnswer(null); setScore(0); }} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${view === 'quiz' ? 'bg-[#f7f6f0] text-[#102737]' : 'text-slate-300'}`}><ListChecks size={16} />Тест</button>
            </div>
          </div>

          {view === 'study' ? (
            <article className="rounded-3xl bg-[#f7f6f0] p-6 text-[#102737] shadow-2xl sm:p-9">
              <div className="border-b border-slate-200 pb-7"><p className="text-sm font-bold uppercase tracking-[.15em] text-[#148d85]">Учебный материал</p><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{topic.title}</h2><p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">{topic.summary}</p></div>
              <div className="mt-8 grid gap-5 xl:grid-cols-3">
                {topic.sections.map((section, index) => <section key={section.heading} className="rounded-2xl border border-[#d9e2e1] bg-white p-5"><span className="mb-4 grid h-8 w-8 place-items-center rounded-xl bg-[#e1f4f0] text-sm font-bold text-[#147c75]">{index + 1}</span><h3 className="text-xl font-bold">{section.heading}</h3><p className="mt-3 text-base leading-7 text-slate-600">{section.body}</p></section>)}
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
                <section className="rounded-2xl bg-[#102f43] p-6 text-white"><h3 className="text-sm font-bold uppercase tracking-[.14em] text-[#65d7c7]">Запомнить</h3><ul className="mt-4 space-y-3">{topic.keyPoints.map((point) => <li key={point} className="flex gap-3 text-base leading-6"><CheckCircle2 className="mt-0.5 shrink-0 text-[#65d7c7]" size={19} />{point}</li>)}</ul></section>
                <section className="rounded-2xl border border-[#efc472] bg-[#fff6df] p-6"><h3 className="text-sm font-bold uppercase tracking-[.14em] text-[#936000]">Экзаменационная тренировка</h3><p className="mt-4 text-lg font-semibold leading-7">{topic.examPrompt}</p><button onClick={() => { setView('quiz'); setQuestionIndex(0); setSelectedAnswer(null); setScore(0); }} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ffb23e] px-5 py-3 text-sm font-bold text-[#102737] hover:bg-[#f2a52b]">Пройти тест <ChevronRight size={17} /></button></section>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
                <button disabled={topicIndex === 0} onClick={() => chooseTopic(topicIndex - 1)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-slate-600 disabled:opacity-30"><ChevronLeft size={18} />Предыдущая</button>
                <button onClick={() => setCompleted((items) => items.includes(topicIndex) ? items.filter((item) => item !== topicIndex) : [...items, topicIndex])} className={`rounded-xl px-5 py-3 font-bold ${completed.includes(topicIndex) ? 'bg-[#dff5ef] text-[#0a6d65]' : 'bg-[#102f43] text-white'}`}>{completed.includes(topicIndex) ? 'Тема изучена ✓' : 'Отметить изученной'}</button>
                <button disabled={topicIndex === topics.length - 1} onClick={() => chooseTopic(topicIndex + 1)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-slate-600 disabled:opacity-30">Следующая<ChevronRight size={18} /></button>
              </div>
            </article>
          ) : (
            <article className="rounded-3xl bg-[#f7f6f0] p-6 text-[#102737] shadow-2xl sm:p-9">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6"><div><p className="text-sm font-bold uppercase tracking-[.15em] text-[#148d85]">Тест по теме</p><h2 className="mt-2 text-2xl font-bold">{topic.title}</h2></div><div className="rounded-2xl bg-[#e5f1ef] px-4 py-3 text-center"><p className="text-xs font-semibold text-slate-500">Вопрос</p><b className="text-lg">{quizProgress}</b></div></div>
              <div className="mx-auto max-w-3xl py-9"><div className="mb-6 flex gap-3"><CircleHelp className="mt-1 shrink-0 text-[#148d85]" /><h3 className="text-2xl font-bold leading-9">{question.prompt}</h3></div><div className="space-y-3">{question.choices.map((choice, index) => { const chosen = selectedAnswer === index; const correct = answered && index === question.answer; return <button key={choice} onClick={() => answerQuestion(index)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-base transition ${correct ? 'border-[#27a396] bg-[#dcf5ef]' : chosen ? 'border-[#d96960] bg-[#fff0ed]' : 'border-slate-200 bg-white hover:border-[#ffb23e]'}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 font-bold">{String.fromCharCode(65 + index)}</span><span className="flex-1">{choice}</span>{correct && <CheckCircle2 className="text-[#17877e]" />}{chosen && !correct && <XCircle className="text-[#c4564f]" />}</button>; })}</div>
                {answered && <div className={`mt-5 rounded-2xl p-5 ${isCorrect ? 'bg-[#dcf5ef] text-[#075e57]' : 'bg-[#fff0ed] text-[#813b36]'}`}><p className="font-bold">{isCorrect ? 'Верно' : 'Неверно'}</p><p className="mt-1 leading-7">{question.explanation}</p></div>}
                <div className="mt-6 flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">Результат: {score} / {topic.quiz.length}</span>{answered && questionIndex < topic.quiz.length - 1 ? <button onClick={nextQuestion} className="inline-flex items-center gap-2 rounded-xl bg-[#102f43] px-5 py-3 font-bold text-white">Следующий вопрос<ChevronRight size={17} /></button> : answered ? <button onClick={() => { setQuestionIndex(0); setSelectedAnswer(null); setScore(0); }} className="inline-flex items-center gap-2 rounded-xl bg-[#ffb23e] px-5 py-3 font-bold"><RotateCcw size={17} />Пройти заново</button> : null}</div>
              </div>
            </article>
          )}
          <p className="mt-4 px-2 text-sm leading-6 text-slate-400">Предварительный курс по структуре открытых companion-материалов Lazar, Feng & Hochheiser. После получения книги профессора содержание будет сверено с точным pensum IN2020.</p>
        </section>
      </div>
    </main>
  );
}
