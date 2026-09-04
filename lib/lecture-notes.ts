import type { CourseTopic } from './course-content';
import { deepDives } from './deep-dives';
import type { Locale } from './i18n';

export type LectureSection = {
  heading: string;
  paragraphs: string[];
  takeaway: string;
};

const templates = {
  ru: {
    method: (t: CourseTopic, h: string) => `В теме «${t.title}» понятие «${h}» важно рассматривать не изолированно, а как часть исследовательского решения. Сначала формулируют, какое знание требуется получить, затем определяют единицу анализа, источник данных и способ интерпретации. Один и тот же приём может быть уместен для exploratory-вопроса и недостаточен для причинного вывода. Поэтому сильное обоснование всегда связывает вопрос, процедуру, данные и границы вывода.`,
    case: (t: CourseTopic, h: string) => `Представим команду, которая исследует новый цифровой сервис. Применяя «${h}», ей нужно заранее описать участников, контекст использования, конкретную процедуру и признаки, по которым будет сделан вывод. После сбора данных исследователь показывает логическую цепочку: что было замечено, как это проанализировано и почему это поддерживает вывод по теме «${t.title}».`,
    quality: (_t: CourseTopic, h: string) => `Качество результата зависит от прозрачности решений. Для «${h}» полезно зафиксировать критерии включения данных, отклонения от плана, возможные источники bias и альтернативные объяснения. Reliability относится к устойчивости процедуры, validity — к обоснованности интерпретации, а generalisability или transferability — к условиям переноса результата.`,
    ethics: (t: CourseTopic) => `Даже если основной вопрос посвящён теме «${t.title}», исследователь обязан оценить нагрузку на участников, добровольность согласия, приватность и минимизацию данных. Этическое решение является частью методологии: давление, неясная инструкция или небезопасная среда могут одновременно причинить вред и исказить данные.`,
    exam: (_t: CourseTopic, h: string) => `В экзаменационном ответе о «${h}» сначала дай точное определение, затем объясни механизм и тип данных. Назови преимущество, существенное ограничение и способ уменьшить риск. Заверши применением к конкретному кейсу и свяжи выбор метода с нужным типом evidence.`,
    takeaway: (h: string) => `Связывай «${h}» с исследовательским вопросом, данными и ограничениями вывода.`,
  },
  en: {
    method: (t: CourseTopic, h: string) => `Within “${t.title}”, “${h}” should be treated as part of a research decision rather than an isolated technique. First specify the knowledge needed; then define the unit of analysis, data source, and interpretive strategy. A procedure suitable for an exploratory question may be insufficient for a causal claim. A strong rationale therefore links question, procedure, evidence, and limits of inference.`,
    case: (t: CourseTopic, h: string) => `Imagine a team studying a new digital service. When applying “${h}”, it should describe the participants, context of use, procedure, and decision criteria in advance. After collection, the researcher must show a traceable chain: what was observed, how it was analysed, and why it supports a conclusion about “${t.title}”.`,
    quality: (_t: CourseTopic, h: string) => `Quality depends on transparent decisions. For “${h}”, document inclusion criteria, deviations from the plan, possible sources of bias, and rival explanations. Reliability concerns stability of procedure or measurement; validity concerns the warrant for an interpretation; generalisability or transferability concerns the conditions under which a result may travel.`,
    ethics: (t: CourseTopic) => `Even when the central question concerns “${t.title}”, the researcher must consider participant burden, voluntary consent, privacy, and data minimisation. Ethics is part of methodology: pressure, unclear instructions, or an unsafe setting can both cause harm and distort the evidence.`,
    exam: (_t: CourseTopic, h: string) => `In an exam answer about “${h}”, begin with a precise definition, then explain the mechanism and kind of data produced. State one advantage, one important limitation, and a mitigation. Finish by applying the concept to a concrete case and linking the method choice to the evidence required.`,
    takeaway: (h: string) => `Connect “${h}” to the research question, the evidence, and the limits of the conclusion.`,
  },
  no: {
    method: (t: CourseTopic, h: string) => `I temaet «${t.title}» bør «${h}» behandles som del av en forskningsbeslutning, ikke som en isolert teknikk. Angi først hvilken kunnskap som trengs, og definer deretter analyseenhet, datakilde og tolkningsstrategi. En prosedyre som passer et utforskende spørsmål, kan være utilstrekkelig for en årsakspåstand. En sterk begrunnelse knytter derfor sammen spørsmål, prosedyre, evidens og slutningenes grenser.`,
    case: (t: CourseTopic, h: string) => `Tenk deg et team som undersøker en ny digital tjeneste. Ved bruk av «${h}» må teamet på forhånd beskrive deltakere, brukskontekst, prosedyre og beslutningskriterier. Etter innsamlingen skal forskeren vise en sporbar kjede: hva som ble observert, hvordan det ble analysert, og hvorfor det støtter en konklusjon om «${t.title}».`,
    quality: (_t: CourseTopic, h: string) => `Kvalitet avhenger av transparente beslutninger. For «${h}» bør man dokumentere inklusjonskriterier, avvik fra planen, mulige skjevheter og rivaliserende forklaringer. Reliabilitet gjelder stabilitet, validitet gjelder om tolkningen er begrunnet, og generaliserbarhet eller overførbarhet gjelder vilkårene for å overføre resultatet.`,
    ethics: (t: CourseTopic) => `Selv når hovedspørsmålet gjelder «${t.title}», må forskeren vurdere deltakerbelastning, frivillig samtykke, personvern og dataminimering. Etikk er en del av metoden: press, uklare instrukser eller et utrygt miljø kan både skade deltakere og forvrenge data.`,
    exam: (_t: CourseTopic, h: string) => `I et eksamenssvar om «${h}» begynner du med en presis definisjon og forklarer deretter mekanismen og datatypen. Nevn én fordel, én viktig begrensning og et tiltak. Avslutt med å bruke begrepet i et konkret case og knytte metodevalget til nødvendig evidens.`,
    takeaway: (h: string) => `Knytt «${h}» til forskningsspørsmålet, evidensen og grensene for konklusjonen.`,
  },
};

export function buildLectureSections(topic: CourseTopic, locale: Locale = 'ru'): LectureSection[] {
  const text = templates[locale];
  const source = [
    ...topic.sections.map((section) => ({ ...section, tip: '' })),
    ...(locale === 'ru' ? (deepDives[topic.id] ?? []) : []),
  ];

  return source.map((section, index) => ({
    heading: section.heading,
    paragraphs: [
      section.body,
      text.method(topic, section.heading),
      text.case(topic, section.heading),
      text.quality(topic, section.heading),
      index % 2 === 0 ? text.ethics(topic) : text.exam(topic, section.heading),
      index % 2 === 0 ? text.exam(topic, section.heading) : text.ethics(topic),
    ],
    takeaway:
      section.tip ||
      text.takeaway(section.heading),
  }));
}
