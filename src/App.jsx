import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 1 — DATABASE (200 collocations, frasi con soggetto, traduzioni riviste)
// ═══════════════════════════════════════════════════════════════════════
const DB = [
  // ── WORK & BUSINESS (100 frasi) ──────────────────────────────────────
  { id:1,   it:"Il direttore prende le redini del progetto in ritardo.",            en:"The director takes the reins of the delayed project.",            cat:"Work & Business", lv:"B2" },
  { id:2,   it:"Il manager delega i compiti più urgenti ai membri del team.",       en:"The manager delegates the most urgent tasks to team members.",     cat:"Work & Business", lv:"B2" },
  { id:3,   it:"Le due aziende raggiungono un accordo vantaggioso per entrambe.",   en:"The two companies reach a mutually beneficial agreement.",         cat:"Work & Business", lv:"C1" },
  { id:4,   it:"Il team lancia una campagna di marketing mirata sui social media.", en:"The team launches a targeted marketing campaign on social media.", cat:"Work & Business", lv:"B2" },
  { id:5,   it:"Sara supera le aspettative del cliente con i suoi risultati.",      en:"Sara exceeds the client's expectations with her results.",         cat:"Work & Business", lv:"B2" },
  { id:6,   it:"Il responsabile stabilisce le priorità tra i compiti della settimana.", en:"The manager sets priorities among the week's tasks.",          cat:"Work & Business", lv:"B2" },
  { id:7,   it:"La direzione porta avanti le trattative commerciali da mesi.",      en:"Management has been carrying out commercial negotiations for months.", cat:"Work & Business", lv:"C1" },
  { id:8,   it:"Il CEO fa una presentazione convincente agli investitori.",         en:"The CEO gives a compelling pitch to investors.",                  cat:"Work & Business", lv:"C1" },
  { id:9,   it:"Le due parti risolvono il conflitto interno con la mediazione.",    en:"The two parties resolve the internal conflict through mediation.", cat:"Work & Business", lv:"B2" },
  { id:10,  it:"Il project manager monitora le performance del team settimanalmente.", en:"The project manager monitors the team's performance weekly.",   cat:"Work & Business", lv:"B2" },
  { id:11,  it:"L'azienda assume personale qualificato per la posizione vacante.",  en:"The company hires qualified staff for the vacant position.",      cat:"Work & Business", lv:"B2" },
  { id:12,  it:"Il team rispetta la scadenza nonostante le difficoltà impreviste.", en:"The team meets the deadline despite unexpected difficulties.",    cat:"Work & Business", lv:"B1" },
  { id:13,  it:"Marco presenta le sue dimissioni dopo anni di lavoro in azienda.",  en:"Marco hands in his resignation after years of working at the company.", cat:"Work & Business", lv:"B2" },
  { id:14,  it:"Giulia negozia un aumento di stipendio durante la valutazione annuale.", en:"Giulia negotiates a pay raise during the annual review.",    cat:"Work & Business", lv:"B2" },
  { id:15,  it:"L'avvocato redige un contratto vincolante tra le due società.",     en:"The lawyer draws up a binding contract between the two companies.", cat:"Work & Business", lv:"C1" },
  { id:16,  it:"Il nuovo direttore aumenta la produttività riducendo gli sprechi.", en:"The new director boosts productivity by cutting waste.",          cat:"Work & Business", lv:"C1" },
  { id:17,  it:"Il responsabile costruisce un rapporto di fiducia con il suo team.", en:"The manager builds a relationship of trust with their team.",    cat:"Work & Business", lv:"B2" },
  { id:18,  it:"Paolo fa rete con i professionisti del settore alla conferenza.",   en:"Paolo networks with industry professionals at the conference.",   cat:"Work & Business", lv:"B2" },
  { id:19,  it:"L'azienda apre una nuova sede in un mercato emergente dell'Asia.", en:"The company opens a new branch in an emerging Asian market.",     cat:"Work & Business", lv:"C1" },
  { id:20,  it:"Il responsabile HR gestisce un team multiculturale da remoto.",     en:"The HR manager manages a multicultural team remotely.",           cat:"Work & Business", lv:"C1" },
  { id:21,  it:"Laura si candida per una posizione dirigenziale in una grande azienda.", en:"Laura applies for a managerial position at a major company.", cat:"Work & Business", lv:"B2" },
  { id:22,  it:"La direttrice conduce un colloquio di lavoro approfondito con il candidato.", en:"The director conducts an in-depth job interview with the candidate.", cat:"Work & Business", lv:"B2" },
  { id:23,  it:"L'azienda incrementa il fatturato del venti per cento in un anno.", en:"The company increases revenue by twenty percent in one year.",    cat:"Work & Business", lv:"C1" },
  { id:24,  it:"Il team porta a termine il progetto con successo entro i tempi.",   en:"The team successfully completes the project on time.",            cat:"Work & Business", lv:"B1" },
  { id:25,  it:"Le due imprese istituiscono una partnership strategica nel settore.", en:"The two companies establish a strategic partnership in the sector.", cat:"Work & Business", lv:"C1" },
  { id:26,  it:"Il direttore fissa obiettivi chiari per il prossimo trimestre.",    en:"The director sets clear goals for the next quarter.",             cat:"Work & Business", lv:"B2" },
  { id:27,  it:"Lo scandalo mette a rischio la reputazione dell'azienda sul mercato.", en:"The scandal jeopardizes the company's reputation in the market.", cat:"Work & Business", lv:"C1" },
  { id:28,  it:"Le parti raggiungono il punto di svolta nella trattativa difficile.", en:"The parties reach a turning point in the tough negotiation.",   cat:"Work & Business", lv:"C1" },
  { id:29,  it:"Il consiglio di amministrazione affronta la crisi con metodo e calma.", en:"The board of directors handles the crisis calmly and methodically.", cat:"Work & Business", lv:"B2" },
  { id:30,  it:"L'azienda mette in pratica la nuova strategia commerciale da gennaio.", en:"The company puts the new commercial strategy into practice from January.", cat:"Work & Business", lv:"B2" },
  { id:31,  it:"Il CFO riduce i costi operativi senza compromettere la qualità.",  en:"The CFO reduces operational costs without compromising quality.",  cat:"Work & Business", lv:"C1" },
  { id:32,  it:"Le due società avviano una collaborazione con un partner internazionale.", en:"The two companies launch a collaboration with an international partner.", cat:"Work & Business", lv:"B2" },
  { id:33,  it:"Il leader guida il team attraverso un periodo di crisi con determinazione.", en:"The leader guides the team through a crisis period with determination.", cat:"Work & Business", lv:"C1" },
  { id:34,  it:"L'azienda acquisisce nuovi clienti grazie a una campagna ben mirata.", en:"The company acquires new clients thanks to a well-targeted campaign.", cat:"Work & Business", lv:"B2" },
  { id:35,  it:"Il reparto QA garantisce la qualità del prodotto prima del lancio.", en:"The QA team ensures product quality before the launch.",          cat:"Work & Business", lv:"B2" },
  { id:36,  it:"La direttrice valuta le prestazioni del personale ogni sei mesi.", en:"The director evaluates staff performance every six months.",      cat:"Work & Business", lv:"B2" },
  { id:37,  it:"Il responsabile sviluppa un piano d'azione per il prossimo anno.", en:"The manager develops an action plan for the coming year.",        cat:"Work & Business", lv:"B2" },
  { id:38,  it:"Il team rispetta il budget assegnato senza mai sforarlo.",          en:"The team sticks to the assigned budget without ever exceeding it.", cat:"Work & Business", lv:"B2" },
  { id:39,  it:"Il collaboratore fa rapporto al suo supervisore ogni lunedì mattina.", en:"The employee reports to their supervisor every Monday morning.", cat:"Work & Business", lv:"B1" },
  { id:40,  it:"Il commerciale prende in carico il nuovo cliente con attenzione.", en:"The sales rep takes on the new client with care.",                cat:"Work & Business", lv:"B2" },
  { id:41,  it:"Le due aziende firmano un accordo commerciale molto vantaggioso.", en:"The two companies sign a highly lucrative commercial agreement.",  cat:"Work & Business", lv:"C1" },
  { id:42,  it:"L'impresa batte la concorrenza grazie ai suoi prodotti innovativi.", en:"The company beats the competition thanks to its innovative products.", cat:"Work & Business", lv:"B2" },
  { id:43,  it:"Il direttore deve fare fronte ai debiti accumulati negli ultimi anni.", en:"The director has to face up to the debts accumulated over the years.", cat:"Work & Business", lv:"C1" },
  { id:44,  it:"Il consiglio mette in discussione la strategia aziendale attuale.", en:"The board calls the current business strategy into question.",    cat:"Work & Business", lv:"C1" },
  { id:45,  it:"L'HR forma i dipendenti sulle nuove procedure operative aziendali.", en:"HR trains employees on the company's new operating procedures.", cat:"Work & Business", lv:"B2" },
  { id:46,  it:"La manager definisce confini chiari tra vita lavorativa e privata.", en:"The manager sets clear boundaries between work and personal life.", cat:"Work & Business", lv:"B2" },
  { id:47,  it:"L'azienda ottiene il finanziamento necessario per il nuovo progetto.", en:"The company secures the necessary funding for the new project.", cat:"Work & Business", lv:"C1" },
  { id:48,  it:"L'azienda perde un cliente importante a causa di un grave errore.", en:"The company loses an important client due to a serious mistake.", cat:"Work & Business", lv:"B2" },
  { id:49,  it:"La startup coglie un'opportunità di mercato prima dei concorrenti.", en:"The startup seizes a market opportunity before its competitors.", cat:"Work & Business", lv:"C1" },
  { id:50,  it:"Il CEO fa una proposta formale al consiglio di amministrazione.",   en:"The CEO makes a formal proposal to the board of directors.",     cat:"Work & Business", lv:"C1" },
  { id:51,  it:"Il team di marketing rilancia un prodotto che non stava performando.", en:"The marketing team relaunches an underperforming product.",    cat:"Work & Business", lv:"C1" },
  { id:52,  it:"Il team leader mantiene un alto livello di motivazione nel gruppo.", en:"The team leader maintains a high level of motivation within the group.", cat:"Work & Business", lv:"B2" },
  { id:53,  it:"L'azienda rispetta le norme etiche e il codice di condotta interno.", en:"The company complies with ethical standards and its internal code of conduct.", cat:"Work & Business", lv:"C1" },
  { id:54,  it:"Il CFO presenta i risultati trimestrali agli azionisti dell'azienda.", en:"The CFO presents the quarterly results to the company's shareholders.", cat:"Work & Business", lv:"C1" },
  { id:55,  it:"Il responsabile sfrutta i dati analitici per prendere decisioni migliori.", en:"The manager leverages analytics to make better decisions.",  cat:"Work & Business", lv:"C1" },
  { id:56,  it:"Il direttore HR affronta un colloquio difficile con un dipendente.", en:"The HR director has a difficult conversation with an employee.",  cat:"Work & Business", lv:"C1" },
  { id:57,  it:"Il responsabile commerciale fa rete a un grande evento del settore.", en:"The sales manager networks at a major industry event.",          cat:"Work & Business", lv:"B2" },
  { id:58,  it:"Il team elabora un piano di emergenza per possibili crisi future.", en:"The team draws up a contingency plan for potential future crises.", cat:"Work & Business", lv:"C1" },
  { id:59,  it:"Il nuovo prodotto soddisfa le aspettative del mercato fin dal lancio.", en:"The new product meets market expectations from the very launch.", cat:"Work & Business", lv:"B2" },
  { id:60,  it:"Il manager porta avanti due progetti in parallelo senza errori.",   en:"The manager runs two projects in parallel without making errors.", cat:"Work & Business", lv:"C1" },
  { id:61,  it:"L'azienda costruisce un brand riconoscibile nel proprio settore di riferimento.", en:"The company builds a recognizable brand in its industry.", cat:"Work & Business", lv:"B2" },
  { id:62,  it:"Il responsabile assume un approccio proattivo ai problemi operativi.", en:"The manager takes a proactive approach to operational issues.", cat:"Work & Business", lv:"C1" },
  { id:63,  it:"Il collaboratore mette le proprie competenze a disposizione del team.", en:"The employee puts their skills at the team's disposal.",       cat:"Work & Business", lv:"B2" },
  { id:64,  it:"L'impresa ottiene un vantaggio competitivo nel mercato globale.",   en:"The company gains a competitive edge in the global market.",      cat:"Work & Business", lv:"C1" },
  { id:65,  it:"Il responsabile fa il punto della situazione con tutti i membri del team.", en:"The manager takes stock of the situation with all team members.", cat:"Work & Business", lv:"B2" },
  { id:66,  it:"La direzione supera le resistenze interne al cambiamento con pazienza.", en:"Management overcomes internal resistance to change with patience.", cat:"Work & Business", lv:"C1" },
  { id:67,  it:"Il responsabile delega i compiti in modo efficace per ottimizzare i tempi.", en:"The manager delegates tasks effectively to optimize time.", cat:"Work & Business", lv:"B2" },
  { id:68,  it:"La società consolida la propria posizione nel mercato locale.",     en:"The company consolidates its position in the local market.",      cat:"Work & Business", lv:"C1" },
  { id:69,  it:"Il nuovo direttore prende le redini di un team in piena difficoltà.", en:"The new director takes the reins of a team in serious difficulty.", cat:"Work & Business", lv:"B2" },
  { id:70,  it:"Il fornitore non rispetta la scadenza prevista nel contratto di fornitura.", en:"The supplier fails to meet the deadline set out in the supply contract.", cat:"Work & Business", lv:"B1" },
  { id:71,  it:"Il responsabile commerciale costruisce un network solido nel settore.", en:"The sales manager builds a solid professional network in the industry.", cat:"Work & Business", lv:"B2" },
  { id:72,  it:"Il controller fa una stima realistica dei costi di produzione.",    en:"The controller makes a realistic estimate of production costs.",   cat:"Work & Business", lv:"B2" },
  { id:73,  it:"Il responsabile apre un dialogo diretto tra i reparti dell'azienda.", en:"The manager opens a direct dialogue between company departments.", cat:"Work & Business", lv:"B2" },
  { id:74,  it:"L'azienda protegge la propria proprietà intellettuale con i brevetti.", en:"The company protects its intellectual property with patents.", cat:"Work & Business", lv:"C1" },
  { id:75,  it:"Il consulente individua le aree di miglioramento nel flusso di lavoro.", en:"The consultant identifies areas for improvement in the workflow.", cat:"Work & Business", lv:"B2" },
  { id:76,  it:"Il responsabile fa rapporto direttamente all'amministratore delegato.", en:"The manager reports directly to the CEO.",                     cat:"Work & Business", lv:"B2" },
  { id:77,  it:"Il controller tiene traccia di tutte le spese operative del mese.", en:"The controller keeps track of all operational expenses that month.", cat:"Work & Business", lv:"B1" },
  { id:78,  it:"Il team supera le aspettative degli azionisti con risultati record.", en:"The team exceeds shareholder expectations with record-breaking results.", cat:"Work & Business", lv:"C1" },
  { id:79,  it:"Il legale negozia le condizioni contrattuali prima della firma finale.", en:"The legal counsel negotiates the contractual terms before the final signing.", cat:"Work & Business", lv:"B2" },
  { id:80,  it:"Il team lavora sotto pressione rispettando tutte le scadenze concordate.", en:"The team works under pressure while meeting all agreed deadlines.", cat:"Work & Business", lv:"B2" },
  { id:81,  it:"Il nuovo responsabile aumenta la quota di mercato dell'azienda del quindici percento.", en:"The new manager increases the company's market share by fifteen percent.", cat:"Work & Business", lv:"C1" },
  { id:82,  it:"Il management elabora un piano aziendale solido per i prossimi cinque anni.", en:"Management draws up a solid business plan for the next five years.", cat:"Work & Business", lv:"C1" },
  { id:83,  it:"La direttrice forma una squadra affiatata e multidisciplinare.",    en:"The director builds a close-knit, multidisciplinary team.",        cat:"Work & Business", lv:"B2" },
  { id:84,  it:"Il manager trasforma un feedback negativo in un'opportunità di crescita.", en:"The manager turns negative feedback into an opportunity for growth.", cat:"Work & Business", lv:"C1" },
  { id:85,  it:"Il team gestisce le aspettative del cliente per tutta la durata del progetto.", en:"The team manages client expectations throughout the entire project.", cat:"Work & Business", lv:"B2" },
  { id:86,  it:"La direzione prende una decisione difficile entro tempi molto stretti.", en:"Management makes a tough decision within a very tight timeframe.", cat:"Work & Business", lv:"B2" },
  { id:87,  it:"L'azienda lancia un nuovo prodotto sul mercato internazionale in primavera.", en:"The company launches a new product on the international market in spring.", cat:"Work & Business", lv:"B2" },
  { id:88,  it:"La startup coglie l'opportunità di espandersi in nuovi mercati esteri.", en:"The startup seizes the opportunity to expand into new foreign markets.", cat:"Work & Business", lv:"C1" },
  { id:89,  it:"Il responsabile pianifica con anticipo ogni fase critica del progetto.", en:"The manager plans well in advance for every critical phase of the project.", cat:"Work & Business", lv:"B2" },
  { id:90,  it:"Il team porta avanti una revisione completa dei processi produttivi.", en:"The team carries out a complete review of the production processes.", cat:"Work & Business", lv:"C1" },
  { id:91,  it:"Il responsabile stabilisce aspettative realistiche con il cliente prima di iniziare.", en:"The manager sets realistic expectations with the client before starting.", cat:"Work & Business", lv:"B2" },
  { id:92,  it:"Il team porta risultati concreti in modo costante nel corso del tempo.", en:"The team delivers consistent results consistently over time.",    cat:"Work & Business", lv:"B2" },
  { id:93,  it:"L'azienda riduce il turnover del personale grazie a benefit migliori.", en:"The company reduces staff turnover thanks to better benefits.",  cat:"Work & Business", lv:"C1" },
  { id:94,  it:"Il responsabile rende conto ai propri superiori dei risultati ottenuti.", en:"The manager is accountable to their superiors for the results achieved.", cat:"Work & Business", lv:"B2" },
  { id:95,  it:"Le due aziende aprono nuove opportunità di business grazie alla collaborazione.", en:"The two companies open up new business opportunities through their collaboration.", cat:"Work & Business", lv:"C1" },
  { id:96,  it:"Il team fissa riunioni settimanali per allinearsi sugli obiettivi.",  en:"The team schedules weekly meetings to align on objectives.",       cat:"Work & Business", lv:"B1" },
  { id:97,  it:"L'azienda massimizza il ritorno sull'investimento pubblicitario.",   en:"The company maximizes the return on its advertising investment.",  cat:"Work & Business", lv:"C1" },
  { id:98,  it:"Il responsabile prende in considerazione il feedback del cliente prima di agire.", en:"The manager takes the client's feedback into account before acting.", cat:"Work & Business", lv:"B2" },
  { id:99,  it:"Il team di vendita conclude le trattative entro la fine del mese.", en:"The sales team concludes negotiations by the end of the month.",   cat:"Work & Business", lv:"B2" },
  { id:100, it:"La direzione mette in campo tutte le risorse disponibili per completare il lavoro.", en:"Management deploys all available resources to complete the work.", cat:"Work & Business", lv:"C1" },

  // ── DAILY LIFE (100 frasi) ───────────────────────────────────────────
  { id:101, it:"Marco fa una passeggiata rigenerante prima di andare in ufficio.", en:"Marco goes for an invigorating walk before heading to the office.", cat:"Daily Life", lv:"B1" },
  { id:102, it:"Giulia perde il conto del tempo mentre legge un romanzo sul divano.", en:"Giulia loses track of time while reading a novel on the couch.", cat:"Daily Life", lv:"B2" },
  { id:103, it:"La famiglia tiene a mente le priorità importanti della settimana.", en:"The family bears in mind the important priorities of the week.",  cat:"Daily Life", lv:"B2" },
  { id:104, it:"Sara fa una colazione abbondante per iniziare bene la giornata.",  en:"Sara has a hearty breakfast to start the day off right.",         cat:"Daily Life", lv:"A2" },
  { id:105, it:"Luca prende una decisione difficile in poco tempo senza rimpianti.", en:"Luca makes a tough decision quickly and without regrets.",        cat:"Daily Life", lv:"B1" },
  { id:106, it:"Il vicino di casa si fa i fatti suoi senza interferire nella vita altrui.", en:"The neighbor minds his own business without interfering in other people's lives.", cat:"Daily Life", lv:"B1" },
  { id:107, it:"Anna si prende una pausa meritata dopo ore di lavoro intenso.",   en:"Anna takes a well-deserved break after hours of intense work.",    cat:"Daily Life", lv:"A2" },
  { id:108, it:"Pietro da per scontato quello che ha senza rendersene conto.",    en:"Pietro takes for granted what he has without realizing it.",       cat:"Daily Life", lv:"B2" },
  { id:109, it:"La coppia fa fatica a far quadrare i conti alla fine del mese.",  en:"The couple struggles to make ends meet at the end of the month.", cat:"Daily Life", lv:"B2" },
  { id:110, it:"Marco corre il rischio di sbagliare di nuovo la stessa cosa.",    en:"Marco runs the risk of making the same mistake again.",           cat:"Daily Life", lv:"B2" },
  { id:111, it:"La madre presta attenzione ai segnali di allarme nella salute del figlio.", en:"The mother pays attention to the warning signs in her son's health.", cat:"Daily Life", lv:"B1" },
  { id:112, it:"Giulia si trova a fare una scelta di vita importante a un bivio.", en:"Giulia finds herself making an important life choice at a crossroads.", cat:"Daily Life", lv:"B1" },
  { id:113, it:"Luca esce dalla propria zona di comfort iscrivendosi a un corso di teatro.", en:"Luca steps out of his comfort zone by signing up for a drama class.", cat:"Daily Life", lv:"B2" },
  { id:114, it:"Sara fa buon uso del tempo libero del weekend imparando il giapponese.", en:"Sara makes good use of her free weekend time learning Japanese.", cat:"Daily Life", lv:"B1" },
  { id:115, it:"I bambini rimettono i giochi al proprio posto dopo averli usati.", en:"The children put the toys back in their place after using them.", cat:"Daily Life", lv:"A2" },
  { id:116, it:"Marco perde la calma in una situazione particolarmente stressante.", en:"Marco loses his temper in a particularly stressful situation.",  cat:"Daily Life", lv:"B1" },
  { id:117, it:"Anna dorme a lungo il sabato mattina per recuperare le energie.",  en:"Anna sleeps in on Saturday morning to recover her energy.",       cat:"Daily Life", lv:"A2" },
  { id:118, it:"Pietro fa del suo meglio anche nelle situazioni più difficili.",   en:"Pietro does his best even in the most difficult situations.",     cat:"Daily Life", lv:"B1" },
  { id:119, it:"Sara tiene la situazione sotto controllo nonostante il caos.",     en:"Sara keeps the situation under control despite the chaos.",        cat:"Daily Life", lv:"B1" },
  { id:120, it:"Marco coglie l'opportunità al momento giusto senza esitare.",      en:"Marco seizes the opportunity at the right moment without hesitating.", cat:"Daily Life", lv:"B2" },
  { id:121, it:"Giulia fa la lista della spesa prima di andare al supermercato.", en:"Giulia makes a shopping list before going to the supermarket.",   cat:"Daily Life", lv:"A2" },
  { id:122, it:"Luca perde il conto delle ore quando è completamente assorbito nel lavoro.", en:"Luca loses track of the hours when he is completely absorbed in his work.", cat:"Daily Life", lv:"B1" },
  { id:123, it:"La madre tiene testa a una situazione complicata con molta calma.", en:"The mother stands her ground in a complicated situation very calmly.", cat:"Daily Life", lv:"B2" },
  { id:124, it:"Pietro fa il punto della situazione dopo una giornata particolarmente impegnativa.", en:"Pietro takes stock of the situation after a particularly demanding day.", cat:"Daily Life", lv:"B2" },
  { id:125, it:"Anna rimanda le decisioni importanti troppo a lungo per paura.",   en:"Anna puts off important decisions for too long out of fear.",      cat:"Daily Life", lv:"B2" },
  { id:126, it:"Sara mette da parte un po' di soldi ogni mese per comprare casa.", en:"Sara puts money aside every month to buy a house.",               cat:"Daily Life", lv:"B1" },
  { id:127, it:"Marco prende sul serio i propri problemi di salute e va dal medico.", en:"Marco takes his health issues seriously and goes to the doctor.", cat:"Daily Life", lv:"B1" },
  { id:128, it:"Giulia porta avanti una conversazione difficile con coraggio.",    en:"Giulia carries on a difficult conversation with courage.",         cat:"Daily Life", lv:"B2" },
  { id:129, it:"Pietro fa affidamento sui propri amici nei momenti di bisogno.",   en:"Pietro relies on his friends in times of need.",                  cat:"Daily Life", lv:"B2" },
  { id:130, it:"Anna sta al passo con le ultime notizie leggendo ogni mattina.",   en:"Anna keeps up with the latest news by reading every morning.",    cat:"Daily Life", lv:"B1" },
  { id:131, it:"Luca perde la speranza dopo una lunga serie di insuccessi personali.", en:"Luca loses hope after a long series of personal failures.",    cat:"Daily Life", lv:"B2" },
  { id:132, it:"Marco prende l'iniziativa senza aspettare che qualcuno lo faccia per lui.", en:"Marco takes the initiative without waiting for someone else to do it.", cat:"Daily Life", lv:"B2" },
  { id:133, it:"I colleghi si prendono una pausa caffè per ricaricarsi dopo le riunioni.", en:"The colleagues take a coffee break to recharge after the meetings.", cat:"Daily Life", lv:"A2" },
  { id:134, it:"Sara si prende cura dei suoi figli con tutta la dedizione possibile.", en:"Sara takes care of her children with all the dedication she can.", cat:"Daily Life", lv:"A2" },
  { id:135, it:"Pietro tiene un diario personale per riflettere sulla sua giornata.", en:"Pietro keeps a personal diary to reflect on his day.",           cat:"Daily Life", lv:"B1" },
  { id:136, it:"La famiglia fa una gita fuori porta in campagna durante il weekend.", en:"The family goes on a day trip to the countryside over the weekend.", cat:"Daily Life", lv:"A2" },
  { id:137, it:"Giulia corre il rischio di perdere tutto se non agisce subito.",   en:"Giulia runs the risk of losing everything if she doesn't act now.", cat:"Daily Life", lv:"B2" },
  { id:138, it:"Marco ha a che fare con persone difficili praticamente ogni giorno.", en:"Marco has to deal with difficult people on an almost daily basis.", cat:"Daily Life", lv:"B2" },
  { id:139, it:"Anna prende una boccata d'aria fresca dopo ore chiusa in casa.",   en:"Anna gets some fresh air after hours spent cooped up at home.",   cat:"Daily Life", lv:"A2" },
  { id:140, it:"Pietro trova il giusto equilibrio tra impegni lavorativi e tempo libero.", en:"Pietro strikes the right balance between work commitments and free time.", cat:"Daily Life", lv:"B2" },
  { id:141, it:"Luca affronta le proprie paure con coraggio ogni giorno un po' di più.", en:"Luca faces his fears with courage, a little more every day.",  cat:"Daily Life", lv:"B2" },
  { id:142, it:"Sara mette a tacere le voci negative nella sua testa con la meditazione.", en:"Sara silences the negative voices in her head through meditation.", cat:"Daily Life", lv:"C1" },
  { id:143, it:"Marco esce dalla routine quotidiana e prova qualcosa di completamente nuovo.", en:"Marco breaks out of his daily routine and tries something completely new.", cat:"Daily Life", lv:"B2" },
  { id:144, it:"Giulia tiene a bada lo stress praticando sport tre volte a settimana.", en:"Giulia keeps stress at bay by playing sports three times a week.", cat:"Daily Life", lv:"B2" },
  { id:145, it:"Anna fa tutto il possibile per aiutare la sua amica in difficoltà.", en:"Anna does everything in her power to help her friend in need.",  cat:"Daily Life", lv:"B2" },
  { id:146, it:"Pietro perde un'occasione d'oro per non aver agito in tempo.",     en:"Pietro misses a golden opportunity by not acting in time.",        cat:"Daily Life", lv:"B2" },
  { id:147, it:"Luca prende le cose con filosofia e non drammatizza mai eccessivamente.", en:"Luca takes things in stride and never overreacts.",           cat:"Daily Life", lv:"C1" },
  { id:148, it:"Sara usa il buon senso quando deve prendere decisioni quotidiane.", en:"Sara uses common sense when making everyday decisions.",           cat:"Daily Life", lv:"B1" },
  { id:149, it:"Marco porta a termine quello che ha iniziato, anche quando è difficile.", en:"Marco follows through on what he has started, even when it's hard.", cat:"Daily Life", lv:"B2" },
  { id:150, it:"Giulia mette in ordine la casa prima che arrivino gli ospiti.",    en:"Giulia tidies the house before the guests arrive.",                cat:"Daily Life", lv:"A2" },
  { id:151, it:"Pietro sta alla larga dai problemi e cerca di non mettersi nei guai.", en:"Pietro steers clear of trouble and tries not to get into difficulties.", cat:"Daily Life", lv:"B2" },
  { id:152, it:"Anna trova conforto nelle piccole cose belle della vita quotidiana.", en:"Anna finds comfort in the small beautiful things of everyday life.", cat:"Daily Life", lv:"B1" },
  { id:153, it:"Luca prende atto della situazione e la accetta per quello che è.", en:"Luca comes to terms with the situation and accepts it for what it is.", cat:"Daily Life", lv:"B2" },
  { id:154, it:"Sara tende un occhio di riguardo per i genitori anziani ogni giorno.", en:"Sara keeps a watchful eye on her elderly parents every day.",   cat:"Daily Life", lv:"B2" },
  { id:155, it:"Marco continua a rimandare il dentista, trovando ogni volta una scusa.", en:"Marco keeps putting off the dentist, finding a new excuse every time.", cat:"Daily Life", lv:"B1" },
  { id:156, it:"Giulia ha spesso la testa tra le nuvole quando è stanca.",         en:"Giulia often has her head in the clouds when she is tired.",       cat:"Daily Life", lv:"B1" },
  { id:157, it:"Pietro fa uno sforzo autentico per mantenere vive le amicizie a distanza.", en:"Pietro makes a genuine effort to keep his long-distance friendships alive.", cat:"Daily Life", lv:"B1" },
  { id:158, it:"Anna si prende un giorno di ferie per ricaricarsi e ritrovare l'energia.", en:"Anna takes a day off to recharge and regain her energy.",   cat:"Daily Life", lv:"B1" },
  { id:159, it:"Marco porta pazienza in una situazione che sembra completamente fuori controllo.", en:"Marco exercises patience in a situation that seems completely out of control.", cat:"Daily Life", lv:"B2" },
  { id:160, it:"Giulia tiene d'occhio le spese per non sforare mai il budget mensile.", en:"Giulia keeps an eye on her spending so as never to exceed her monthly budget.", cat:"Daily Life", lv:"B1" },
  { id:161, it:"Pietro dà una mano ai vicini di casa ogni volta che ne hanno bisogno.", en:"Pietro gives his neighbors a hand whenever they need one.",    cat:"Daily Life", lv:"A2" },
  { id:162, it:"Sara fa una scelta ponderata senza farsi trascinare dalle emozioni.", en:"Sara makes a considered choice without letting herself be swept away by emotions.", cat:"Daily Life", lv:"B2" },
  { id:163, it:"Luca si prende il tempo necessario per pensare prima di rispondere.", en:"Luca takes the time he needs to think before replying.",         cat:"Daily Life", lv:"B2" },
  { id:164, it:"Marco ha le idee chiare su quello che vuole dalla propria vita.",   en:"Marco has a clear idea of what he wants from his life.",           cat:"Daily Life", lv:"B2" },
  { id:165, it:"Anna va a nuotare al mattino per iniziare la giornata in forma.",  en:"Anna goes for a morning swim to start the day feeling fit.",       cat:"Daily Life", lv:"A2" },
  { id:166, it:"Pietro mette da parte l'orgoglio e chiede aiuto quando ne ha bisogno.", en:"Pietro sets his pride aside and asks for help when he needs it.", cat:"Daily Life", lv:"B2" },
  { id:167, it:"Giulia tiene fede alle proprie promesse anche quando non è comodo.", en:"Giulia keeps her promises even when it is not convenient.",       cat:"Daily Life", lv:"B2" },
  { id:168, it:"Marco fa una donazione mensile a un'associazione benefica locale.", en:"Marco makes a monthly donation to a local charitable organization.", cat:"Daily Life", lv:"B1" },
  { id:169, it:"Luca perde la calma alla guida in mezzo al traffico caotico del mattino.", en:"Luca loses his temper while driving in the chaotic morning traffic.", cat:"Daily Life", lv:"B1" },
  { id:170, it:"Sara prende la vita con più leggerezza da quando ha iniziato a meditare.", en:"Sara takes life more lightly since she started meditating.", cat:"Daily Life", lv:"B2" },
  { id:171, it:"Pietro fa cose spontanee senza pianificare nulla in anticipo.",    en:"Pietro does spontaneous things without planning anything in advance.", cat:"Daily Life", lv:"A2" },
  { id:172, it:"Anna rimane in buona salute seguendo abitudini sane e costanti.", en:"Anna stays in good health by following healthy and consistent habits.", cat:"Daily Life", lv:"B1" },
  { id:173, it:"Marco ha sempre un piano B nel caso in cui le cose non vadano come previsto.", en:"Marco always has a backup plan in case things don't go as expected.", cat:"Daily Life", lv:"B2" },
  { id:174, it:"Giulia tiene le emozioni sotto controllo anche nelle situazioni più difficili.", en:"Giulia keeps her emotions under control even in the most difficult situations.", cat:"Daily Life", lv:"B2" },
  { id:175, it:"Pietro presta attenzione alle truffe online per non cadere nei tranelli.", en:"Pietro watches out for online scams so as not to fall into their traps.", cat:"Daily Life", lv:"B1" },
  { id:176, it:"Sara porta rispetto a tutte le persone indipendentemente dalle differenze.", en:"Sara shows respect to all people regardless of their differences.", cat:"Daily Life", lv:"B1" },
  { id:177, it:"Marco mette a frutto il suo talento artistico nel tempo libero.", en:"Marco puts his artistic talent to good use in his free time.",     cat:"Daily Life", lv:"B2" },
  { id:178, it:"Anna sta al passo con i tempi che cambiano e si aggiorna continuamente.", en:"Anna keeps up with the changing times and continuously updates her skills.", cat:"Daily Life", lv:"B2" },
  { id:179, it:"Luca dà il buon esempio ai suoi figli con i propri comportamenti.", en:"Luca sets a good example for his children through his own behavior.", cat:"Daily Life", lv:"B1" },
  { id:180, it:"Marco fa a meno del telefono per alcune ore ogni giorno deliberatamente.", en:"Marco deliberately goes without his phone for a few hours every day.", cat:"Daily Life", lv:"B1" },
  { id:181, it:"Giulia tiene la mente aperta di fronte a idee e prospettive nuove.", en:"Giulia keeps an open mind when faced with new ideas and perspectives.", cat:"Daily Life", lv:"B2" },
  { id:182, it:"Pietro fa tesoro di ogni esperienza vissuta, anche di quelle negative.", en:"Pietro treasures every experience he has been through, including the negative ones.", cat:"Daily Life", lv:"B2" },
  { id:183, it:"Sara sta con i piedi per terra e non perde mai il senso della realtà.", en:"Sara keeps her feet on the ground and never loses touch with reality.", cat:"Daily Life", lv:"B2" },
  { id:184, it:"Marco ha il coraggio di ricominciare dopo un grande fallimento personale.", en:"Marco has the courage to start over after a major personal failure.", cat:"Daily Life", lv:"C1" },
  { id:185, it:"Anna fa un passo indietro per vedere la situazione con più chiarezza.", en:"Anna takes a step back to see the situation more clearly.",       cat:"Daily Life", lv:"B2" },
  { id:186, it:"Luca mette il cuore in tutto quello che fa, senza mai risparmiarsi.", en:"Luca puts his heart into everything he does, never holding back.", cat:"Daily Life", lv:"B2" },
  { id:187, it:"Pietro fa i conti con un passato difficile e riesce finalmente ad andare avanti.", en:"Pietro comes to terms with a difficult past and finally manages to move forward.", cat:"Daily Life", lv:"C1" },
  { id:188, it:"Sara tiene alto il morale della famiglia nei momenti più bui.",    en:"Sara keeps the family's morale high during the darkest moments.",  cat:"Daily Life", lv:"C1" },
  { id:189, it:"Marco fa buon uso delle risorse a disposizione per realizzare i propri sogni.", en:"Marco makes the most of the resources available to him to pursue his dreams.", cat:"Daily Life", lv:"B2" },
  { id:190, it:"Giulia prende coscienza dei propri errori e impara da ognuno di essi.", en:"Giulia becomes aware of her mistakes and learns from each one of them.", cat:"Daily Life", lv:"B2" },
  { id:191, it:"Pietro porta avanti i propri sogni nonostante le difficoltà che incontra.", en:"Pietro pursues his dreams despite the difficulties he encounters.", cat:"Daily Life", lv:"B2" },
  { id:192, it:"Anna prende la cosa nel verso giusto e non si lascia mai scoraggiare.", en:"Anna takes things the right way and never lets herself get discouraged.", cat:"Daily Life", lv:"B2" },
  { id:193, it:"Luca fa una passeggiata serale dopo cena per staccare la mente dal lavoro.", en:"Luca goes for an evening walk after dinner to take his mind off work.", cat:"Daily Life", lv:"A2" },
  { id:194, it:"Marco fa un'eccezione alla regola in modo consapevole in quella circostanza.", en:"Marco makes a conscious exception to the rule in that particular circumstance.", cat:"Daily Life", lv:"B2" },
  { id:195, it:"Sara fa esperienza di culture diverse viaggiando ogni volta che può.", en:"Sara gains experience of different cultures by traveling whenever she can.", cat:"Daily Life", lv:"B2" },
  { id:196, it:"Pietro ha a cuore il benessere di tutta la sua famiglia allargata.", en:"Pietro has the well-being of his entire extended family at heart.", cat:"Daily Life", lv:"B2" },
  { id:197, it:"Anna si fa forza e affronta la situazione difficile senza tirarsi indietro.", en:"Anna pulls herself together and faces the difficult situation without backing down.", cat:"Daily Life", lv:"B2" },
  { id:198, it:"Luca rimane in contatto con i suoi amici di infanzia attraverso i social.", en:"Luca stays in touch with his childhood friends through social media.", cat:"Daily Life", lv:"A2" },
  { id:199, it:"Marco fa del volontariato il sabato mattina per dare un contributo alla comunità.", en:"Marco does volunteer work on Saturday mornings to give something back to the community.", cat:"Daily Life", lv:"B2" },
  { id:200, it:"Sara fa una netta distinzione tra la vita personale e quella professionale.", en:"Sara draws a clear distinction between her personal and professional life.", cat:"Daily Life", lv:"B2" },
];

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 1 — PREPOSITIONS DATABASE (105 exercises)
// ═══════════════════════════════════════════════════════════════════════
const PREPS = [
  { id:1,  s:"She is very good ___ mathematics.",                      a:"at",    opts:["at","in","for","with"] },
  { id:2,  s:"He is interested ___ learning new languages.",           a:"in",    opts:["in","at","for","about"] },
  { id:3,  s:"I'm really excited ___ the trip to New York.",           a:"about", opts:["about","for","at","with"] },
  { id:4,  s:"She is afraid ___ flying.",                              a:"of",    opts:["of","from","at","for"] },
  { id:5,  s:"He is proud ___ his achievements.",                      a:"of",    opts:["of","about","at","with"] },
  { id:6,  s:"Are you familiar ___ this software?",                    a:"with",  opts:["with","to","of","about"] },
  { id:7,  s:"She is responsible ___ the marketing department.",       a:"for",   opts:["for","of","to","about"] },
  { id:8,  s:"He is dependent ___ his parents financially.",           a:"on",    opts:["on","from","to","of"] },
  { id:9,  s:"I'm tired ___ doing the same thing every day.",          a:"of",    opts:["of","from","at","with"] },
  { id:10, s:"She arrived ___ the airport two hours early.",           a:"at",    opts:["at","in","to","on"] },
  { id:11, s:"He applied ___ a job at a tech company.",               a:"for",   opts:["for","to","at","in"] },
  { id:12, s:"We need to focus ___ the main problem.",                 a:"on",    opts:["on","at","in","to"] },
  { id:13, s:"She insisted ___ paying for dinner.",                    a:"on",    opts:["on","in","at","for"] },
  { id:14, s:"He is married ___ a doctor.",                            a:"to",    opts:["to","with","for","of"] },
  { id:15, s:"I'm looking forward ___ meeting you.",                   a:"to",    opts:["to","for","at","about"] },
  { id:16, s:"She succeeded ___ passing the exam.",                    a:"in",    opts:["in","at","for","with"] },
  { id:17, s:"He apologised ___ being late.",                          a:"for",   opts:["for","about","at","of"] },
  { id:18, s:"We agreed ___ the terms of the contract.",               a:"on",    opts:["on","with","to","about"] },
  { id:19, s:"She is angry ___ him for no reason.",                    a:"with",  opts:["with","at","about","for"] },
  { id:20, s:"I'm worried ___ the results of the test.",               a:"about", opts:["about","for","of","with"] },
  { id:21, s:"He is very kind ___ everyone he meets.",                 a:"to",    opts:["to","with","for","of"] },
  { id:22, s:"She spent all her money ___ clothes.",                   a:"on",    opts:["on","for","at","with"] },
  { id:23, s:"I congratulated her ___ passing her driving test.",      a:"on",    opts:["on","for","at","about"] },
  { id:24, s:"He is jealous ___ his colleague's success.",             a:"of",    opts:["of","about","from","with"] },
  { id:25, s:"She is in charge ___ the whole project.",                a:"of",    opts:["of","for","at","with"] },
  { id:26, s:"He blamed his sister ___ breaking the vase.",            a:"for",   opts:["for","of","about","at"] },
  { id:27, s:"We rely ___ public transport every day.",                a:"on",    opts:["on","in","at","for"] },
  { id:28, s:"She is very skilled ___ negotiating deals.",             a:"at",    opts:["at","in","for","with"] },
  { id:29, s:"I disagree ___ your conclusion about the data.",         a:"with",  opts:["with","about","to","from"] },
  { id:30, s:"He is addicted ___ social media.",                       a:"to",    opts:["to","on","for","with"] },
  { id:31, s:"She is aware ___ the risks involved.",                   a:"of",    opts:["of","about","with","for"] },
  { id:32, s:"They objected ___ the new proposal.",                    a:"to",    opts:["to","against","about","with"] },
  { id:33, s:"He is very sensitive ___ criticism.",                    a:"to",    opts:["to","about","with","of"] },
  { id:34, s:"She suffers ___ migraines when she's stressed.",         a:"from",  opts:["from","of","with","at"] },
  { id:35, s:"I believe ___ the power of education.",                  a:"in",    opts:["in","at","of","about"] },
  { id:36, s:"He is committed ___ finishing the project on time.",     a:"to",    opts:["to","for","in","about"] },
  { id:37, s:"She is very cautious ___ making promises.",              a:"about", opts:["about","of","with","in"] },
  { id:38, s:"We were shocked ___ hearing the news.",                  a:"at",    opts:["at","by","of","about"] },
  { id:39, s:"He is qualified ___ the position of manager.",           a:"for",   opts:["for","to","at","in"] },
  { id:40, s:"I'm satisfied ___ the results we achieved.",             a:"with",  opts:["with","about","of","at"] },
  { id:41, s:"She is suspicious ___ his motives.",                     a:"of",    opts:["of","about","with","at"] },
  { id:42, s:"He is very loyal ___ his friends.",                      a:"to",    opts:["to","with","for","of"] },
  { id:43, s:"I'm amazed ___ how quickly she learned.",                a:"at",    opts:["at","by","of","about"] },
  { id:44, s:"She is capable ___ managing the whole team.",            a:"of",    opts:["of","at","for","with"] },
  { id:45, s:"He is very keen ___ learning new skills.",               a:"on",    opts:["on","for","about","in"] },
  { id:46, s:"We are satisfied ___ the outcome of the meeting.",       a:"with",  opts:["with","about","by","of"] },
  { id:47, s:"She contributed ___ the success of the project.",        a:"to",    opts:["to","for","in","at"] },
  { id:48, s:"He is very generous ___ his time and money.",            a:"with",  opts:["with","in","of","at"] },
  { id:49, s:"I am fed up ___ waiting all the time.",                  a:"with",  opts:["with","of","at","about"] },
  { id:50, s:"She is fond ___ classical music.",                       a:"of",    opts:["of","about","with","for"] },
  { id:51, s:"He is allergic ___ dust and pollen.",                    a:"to",    opts:["to","of","from","with"] },
  { id:52, s:"I was disappointed ___ the quality of the product.",     a:"with",  opts:["with","about","by","of"] },
  { id:53, s:"She is involved ___ several community projects.",        a:"in",    opts:["in","with","at","for"] },
  { id:54, s:"He is obsessed ___ getting everything perfect.",         a:"with",  opts:["with","about","by","on"] },
  { id:55, s:"I'm curious ___ how the story ends.",                    a:"about", opts:["about","of","for","at"] },
  { id:56, s:"She is not used ___ waking up so early.",                a:"to",    opts:["to","at","for","with"] },
  { id:57, s:"He is very good ___ explaining complex topics.",         a:"at",    opts:["at","in","for","with"] },
  { id:58, s:"I was impressed ___ her presentation.",                  a:"by",    opts:["by","with","at","of"] },
  { id:59, s:"She is dedicated ___ her work.",                         a:"to",    opts:["to","for","in","about"] },
  { id:60, s:"He was brought up ___ a strict family.",                 a:"in",    opts:["in","by","with","at"] },
  { id:61, s:"I am very pleased ___ your progress.",                   a:"with",  opts:["with","about","at","of"] },
  { id:62, s:"She is fluent ___ three languages.",                     a:"in",    opts:["in","at","with","for"] },
  { id:63, s:"He is terrified ___ spiders.",                           a:"of",    opts:["of","from","at","about"] },
  { id:64, s:"I was confused ___ the instructions.",                   a:"by",    opts:["by","with","about","of"] },
  { id:65, s:"She is very punctual ___ her appointments.",             a:"with",  opts:["with","at","about","in"] },
  { id:66, s:"He is not aware ___ the problem.",                       a:"of",    opts:["of","about","with","at"] },
  { id:67, s:"I'm very happy ___ the result of the experiment.",       a:"with",  opts:["with","about","at","of"] },
  { id:68, s:"She is experienced ___ project management.",             a:"in",    opts:["in","at","with","for"] },
  { id:69, s:"He cares deeply ___ his community.",                     a:"about", opts:["about","for","of","with"] },
  { id:70, s:"I was astonished ___ his rudeness.",                     a:"at",    opts:["at","by","of","about"] },
  { id:71, s:"She is very ambitious ___ her career.",                  a:"about", opts:["about","for","with","in"] },
  { id:72, s:"He is brilliant ___ solving complex puzzles.",           a:"at",    opts:["at","in","for","with"] },
  { id:73, s:"I'm concerned ___ the rising unemployment rate.",        a:"about", opts:["about","with","of","for"] },
  { id:74, s:"She is very adaptable ___ change.",                      a:"to",    opts:["to","with","for","of"] },
  { id:75, s:"He is not accustomed ___ living alone.",                 a:"to",    opts:["to","with","for","at"] },
  { id:76, s:"I feel sorry ___ the inconvenience caused.",             a:"for",   opts:["for","about","of","with"] },
  { id:77, s:"She is very passionate ___ social justice.",             a:"about", opts:["about","for","in","of"] },
  { id:78, s:"He is hopeful ___ a positive outcome.",                  a:"about", opts:["about","for","of","with"] },
  { id:79, s:"I'm very upset ___ what happened yesterday.",            a:"about", opts:["about","with","at","of"] },
  { id:80, s:"She is in need ___ urgent medical attention.",           a:"of",    opts:["of","for","at","with"] },
  { id:81, s:"He is very enthusiastic ___ the new proposal.",          a:"about", opts:["about","for","at","with"] },
  { id:82, s:"I can rely ___ you to get it done.",                     a:"on",    opts:["on","in","at","with"] },
  { id:83, s:"She is very confident ___ her abilities.",               a:"in",    opts:["in","about","of","with"] },
  { id:84, s:"He is bored ___ doing the same routine.",                a:"with",  opts:["with","of","at","about"] },
  { id:85, s:"I'm not familiar ___ this part of the city.",            a:"with",  opts:["with","to","about","of"] },
  { id:86, s:"She is very polite ___ everyone she speaks to.",         a:"to",    opts:["to","with","at","for"] },
  { id:87, s:"He is late ___ work again today.",                       a:"for",   opts:["for","to","at","in"] },
  { id:88, s:"I am opposed ___ any form of discrimination.",           a:"to",    opts:["to","against","about","with"] },
  { id:89, s:"She is very grateful ___ all the support received.",     a:"for",   opts:["for","of","about","with"] },
  { id:90, s:"He is terrified ___ making mistakes in public.",         a:"of",    opts:["of","about","from","at"] },
  { id:91, s:"I am very attached ___ my hometown.",                    a:"to",    opts:["to","with","for","of"] },
  { id:92, s:"She is very strict ___ punctuality.",                    a:"about", opts:["about","with","on","in"] },
  { id:93, s:"He is incapable ___ lying to people.",                   a:"of",    opts:["of","from","at","with"] },
  { id:94, s:"I was astonished ___ his unexpected kindness.",          a:"by",    opts:["by","at","of","with"] },
  { id:95, s:"She is very talented ___ playing the piano.",            a:"at",    opts:["at","in","for","with"] },
  { id:96, s:"He complained ___ the noise coming from next door.",     a:"about", opts:["about","of","at","for"] },
  { id:97, s:"I'm very keen ___ trying new restaurants.",              a:"on",    opts:["on","for","about","in"] },
  { id:98, s:"She is very active ___ her local community.",            a:"in",    opts:["in","at","with","for"] },
  { id:99, s:"He is very selective ___ who he spends time with.",      a:"about", opts:["about","with","of","in"] },
  { id:100,s:"I am looking forward ___ the holidays.",                 a:"to",    opts:["to","for","about","at"] },
  { id:101,s:"She is very enthusiastic ___ her new role.",             a:"about", opts:["about","for","in","with"] },
  { id:102,s:"He is afraid ___ commitment in relationships.",          a:"of",    opts:["of","from","about","with"] },
  { id:103,s:"I'm not happy ___ the way this was handled.",            a:"about", opts:["about","with","of","at"] },
  { id:104,s:"She is qualified ___ the senior manager role.",          a:"for",   opts:["for","to","in","at"] },
  { id:105,s:"He is very bad ___ managing his time effectively.",      a:"at",    opts:["at","in","with","for"] },
];

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 1 — CONSTANTS & STORAGE
// ═══════════════════════════════════════════════════════════════════════
const CATS   = ["All", "Work & Business", "Daily Life"];
const LEVELS = ["All", "A2", "B1", "B2", "C1"];
const ROUND  = 12;
const SK_SESSIONS = "phraseup_sessions_v2";
const SK_WRONG    = "phraseup_wrong_v2";
const SK_THEME    = "phraseup_theme_v1";

