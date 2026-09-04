import type { CourseTopic, QuizQuestion } from './course-content';
import { topics } from './course-content';
import { deepDives } from './deep-dives';
import { buildLectureSections } from './lecture-notes';
import type { Locale } from './i18n';

const firstSentence = (text: string) =>
  text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? text;

const rotate = <T>(items: T[], start: number, count: number) => {
  const result: T[] = [];
  for (let index = 0; index < count; index += 1)
    result.push(items[(start + index) % items.length]);
  return result;
};

const shuffledChoices = (
  correct: string,
  distractors: string[],
  seed: number,
) => {
  const unique = [
    correct,
    ...distractors.filter((item) => item !== correct),
  ].slice(0, 4);
  const offset = seed % unique.length;
  const choices = rotate(unique, offset, unique.length);
  return { choices, answer: choices.indexOf(correct) };
};

export function buildQuestionBank(topic: CourseTopic, courseTopics: CourseTopic[] = topics, locale: Locale = 'ru'): QuizQuestion[] {
  const topicIndex = courseTopics.findIndex((item) => item.id === topic.id);
  const otherTopics = courseTopics.filter((item) => item.id !== topic.id);
  const sections = buildLectureSections(topic, locale).flatMap((section) =>
    section.paragraphs.map((body, paragraphIndex) => ({
      heading: section.heading,
      body,
    })),
  );
  const allSections = (item: CourseTopic) =>
    locale === 'ru'
      ? [...item.sections, ...(deepDives[item.id] ?? [])]
      : item.sections;
  const otherBodies = otherTopics.flatMap((item) =>
    allSections(item).map((section) => firstSentence(section.body)),
  );
  const otherHeadings = otherTopics.flatMap((item) =>
    allSections(item).map((section) => section.heading),
  );
  const otherPoints = otherTopics.flatMap((item) => item.keyPoints);
  const questions: QuizQuestion[] = [...topic.quiz];
  const words = locale === 'en' ? {
    explain: (h: string) => `Which explanation best describes “${h}”?`,
    belongs: (body: string) => `Which concept does this statement describe: “${body}”`,
    belongsAnswer: (h: string) => `It belongs to the section “${h}”.`,
    apply: (t: string) => `A researcher is working with “${t}”. Which recommendation should they apply?`,
    principle: (p: string) => `Key principle: ${p}.`,
    truePrinciple: (t: string) => `Which principle genuinely belongs to “${t}”?`,
    whichTopic: (p: string) => `For which topic is the recommendation “${p}” especially relevant?`,
    topicAnswer: (t: string) => `The recommendation belongs to “${t}”.`,
    exam: (h: string) => `Which conclusion is strongest in an exam answer about “${h}”?`,
    courseTopic: (h: string) => `Which course topic covers “${h}”?`,
    part: (t: string) => `This is part of “${t}”.`,
  } : locale === 'no' ? {
    explain: (h: string) => `Hvilken forklaring beskriver «${h}» best?`,
    belongs: (body: string) => `Hvilket begrep beskriver denne påstanden: «${body}»`,
    belongsAnswer: (h: string) => `Den hører til delen «${h}».`,
    apply: (t: string) => `En forsker arbeider med «${t}». Hvilken anbefaling bør brukes?`,
    principle: (p: string) => `Nøkkelprinsipp: ${p}.`,
    truePrinciple: (t: string) => `Hvilket prinsipp hører faktisk til «${t}»?`,
    whichTopic: (p: string) => `For hvilket tema er anbefalingen «${p}» særlig relevant?`,
    topicAnswer: (t: string) => `Anbefalingen hører til «${t}».`,
    exam: (h: string) => `Hvilken konklusjon er sterkest i et eksamenssvar om «${h}»?`,
    courseTopic: (h: string) => `Hvilket kurstema dekker «${h}»?`,
    part: (t: string) => `Dette er en del av «${t}».`,
  } : {
    explain: (h: string) => `Какое объяснение точнее всего раскрывает «${h}»?`,
    belongs: (body: string) => `К какому понятию относится утверждение: «${body}»`,
    belongsAnswer: (h: string) => `Это относится к блоку «${h}».`,
    apply: (t: string) => `Исследователь работает с темой «${t}». Какую рекомендацию ему следует применить?`,
    principle: (p: string) => `Ключевой принцип: ${p}.`,
    truePrinciple: (t: string) => `Какой принцип действительно относится к теме «${t}»?`,
    whichTopic: (p: string) => `Для какой темы особенно важна рекомендация «${p}»?`,
    topicAnswer: (t: string) => `Рекомендация относится к теме «${t}».`,
    exam: (h: string) => `Какой вывод лучше использовать в экзаменационном ответе о «${h}»?`,
    courseTopic: (h: string) => `В какой теме курса разбирается «${h}»?`,
    part: (t: string) => `Это часть темы «${t}».`,
  };

  sections.forEach((section, sectionIndex) => {
    const body = firstSentence(section.body);
    const definition = shuffledChoices(
      body,
      rotate(otherBodies, topicIndex * 3 + sectionIndex, 3),
      sectionIndex + topicIndex,
    );
    questions.push({
      prompt: words.explain(section.heading),
      choices: definition.choices,
      answer: definition.answer,
      explanation: body,
    });

    const heading = shuffledChoices(
      section.heading,
      rotate(otherHeadings, topicIndex * 4 + sectionIndex, 3),
      sectionIndex + 2,
    );
    questions.push({
      prompt: words.belongs(body),
      choices: heading.choices,
      answer: heading.answer,
      explanation: words.belongsAnswer(section.heading),
    });

    const application = shuffledChoices(
      topic.keyPoints[sectionIndex % topic.keyPoints.length],
      rotate(otherPoints, topicIndex * 5 + sectionIndex, 3),
      sectionIndex + 1,
    );
    questions.push({
      prompt: words.apply(topic.title),
      choices: application.choices,
      answer: application.answer,
      explanation: words.principle(topic.keyPoints[sectionIndex % topic.keyPoints.length]),
    });
  });

  topic.keyPoints.forEach((point, pointIndex) => {
    const principle = shuffledChoices(
      point,
      rotate(otherPoints, topicIndex * 7 + pointIndex, 3),
      pointIndex + topicIndex + 1,
    );
    questions.push({
      prompt: words.truePrinciple(topic.title),
      choices: principle.choices,
      answer: principle.answer,
      explanation: point,
    });

    const titles = shuffledChoices(
      topic.title,
      rotate(
        otherTopics.map((item) => item.title),
        topicIndex + pointIndex,
        3,
      ),
      pointIndex + 2,
    );
    questions.push({
      prompt: words.whichTopic(point),
      choices: titles.choices,
      answer: titles.answer,
      explanation: words.topicAnswer(topic.title),
    });
  });

  sections.forEach((section, sectionIndex) => {
    const correct = firstSentence(section.body);
    const choices = shuffledChoices(
      correct,
      rotate(otherBodies, topicIndex * 9 + sectionIndex + 5, 3),
      topicIndex + sectionIndex + 3,
    );
    questions.push({
      prompt: words.exam(section.heading),
      choices: choices.choices,
      answer: choices.answer,
      explanation: correct,
    });

    const topicChoice = shuffledChoices(
      topic.title,
      rotate(
        otherTopics.map((item) => item.title),
        topicIndex * 2 + sectionIndex + 4,
        3,
      ),
      topicIndex + sectionIndex,
    );
    questions.push({
      prompt: words.courseTopic(section.heading),
      choices: topicChoice.choices,
      answer: topicChoice.answer,
      explanation: words.part(topic.title),
    });
  });

  return questions.slice(0, questionCountForTopic(topic));
}

const questionCounts = [
  22, 27, 31, 29, 25, 24, 26, 32, 28, 35, 30, 23, 27, 33, 26, 24,
];

export const questionCountForTopic = (topic: CourseTopic) =>
  questionCounts[
    Math.max(
      0,
      topics.findIndex((item) => item.id === topic.id),
    )
  ];

export const totalQuestionCount = topics.reduce(
  (sum, topic) => sum + questionCountForTopic(topic),
  0,
);
