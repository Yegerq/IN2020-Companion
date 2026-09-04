import type { CourseTopic, QuizQuestion } from './course-content';
import { topics } from './course-content';
import { deepDives } from './deep-dives';
import { buildLectureSections } from './lecture-notes';

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

export function buildQuestionBank(topic: CourseTopic): QuizQuestion[] {
  const topicIndex = topics.findIndex((item) => item.id === topic.id);
  const otherTopics = topics.filter((item) => item.id !== topic.id);
  const sections = buildLectureSections(topic).flatMap((section) =>
    section.paragraphs.map((body, paragraphIndex) => ({
      heading:
        paragraphIndex === 0
          ? section.heading
          : `${section.heading}: аспект ${paragraphIndex + 1}`,
      body,
    })),
  );
  const allSections = (item: CourseTopic) => [
    ...item.sections,
    ...(deepDives[item.id] ?? []),
  ];
  const otherBodies = otherTopics.flatMap((item) =>
    allSections(item).map((section) => firstSentence(section.body)),
  );
  const otherHeadings = otherTopics.flatMap((item) =>
    allSections(item).map((section) => section.heading),
  );
  const otherPoints = otherTopics.flatMap((item) => item.keyPoints);
  const questions: QuizQuestion[] = [...topic.quiz];

  sections.forEach((section, sectionIndex) => {
    const body = firstSentence(section.body);
    const definition = shuffledChoices(
      body,
      rotate(otherBodies, topicIndex * 3 + sectionIndex, 3),
      sectionIndex + topicIndex,
    );
    questions.push({
      prompt: `Какое объяснение точнее всего раскрывает «${section.heading}»?`,
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
      prompt: `К какому понятию относится утверждение: «${body}»`,
      choices: heading.choices,
      answer: heading.answer,
      explanation: `Это относится к блоку «${section.heading}».`,
    });

    const application = shuffledChoices(
      topic.keyPoints[sectionIndex % topic.keyPoints.length],
      rotate(otherPoints, topicIndex * 5 + sectionIndex, 3),
      sectionIndex + 1,
    );
    questions.push({
      prompt: `Исследователь работает с темой «${topic.title}». Какую рекомендацию ему следует применить?`,
      choices: application.choices,
      answer: application.answer,
      explanation: `Ключевой принцип: ${topic.keyPoints[sectionIndex % topic.keyPoints.length]}.`,
    });
  });

  topic.keyPoints.forEach((point, pointIndex) => {
    const principle = shuffledChoices(
      point,
      rotate(otherPoints, topicIndex * 7 + pointIndex, 3),
      pointIndex + topicIndex + 1,
    );
    questions.push({
      prompt: `Какой принцип действительно относится к теме «${topic.title}»?`,
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
      prompt: `Для какой темы особенно важна рекомендация «${point}»?`,
      choices: titles.choices,
      answer: titles.answer,
      explanation: `Рекомендация относится к теме «${topic.title}».`,
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
      prompt: `Какой вывод лучше использовать в экзаменационном ответе о «${section.heading}»?`,
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
      prompt: `В какой теме курса разбирается «${section.heading}»?`,
      choices: topicChoice.choices,
      answer: topicChoice.answer,
      explanation: `Это часть темы «${topic.title}».`,
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