function norm(s) {
  return s.toLowerCase().trim()
    .replace(/[''""]/g, "'")
    .replace(/[^a-z0-9\s']/g, "")
    .replace(/\s+/g, " ");
}
function matchScore(input, answer) {
  const ni = norm(input), na = norm(answer);
  if (ni === na) return "exact";
  const wi = ni.split(" ").filter(Boolean);
  const wa = na.split(" ").filter(Boolean);
  const hits = wi.filter(w => wa.includes(w)).length;
  const ratio = hits / wa.length;
  if (ratio >= 0.8) return "close";
  if (ratio >= 0.6) return "partial";
  return "wrong";
}
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function loadSessions() { try { return JSON.parse(localStorage.getItem(SK_SESSIONS)) || []; } catch { return []; } }
function saveSessions(arr) { try { localStorage.setItem(SK_SESSIONS, JSON.stringify(arr.slice(-20))); } catch {} }
function loadWrong() { try { return JSON.parse(localStorage.getItem(SK_WRONG)) || []; } catch { return []; } }
function saveWrong(arr) { try { localStorage.setItem(SK_WRONG, JSON.stringify(arr.slice(-300))); } catch {} }
function loadTheme() { try { return localStorage.getItem(SK_THEME) || "dark"; } catch { return "dark"; } }

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 2 — CSS (DUAL THEME — REFINED, NO HERO)
// ═══════════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

[data-theme="dark"] {
  --bg:       #04090f;
  --bg2:      #080f1a;
  --bg3:      #0c1626;
  --card:     rgba(10,22,42,0.88);
  --card2:    rgba(12,26,50,0.95);
  --border:   rgba(55,140,210,0.13);
  --border2:  rgba(55,190,250,0.22);
  --blue:     #2563eb;
  --blue2:    #3b82f6;
  --blue3:    #93c5fd;
  --indigo:   #6366f1;
  --green:    #10b981;
  --orange:   #f59e0b;
  --red:      #ef4444;
  --text:     #ddeeff;
  --text2:    #8eadc8;
  --text3:    #4a6a82;
  --sh:       0 8px 40px rgba(0,0,0,0.5);
  --nav-bg:   rgba(4,9,15,0.96);
  --input-bg: rgba(255,255,255,0.03);
  --green-bg: rgba(16,185,129,0.08);
  --orange-bg:rgba(245,158,11,0.08);
  --red-bg:   rgba(239,68,68,0.07);
  --correct:  #34d399;
  --wrong-c:  #f87171;
}
[data-theme="light"] {
  --bg:       #f0f5ff;
  --bg2:      #e4eeff;
  --bg3:      #d8e5ff;
  --card:     rgba(255,255,255,0.9);
  --card2:    rgba(255,255,255,0.98);
  --border:   rgba(37,99,235,0.16);
  --border2:  rgba(37,99,235,0.3);
  --blue:     #1d4ed8;
  --blue2:    #2563eb;
  --blue3:    #3b82f6;
  --indigo:   #4f46e5;
  --green:    #059669;
  --orange:   #d97706;
  --red:      #dc2626;
  --text:     #0f172a;
  --text2:    #334155;
  --text3:    #64748b;
  --sh:       0 4px 20px rgba(30,60,120,0.1);
  --nav-bg:   rgba(240,245,255,0.97);
  --input-bg: rgba(37,99,235,0.04);
  --green-bg: rgba(5,150,105,0.07);
  --orange-bg:rgba(217,119,6,0.07);
  --red-bg:   rgba(220,38,38,0.06);
  --correct:  #059669;
  --wrong-c:  #dc2626;
}

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  transition: background 0.3s, color 0.3s;
}
[data-theme="dark"] body {
  background-image:
    radial-gradient(ellipse 110% 50% at 50% -5%, rgba(37,99,235,0.08) 0%, transparent 70%),
    radial-gradient(ellipse 50% 30% at 85% 85%, rgba(99,102,241,0.05) 0%, transparent 60%);
  background-attachment: fixed;
}
[data-theme="light"] body {
  background-image:
    radial-gradient(ellipse 110% 50% at 50% -5%, rgba(59,130,246,0.1) 0%, transparent 70%);
  background-attachment: fixed;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--bg3); border-radius: 4px; }

