import { topics as russianTopics, type CourseTopic } from './course-content';
import type { Locale } from './i18n';

type TopicSeed = {
  title: string;
  summary: string;
  concepts: [string, string][];
  keyPoints: [string, string, string];
  examPrompt: string;
};

const en: TopicSeed[] = [
  { title: 'Foundations of HCI research', summary: 'Research begins with a question and a context. Choose a method for the knowledge it can produce, not for convenience.', concepts: [
    ['Research questions', 'A strong research question is specific, answerable with evidence, and connects a phenomenon, people, and context. Exploratory, descriptive, and explanatory questions require different evidence.'],
    ['Choosing a method', 'Experiments test causal claims; surveys estimate patterns; interviews and observation reveal meaning and practice; usability tests identify interaction problems. Every method has limits.'],
    ['Three waves of HCI', 'The first wave emphasized human factors, the second situated active users in work contexts, and the third broadened HCI toward experience, culture, participation, and consequences.'],
    ['Research paradigms', 'Quantitative work examines magnitude and patterns, qualitative work examines meaning and process, and mixed methods integrates both around complementary subquestions.'],
    ['Operationalisation and evidence', 'Abstract constructs such as trust or usability must be represented by observable indicators. A defensible claim traces the path from question through data and analysis to interpretation.'],
    ['The research cycle', 'A practical cycle includes prior work, method choice, ethics, piloting, recruitment, collection, analysis, and reporting. Findings often refine the next research question.'],
  ], keyPoints: ['Start with the research question', 'Match the method to the required kind of knowledge', 'Triangulation strengthens an interpretation but does not remove every limitation'], examPrompt: 'Explain how the evolution of HCI changed both its research questions and its methods.' },
  { title: 'Experimental research', summary: 'Experiments ask whether manipulating an independent variable changes a measured outcome.', concepts: [
    ['Variables and hypotheses', 'The independent variable is manipulated and the dependent variable is measured. The null hypothesis states no effect; the alternative specifies an expected difference or relationship.'],
    ['Control and causality', 'A causal inference needs manipulation, control of rival explanations, and a valid comparison. A confound varies with the independent variable and offers an alternative explanation.'],
    ['Laboratory and field studies', 'Laboratories offer control and precise measurement but may reduce ecological validity. Field studies preserve context while making noise, control, and replication harder.'],
    ['Causal inference', 'The proposed cause must precede the effect, variables must covary, and plausible alternative explanations must be addressed. Association alone is insufficient.'],
    ['Manipulation checks', 'A manipulation check tests whether participants noticed the intended difference and whether it changed the target construct, but it may also reveal the hypothesis.'],
    ['Demand characteristics', 'Participants may infer the study purpose and behave accordingly. Neutral instructions, standardisation, and blinding where possible reduce this threat.'],
  ], keyPoints: ['Manipulate the IV and measure the DV', 'Correlation does not establish causation', 'Control strengthens internal validity'], examPrompt: 'Compare a controlled laboratory study with a field study, giving two advantages and two limitations of each.' },
  { title: 'Experimental design', summary: 'A sound design separates the effect of the manipulation from participant differences, order effects, noise, and bias.', concepts: [
    ['Between-subjects designs', 'Each participant completes one condition. Carry-over is avoided, but larger samples are needed and group differences can add variance.'],
    ['Within-subjects designs', 'Each participant completes every condition, increasing sensitivity and reducing sample needs. Order, learning, fatigue, and carry-over must be managed.'],
    ['Factorial designs', 'Factorial designs manipulate two or more independent variables and estimate both main effects and interactions between factors.'],
    ['Randomisation and matching', 'Random assignment balances known and unknown participant differences probabilistically. Matching can help small samples but does not replace appropriate analysis.'],
    ['Counterbalancing', 'Counterbalancing distributes order effects across conditions. A Latin square balances positions when using every possible order is impractical.'],
    ['Power and sample size', 'Statistical power is the probability of detecting an effect of a specified size. It depends on sample size, measurement precision, design, and effect magnitude.'],
  ], keyPoints: ['Choose between- or within-subjects design from the expected risks', 'Counterbalance anticipated order effects', 'Plan sample size from effect size and design'], examPrompt: 'Design an experiment for comparing two interfaces and justify assignment, counterbalancing, variables, and sample size.' },
  { title: 'Statistical analysis', summary: 'Statistics summarise uncertainty and patterns; they do not replace design quality, measurement validity, or substantive interpretation.', concepts: [
    ['Descriptive statistics', 'Use distributions, centre, and spread to understand the data before testing hypotheses. The mean is sensitive to skew and outliers; the median is more robust.'],
    ['Inferential reasoning', 'A p-value describes the compatibility of data with a statistical model under the null; it is not the probability that the hypothesis is true.'],
    ['Errors and uncertainty', 'Type I error is a false positive and Type II error is a missed real effect. Confidence intervals express uncertainty around an estimate.'],
    ['Measurement scales', 'Nominal, ordinal, interval, and ratio scales support different summaries and tests. The scale of the outcome and dependence of observations guide test choice.'],
    ['Model assumptions', 'Independence, distribution shape, and variance assumptions must be assessed through design knowledge, plots, and diagnostics rather than one mechanical normality test.'],
    ['Practical significance', 'Statistical significance does not show whether an effect matters. Interpret effect size and uncertainty in the language of the user task.'],
  ], keyPoints: ['Inspect the distribution before choosing a test', 'Report effect size and uncertainty, not only p-values', 'Distinguish statistical from practical significance'], examPrompt: 'Interpret a statistically significant result and explain what else is needed before claiming that the design is meaningfully better.' },
  { title: 'Surveys and questionnaires', summary: 'Surveys can describe attitudes and reported behaviour at scale when questions, sampling, and response options are carefully designed.', concepts: [
    ['Question wording', 'Questions should be clear, neutral, and ask one thing at a time. Leading, loaded, double-barrelled, and ambiguous wording introduces measurement error.'],
    ['Sampling and nonresponse', 'A large convenience sample can still be biased. Coverage, recruitment, self-selection, and nonresponse determine whose views are represented.'],
    ['Reliability and validity', 'Reliability concerns consistency; validity concerns whether interpretations represent the intended construct. Reliability alone cannot establish validity.'],
    ['Response formats', 'Open questions provide richness while closed formats ease comparison. A Likert scale normally combines several items measuring one construct.'],
    ['Order and context effects', 'Earlier questions frame later answers. Begin broadly, place sensitive questions later, and randomise independent items when order is not meaningful.'],
    ['Cognitive interviewing', 'Respondents think aloud about comprehension, recall, judgement, and response selection, revealing ambiguity before a large launch.'],
  ], keyPoints: ['Pilot both meaning and technical flow', 'Provide exhaustive, mutually sensible response options', 'Discuss sampling bias when generalising'], examPrompt: 'Critique a questionnaire intended to measure trust, covering wording, scale construction, sampling, reliability, and validity.' },
  { title: 'Diary studies', summary: 'Diary studies capture experiences close to when they occur and reveal change over time in everyday contexts.', concepts: [
    ['When diaries fit', 'Diaries suit repeated, private, distributed, or hard-to-observe experiences. They are weaker for rare events when participants may wait a long time to record anything.'],
    ['Prompt and media design', 'Prompts should be brief and concrete. Text, photos, audio, and structured fields trade expressive richness against burden and comparability.'],
    ['Compliance and follow-up', 'Missing entries, delayed recall, and fatigue threaten quality. Reminders, reasonable duration, check-ins, and a follow-up interview support interpretation.'],
    ['Diary schedules', 'Interval-contingent entries follow a schedule, event-contingent entries follow an event, and signal-contingent entries follow a prompt.'],
    ['Onboarding participants', 'Examples, event boundaries, and a question channel reduce misunderstanding. Reviewing early entries prevents a week of unusable data.'],
    ['Reactivity', 'Recording can increase awareness and change the behaviour being studied. Follow-up questions help separate behavioural change from changed reporting.'],
  ], keyPoints: ['Match the recording schedule to event frequency', 'Minimise participant burden', 'Treat missing and delayed entries as data-quality issues'], examPrompt: 'Design a diary study for mobile interruptions and justify prompts, duration, media, reminders, and follow-up.' },
  { title: 'Case studies', summary: 'A case study develops an in-depth, contextual account of a bounded contemporary case using multiple sources of evidence.', concepts: [
    ['Defining the case', 'Specify the unit of analysis, time period, setting, and boundaries. A case is not simply a small sample or a synonym for an interview study.'],
    ['Multiple sources', 'Documents, observations, interviews, artefacts, and records can be triangulated. Disagreement between sources is analytically useful rather than something to hide.'],
    ['Analytical generalisation', 'Case studies generalise to concepts, mechanisms, or theory, not statistically to a population. Thick context helps readers judge transferability.'],
    ['Single and multiple cases', 'A single case can be unique or critical. Multiple cases use replication logic to examine whether a mechanism recurs in similar or contrasting contexts.'],
    ['Chain of evidence', 'Protocols, decision logs, and source links let a reader trace raw evidence through coding and claims to conclusions.'],
    ['Limits of inference', 'A small number of cases can support contextual explanation, but not a population estimate of how often something occurs.'],
  ], keyPoints: ['Bound the case explicitly', 'Maintain a transparent chain of evidence', 'Generalise analytically rather than statistically'], examPrompt: 'Propose a case study of technology adoption and explain case boundaries, sources, triangulation, and transferability.' },
  { title: 'Interviews and focus groups', summary: 'Interviews explore individual accounts in depth; focus groups reveal interaction, shared norms, and disagreement.', concepts: [
    ['Interview structure', 'Structured interviews maximise consistency, unstructured interviews maximise openness, and semi-structured interviews combine a guide with responsive probing.'],
    ['Probing and listening', 'Good probes request concrete episodes, examples, contrasts, and clarification without suggesting an answer. Silence can give participants space to think.'],
    ['Focus-group interaction', 'The group interaction is data. It reveals consensus, conflict, language, and social norms, but power relations may silence some views.'],
    ['The interview funnel', 'Move from rapport and broad experience toward specific episodes, details, and sensitive topics, then invite anything important that was missed.'],
    ['Moderating a group', 'Invite quieter voices, limit domination, and explore disagreement without forcing consensus. Group composition affects psychological safety.'],
    ['Analytical sufficiency', 'Stop when categories are sufficiently developed for the research purpose. Saturation is not a universal participant number.'],
  ], keyPoints: ['Ask for concrete experience before abstract opinion', 'Avoid leading questions', 'Analyse interaction and power in focus groups'], examPrompt: 'Choose between interviews and focus groups for a sensitive design question and defend recruitment, guide structure, and moderation.' },
  { title: 'Ethnography and observation', summary: 'Ethnographic work studies situated practice over time through participation, observation, fieldnotes, and reflexive interpretation.', concepts: [
    ['Participant observation', 'The researcher’s role ranges from observer to participant. Presence enables contextual understanding but also shapes access, behaviour, and interpretation.'],
    ['Fieldnotes', 'Record actions, settings, talk, timing, artefacts, and reflections promptly. Separate descriptive observations from analytic memos.'],
    ['Reflexivity', 'Researchers examine how their identity, relationships, assumptions, and position shape what becomes visible and what remains inaccessible.'],
    ['Access and rapport', 'Organisational permission opens a field, while trust is earned over time. Gatekeepers may both enable and filter access.'],
    ['Description and interpretation', 'Descriptive notes document events; analytic memos develop explanations and questions. Keeping them distinct prevents guesses becoming facts.'],
    ['Ethics in the field', 'Consent is ongoing as new people and sensitive situations appear. A manager’s permission does not replace individual consent.'],
  ], keyPoints: ['Treat context and routine as data', 'Separate observation from interpretation', 'Make positionality and access limitations visible'], examPrompt: 'Plan an observation study in a workplace and discuss researcher role, access, fieldnotes, reflexivity, and ongoing consent.' },
  { title: 'Usability testing', summary: 'Usability testing observes representative users attempting realistic tasks to identify where an interface obstructs their goals.', concepts: [
    ['Tasks and participants', 'Recruit people relevant to the product and write goal-based tasks that do not reveal the interface steps. Pilot every task and recording setup.'],
    ['Think-aloud protocol', 'Participants verbalise what they notice and expect. Prompts should be neutral because explanations and researcher intervention can change performance.'],
    ['Measures and findings', 'Task success, errors, time, paths, comments, and severity answer different questions. Findings must connect observations to user goals and design implications.'],
    ['Formative and summative tests', 'Formative testing finds problems early to improve a design; summative testing compares against benchmarks or alternatives using predefined metrics.'],
    ['Problem severity', 'Severity combines frequency, impact, and persistence. A dramatic isolated reaction may matter less than a quiet recurring failure.'],
    ['Heuristic evaluation', 'Experts inspect an interface against principles. It is fast, but depends on evaluator expertise and does not replace observation of real users.'],
  ], keyPoints: ['Test the interface, not the participant', 'Use neutral facilitation', 'Connect every recommendation to evidence and a user goal'], examPrompt: 'Design a usability test for a mobile service, including participants, tasks, protocol, measures, severity, and reporting.' },
  { title: 'Qualitative analysis', summary: 'Qualitative analysis develops a transparent interpretation by moving iteratively between data, codes, patterns, context, and claims.', concepts: [
    ['Coding data', 'Codes label meaningful features of data. Coding is analytical rather than clerical: code definitions change as the researcher compares passages and refines distinctions.'],
    ['Themes and claims', 'A theme is a coherent pattern relevant to the research question, not merely a frequent topic. It requires boundaries, evidence, and an interpretive claim.'],
    ['Quality and reflexivity', 'Audit trails, negative cases, peer discussion, rich evidence, and reflexive memos make reasoning inspectable; mechanical coder agreement is not the only quality criterion.'],
    ['Inductive and deductive coding', 'Inductive codes develop from data; deductive codes come from prior theory or questions. They may be combined when their origin is reported clearly.'],
    ['Semantic and latent meaning', 'Semantic analysis stays with explicit meaning; latent analysis interprets underlying assumptions and structures and therefore needs a clear theoretical basis.'],
    ['Design implications', 'An implication should follow from a pattern, respect context, and indicate a design direction without pretending to be universal.'],
  ], keyPoints: ['Keep an audit trail from data to claims', 'Search for exceptions as well as patterns', 'Do not confuse quotation with analysis'], examPrompt: 'Explain a defensible thematic-analysis workflow from transcription to themes and design implications.' },
  { title: 'Automated data collection', summary: 'Logs and sensors record behaviour at scale, but technical traces require semantic definitions, validation, and contextual interpretation.', concepts: [
    ['Instrumentation', 'Define events, properties, identities, timestamps, and versions before collection. Validate that the implemented telemetry matches the analytic specification.'],
    ['Data quality', 'Duplicates, missing events, bots, clock errors, and changing product versions can create false patterns. Monitoring and provenance are part of the method.'],
    ['Inference and privacy', 'A trace shows that an event was recorded, not necessarily user intent. Data minimisation, access control, retention, and consent reduce information risk.'],
    ['Events and units', 'One user action may create several technical logs. Sessions, users, devices, and actions are different units of analysis and must not be mixed.'],
    ['Missingness', 'Logging gaps may be systematic because of offline use, blockers, platform bugs, or consent. Treating missing observations as zero biases conclusions.'],
    ['Combining methods', 'Logs reveal the scale of a pattern while interviews or diaries help explain why it occurs. Integration requires a shared question, time frame, and unit.'],
  ], keyPoints: ['Define semantic events before analysis', 'Validate telemetry continuously', 'Do not infer motivation from clicks alone'], examPrompt: 'Evaluate a logging study of feature use, covering event definitions, missingness, versions, inference, privacy, and complementary methods.' },
  { title: 'Measuring people', summary: 'Human performance, experience, and physiology require operational definitions and multiple measures whose limitations are understood.', concepts: [
    ['Constructs and measures', 'A construct is the concept of interest; a measure is an observable indicator. Converging indicators strengthen interpretation when they genuinely address the same construct.'],
    ['Questionnaires and scales', 'Validated multi-item scales can measure perceived workload, usability, or experience, but translation and context may change their properties.'],
    ['Behavioural and physiological data', 'Performance and sensor measures seem objective but still depend on tasks, calibration, artefacts, preprocessing, and theoretical interpretation.'],
    ['Performance measures', 'Time, accuracy, errors, and task success capture different dimensions. Speed–accuracy trade-offs make reliance on a single metric risky.'],
    ['Self-report measures', 'Self-reports access perception but are affected by memory, framing, and social desirability. Stated intention is not the same as behaviour.'],
    ['Physiological measures', 'Eye tracking, heart rate, and skin conductance require calibration and rarely map uniquely to a psychological state. Arousal alone has no valence.'],
  ], keyPoints: ['Do not equate an indicator with the construct', 'Combine measures for a reason', 'Report calibration, artefacts, and interpretation limits'], examPrompt: 'Operationalise user workload using complementary measures and explain validity, calibration, and interpretation risks.' },
  { title: 'Online and ubiquitous research', summary: 'Remote, mobile, and in-the-wild studies expand reach and realism while reducing control over devices, attention, and context.', concepts: [
    ['Remote study design', 'Instructions, consent, tasks, support, and debriefing must work without the researcher physically present. Pilot across likely devices and accessibility settings.'],
    ['Context and interruptions', 'Location, connectivity, multitasking, and notifications affect behaviour. Contextual metadata can aid interpretation but may increase privacy risk.'],
    ['Scale and participant quality', 'Online recruitment increases reach, not automatic representativeness. Fair compensation and meaningful quality checks support both ethics and data quality.'],
    ['Device control', 'Screen size, browser, input, latency, and multitasking vary. Eligibility checks and technical metadata describe or constrain variation.'],
    ['Crowdsourcing', 'Platforms recruit quickly across regions, but their workforce has distinct norms and research experience. Fair pay and transparent rejection rules matter.'],
    ['Experience sampling', 'Random, fixed, or event-triggered prompts trade comparability against proximity to experience. Burden and interruptibility must be piloted.'],
  ], keyPoints: ['Design for unattended participation', 'Treat device and context variability explicitly', 'Use fair and proportionate quality controls'], examPrompt: 'Plan a remote experience-sampling study and justify recruitment, prompting, device checks, compensation, privacy, and support.' },
  { title: 'Research ethics and participants', summary: 'Ethics is a continuing methodological responsibility: respect autonomy, minimise harm, distribute burden fairly, and protect data.', concepts: [
    ['Informed consent', 'Consent must be voluntary, comprehensible, specific, and ongoing. Participants need realistic information about tasks, risks, data use, withdrawal, and contacts.'],
    ['Risk and vulnerable situations', 'Risk includes physical, psychological, social, economic, and informational harm. Vulnerability is contextual and may arise from dependency or unequal power.'],
    ['Privacy and data management', 'Collect only necessary data, separate identifiers, restrict access, define retention, and consider re-identification rather than promising anonymity casually.'],
    ['Respect, beneficence, and justice', 'Respect supports autonomy, beneficence balances benefit and harm, and justice distributes research burdens and benefits fairly.'],
    ['Information risk', 'Combinations of time, location, role, and rare behaviour can identify a person even without a name. Threat modelling examines access and possible harms.'],
    ['Withdrawal and deletion', 'Participants need a usable withdrawal route, a deletion deadline, and honest limits after aggregation or anonymisation. Explain these before consent.'],
  ], keyPoints: ['Treat consent as a process', 'Minimise both collection and retention', 'Consider power, burden, and exclusion throughout the study'], examPrompt: 'Conduct an ethical review of a study collecting sensitive interaction logs, including consent, risk, justice, withdrawal, and data management.' },
  { title: 'Research with disabled people', summary: 'Inclusive research removes barriers, respects lived expertise, and adapts participation without treating disability as a deficit.', concepts: [
    ['Inclusive recruitment', 'Recruit beyond convenient organisations, make materials accessible, and budget for communication, support persons, transport, fatigue, and additional time.'],
    ['Reasonable adaptations', 'Offer flexible modes, schedules, input, breaks, and communication formats. Ask participants what works instead of inferring needs from a diagnosis.'],
    ['Participatory approaches', 'Disabled people can shape questions, methods, interpretation, and design decisions as experts and partners, with appropriate power and compensation.'],
    ['Accessible consent', 'Provide screen-reader-friendly, large-print, plain-language, captioned, or interpreted materials as requested and test accessibility before the session.'],
    ['Ableism and deficit framing', 'Study interaction barriers rather than automatically locating the problem in a person’s body. The social model highlights environmental and design constraints.'],
    ['Meaningful participation', 'Participation means influence over decisions, not symbolic attendance. Accessible communication, time, and payment make collaboration substantive.'],
  ], keyPoints: ['Ask about access needs directly', 'Compensate lived expertise', 'Report design barriers without deficit framing'], examPrompt: 'Redesign a conventional usability study for meaningful participation by disabled people, covering access, consent, adaptation, power, and reporting.' },
];

