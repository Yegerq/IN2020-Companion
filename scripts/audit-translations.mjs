import { createServer } from 'vite';

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { topicsForLocale } = await server.ssrLoadModule('/lib/localized-course.ts');
  const { buildQuestionBank } = await server.ssrLoadModule('/lib/question-bank.ts');
  for (const locale of ['en', 'no']) {
    const topics = topicsForLocale(locale);
    const questions = topics.flatMap((topic) => buildQuestionBank(topic, topics, locale));
    const values = questions.flatMap((q) => [q.prompt, q.explanation, ...q.choices]);
    const cyrillic = values.filter((value) => /[А-Яа-яЁё]/.test(value));
    console.log(`${locale}: ${topics.length} topics, ${questions.length} questions, ${cyrillic.length} Cyrillic strings`);
    if (cyrillic.length) throw new Error(cyrillic.slice(0, 5).join('\n'));
  }
} finally {
  await server.close();
}