.app { max-width: 680px; margin: 0 auto; padding: 0 1rem 6rem; }

/* ── NAVBAR ── */
.navbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.9rem 0 0.75rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
  position: sticky; top: 0; z-index: 50;
  background: var(--nav-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.logo {
  display: flex; align-items: center; gap: 0.5rem;
  cursor: pointer; user-select: none;
}
.logo-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(145deg, #1e3a8a, #1d4ed8, #2563eb);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 16px rgba(37,99,235,0.4);
  flex-shrink: 0;
}
[data-theme="light"] .logo-icon { box-shadow: 0 0 12px rgba(37,99,235,0.25); }
.logo-icon svg { width: 22px; height: 22px; }
.logo-text { line-height: 1; }
.logo-name {
  font-weight: 900; font-size: 1.1rem; letter-spacing: -0.04em;
  background: linear-gradient(90deg, var(--blue2), var(--blue3));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
[data-theme="light"] .logo-name {
  background: linear-gradient(90deg, #1d4ed8, #3b82f6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.logo-tag {
  font-size: 0.58rem; font-weight: 700; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--text3);
}
.nav-right { display: flex; align-items: center; gap: 0.4rem; }
.nav-btn {
  padding: 0.28rem 0.75rem; border-radius: 50px;
  border: 1px solid var(--border2); background: none;
  font-family: inherit; font-size: 0.76rem; font-weight: 700; color: var(--blue2);
  cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.nav-btn:hover { background: rgba(37,99,235,0.1); }
.nav-btn.active { background: rgba(37,99,235,0.12); }
.nav-btn.danger { color: var(--red); border-color: rgba(220,38,38,0.3); }
.nav-btn.danger:hover { background: rgba(220,38,38,0.08); }
.theme-btn {
  width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--card);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s; font-size: 0.9rem;
}
.theme-btn:hover { border-color: var(--blue2); transform: rotate(15deg); }

/* ── SCREENS ── */
.screen { animation: fadeUp 0.28s ease both; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── PAGE TITLE ── */
.page-title {
  font-size: 1.3rem; font-weight: 900; letter-spacing: -0.03em;
  margin-bottom: 0.2rem; color: var(--text);
}
.page-sub { font-size: 0.82rem; color: var(--text2); margin-bottom: 1.4rem; line-height: 1.5; }

/* ── SECTION LABEL ── */
.sl { font-size: 0.64rem; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--text3); margin-bottom: 0.5rem; }

/* ── CHIPS ── */
.chips { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 1rem; }
.chip {
  padding: 0.28rem 0.8rem; border-radius: 50px;
  border: 1px solid var(--border); background: var(--card);
  font-family: inherit; font-size: 0.76rem; font-weight: 600; color: var(--text2);
  cursor: pointer; transition: all 0.15s;
}
.chip:hover  { border-color: var(--blue2); color: var(--blue2); }
.chip.on     { background: rgba(37,99,235,0.12); border-color: rgba(37,99,235,0.45); color: var(--blue2); }

/* ── CARDS ── */
.card {
  background: var(--card2); border: 1px solid var(--border);
  border-radius: 14px; overflow: hidden;
}
.card-body { padding: 1.2rem 1.4rem; }

/* ── START CARD ── */
.start-card {
  background: var(--card2); border: 1px solid var(--border2);
  border-radius: 14px; padding: 1.2rem 1.4rem; margin-bottom: 1rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
}
.start-info { font-size: 0.82rem; color: var(--text2); line-height: 1.5; }
.start-info strong { color: var(--text); display: block; font-size: 0.95rem; margin-bottom: 0.15rem; font-weight: 800; }
.start-btn {
  flex-shrink: 0; padding: 0.7rem 1.5rem; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #1e40af, #2563eb);
  font-family: inherit; font-size: 0.88rem; font-weight: 800; color: white;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
  box-shadow: 0 0 20px rgba(37,99,235,0.35); letter-spacing: -0.01em;
}
.start-btn:hover { transform: translateY(-2px); box-shadow: 0 0 28px rgba(37,99,235,0.5); }
.start-btn:active { transform: translateY(0); }
.start-btn:disabled { background: var(--bg3); color: var(--text3); box-shadow: none; cursor: default; transform: none; }

/* ── MODE GRID ── */
.mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.4rem; }
.mode-card {
  background: var(--card2); border: 1px solid var(--border);
  border-radius: 14px; padding: 1.1rem; cursor: pointer;
  transition: all 0.2s; text-align: left; font-family: inherit;
}
.mode-card:hover { border-color: var(--blue2); transform: translateY(-2px); box-shadow: var(--sh); }
.mode-card.active { border-color: var(--blue2); background: rgba(37,99,235,0.07); }
.mc-icon { font-size: 1.4rem; margin-bottom: 0.4rem; }
.mc-title { font-size: 0.9rem; font-weight: 800; color: var(--text); margin-bottom: 0.2rem; }
.mc-sub { font-size: 0.73rem; color: var(--text2); line-height: 1.4; }

/* ── QUIZ HEADER ── */
.quiz-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.1rem; }
.prog-track { flex: 1; height: 5px; border-radius: 3px; background: var(--border); overflow: hidden; }
.prog-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--blue), var(--indigo)); transition: width 0.4s ease; }
.q-counter { font-size: 0.76rem; font-weight: 700; color: var(--text3); white-space: nowrap; }