const noText: TopicSeed[] = [
  { title: 'Grunnlag for HCI-forskning', summary: 'Forskning begynner med et spørsmål og en kontekst. Metoden velges ut fra kunnskapen den kan gi, ikke ut fra bekvemmelighet.', concepts: [
    ['Forskningsspørsmål', 'Et godt forskningsspørsmål er presist, kan besvares med data og knytter sammen et fenomen, mennesker og kontekst. Utforskende, beskrivende og forklarende spørsmål krever ulik evidens.'],
    ['Valg av metode', 'Eksperimenter undersøker årsak, spørreundersøkelser kartlegger mønstre, intervjuer og observasjon belyser mening og praksis, mens brukertesting avdekker interaksjonsproblemer.'],
    ['Tre bølger i HCI', 'Den første bølgen vektla menneskelige faktorer, den andre aktive brukere i arbeidssituasjoner, og den tredje erfaring, kultur, deltakelse og teknologiske konsekvenser.'],
    ['Forskningsparadigmer', 'Kvantitativ forskning undersøker omfang og mønstre, kvalitativ forskning mening og prosess, mens mixed methods integrerer begge rundt komplementære delspørsmål.'],
    ['Operasjonalisering og evidens', 'Abstrakte konstruksjoner som tillit og brukbarhet må representeres med observerbare indikatorer. En holdbar påstand kan spores fra spørsmål via data og analyse til tolkning.'],
    ['Forskningssyklusen', 'En praktisk syklus omfatter tidligere forskning, metodevalg, etikk, pilot, rekruttering, datainnsamling, analyse og rapportering. Funn presiserer ofte neste spørsmål.'],
  ], keyPoints: ['Start med forskningsspørsmålet', 'Tilpass metoden til kunnskapstypen som trengs', 'Triangulering styrker en tolkning, men fjerner ikke alle begrensninger'], examPrompt: 'Forklar hvordan utviklingen av HCI har endret både forskningsspørsmålene og metodene.' },
  { title: 'Eksperimentell forskning', summary: 'Eksperimenter undersøker om manipulering av en uavhengig variabel endrer et målt resultat.', concepts: [
    ['Variabler og hypoteser', 'Den uavhengige variabelen manipuleres, og den avhengige variabelen måles. Nullhypotesen sier ingen effekt; alternativhypotesen beskriver forventet forskjell eller sammenheng.'],
    ['Kontroll og kausalitet', 'En årsaksslutning krever manipulasjon, kontroll av rivaliserende forklaringer og en gyldig sammenligning. En confound samvarierer med den uavhengige variabelen.'],
    ['Laboratorium og felt', 'Laboratoriet gir kontroll og presise målinger, men kan svekke økologisk validitet. Feltstudier bevarer kontekst, men gjør kontroll og replikasjon vanskeligere.'],
    ['Årsaksslutning', 'Den antatte årsaken må komme før effekten, variablene må samvariere, og plausible alternative forklaringer må håndteres. Sammenheng alene er utilstrekkelig.'],
    ['Manipulasjonssjekk', 'En manipulasjonssjekk undersøker om deltakerne oppfattet forskjellen og om den påvirket den tiltenkte konstruksjonen, men kan samtidig avsløre hypotesen.'],
    ['Forventningseffekter', 'Deltakere kan gjette studiens formål og tilpasse atferden. Nøytrale instrukser, standardisering og blinding reduserer denne trusselen.'],
  ], keyPoints: ['Manipuler IV og mål DV', 'Korrelasjon fastslår ikke kausalitet', 'Kontroll styrker intern validitet'], examPrompt: 'Sammenlign en kontrollert laboratoriestudie med en feltstudie, med to fordeler og to begrensninger ved hver.' },
  { title: 'Eksperimentdesign', summary: 'Et godt design skiller effekten av manipulasjonen fra deltakerforskjeller, rekkefølgeeffekter, støy og bias.', concepts: [
    ['Mellomgruppedesign', 'Hver deltaker gjennomfører én betingelse. Carry-over unngås, men designet krever flere deltakere og gruppeforskjeller kan øke variansen.'],
    ['Innomgruppedesign', 'Hver deltaker gjennomfører alle betingelser. Det øker sensitiviteten, men læring, tretthet, rekkefølge og carry-over må håndteres.'],
    ['Faktorielle design', 'Faktorielle design manipulerer to eller flere uavhengige variabler og estimerer både hovedeffekter og interaksjoner mellom faktorene.'],
    ['Randomisering og matching', 'Tilfeldig tildeling balanserer kjente og ukjente deltakerforskjeller sannsynlighetsmessig. Matching kan hjelpe i små utvalg, men erstatter ikke riktig analyse.'],
    ['Motbalansering', 'Motbalansering fordeler rekkefølgeeffekter mellom betingelsene. Et latinsk kvadrat balanserer posisjoner når alle mulige rekkefølger er upraktiske.'],
    ['Power og utvalgsstørrelse', 'Statistisk styrke er sannsynligheten for å oppdage en effekt av en bestemt størrelse og avhenger av utvalg, presisjon, design og effektstørrelse.'],
  ], keyPoints: ['Velg design ut fra forventede trusler', 'Motbalanser forventede rekkefølgeeffekter', 'Planlegg utvalget ut fra effektstørrelse og design'], examPrompt: 'Utform et eksperiment som sammenligner to grensesnitt, og begrunn tildeling, motbalansering, variabler og utvalgsstørrelse.' },
  { title: 'Statistisk analyse', summary: 'Statistikk beskriver usikkerhet og mønstre, men erstatter ikke et godt design, gyldige mål eller faglig tolkning.', concepts: [
    ['Deskriptiv statistikk', 'Undersøk fordeling, sentraltendens og spredning før hypotesetesting. Gjennomsnittet påvirkes av skjevhet og ekstremverdier; medianen er mer robust.'],
    ['Statistisk inferens', 'En p-verdi beskriver hvor forenlige dataene er med en modell under nullhypotesen; den er ikke sannsynligheten for at hypotesen er sann.'],
    ['Feil og usikkerhet', 'Type I-feil er en falsk positiv, og type II-feil er en oversett reell effekt. Konfidensintervaller uttrykker usikkerheten rundt et estimat.'],
    ['Måleskalaer', 'Nominal-, ordinal-, intervall- og forholdstall støtter ulike oppsummeringer og tester. Skala og avhengighet mellom observasjoner styrer testvalget.'],
    ['Modellforutsetninger', 'Uavhengighet, fordelingsform og varians må vurderes med designkunnskap, figurer og diagnostikk, ikke bare én mekanisk normalitetstest.'],
    ['Praktisk betydning', 'Statistisk signifikans viser ikke om en effekt betyr noe. Effektstørrelse og usikkerhet må tolkes i språket til brukeroppgaven.'],
  ], keyPoints: ['Undersøk fordelingen før testvalg', 'Rapporter effektstørrelse og usikkerhet, ikke bare p-verdi', 'Skill statistisk fra praktisk betydning'], examPrompt: 'Tolk et statistisk signifikant resultat og forklar hva som ellers trengs før man hevder at designet er meningsfullt bedre.' },
  { title: 'Spørreundersøkelser', summary: 'Spørreundersøkelser kan beskrive holdninger og rapportert atferd i stor skala når spørsmål, utvalg og svaralternativer er godt utformet.', concepts: [
    ['Spørsmålsformulering', 'Spørsmål skal være tydelige, nøytrale og handle om én ting. Ledende, ladede, doble og tvetydige formuleringer skaper målefeil.'],
    ['Utvalg og frafall', 'Et stort bekvemmelighetsutvalg kan fortsatt være skjevt. Dekning, rekruttering, selvseleksjon og frafall avgjør hvilke synspunkter som representeres.'],
    ['Reliabilitet og validitet', 'Reliabilitet gjelder konsistens; validitet gjelder om tolkningen representerer den tiltenkte konstruksjonen. Reliabilitet alene kan ikke etablere validitet.'],
    ['Svarformat', 'Åpne spørsmål gir rikdom, mens lukkede format letter sammenligning. En Likert-skala kombinerer vanligvis flere items som måler samme konstruksjon.'],
    ['Rekkefølge og kontekst', 'Tidligere spørsmål rammer inn senere svar. Begynn bredt, legg sensitive spørsmål sent, og randomiser uavhengige items når rekkefølgen ikke betyr noe.'],
    ['Kognitivt intervju', 'Respondenten tenker høyt om forståelse, hukommelse, vurdering og valg av svar. Dette avdekker tvetydighet før stor utrulling.'],
  ], keyPoints: ['Pilotér både mening og teknisk flyt', 'Gi uttømmende og fornuftige svaralternativer', 'Diskuter utvalgsskjevhet ved generalisering'], examPrompt: 'Vurder et spørreskjema som skal måle tillit, med formulering, skalakonstruksjon, utvalg, reliabilitet og validitet.' },
  { title: 'Dagbokstudier', summary: 'Dagbokstudier fanger erfaringer nær hendelsen og viser endringer over tid i hverdagslige kontekster.', concepts: [
    ['Når dagbok passer', 'Dagbøker passer for gjentatte, private, spredte eller vanskelig observerbare erfaringer, men er svakere når hendelser er svært sjeldne.'],
    ['Prompts og medier', 'Prompts bør være korte og konkrete. Tekst, foto, lyd og strukturerte felt balanserer uttrykksrikdom mot belastning og sammenlignbarhet.'],
    ['Etterlevelse og oppfølging', 'Manglende notater, forsinket erindring og tretthet truer kvaliteten. Påminnelser, rimelig varighet, innsjekk og oppfølgingsintervju støtter tolkningen.'],
    ['Dagbokplaner', 'Intervallbaserte notater følger en tidsplan, hendelsesbaserte følger en hendelse, og signalbaserte følger en tilfeldig eller fast prompt.'],
    ['Introduksjon av deltakere', 'Eksempler, klare hendelsesgrenser og en spørsmåls­kanal reduserer misforståelser. Tidlig gjennomgang hindrer en uke med ubrukelige data.'],
    ['Reaktivitet', 'Registrering kan øke bevisstheten og endre atferden som studeres. Oppfølging skiller reell atferdsendring fra endret rapportering.'],
  ], keyPoints: ['Tilpass registreringsplanen til hendelsesfrekvensen', 'Minimer deltakerbelastningen', 'Behandle manglende og forsinkede notater som kvalitetsproblemer'], examPrompt: 'Utform en dagbokstudie om mobilavbrudd og begrunn prompts, varighet, medier, påminnelser og oppfølging.' },
  { title: 'Casestudier', summary: 'En casestudie utvikler en dyp, kontekstuell forståelse av et avgrenset nåtidig tilfelle med flere evidenskilder.', concepts: [
    ['Avgrensning av caset', 'Angi analyseenhet, tidsperiode, setting og grenser. Et case er ikke bare et lite utvalg eller et annet ord for en intervjustudie.'],
    ['Flere kilder', 'Dokumenter, observasjoner, intervjuer, artefakter og registre kan trianguleres. Uenighet mellom kilder er analytisk nyttig.'],
    ['Analytisk generalisering', 'Casestudier generaliserer til begreper, mekanismer eller teori, ikke statistisk til en populasjon. Rik kontekst støtter vurdering av overførbarhet.'],
    ['Enkeltcase og flere case', 'Et enkelt case kan være unikt eller kritisk. Flere case bruker replikeringslogikk for å undersøke mekanismer på tvers av kontekster.'],
    ['Evidenskjede', 'Protokoller, beslutningslogger og kildehenvisninger lar leseren spore rådata gjennom koding og påstander til konklusjoner.'],
    ['Slutningenes grenser', 'Få case kan støtte kontekstuell forklaring, men ikke et populasjonsestimat for hvor ofte noe forekommer.'],
  ], keyPoints: ['Avgrens caset eksplisitt', 'Bevar en transparent evidenskjede', 'Generaliser analytisk, ikke statistisk'], examPrompt: 'Foreslå en casestudie om innføring av teknologi og forklar avgrensning, kilder, triangulering og overførbarhet.' },
  { title: 'Intervjuer og fokusgrupper', summary: 'Intervjuer utforsker individuelle beretninger i dybden; fokusgrupper synliggjør samhandling, normer og uenighet.', concepts: [
    ['Intervjustruktur', 'Strukturerte intervjuer gir konsistens, ustrukturerte gir åpenhet, og semistrukturerte kombinerer en guide med fleksibel oppfølging.'],
    ['Oppfølging og lytting', 'Gode oppfølgingsspørsmål ber om konkrete hendelser, eksempler, kontraster og presisering uten å antyde et svar. Stillhet gir rom for refleksjon.'],
    ['Samhandling i fokusgruppen', 'Gruppesamhandlingen er data og viser enighet, konflikt, språk og normer. Maktforhold kan likevel gjøre enkelte perspektiver tause.'],
    ['Intervjutrakten', 'Gå fra kontakt og bred erfaring mot konkrete episoder, detaljer og sensitive temaer, og avslutt med det deltakeren mener mangler.'],
    ['Moderering av gruppe', 'Inviter stille stemmer, begrens dominans og utforsk uenighet uten å presse frem konsensus. Sammensetningen påvirker tryggheten.'],
    ['Analytisk tilstrekkelighet', 'Stopp når kategoriene er godt nok utviklet for formålet. Metning er ikke et universelt antall deltakere.'],
  ], keyPoints: ['Spør om konkrete erfaringer før abstrakte meninger', 'Unngå ledende spørsmål', 'Analyser samhandling og makt i fokusgrupper'], examPrompt: 'Velg mellom intervju og fokusgruppe for et sensitivt designspørsmål, og begrunn rekruttering, guide og moderering.' },
  { title: 'Etnografi og observasjon', summary: 'Etnografisk arbeid studerer situert praksis over tid gjennom deltakelse, observasjon, feltnotater og refleksiv tolkning.', concepts: [
    ['Deltakende observasjon', 'Forskerrollen går fra observatør til deltaker. Nærvær gir kontekstuell forståelse, men påvirker også tilgang, atferd og tolkning.'],
    ['Feltnotater', 'Dokumenter handlinger, omgivelser, samtaler, tidspunkt, artefakter og refleksjoner raskt. Skill beskrivende observasjoner fra analytiske memoer.'],
    ['Refleksivitet', 'Forskeren undersøker hvordan identitet, relasjoner, antakelser og posisjon former det som blir synlig og det som forblir utilgjengelig.'],
    ['Tilgang og tillit', 'Organisatorisk tillatelse åpner feltet, mens tillit bygges over tid. Portvakter kan både muliggjøre og filtrere tilgang.'],
    ['Beskrivelse og tolkning', 'Beskrivende notater dokumenterer hendelser; analytiske memoer utvikler forklaringer og spørsmål. Skillet hindrer at gjetninger presenteres som fakta.'],
    ['Etikk i feltet', 'Samtykke må fornyes når nye personer og sensitive situasjoner oppstår. En leders tillatelse erstatter ikke individuelt samtykke.'],
  ], keyPoints: ['Behandle kontekst og rutiner som data', 'Skill observasjon fra tolkning', 'Synliggjør posisjon og tilgangsbegrensninger'], examPrompt: 'Planlegg observasjon på en arbeidsplass og drøft forskerrolle, tilgang, feltnotater, refleksivitet og løpende samtykke.' },
  { title: 'Brukervennlighetstesting', summary: 'Brukertesting observerer representative brukere som utfører realistiske oppgaver for å finne hvor grensesnittet hindrer målene deres.', concepts: [
    ['Oppgaver og deltakere', 'Rekrutter personer som er relevante for produktet, og skriv målbaserte oppgaver som ikke avslører stegene i grensesnittet. Pilotér oppgaver og opptak.'],
    ['Tenk-høyt-protokoll', 'Deltakere uttrykker hva de ser og forventer. Prompts må være nøytrale fordi forklaring og forskerinngrep kan endre prestasjonen.'],
    ['Mål og funn', 'Oppgavesuksess, feil, tid, navigasjonsvei, kommentarer og alvorlighet besvarer ulike spørsmål. Funn må kobles til brukermål og designkonsekvenser.'],
    ['Formativ og summativ testing', 'Formativ testing finner problemer tidlig for å forbedre designet; summativ testing sammenligner med benchmark eller alternativer ved hjelp av forhåndsdefinerte mål.'],
    ['Problemets alvorlighet', 'Alvorlighet kombinerer hyppighet, konsekvens og varighet. En dramatisk enkelthendelse kan være mindre viktig enn en stille, gjentatt feil.'],
    ['Heuristisk evaluering', 'Eksperter inspiserer grensesnittet mot prinsipper. Metoden er rask, men avhenger av ekspertise og erstatter ikke observasjon av faktiske brukere.'],
  ], keyPoints: ['Test grensesnittet, ikke deltakeren', 'Bruk nøytral fasilitering', 'Knytt anbefalinger til evidens og brukermål'], examPrompt: 'Utform en brukertest av en mobiltjeneste med deltakere, oppgaver, protokoll, mål, alvorlighet og rapportering.' },
  { title: 'Kvalitativ analyse', summary: 'Kvalitativ analyse utvikler en transparent tolkning ved å bevege seg iterativt mellom data, koder, mønstre, kontekst og påstander.', concepts: [
    ['Koding av data', 'Koder merker meningsfulle trekk ved data. Koding er analytisk: definisjonene endres når forskeren sammenligner utdrag og presiserer forskjeller.'],
    ['Temaer og påstander', 'Et tema er et sammenhengende mønster som er relevant for forskningsspørsmålet, ikke bare et hyppig emne. Det krever grenser, evidens og tolkning.'],
    ['Kvalitet og refleksivitet', 'Revisjonsspor, negative tilfeller, fagfellesamtaler, rik evidens og refleksive memoer gjør resonnementet etterprøvbart.'],
    ['Induktiv og deduktiv koding', 'Induktive koder utvikles fra data; deduktive koder kommer fra teori eller spørsmål. De kan kombineres når opphavet rapporteres tydelig.'],
    ['Semantisk og latent mening', 'Semantisk analyse undersøker eksplisitt mening; latent analyse tolker underliggende antakelser og strukturer og krever et tydelig teoretisk grunnlag.'],
    ['Designimplikasjoner', 'En implikasjon må følge av et mønster, respektere konteksten og peke ut en designretning uten å late som den er universell.'],
  ], keyPoints: ['Bevar et revisjonsspor fra data til påstand', 'Se etter unntak så vel som mønstre', 'Ikke forveksle sitat med analyse'], examPrompt: 'Forklar en forsvarlig tematisk analyse fra transkripsjon til temaer og designimplikasjoner.' },
  { title: 'Automatisert datainnsamling', summary: 'Logger og sensorer registrerer atferd i stor skala, men tekniske spor krever semantiske definisjoner, validering og kontekstuell tolkning.', concepts: [
    ['Instrumentering', 'Definer hendelser, egenskaper, identiteter, tidsstempler og versjoner før innsamling. Valider at implementert telemetri samsvarer med analysespesifikasjonen.'],
    ['Datakvalitet', 'Duplikater, manglende hendelser, botter, klokkefeil og produktendringer kan skape falske mønstre. Overvåking og proveniens er del av metoden.'],
    ['Slutning og personvern', 'Et spor viser at en hendelse ble registrert, ikke nødvendigvis brukerens intensjon. Dataminimering, tilgangskontroll, lagringstid og samtykke reduserer risiko.'],
    ['Hendelser og analyseenheter', 'Én brukerhandling kan gi flere logger. Sesjoner, brukere, enheter og handlinger er ulike analyseenheter og må ikke blandes.'],
    ['Manglende data', 'Logghull kan være systematiske på grunn av frakoblet bruk, blokkering, plattformfeil eller samtykke. Manglende observasjoner er ikke null.'],
    ['Kombinasjon av metoder', 'Logger viser omfanget av et mønster, mens intervju eller dagbok forklarer hvorfor. Integrasjon krever felles spørsmål, tidsrom og enhet.'],
  ], keyPoints: ['Definer semantiske hendelser før analyse', 'Valider telemetrien kontinuerlig', 'Ikke utled motivasjon fra klikk alene'], examPrompt: 'Vurder en loggstudie av funksjonsbruk med hendelsesdefinisjoner, manglende data, versjoner, slutninger, personvern og komplementære metoder.' },
  { title: 'Måling av mennesker', summary: 'Menneskelig prestasjon, erfaring og fysiologi krever operasjonelle definisjoner og flere mål med kjente begrensninger.', concepts: [
    ['Konstruksjoner og mål', 'En konstruksjon er begrepet av interesse; et mål er en observerbar indikator. Samstemte indikatorer styrker tolkningen når de faktisk gjelder samme konstruksjon.'],
    ['Spørreskjema og skalaer', 'Validerte flerleddsskalaer kan måle opplevd arbeidsbelastning, brukbarhet eller erfaring, men oversettelse og kontekst kan endre egenskapene deres.'],
    ['Atferds- og fysiologiske data', 'Prestasjon og sensormål virker objektive, men avhenger fortsatt av oppgaver, kalibrering, artefakter, forbehandling og teoretisk tolkning.'],
    ['Prestasjonsmål', 'Tid, nøyaktighet, feil og oppgavesuksess måler ulike sider. Avveiningen mellom fart og nøyaktighet gjør ett enkelt mål risikabelt.'],
    ['Selvrapportering', 'Selvrapport gir tilgang til opplevelser, men påvirkes av hukommelse, innramming og sosial ønskverdighet. Intensjon er ikke det samme som atferd.'],
    ['Fysiologiske mål', 'Blikksporing, puls og hudledning krever kalibrering og peker sjelden entydig på en psykologisk tilstand. Aktivering alene har ingen valens.'],
  ], keyPoints: ['Ikke likestill indikatoren med konstruksjonen', 'Kombiner mål av en tydelig grunn', 'Rapporter kalibrering, artefakter og tolkningsgrenser'], examPrompt: 'Operasjonaliser arbeidsbelastning med komplementære mål og forklar validitet, kalibrering og tolkningsrisiko.' },
  { title: 'Nettbasert og allestedsnærværende forskning', summary: 'Fjern-, mobil- og feltstudier øker rekkevidde og realisme, men reduserer kontroll over enheter, oppmerksomhet og kontekst.', concepts: [
    ['Design av fjernstudier', 'Instrukser, samtykke, oppgaver, støtte og debrief må fungere uten fysisk forskernærvær. Pilotér på aktuelle enheter og tilgjengelighetsinnstillinger.'],
    ['Kontekst og avbrudd', 'Sted, nettverk, multitasking og varsler påvirker atferd. Kontekstmetadata kan støtte tolkning, men også øke personvernrisikoen.'],
    ['Skala og deltakerkvalitet', 'Nettbasert rekruttering øker rekkevidden, ikke automatisk representativiteten. Rettferdig betaling og meningsfulle kvalitetssjekker støtter etikk og data.'],
    ['Kontroll av enhet', 'Skjermstørrelse, nettleser, input, forsinkelse og multitasking varierer. Kvalifiseringskontroller og metadata beskriver eller begrenser variasjonen.'],
    ['Crowdsourcing', 'Plattformer rekrutterer raskt på tvers av regioner, men arbeidsstyrken har egne normer og forskningserfaringer. Rettferdig betaling og tydelige avvisningsregler er viktige.'],
    ['Experience sampling', 'Tilfeldige, faste eller hendelsesutløste prompts balanserer sammenlignbarhet mot nærhet til erfaringen. Belastning og avbrytbarhet må piloteres.'],
  ], keyPoints: ['Design for deltakelse uten tilsyn', 'Håndter variasjon i enhet og kontekst eksplisitt', 'Bruk rettferdige og forholdsmessige kvalitetskontroller'], examPrompt: 'Planlegg en fjernbasert experience-sampling-studie og begrunn rekruttering, prompting, enhetskontroller, betaling, personvern og støtte.' },
  { title: 'Forskningsetikk og deltakere', summary: 'Etikk er et løpende metodisk ansvar: respekter autonomi, reduser skade, fordel byrder rettferdig og beskytt data.', concepts: [
    ['Informert samtykke', 'Samtykke må være frivillig, forståelig, spesifikt og løpende. Deltakere trenger realistisk informasjon om oppgaver, risiko, databruk og tilbaketrekking.'],
    ['Risiko og sårbarhet', 'Risiko omfatter fysisk, psykisk, sosial, økonomisk og informasjonsmessig skade. Sårbarhet er kontekstavhengig og kan oppstå ved avhengighet eller skjev makt.'],
    ['Personvern og datahåndtering', 'Samle bare nødvendige data, skill identifikatorer, begrens tilgang, fastsett lagringstid og vurder reidentifisering før anonymitet loves.'],
    ['Respekt, velgjørenhet og rettferdighet', 'Respekt støtter autonomi, velgjørenhet balanserer nytte og skade, og rettferdighet fordeler forskningens byrder og goder rimelig.'],
    ['Informasjonsrisiko', 'Kombinasjoner av tid, sted, rolle og sjelden atferd kan identifisere en person uten navn. Trusselmodellering undersøker tilgang og mulig skade.'],
    ['Tilbaketrekking og sletting', 'Deltakere trenger en brukbar vei ut, en frist for sletting og ærlige grenser etter aggregering eller anonymisering.'],
  ], keyPoints: ['Behandle samtykke som en prosess', 'Minimer både innsamling og lagringstid', 'Vurder makt, belastning og ekskludering gjennom hele studien'], examPrompt: 'Gjør en etisk vurdering av en studie med sensitive interaksjonslogger, inkludert samtykke, risiko, rettferdighet, tilbaketrekking og datahåndtering.' },
  { title: 'Forskning med personer med funksjonsnedsettelser', summary: 'Inkluderende forskning fjerner barrierer, respekterer erfaringskompetanse og tilpasser deltakelse uten å fremstille funksjonsnedsettelse som mangel.', concepts: [
    ['Inkluderende rekruttering', 'Rekrutter bredere enn praktiske organisasjoner, gjør materialet tilgjengelig, og budsjetter for kommunikasjon, støttepersoner, transport, tretthet og ekstra tid.'],
    ['Rimelige tilpasninger', 'Tilby fleksible kanaler, tidspunkt, input, pauser og kommunikasjonsformat. Spør hva som fungerer i stedet for å slutte fra en diagnose.'],
    ['Deltakende tilnærminger', 'Personer med funksjonsnedsettelser kan forme spørsmål, metoder, tolkning og designvalg som eksperter og partnere, med reell makt og betaling.'],
    ['Tilgjengelig samtykke', 'Tilby materiale for skjermleser, stor skrift, klart språk, teksting eller tolking etter ønske, og test tilgjengeligheten før sesjonen.'],
    ['Ableisme og mangelperspektiv', 'Studer interaksjonsbarrierer fremfor automatisk å plassere problemet i kroppen. Den sosiale modellen synliggjør miljø- og designbegrensninger.'],
    ['Meningsfull deltakelse', 'Deltakelse betyr innflytelse på beslutninger, ikke symbolsk tilstedeværelse. Tilgjengelig kommunikasjon, tid og betaling gjør samarbeidet reelt.'],
  ], keyPoints: ['Spør direkte om tilgjengelighetsbehov', 'Kompenser erfaringskompetanse', 'Rapporter designbarrierer uten mangelperspektiv'], examPrompt: 'Tilpass en vanlig brukertest for meningsfull deltakelse av personer med funksjonsnedsettelser, med tilgang, samtykke, tilpasning, makt og rapportering.' },
];

function toTopics(seeds: TopicSeed[]): CourseTopic[] {
  return russianTopics.map((source, index) => {
    const seed = seeds[index];
    return {
      ...source,
      title: seed.title,
      english: en[index].title,
      summary: seed.summary,
      sections: seed.concepts.map(([heading, body]) => ({ heading, body })),
      keyPoints: seed.keyPoints,
      examPrompt: seed.examPrompt,
      quiz: [],
    };
  });
}

export const englishTopics = toTopics(en);
export const norwegianTopics = toTopics(noText);

export function topicsForLocale(locale: Locale): CourseTopic[] {
  if (locale === 'en') return englishTopics;
  if (locale === 'no') return norwegianTopics;
  return russianTopics;
}