/* ── QUESTION CARD ── */
.qcard {
  background: var(--card2); border: 1px solid var(--border2);
  border-radius: 16px; padding: 1.5rem; margin-bottom: 0.9rem;
  position: relative; overflow: hidden; box-shadow: var(--sh);
}
.qcard::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2.5px;
  background: var(--cat-color, var(--blue2));
  box-shadow: 0 0 10px var(--cat-color, var(--blue2));
}
.qcard-meta { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.9rem; flex-wrap: wrap; }
.cat-pill {
  padding: 0.15rem 0.55rem; border-radius: 50px;
  font-size: 0.64rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  border: 1px solid currentColor;
}
.lv-pill {
  padding: 0.15rem 0.45rem; border-radius: 4px;
  font-size: 0.64rem; font-weight: 700;
  background: rgba(255,255,255,0.05); color: var(--text3);
}
[data-theme="light"] .lv-pill { background: rgba(0,0,0,0.05); }
.q-label { font-size: 0.63rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text3); margin-bottom: 0.45rem; }
.q-text { font-size: clamp(1rem, 2.5vw, 1.25rem); font-weight: 800; color: var(--text); line-height: 1.45; letter-spacing: -0.02em; }

/* ── ANSWER INPUT ── */
.ans-wrap { margin-bottom: 0.7rem; }
.ans-input {
  width: 100%; padding: 0.85rem 1rem; border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--input-bg);
  font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 500; color: var(--text);
  outline: none; transition: all 0.2s;
}
.ans-input::placeholder { color: var(--text3); }
.ans-input:focus { border-color: rgba(37,99,235,0.5); background: rgba(37,99,235,0.04); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
.ans-input.exact   { border-color: rgba(16,185,129,0.6); background: rgba(16,185,129,0.07); color: var(--correct); }
.ans-input.close   { border-color: rgba(245,158,11,0.5); background: rgba(245,158,11,0.07); color: var(--orange); }
.ans-input.partial { border-color: rgba(245,158,11,0.4); background: rgba(245,158,11,0.06); color: var(--orange); }
.ans-input.wrong   { border-color: rgba(220,38,38,0.5);  background: rgba(220,38,38,0.07); color: var(--wrong-c); }
.ans-input:disabled { opacity: 0.85; }

/* ── ACTION BUTTONS ── */
.action-btn {
  width: 100%; padding: 0.82rem; border-radius: 10px; border: none;
  font-family: inherit; font-size: 0.92rem; font-weight: 800;
  cursor: pointer; transition: all 0.2s; letter-spacing: -0.01em;
}
.action-btn.check {
  background: linear-gradient(135deg, #1e40af, #2563eb);
  color: white; box-shadow: 0 0 20px rgba(37,99,235,0.28);
}
.action-btn.check:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 0 28px rgba(37,99,235,0.42); }
.action-btn.check:disabled { background: var(--bg3); color: var(--text3); box-shadow: none; cursor: default; }
.action-btn.next-q {
  background: linear-gradient(135deg, #059669, #0ea5e9);
  color: white; box-shadow: 0 0 18px rgba(5,150,105,0.2);
}
.action-btn.next-q:hover { transform: translateY(-1px); box-shadow: 0 0 26px rgba(5,150,105,0.35); }

/* ── FEEDBACK ── */
.feedback {
  border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 0.7rem;
  display: flex; align-items: flex-start; gap: 0.7rem;
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid;
}
@keyframes popIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
.feedback.exact   { background: var(--green-bg);  border-color: rgba(16,185,129,0.25); }
.feedback.close,
.feedback.partial { background: var(--orange-bg); border-color: rgba(245,158,11,0.22); }
.feedback.wrong   { background: var(--red-bg);    border-color: rgba(220,38,38,0.2); }
.fb-icon { font-size: 1.2rem; flex-shrink: 0; }
.fb-content { flex: 1; min-width: 0; }
.fb-title { font-weight: 700; font-size: 0.83rem; margin-bottom: 0.18rem; }
.feedback.exact   .fb-title { color: var(--correct); }
.feedback.close   .fb-title,
.feedback.partial .fb-title { color: var(--orange); }
.feedback.wrong   .fb-title { color: var(--wrong-c); }
.fb-ans { font-size: 0.8rem; color: var(--text2); line-height: 1.5; }
.fb-ans strong { color: var(--text); font-weight: 700; }

/* ── PREPOSITIONS QUIZ ── */
.prep-q-text {
  font-size: clamp(0.95rem, 2.3vw, 1.15rem); font-weight: 700;
  color: var(--text); line-height: 1.6; margin-bottom: 1.1rem;
}
.prep-blank {
  display: inline-block; min-width: 60px; text-align: center;
  border-bottom: 2.5px solid var(--blue2);
  padding: 0 0.3rem; color: var(--blue2); font-weight: 800;
  border-radius: 4px 4px 0 0; transition: all 0.25s;
}
.prep-blank.correct { border-color: var(--correct); color: var(--correct); background: var(--green-bg); }
.prep-blank.wrong   { border-color: var(--wrong-c); color: var(--wrong-c); background: var(--red-bg); }
.prep-opts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.55rem; }
.prep-opt {
  padding: 0.72rem; border-radius: 10px; border: 1.5px solid var(--border);
  background: var(--card); font-family: inherit; font-size: 0.92rem; font-weight: 700;
  color: var(--text); cursor: pointer; transition: all 0.18s;
}
.prep-opt:hover:not(:disabled) { border-color: var(--blue2); background: rgba(37,99,235,0.08); color: var(--blue2); }
.prep-opt.correct   { border-color: var(--correct); background: var(--green-bg); color: var(--correct); }
.prep-opt.wrong-sel { border-color: var(--wrong-c); background: var(--red-bg);   color: var(--wrong-c); }
.prep-opt.reveal    { border-color: var(--correct); background: var(--green-bg); color: var(--correct); }
.prep-opt:disabled  { cursor: default; }

/* ── RESULTS ── */
.result-banner {
  border-radius: 16px; overflow: hidden; margin-bottom: 1.2rem;
  background: var(--card2); border: 1px solid var(--border2); box-shadow: var(--sh);
}
.result-top {
  padding: 2rem; text-align: center;
  background: linear-gradient(160deg, var(--bg2), var(--bg));
}
.result-emoji { font-size: 3rem; margin-bottom: 0.6rem; animation: bounce 0.5s 0.15s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes bounce { from { transform: scale(0); } to { transform: scale(1); } }
.result-title { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.03em; }
.result-sub { color: var(--text2); font-size: 0.84rem; margin-top: 0.3rem; }
.result-bar { height: 3px; background: linear-gradient(90deg, #1d4ed8, #6366f1, #ec4899); }
.stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; padding: 1.1rem; }
.stat-box {
  background: rgba(255,255,255,0.03); border: 1px solid var(--border);
  border-radius: 10px; padding: 0.9rem; text-align: center;
}
[data-theme="light"] .stat-box { background: rgba(0,0,0,0.02); }
.stat-val { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.04em; line-height: 1; }
.stat-lbl { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text3); margin-top: 0.2rem; }
.review-list { padding: 1rem 1.1rem 0.2rem; }
.review-head { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text3); margin-bottom: 0.7rem; }
.ri {
  display: flex; gap: 0.55rem; align-items: flex-start;
  padding: 0.6rem 0; border-bottom: 1px solid rgba(55,140,210,0.06);
}
.ri:last-child { border-bottom: none; }
.ri-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.ri-it { font-size: 0.78rem; color: var(--text2); margin-bottom: 0.06rem; }
.ri-en { font-size: 0.82rem; font-weight: 700; color: var(--text); }
.ri-given { font-size: 0.74rem; color: var(--text3); font-style: italic; }
.btn-row { display: flex; gap: 0.65rem; padding: 0.8rem 1.1rem 1.1rem; }
.btn-sec { flex: 1; padding: 0.7rem; border: 1px solid var(--border2); border-radius: 10px; background: none; font-family: inherit; font-size: 0.85rem; font-weight: 700; color: var(--blue2); cursor: pointer; transition: all 0.15s; }
.btn-sec:hover { background: rgba(37,99,235,0.08); }
.btn-pri { flex: 2; padding: 0.7rem; border: none; border-radius: 10px; background: linear-gradient(135deg, #1e40af, #2563eb); font-family: inherit; font-size: 0.85rem; font-weight: 800; color: white; cursor: pointer; box-shadow: 0 0 16px rgba(37,99,235,0.28); transition: all 0.15s; }
.btn-pri:hover { transform: translateY(-1px); box-shadow: 0 0 24px rgba(37,99,235,0.45); }

/* ── RIPASSO PAGE ── */
.ripasso-empty {
  text-align: center; padding: 3rem 1rem; color: var(--text3);
  font-size: 0.88rem; line-height: 1.7;
}
.ripasso-empty .big { font-size: 2.5rem; margin-bottom: 0.5rem; }
.ripasso-item {
  background: var(--card2); border: 1px solid var(--border);
  border-radius: 12px; padding: 1rem 1.2rem; margin-bottom: 0.6rem;
}
.ri-type-badge {
  display: inline-block; font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.12rem 0.5rem; border-radius: 4px; margin-bottom: 0.5rem;
  background: rgba(37,99,235,0.1); color: var(--blue2); border: 1px solid rgba(37,99,235,0.2);
}
.ripasso-q { font-size: 0.88rem; font-weight: 700; color: var(--text); margin-bottom: 0.35rem; line-height: 1.4; }
.ripasso-a { font-size: 0.82rem; color: var(--text2); }
.ripasso-a span { color: var(--correct); font-weight: 700; }
.ripasso-count {
  display: inline-flex; align-items: center; gap: 0.3rem;
  font-size: 0.72rem; font-weight: 700; color: var(--wrong-c);
  background: var(--red-bg); border: 1px solid rgba(220,38,38,0.2);
  padding: 0.1rem 0.5rem; border-radius: 50px; margin-top: 0.4rem;
}

/* ── STATS ── */
.stats-banner { border-radius: 16px; overflow: hidden; margin-bottom: 1.2rem; background: var(--card2); border: 1px solid var(--border2); }
.stats-top { padding: 1.3rem 1.4rem 0.9rem; border-bottom: 1px solid var(--border); }
.stats-top h2 { font-size: 1.2rem; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 0.15rem; }
.stats-top p { font-size: 0.8rem; color: var(--text2); }
.big-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); }
.bstat { background: var(--card2); padding: 0.9rem; text-align: center; }
.bstat-v { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.04em; line-height: 1; background: linear-gradient(135deg, var(--blue2), var(--indigo)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.bstat-l { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text3); margin-top: 0.18rem; }
.chart-card { background: var(--card2); border: 1px solid var(--border); border-radius: 14px; padding: 1.1rem; margin-bottom: 0.9rem; }
.chart-title { font-size: 0.8rem; font-weight: 700; color: var(--text2); margin-bottom: 0.15rem; }
.chart-sub { font-size: 0.7rem; color: var(--text3); margin-bottom: 1rem; }
.sess-list { background: var(--card2); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 0.9rem; }
.sess-head { padding: 0.7rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.64rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text3); }
.sess-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.68rem 1rem; border-bottom: 1px solid rgba(55,140,210,0.05); }
.sess-row:last-child { border-bottom: none; }
.sess-n { font-size: 0.72rem; font-weight: 700; color: var(--text3); width: 20px; }
.sess-d { flex: 1; font-size: 0.8rem; color: var(--text2); }
.sess-m { font-size: 0.72rem; color: var(--text3); }
.sess-acc { font-weight: 800; font-size: 0.86rem; color: var(--blue2); }
.sess-badge { padding: 0.12rem 0.42rem; border-radius: 4px; font-size: 0.65rem; font-weight: 700; }
.sess-badge.good { background: rgba(16,185,129,0.12); color: var(--correct); }
.sess-badge.mid  { background: rgba(245,158,11,0.12); color: var(--orange); }
.sess-badge.low  { background: rgba(220,38,38,0.1);  color: var(--wrong-c); }
.no-data { padding: 2.5rem; text-align: center; color: var(--text3); font-size: 0.88rem; line-height: 1.7; }
.ctt { background: var(--bg2); border: 1px solid var(--border2); border-radius: 8px; padding: 0.55rem 0.85rem; }
.ctt-l { font-size: 0.7rem; color: var(--text3); margin-bottom: 0.15rem; }
.ctt-v { font-weight: 700; color: var(--blue2); font-family: 'JetBrains Mono', monospace; }

/* ── INFO PAGE ── */
.info-card { background: var(--card2); border: 1px solid var(--border); border-radius: 14px; padding: 1.3rem 1.4rem; margin-bottom: 0.9rem; }
.info-card h3 { font-size: 0.95rem; font-weight: 800; margin-bottom: 0.6rem; color: var(--text); }
.info-card p { font-size: 0.83rem; color: var(--text2); line-height: 1.7; margin-bottom: 0.4rem; }
.info-card ul { padding-left: 1.2rem; margin-top: 0.3rem; }
.info-card li { font-size: 0.83rem; color: var(--text2); line-height: 1.7; margin-bottom: 0.2rem; }
.disc { border-left: 3px solid var(--orange); padding-left: 0.9rem; }
.disc p { color: var(--text3); }
.version { font-size: 0.7rem; color: var(--text3); text-align: center; padding: 0.5rem 0 0; }

/* ── MODAL ── */
.overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem; animation: fadeUp 0.2s ease;
}
.modal {
  background: var(--bg2); border: 1px solid var(--border2); border-radius: 16px;
  padding: 2rem; max-width: 340px; width: 100%;
  box-shadow: 0 0 60px rgba(0,0,0,0.4);
  animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.modal h3 { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.45rem; }
.modal p  { font-size: 0.86rem; color: var(--text2); line-height: 1.55; margin-bottom: 1.4rem; }
.modal-btns { display: flex; gap: 0.65rem; }
.m-cancel { flex:1; padding:0.65rem; border:1px solid var(--border2); border-radius:10px; background:none; font-family:inherit; font-size:0.88rem; font-weight:600; color:var(--text2); cursor:pointer; transition:all 0.15s; }
.m-cancel:hover { background: rgba(255,255,255,0.04); }
[data-theme="light"] .m-cancel:hover { background: rgba(0,0,0,0.04); }
.m-quit { flex:1; padding:0.65rem; border:1px solid rgba(220,38,38,0.3); border-radius:10px; background:rgba(220,38,38,0.08); font-family:inherit; font-size:0.88rem; font-weight:700; color:var(--wrong-c); cursor:pointer; transition:all 0.15s; }
.m-quit:hover { background: rgba(220,38,38,0.18); }

/* ── RESPONSIVE ── */
@media (max-width: 520px) {
  .big-stats { grid-template-columns: repeat(2, 1fr); }
  .mode-grid { grid-template-columns: 1fr 1fr; }
  .stat-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 360px) {
  .mode-grid { grid-template-columns: 1fr; }
}
`;

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 2 — LOGO ICON (speech bubble + pen, no flag)
// ═══════════════════════════════════════════════════════════════════════
const LogoSVG = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Speech bubble */}
    <path d="M5 7C5 5.34 6.34 4 8 4H28C29.66 4 31 5.34 31 7V21C31 22.66 29.66 24 28 24H14L8 30V24H8C6.34 24 5 22.66 5 21V7Z"
      fill="white" opacity="0.95"/>
    {/* Text lines */}
    <rect x="10" y="10" width="16" height="2.5" rx="1.25" fill="#1e40af" opacity="0.55"/>
    <rect x="10" y="15" width="12" height="2.5" rx="1.25" fill="#1e40af" opacity="0.55"/>
    <rect x="10" y="20" width="14" height="2.5" rx="1.25" fill="#1e40af" opacity="0.4"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY COLOR
// ═══════════════════════════════════════════════════════════════════════
function catColor(cat) {
  return cat === "Work & Business" ? "#3b82f6" : "#0ea5e9";
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  // ── THEME ──────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => loadTheme());
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(SK_THEME, theme); } catch {}
  }, [theme]);

  // ── NAVIGATION ─────────────────────────────────────────────────
  const [screen, setScreen] = useState("home"); // home | quiz | preps | results | prepResults | ripasso | stats | info
  const [gameMode, setGameMode] = useState("collocations");
  const [showQuit, setShowQuit] = useState(false);

  // ── FILTERS ────────────────────────────────────────────────────
  const [catF, setCatF] = useState("All");
  const [lvF,  setLvF]  = useState("All");

  // ── COLLOCATIONS QUIZ STATE ─────────────────────────────────────
  const [deck,    setDeck]    = useState([]);
  const [idx,     setIdx]     = useState(0);
  const [input,   setInput]   = useState("");
  const [result,  setResult]  = useState(null);
  const [history, setHistory] = useState([]);
  const inputRef = useRef();

  // ── PREPOSITIONS QUIZ STATE ─────────────────────────────────────
  const [prepDeck,     setPrepDeck]     = useState([]);
  const [prepIdx,      setPrepIdx]      = useState(0);
  const [prepSelected, setPrepSelected] = useState(null);
  const [prepHistory,  setPrepHistory]  = useState([]);

  // ── PERSISTENCE ─────────────────────────────────────────────────
  const [sessions, setSessions] = useState(() => loadSessions());
  const [wrongItems, setWrongItems] = useState(() => loadWrong());

  // ── CURRENT SESSION ID ──────────────────────────────────────────
  const sessionIdRef = useRef(Date.now());

  // ── COMPUTED ───────────────────────────────────────────────────
  const filtered = DB.filter(c =>
    (catF === "All" || c.cat === catF) &&
    (lvF  === "All" || c.lv  === lvF)
  );

  // Wrong items from last 3 sessions
  const recentSessionIds = sessions.slice(-3).map(s => s.id);
  const recentWrong = wrongItems.filter(w => recentSessionIds.includes(w.sessionId));

  // ── START COLLOCATIONS ──────────────────────────────────────────
  function startColloc() {
    if (!filtered.length) return;
    sessionIdRef.current = Date.now();
    const pool = shuffle(filtered).slice(0, Math.min(ROUND, filtered.length));
    setDeck(pool); setIdx(0); setInput(""); setResult(null); setHistory([]);
    setScreen("quiz");
    setTimeout(() => inputRef.current?.focus(), 120);
  }

  // ── START PREPOSITIONS ──────────────────────────────────────────
  function startPreps() {
    sessionIdRef.current = Date.now();
    // shuffle both the deck AND each question's options so correct answer
    // is never always in the same position (top-left)
    const pool = shuffle(PREPS).slice(0, 15).map(q => ({
      ...q,
      opts: shuffle(q.opts),
    }));
    setPrepDeck(pool); setPrepIdx(0); setPrepSelected(null); setPrepHistory([]);
    setScreen("preps");
  }

  // ── SUBMIT COLLOCATION ANSWER ───────────────────────────────────
  function handleSubmit() {
    if (result) { advance(); return; }
    if (!input.trim()) return;
    const card = deck[idx];
    const status = matchScore(input, card.en);
    setResult({ status });
    const newEntry = { card, status, given: input };
    setHistory(h => [...h, newEntry]);

    // Save wrong answers
    if (status === "wrong") {
      const w = {
        id: card.id, type: "colloc",
        it: card.it, en: card.en,
        given: input, sessionId: sessionIdRef.current,
        ts: Date.now()
      };
      const updated = [...wrongItems, w];
      setWrongItems(updated);
      saveWrong(updated);
    }
  }

  function advance() {
    const ni = idx + 1;
    if (ni >= deck.length) {
      finishColloc([...history]);
    } else {
      setIdx(ni); setInput(""); setResult(null);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }

  function finishColloc(finalHistory) {
    const correct = finalHistory.filter(h => h.status === "exact").length;
    const acc = Math.round((correct / Math.max(finalHistory.length, 1)) * 100);
    const newSess = {
      id: sessionIdRef.current,
      date: new Date().toLocaleDateString("it-IT"),
      mode: "Collocations", total: finalHistory.length, correct, acc
    };
    const updated = [...sessions, newSess].slice(-20);
    setSessions(updated); saveSessions(updated);
    setScreen("results");
  }

  // ── PREPOSITION ANSWER ──────────────────────────────────────────
  function handlePrepAnswer(opt) {
    if (prepSelected) return;
    const q = prepDeck[prepIdx];
    const correct = opt === q.a;
    setPrepSelected(opt);
    const entry = { q, selected: opt, correct };
    const newHistory = [...prepHistory, entry];
    setPrepHistory(newHistory);

    if (!correct) {
      const w = {
        id: q.id + 10000, type: "prep",
        it: q.s, en: q.a,
        given: opt, sessionId: sessionIdRef.current,
        ts: Date.now()
      };
      const updated = [...wrongItems, w];
      setWrongItems(updated);
      saveWrong(updated);
    }

    setTimeout(() => {
      const ni = prepIdx + 1;
      if (ni >= prepDeck.length) {
        const correct2 = newHistory.filter(h => h.correct).length;
        const acc2 = Math.round((correct2 / Math.max(newHistory.length, 1)) * 100);
        const newSess = {
          id: sessionIdRef.current,
          date: new Date().toLocaleDateString("it-IT"),
          mode: "Preposizioni", total: newHistory.length, correct: correct2, acc: acc2
        };
        const updated = [...sessions, newSess].slice(-20);
        setSessions(updated); saveSessions(updated);
        setScreen("prepResults");
      } else {
        setPrepIdx(ni); setPrepSelected(null);
      }
    }, 900);
  }

  // ── QUIT ────────────────────────────────────────────────────────
  function quitGame() { setShowQuit(false); setScreen("home"); }

  // ── CARD & PROGRESS ─────────────────────────────────────────────
  const card     = deck[idx];
  const catC     = catColor(card?.cat || "Work & Business");
  const progress = deck.length ? (idx / deck.length) * 100 : 0;
  const prepCard = prepDeck[prepIdx];
  const prepProg = prepDeck.length ? (prepIdx / prepDeck.length) * 100 : 0;

  // ── STATS COMPUTE ───────────────────────────────────────────────
  const avgAcc    = sessions.length ? Math.round(sessions.reduce((a,b) => a+b.acc, 0) / sessions.length) : 0;
  const bestAcc   = sessions.length ? Math.max(...sessions.map(s => s.acc)) : 0;
  const chartData = sessions.map((s, i) => ({ name: `S${i+1}`, acc: s.acc }));

  // ── COLLOC RESULT MESSAGE ───────────────────────────────────────
  const rm = (() => {
    const pct = history.length ? history.filter(h => h.status !== "wrong").length / history.length : 0;
    if (pct >= 0.9) return { emoji:"🏆", title:"Eccezionale!",       sub:"Padronanza quasi assoluta." };
    if (pct >= 0.7) return { emoji:"🎯", title:"Ottimo lavoro!",      sub:"Sei sulla strada giusta!" };
    if (pct >= 0.5) return { emoji:"💪", title:"Buon tentativo!",     sub:"Riprova per migliorare." };
    return             { emoji:"📚", title:"Continua a studiare!", sub:"La pratica fa la differenza." };
  })();

  // ── PREP RESULT ─────────────────────────────────────────────────
  const prepCorrect = prepHistory.filter(h => h.correct).length;
  const prepAcc     = Math.round((prepCorrect / Math.max(prepHistory.length, 1)) * 100);
  const prm = prepAcc >= 80 ? {emoji:"🏆",title:"Ottimo!"} : prepAcc >= 60 ? {emoji:"🎯",title:"Bene!"} : {emoji:"📚",title:"Continua a esercitarti!"};

  // ── TOOLTIP ─────────────────────────────────────────────────────
  const CT = ({active, payload, label}) => !active || !payload?.length ? null : (
    <div className="ctt"><div className="ctt-l">Sessione {label}</div><div className="ctt-v">{payload[0].value}%</div></div>
  );

  const inGame = screen === "quiz" || screen === "preps";

  return (
    <>
      <style>{CSS}</style>

      {/* QUIT MODAL */}
      {showQuit && (
        <div className="overlay" onClick={() => setShowQuit(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>⚠️ Abbandonare la sessione?</h3>
            <p>Se esci ora, il progresso della sessione corrente non verrà salvato nelle statistiche.</p>
            <div className="modal-btns">
              <button className="m-cancel" onClick={() => setShowQuit(false)}>Continua</button>
              <button className="m-quit"   onClick={quitGame}>Esci</button>
            </div>
          </div>
        </div>
      )}

      <div className="app" data-theme={theme}>

        {/* ── NAVBAR ── */}
        <nav className="navbar">
          <div className="logo" onClick={() => inGame ? setShowQuit(true) : setScreen("home")}>
            <div className="logo-icon"><LogoSVG /></div>
            <div className="logo-text">
              <div className="logo-name">PhraseUp!</div>
              <div className="logo-tag">English Trainer</div>
            </div>
          </div>
          <div className="nav-right">
            {!inGame && (
              <>
                <button className={`nav-btn${screen==="ripasso"?" active":""}`} onClick={() => setScreen("ripasso")}>
                  Ripasso {recentWrong.length > 0 && `(${recentWrong.length})`}
                </button>
                <button className={`nav-btn${screen==="stats"?" active":""}`} onClick={() => setScreen("stats")}>Stats</button>
                <button className={`nav-btn${screen==="info"?" active":""}`}   onClick={() => setScreen("info")}>Info</button>
              </>
            )}
            {inGame && (
              <button className="nav-btn danger" onClick={() => setShowQuit(true)}>✕ Esci</button>
            )}
            <button className="theme-btn" onClick={() => setTheme(t => t==="dark"?"light":"dark")} title="Cambia tema">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>

        {/* ══════════════════════════════════════════ HOME ══════════════════════════════════════════ */}
        {screen === "home" && (
          <div className="screen">

            {/* MODE SELECTOR */}
            <p className="sl">Modalità di esercizio</p>
            <div className="mode-grid">
              <button className={`mode-card${gameMode==="collocations"?" active":""}`} onClick={() => setGameMode("collocations")}>
                <div className="mc-icon">📝</div>
                <div className="mc-title">Collocations</div>
                <div className="mc-sub">Traduci frasi in inglese. Valutazione intelligente della risposta.</div>
              </button>
              <button className={`mode-card${gameMode==="preps"?" active":""}`} onClick={() => setGameMode("preps")}>
                <div className="mc-icon">🔗</div>
                <div className="mc-title">Preposizioni</div>
                <div className="mc-sub">Scegli la preposizione corretta tra 4 opzioni.</div>
              </button>
            </div>

            {/* COLLOCATIONS FILTERS */}
            {gameMode === "collocations" && (
              <>
                <p className="sl">Categoria</p>
                <div className="chips">
                  {CATS.map(c => (
                    <button key={c} className={`chip${catF===c?" on":""}`} onClick={() => setCatF(c)}>{c}</button>
                  ))}
                </div>
                <p className="sl">Livello</p>
                <div className="chips">
                  {LEVELS.map(l => (
                    <button key={l} className={`chip${lvF===l?" on":""}`} onClick={() => setLvF(l)}>{l}</button>
                  ))}
                </div>
                <div className="start-card">
                  <div className="start-info">
                    <strong>{filtered.length} frasi disponibili</strong>
                    {Math.min(ROUND, filtered.length)} domande per sessione
                  </div>
                  <button className="start-btn" onClick={startColloc} disabled={!filtered.length}>Inizia ▶</button>
                </div>
              </>
            )}

            {gameMode === "preps" && (
              <div className="start-card">
                <div className="start-info">
                  <strong>{PREPS.length} esercizi disponibili</strong>
                  15 domande per sessione
                </div>
                <button className="start-btn" onClick={startPreps}>Inizia ▶</button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════ COLLOC QUIZ ══════════════════════════════════════════ */}
        {screen === "quiz" && card && (
          <div className="screen">
            <div className="quiz-header">
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="q-counter">{idx + 1} / {deck.length}</div>
            </div>

            <div className="qcard" style={{ "--cat-color": catC }}>
              <div className="qcard-meta">
                <span className="cat-pill" style={{ color: catC, borderColor: catC + "66" }}>{card.cat}</span>
                <span className="lv-pill">{card.lv}</span>
              </div>
              <div className="q-label">Traduci in inglese</div>
              <div className="q-text">{card.it}</div>
            </div>

            <div className="ans-wrap">
              <input
                ref={inputRef}
                className={`ans-input${result ? " " + result.status : ""}`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="Scrivi la traduzione in inglese…"
                disabled={!!result}
                autoComplete="off" autoCorrect="off" spellCheck="false"
              />
            </div>

            {result && (
              <div className={`feedback ${result.status}`}>
                <div className="fb-icon">{result.status==="exact"?"✅":result.status==="close"?"🟡":result.status==="partial"?"🟠":"❌"}</div>
                <div className="fb-content">
                  <div className="fb-title">
                    {result.status==="exact"?"Perfetto!":result.status==="close"?"Quasi perfetto!":result.status==="partial"?"Parzialmente corretto":"Non corretto"}
                  </div>
                  <div className="fb-ans">Risposta corretta: <strong>{card.en}</strong></div>
                </div>
              </div>
            )}

            <button
              className={`action-btn ${result ? "next-q" : "check"}`}
              onClick={handleSubmit}
              disabled={!result && !input.trim()}
            >
              {result
                ? (idx + 1 >= deck.length ? "Vedi risultati →" : "Prossima →")
                : "Controlla"}
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════ PREPS QUIZ ══════════════════════════════════════════ */}
        {screen === "preps" && prepCard && (
          <div className="screen">
            <div className="quiz-header">
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${prepProg}%` }} />
              </div>
              <div className="q-counter">{prepIdx + 1} / {prepDeck.length}</div>
            </div>

            <div className="qcard">
              <div className="q-label">Scegli la preposizione corretta</div>
              <div className="prep-q-text">
                {prepCard.s.split("___").map((part, i) => (
                  <span key={i}>
                    {part}
                    {i === 0 && (
                      <span className={`prep-blank${prepSelected ? (prepSelected === prepCard.a ? " correct" : " wrong") : ""}`}>
                        {prepSelected ? (prepSelected === prepCard.a ? prepSelected : prepSelected) : "___"}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <div className="prep-opts">
                {prepCard.opts.map(opt => {
                  let cls = "";
                  if (prepSelected) {
                    if (opt === prepCard.a) cls = "correct";
                    else if (opt === prepSelected) cls = "wrong-sel";
                  }
                  return (
                    <button key={opt} className={`prep-opt ${cls}`} onClick={() => handlePrepAnswer(opt)} disabled={!!prepSelected}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════ COLLOC RESULTS ══════════════════════════════════════════ */}
        {screen === "results" && (
          <div className="screen">
            <div className="result-banner">
              <div className="result-top">
                <div className="result-emoji">{rm.emoji}</div>
                <div className="result-title">{rm.title}</div>
                <div className="result-sub">{rm.sub}</div>
              </div>
              <div className="result-bar" />
              <div className="stat-grid">
                {[
                  [history.filter(h=>h.status==="exact").length + "/" + history.length, "Corrette"],
                  [Math.round(history.filter(h=>h.status!=="wrong").length / Math.max(history.length,1)*100) + "%", "Precisione"],
                  [history.filter(h=>h.status==="wrong").length, "Errori"],
                ].map(([v, l], i) => (
                  <div key={i} className="stat-box">
                    <div className="stat-val" style={{color: ["var(--blue2)","var(--green)","var(--wrong-c)"][i]}}>{v}</div>
                    <div className="stat-lbl">{l}</div>
                  </div>
                ))}
              </div>

              <div className="review-list">
                <div className="review-head">Riepilogo risposte</div>
                {history.map((h, i) => (
                  <div key={i} className="ri">
                    <div className="ri-dot" style={{background: h.status==="exact"?"var(--correct)":h.status==="wrong"?"var(--wrong-c)":"var(--orange)"}} />
                    <div>
                      <div className="ri-it">{h.card.it}</div>
                      <div className="ri-en">{h.card.en}</div>
                      {h.status !== "exact" && <div className="ri-given">Hai scritto: {h.given}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="btn-row">
                <button className="btn-sec" onClick={() => setScreen("home")}>← Home</button>
                <button className="btn-pri" onClick={startColloc}>Rigioca ↺</button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════ PREP RESULTS ══════════════════════════════════════════ */}
        {screen === "prepResults" && (
          <div className="screen">
            <div className="result-banner">
              <div className="result-top">
                <div className="result-emoji">{prm.emoji}</div>
                <div className="result-title">{prm.title}</div>
                <div className="result-sub">Corrette: {prepCorrect}/{prepHistory.length} · Precisione: {prepAcc}%</div>
              </div>
              <div className="result-bar" />
              <div className="review-list">
                <div className="review-head">Riepilogo</div>
                {prepHistory.map((h, i) => (
                  <div key={i} className="ri">
                    <div className="ri-dot" style={{background: h.correct ? "var(--correct)" : "var(--wrong-c)"}} />
                    <div>
                      <div className="ri-it">{h.q.s.replace("___", `[${h.q.a}]`)}</div>
                      {!h.correct && <div className="ri-given">Hai risposto: {h.selected} · Corretto: {h.q.a}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="btn-row">
                <button className="btn-sec" onClick={() => setScreen("home")}>← Home</button>
                <button className="btn-pri" onClick={startPreps}>Riprova ↺</button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════ RIPASSO ══════════════════════════════════════════ */}
        {screen === "ripasso" && (
          <div className="screen">
            <h1 className="page-title">📋 Ripasso errori</h1>
            <p className="page-sub">Elementi sbagliati nelle ultime 3 sessioni. Ripassali con calma.</p>

            {recentWrong.length === 0 ? (
              <div className="ripasso-empty">
                <div className="big">✨</div>
                <div>Nessun errore nelle ultime sessioni.<br/>Complimenti, continua così!</div>
              </div>
            ) : (
              <>
                {/* Colloc errors */}
                {recentWrong.filter(w => w.type === "colloc").length > 0 && (
                  <>
                    <p className="sl">Collocations — da ripassare</p>
                    {recentWrong.filter(w => w.type === "colloc").map((w, i) => (
                      <div key={i} className="ripasso-item">
                        <div className="ri-type-badge">Collocation</div>
                        <div className="ripasso-q">{w.it}</div>
                        <div className="ripasso-a">Risposta: <span>{w.en}</span></div>
                        {w.given && <div className="ri-given" style={{fontSize:"0.76rem",color:"var(--text3)",marginTop:"0.3rem"}}>Hai scritto: "{w.given}"</div>}
                      </div>
                    ))}
                  </>
                )}

                {/* Prep errors */}
                {recentWrong.filter(w => w.type === "prep").length > 0 && (
                  <>
                    <p className="sl" style={{marginTop:"1rem"}}>Preposizioni — da ripassare</p>
                    {recentWrong.filter(w => w.type === "prep").map((w, i) => (
                      <div key={i} className="ripasso-item">
                        <div className="ri-type-badge">Preposizione</div>
                        <div className="ripasso-q">{w.it.replace("___", `___`)}</div>
                        <div className="ripasso-a">Risposta corretta: <span>{w.en}</span></div>
                        {w.given && <div className="ri-given" style={{fontSize:"0.76rem",color:"var(--text3)",marginTop:"0.3rem"}}>Hai risposto: "{w.given}"</div>}
                      </div>
                    ))}
                  </>
                )}

                <div style={{marginTop:"1rem",display:"flex",justifyContent:"center"}}>
                  <button className="nav-btn" style={{color:"var(--wrong-c)",borderColor:"rgba(220,38,38,0.3)"}}
                    onClick={() => { saveWrong([]); setWrongItems([]); }}>
                    🗑 Cancella storico errori
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════ STATS ══════════════════════════════════════════ */}
        {screen === "stats" && (
          <div className="screen">
            <div className="stats-banner">
              <div className="stats-top">
                <h2>📊 Statistiche</h2>
                <p>Riepilogo delle tue sessioni di allenamento</p>
              </div>
              <div className="big-stats">
                {[
                  [sessions.length,       "Sessioni"],
                  [avgAcc + "%",          "Media"],
                  [bestAcc + "%",         "Record"],
                  [sessions.filter(s=>s.mode==="Collocations").length, "Colloc"],
                ].map(([v, l], i) => (
                  <div key={i} className="bstat">
                    <div className="bstat-v">{v}</div>
                    <div className="bstat-l">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {sessions.length === 0 ? (
              <div className="no-data">Nessuna sessione completata.<br/>Fai il primo esercizio per vedere i tuoi dati!</div>
            ) : (
              <>
                <div className="chart-card">
                  <div className="chart-title">Precisione per sessione (%)</div>
                  <div className="chart-sub">Andamento nelle ultime sessioni</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={chartData} margin={{top:4,right:4,left:-20,bottom:0}}>
                      <defs>
                        <linearGradient id="gAcc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,140,210,0.08)"/>
                      <XAxis dataKey="name" tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis domain={[0,100]} tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false}/>
                      <Tooltip content={<CT />}/>
                      <Area type="monotone" dataKey="acc" stroke="#2563eb" strokeWidth={2.5} fill="url(#gAcc)" dot={{fill:"#2563eb",r:3,strokeWidth:0}}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="sess-list">
                  <div className="sess-head">Storico sessioni</div>
                  {[...sessions].reverse().map((s, i) => (
                    <div key={i} className="sess-row">
                      <div className="sess-n">{sessions.length - i}</div>
                      <div className="sess-d">{s.date}</div>
                      <div className="sess-m">{s.mode}</div>
                      <div className="sess-acc">{s.acc}%</div>
                      <div className={`sess-badge${s.acc>=80?" good":s.acc>=60?" mid":" low"}`}>
                        {s.acc>=80?"🌟":s.acc>=60?"👍":"📚"}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{display:"flex",justifyContent:"center",marginTop:"0.5rem"}}>
              <button className="nav-btn" onClick={() => setScreen("home")}>← Home</button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════ INFO ══════════════════════════════════════════ */}
        {screen === "info" && (
          <div className="screen">
            <h1 className="page-title">Info & Disclaimer</h1>
            <p className="page-sub">Tutto quello che devi sapere su PhraseUp!</p>

            <div className="info-card">
              <h3>Cos'è PhraseUp!?</h3>
              <p>PhraseUp! è un'app educativa per migliorare il tuo inglese attraverso le <strong>collocations</strong> — combinazioni di parole naturali usate dai madrelingua — e gli esercizi sulle <strong>preposizioni</strong>.</p>
              <p>Ogni frase è stata selezionata per rispecchiare situazioni reali di vita quotidiana e lavorativa, con particolare attenzione all'inglese contemporaneo.</p>
            </div>

            <div className="info-card">
              <h3>Come funziona</h3>
              <ul>
                <li><strong>Collocations:</strong> viene mostrata una frase in italiano con soggetto — devi tradurla in inglese. Il sistema valuta la risposta in modo intelligente, premiando anche le risposte parzialmente corrette.</li>
                <li><strong>Preposizioni:</strong> esercizi a scelta multipla per padroneggiare l'uso delle preposizioni inglesi nei contesti più comuni.</li>
                <li><strong>Ripasso:</strong> la sezione Ripasso raccoglie automaticamente gli errori delle ultime 3 sessioni, così puoi concentrarti sulle aree più deboli.</li>
                <li><strong>Statistiche:</strong> tieni traccia della tua precisione nel tempo.</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>Valutazione risposte (Collocations)</h3>
              <p>Il sistema di matching considera corretta anche una risposta con piccole variazioni: esatta (100%), vicina (risposta quasi identica), parziale (oltre il 60% delle parole corrette). Solo le risposte molto lontane dall'originale sono considerate errate.</p>
            </div>

            <div className="info-card disc">
              <h3>⚖️ Disclaimer</h3>
              <p>PhraseUp! è un'applicazione educativa creata a scopo didattico. Le traduzioni proposte rappresentano usi comuni dell'inglese contemporaneo ma potrebbero non coprire tutte le sfumature o i registri linguistici.</p>
              <p>Questa app non costituisce un corso di lingua certificato. Per certificazioni ufficiali (TOEFL, IELTS, Cambridge) si consiglia di affidarsi a enti accreditati.</p>
              <p>I dati di utilizzo (sessioni, errori) sono salvati localmente sul dispositivo dell'utente e non vengono trasmessi ad alcun server.</p>
            </div>

            <div className="info-card" style={{textAlign:"center"}}>
              <div className="version">PhraseUp! v2.0 · {DB.length} collocations · {PREPS.length} preposizioni</div>
            </div>

            <div style={{display:"flex",justifyContent:"center",marginTop:"0.5rem",marginBottom:"1rem"}}>
              <button className="nav-btn" onClick={() => setScreen("home")}>← Home</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
