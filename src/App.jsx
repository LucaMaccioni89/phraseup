import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 2 — DATABASE COLLOCATIONS (300 entries, QA-reviewed by Agent 3)
// 150 Work & Business · 150 Daily Life
// All sentences have a subject, translations verified
// ═══════════════════════════════════════════════════════════════════════
const DB = [
  // ── WORK & BUSINESS ──────────────────────────────────────────────────
  { id:1,   it:"Il direttore prende le redini del progetto rimasto indietro.",          en:"The director takes the reins of the project that has fallen behind.",      cat:"Work & Business", lv:"B2" , colloc_en:"takes the reins", colloc_it:"prende le redini" },
  { id:2,   it:"Il manager delega i compiti più urgenti ai membri del team.",           en:"The manager delegates the most urgent tasks to team members.",             cat:"Work & Business", lv:"B2" , colloc_en:"delegates the most urgent tasks", colloc_it:"delega i compiti urgenti" },
  { id:3,   it:"Le due aziende raggiungono un accordo vantaggioso per entrambe.",       en:"The two companies reach a mutually beneficial agreement.",                 cat:"Work & Business", lv:"C1" , colloc_en:"reach a mutually beneficial agreement", colloc_it:"raggiungono un accordo vantaggioso" },
  { id:4,   it:"Il team lancia una campagna di marketing mirata sui social media.",     en:"The team launches a targeted marketing campaign on social media.",         cat:"Work & Business", lv:"B2" , colloc_en:"launches a targeted marketing campaign", colloc_it:"lancia una campagna di marketing" },
  { id:5,   it:"Sara supera le aspettative del cliente con i suoi risultati.",          en:"Sara exceeds the client's expectations with her results.",                 cat:"Work & Business", lv:"B2" , colloc_en:"exceeds the client's expectations", colloc_it:"supera le aspettative del cliente" },
  { id:6,   it:"Il responsabile stabilisce le priorità tra i compiti della settimana.", en:"The manager sets priorities among the week's tasks.",                      cat:"Work & Business", lv:"B2" , colloc_en:"sets priorities", colloc_it:"stabilisce le priorità" },
  { id:7,   it:"La direzione porta avanti le trattative commerciali da mesi.",          en:"Management has been carrying out commercial negotiations for months.",      cat:"Work & Business", lv:"C1" , colloc_en:"carrying out commercial negotiations", colloc_it:"porta avanti le trattative" },
  { id:8,   it:"Il CEO fa una presentazione convincente agli investitori.",             en:"The CEO gives a compelling pitch to investors.",                           cat:"Work & Business", lv:"C1" , colloc_en:"gives a compelling pitch", colloc_it:"fa una presentazione convincente" },
  { id:9,   it:"Le due parti risolvono il conflitto interno con la mediazione.",        en:"The two parties resolve the internal conflict through mediation.",          cat:"Work & Business", lv:"B2" , colloc_en:"resolve the internal conflict", colloc_it:"risolvono il conflitto" },
  { id:10,  it:"Il project manager monitora le performance del team ogni settimana.",   en:"The project manager monitors the team's performance every week.",          cat:"Work & Business", lv:"B2" , colloc_en:"monitors the team's performance", colloc_it:"monitora le performance" },
  { id:11,  it:"L'azienda assume personale qualificato per la posizione vacante.",      en:"The company hires qualified staff for the vacant position.",               cat:"Work & Business", lv:"B2" , colloc_en:"hires qualified staff", colloc_it:"assume personale qualificato" },
  { id:12,  it:"Il team rispetta la scadenza nonostante le difficoltà impreviste.",     en:"The team meets the deadline despite unexpected difficulties.",             cat:"Work & Business", lv:"B1" , colloc_en:"meets the deadline", colloc_it:"rispetta la scadenza" },
  { id:13,  it:"Marco presenta le sue dimissioni dopo anni di lavoro in azienda.",      en:"Marco hands in his resignation after years at the company.",               cat:"Work & Business", lv:"B2" , colloc_en:"hands in his resignation", colloc_it:"presenta le dimissioni" },
  { id:14,  it:"Giulia negozia un aumento di stipendio durante la valutazione annuale.",en:"Giulia negotiates a pay raise during the annual review.",                  cat:"Work & Business", lv:"B2" , colloc_en:"negotiates a pay raise", colloc_it:"negozia un aumento di stipendio" },
  { id:15,  it:"L'avvocato redige un contratto vincolante tra le due società.",         en:"The lawyer draws up a binding contract between the two companies.",        cat:"Work & Business", lv:"C1" , colloc_en:"draws up a binding contract", colloc_it:"redige un contratto vincolante" },
  { id:16,  it:"Il nuovo direttore aumenta la produttività riducendo gli sprechi.",     en:"The new director boosts productivity by cutting waste.",                   cat:"Work & Business", lv:"C1" , colloc_en:"boosts productivity", colloc_it:"aumenta la produttività" },
  { id:17,  it:"Il responsabile costruisce un rapporto di fiducia solido con il team.", en:"The manager builds a strong relationship of trust with the team.",         cat:"Work & Business", lv:"B2" , colloc_en:"builds a strong relationship of trust", colloc_it:"costruisce un rapporto di fiducia" },
  { id:18,  it:"Paolo fa rete con i professionisti del settore alla conferenza.",       en:"Paolo networks with industry professionals at the conference.",            cat:"Work & Business", lv:"B2" , colloc_en:"networks with industry professionals", colloc_it:"fa rete con i professionisti" },
  { id:19,  it:"L'azienda apre una nuova sede in un mercato emergente asiatico.",       en:"The company opens a new branch in an emerging Asian market.",              cat:"Work & Business", lv:"C1" , colloc_en:"opens a new branch", colloc_it:"apre una nuova sede" },
  { id:20,  it:"Il responsabile HR gestisce un team multiculturale da remoto.",         en:"The HR manager manages a multicultural remote team.",                      cat:"Work & Business", lv:"C1" , colloc_en:"manages a multicultural remote team", colloc_it:"gestisce un team multiculturale" },
  { id:21,  it:"Laura si candida per una posizione dirigenziale in una grande azienda.",en:"Laura applies for a managerial position at a major company.",              cat:"Work & Business", lv:"B2" , colloc_en:"applies for a managerial position", colloc_it:"si candida per una posizione" },
  { id:22,  it:"La direttrice conduce un colloquio di lavoro approfondito con il candidato.", en:"The director conducts an in-depth job interview with the candidate.", cat:"Work & Business", lv:"B2" , colloc_en:"conducts an in-depth job interview", colloc_it:"conduce un colloquio approfondito" },
  { id:23,  it:"L'azienda incrementa il fatturato del venti percento in un anno.",      en:"The company increases its revenue by twenty percent in one year.",         cat:"Work & Business", lv:"C1" , colloc_en:"increases its revenue", colloc_it:"incrementa il fatturato" },
  { id:24,  it:"Il team porta a termine il progetto con successo nei tempi previsti.",  en:"The team successfully completes the project within the planned timeframe.", cat:"Work & Business", lv:"B1" , colloc_en:"successfully completes the project", colloc_it:"porta a termine il progetto" },
  { id:25,  it:"Le due imprese istituiscono una partnership strategica nel settore.",   en:"The two companies establish a strategic partnership in the sector.",        cat:"Work & Business", lv:"C1" , colloc_en:"establish a strategic partnership", colloc_it:"istituiscono una partnership" },
  { id:26,  it:"Il direttore fissa obiettivi chiari per il prossimo trimestre.",        en:"The director sets clear goals for the next quarter.",                      cat:"Work & Business", lv:"B2" , colloc_en:"sets clear goals", colloc_it:"fissa obiettivi chiari" },
  { id:27,  it:"Lo scandalo mette a rischio la reputazione dell'azienda sul mercato.", en:"The scandal puts the company's reputation at risk in the market.",          cat:"Work & Business", lv:"C1" , colloc_en:"puts the company's reputation at risk", colloc_it:"mette a rischio la reputazione" },
  { id:28,  it:"Le parti raggiungono il punto di svolta nella trattativa difficile.",   en:"The parties reach a turning point in the tough negotiation.",              cat:"Work & Business", lv:"C1" , colloc_en:"reach a turning point", colloc_it:"raggiungono il punto di svolta" },
  { id:29,  it:"Il CDA affronta la crisi aziendale con metodo e calma.",               en:"The board of directors handles the business crisis calmly and methodically.", cat:"Work & Business", lv:"B2" , colloc_en:"handles the business crisis", colloc_it:"affronta la crisi aziendale" },
  { id:30,  it:"L'azienda mette in pratica la nuova strategia commerciale a gennaio.",  en:"The company puts the new commercial strategy into practice in January.",   cat:"Work & Business", lv:"B2" , colloc_en:"puts the new commercial strategy into practice", colloc_it:"mette in pratica la strategia" },
  { id:31,  it:"Il CFO riduce i costi operativi senza compromettere la qualità.",       en:"The CFO cuts operational costs without compromising quality.",              cat:"Work & Business", lv:"C1" , colloc_en:"cuts operational costs", colloc_it:"riduce i costi operativi" },
  { id:32,  it:"Le due società avviano una collaborazione con un partner internazionale.", en:"The two companies launch a collaboration with an international partner.", cat:"Work & Business", lv:"B2" , colloc_en:"launch a collaboration", colloc_it:"avviano una collaborazione" },
  { id:33,  it:"Il leader guida il team attraverso un periodo di crisi con determinazione.", en:"The leader steers the team through a difficult period with determination.", cat:"Work & Business", lv:"C1" , colloc_en:"steers the team", colloc_it:"guida il team" },
  { id:34,  it:"L'azienda acquisisce nuovi clienti grazie a una campagna ben mirata.",  en:"The company wins new clients thanks to a well-targeted campaign.",          cat:"Work & Business", lv:"B2" , colloc_en:"wins new clients", colloc_it:"acquisisce nuovi clienti" },
  { id:35,  it:"Il reparto QA garantisce la qualità del prodotto prima del lancio.",    en:"The QA team ensures product quality before the launch.",                   cat:"Work & Business", lv:"B2" , colloc_en:"ensures product quality", colloc_it:"garantisce la qualità del prodotto" },
  { id:36,  it:"La direttrice valuta le prestazioni del personale ogni sei mesi.",      en:"The director assesses staff performance every six months.",                 cat:"Work & Business", lv:"B2" , colloc_en:"assesses staff performance", colloc_it:"valuta le prestazioni del personale" },
  { id:37,  it:"Il responsabile sviluppa un piano d'azione dettagliato per l'anno.",   en:"The manager develops a detailed action plan for the year.",                 cat:"Work & Business", lv:"B2" , colloc_en:"develops a detailed action plan", colloc_it:"sviluppa un piano d'azione" },
  { id:38,  it:"Il team rispetta il budget assegnato senza mai sforarlo.",              en:"The team sticks to the assigned budget without ever exceeding it.",         cat:"Work & Business", lv:"B2" , colloc_en:"sticks to the assigned budget", colloc_it:"rispetta il budget assegnato" },
  { id:39,  it:"Il collaboratore fa rapporto al supervisore ogni lunedì mattina.",      en:"The employee reports to their supervisor every Monday morning.",            cat:"Work & Business", lv:"B1" , colloc_en:"reports to their supervisor", colloc_it:"fa rapporto al supervisore" },
  { id:40,  it:"Il commerciale prende in carico il nuovo cliente con la massima cura.", en:"The sales rep takes on the new client with the utmost care.",               cat:"Work & Business", lv:"B2" , colloc_en:"takes on the new client", colloc_it:"prende in carico il cliente" },
  { id:41,  it:"Le due aziende firmano un accordo commerciale molto vantaggioso.",      en:"The two companies sign a highly advantageous commercial agreement.",        cat:"Work & Business", lv:"C1" , colloc_en:"sign a highly advantageous commercial agreement", colloc_it:"firmano un accordo vantaggioso" },
  { id:42,  it:"L'impresa batte la concorrenza grazie ai suoi prodotti innovativi.",    en:"The company beats the competition thanks to its innovative products.",      cat:"Work & Business", lv:"B2" , colloc_en:"beats the competition", colloc_it:"batte la concorrenza" },
  { id:43,  it:"Il direttore deve far fronte ai debiti accumulati negli ultimi anni.",  en:"The director has to deal with the debts accumulated over the years.",        cat:"Work & Business", lv:"C1" , colloc_en:"deal with the debts", colloc_it:"fare fronte ai debiti" },
  { id:44,  it:"Il consiglio mette in discussione la strategia aziendale attuale.",     en:"The board calls the current business strategy into question.",              cat:"Work & Business", lv:"C1" , colloc_en:"calls the current business strategy into question", colloc_it:"mette in discussione la strategia" },
  { id:45,  it:"Il reparto HR forma i dipendenti sulle nuove procedure operative.",     en:"The HR department trains employees on the new operating procedures.",       cat:"Work & Business", lv:"B2" , colloc_en:"trains employees", colloc_it:"forma i dipendenti" },
  { id:46,  it:"La manager definisce confini chiari tra vita lavorativa e privata.",    en:"The manager sets clear boundaries between work and personal life.",         cat:"Work & Business", lv:"B2" , colloc_en:"sets clear boundaries", colloc_it:"definisce confini chiari" },
  { id:47,  it:"L'azienda ottiene i fondi necessari per avviare il nuovo progetto.",    en:"The company secures the funds needed to launch the new project.",           cat:"Work & Business", lv:"C1" , colloc_en:"secures the funds", colloc_it:"ottiene i fondi necessari" },
  { id:48,  it:"L'azienda perde un cliente importante a causa di un grave errore.",     en:"The company loses a key client due to a serious mistake.",                  cat:"Work & Business", lv:"B2" , colloc_en:"loses a key client", colloc_it:"perde un cliente importante" },
  { id:49,  it:"La startup coglie un'opportunità di mercato prima dei concorrenti.",    en:"The startup seizes a market opportunity before its competitors.",           cat:"Work & Business", lv:"C1" , colloc_en:"seizes a market opportunity", colloc_it:"coglie un'opportunità di mercato" },
  { id:50,  it:"Il CEO presenta una proposta formale al consiglio di amministrazione.", en:"The CEO submits a formal proposal to the board of directors.",              cat:"Work & Business", lv:"C1" , colloc_en:"submits a formal proposal", colloc_it:"presenta una proposta formale" },
  { id:51,  it:"Il team di marketing rilancia un prodotto che non stava performando.",  en:"The marketing team relaunches a product that was underperforming.",         cat:"Work & Business", lv:"C1" , colloc_en:"relaunches a product", colloc_it:"rilancia un prodotto" },
  { id:52,  it:"Il team leader mantiene alto il livello di motivazione nel gruppo.",    en:"The team leader keeps the group's motivation level high.",                  cat:"Work & Business", lv:"B2" , colloc_en:"keeps the group's motivation level high", colloc_it:"mantiene alta la motivazione" },
  { id:53,  it:"L'azienda rispetta il codice di condotta etico in ogni circostanza.",   en:"The company complies with the ethical code of conduct in every circumstance.", cat:"Work & Business", lv:"C1" , colloc_en:"complies with the ethical code of conduct", colloc_it:"rispetta il codice di condotta" },
  { id:54,  it:"Il CFO presenta i risultati trimestrali agli azionisti dell'azienda.",  en:"The CFO presents the quarterly results to the company's shareholders.",     cat:"Work & Business", lv:"C1" , colloc_en:"presents the quarterly results", colloc_it:"presenta i risultati trimestrali" },
  { id:55,  it:"Il responsabile usa i dati analitici per prendere decisioni migliori.", en:"The manager leverages analytics data to make better decisions.",            cat:"Work & Business", lv:"C1" , colloc_en:"leverages analytics data", colloc_it:"sfrutta i dati analitici" },
  { id:56,  it:"Il direttore HR affronta una conversazione difficile con un dipendente.", en:"The HR director has a difficult conversation with an employee.",          cat:"Work & Business", lv:"C1" , colloc_en:"has a difficult conversation", colloc_it:"affronta una conversazione difficile" },
  { id:57,  it:"Il responsabile commerciale fa rete a un grande evento del settore.",   en:"The sales manager networks at a major industry event.",                    cat:"Work & Business", lv:"B2" , colloc_en:"networks at a major industry event", colloc_it:"fa rete a un evento del settore" },
  { id:58,  it:"Il team elabora un piano di emergenza per possibili crisi future.",     en:"The team draws up a contingency plan for potential future crises.",         cat:"Work & Business", lv:"C1" , colloc_en:"draws up a contingency plan", colloc_it:"elabora un piano di emergenza" },
  { id:59,  it:"Il nuovo prodotto soddisfa le aspettative del mercato fin dal lancio.", en:"The new product meets market expectations from the very launch.",           cat:"Work & Business", lv:"B2" , colloc_en:"meets market expectations", colloc_it:"soddisfa le aspettative del mercato" },
  { id:60,  it:"Il manager porta avanti due progetti in parallelo senza errori.",       en:"The manager runs two projects in parallel without making errors.",          cat:"Work & Business", lv:"C1" , colloc_en:"runs two projects in parallel", colloc_it:"porta avanti due progetti in parallelo" },
  { id:61,  it:"L'azienda costruisce un brand riconoscibile nel proprio settore.",      en:"The company builds a recognizable brand in its industry.",                  cat:"Work & Business", lv:"B2" , colloc_en:"builds a recognizable brand", colloc_it:"costruisce un brand riconoscibile" },
  { id:62,  it:"Il responsabile adotta un approccio proattivo ai problemi operativi.",  en:"The manager takes a proactive approach to operational issues.",             cat:"Work & Business", lv:"C1" , colloc_en:"takes a proactive approach", colloc_it:"adotta un approccio proattivo" },
  { id:63,  it:"Il collaboratore mette le proprie competenze a disposizione del team.", en:"The employee puts their skills at the team's disposal.",                    cat:"Work & Business", lv:"B2" , colloc_en:"puts their skills at the team's disposal", colloc_it:"mette le competenze a disposizione" },
  { id:64,  it:"L'impresa ottiene un vantaggio competitivo nel mercato globale.",       en:"The company gains a competitive edge in the global market.",                cat:"Work & Business", lv:"C1" , colloc_en:"gains a competitive edge", colloc_it:"ottiene un vantaggio competitivo" },
  { id:65,  it:"Il responsabile fa il punto della situazione con tutti i membri del team.", en:"The manager takes stock of the situation with all team members.",        cat:"Work & Business", lv:"B2" , colloc_en:"takes stock of the situation", colloc_it:"fa il punto della situazione" },
  { id:66,  it:"La direzione supera le resistenze interne al cambiamento con pazienza.", en:"Management overcomes internal resistance to change with patience.",        cat:"Work & Business", lv:"C1" , colloc_en:"overcomes internal resistance", colloc_it:"supera le resistenze interne" },
  { id:67,  it:"Il responsabile delega i compiti in modo efficace per ottimizzare i tempi.", en:"The manager delegates tasks effectively to save time.",               cat:"Work & Business", lv:"B2" , colloc_en:"delegates tasks effectively", colloc_it:"delega i compiti in modo efficace" },
  { id:68,  it:"La società consolida la propria posizione nel mercato locale.",         en:"The company consolidates its position in the local market.",                cat:"Work & Business", lv:"C1" , colloc_en:"consolidates its position", colloc_it:"consolida la propria posizione" },
  { id:69,  it:"Il nuovo direttore prende le redini di un team in difficoltà.",         en:"The new director takes the reins of a struggling team.",                   cat:"Work & Business", lv:"B2" , colloc_en:"takes the reins of a struggling team", colloc_it:"prende le redini del team" },
  { id:70,  it:"Il fornitore non rispetta la scadenza prevista nel contratto.",         en:"The supplier fails to meet the deadline set out in the contract.",          cat:"Work & Business", lv:"B1" , colloc_en:"fails to meet the deadline", colloc_it:"non rispetta la scadenza" },
  { id:71,  it:"Il responsabile commerciale costruisce un network solido nel settore.", en:"The sales manager builds a solid professional network in the industry.",    cat:"Work & Business", lv:"B2" , colloc_en:"builds a solid professional network", colloc_it:"costruisce un network solido" },
  { id:72,  it:"Il controller fa una stima realistica dei costi di produzione.",        en:"The controller makes a realistic estimate of production costs.",            cat:"Work & Business", lv:"B2" , colloc_en:"makes a realistic estimate", colloc_it:"fa una stima realistica" },
  { id:73,  it:"Il responsabile apre un dialogo diretto tra i reparti dell'azienda.",  en:"The manager opens a direct dialogue between the company's departments.",    cat:"Work & Business", lv:"B2" , colloc_en:"opens a direct dialogue", colloc_it:"apre un dialogo diretto" },
  { id:74,  it:"L'azienda tutela la propria proprietà intellettuale con i brevetti.",   en:"The company protects its intellectual property with patents.",              cat:"Work & Business", lv:"C1" , colloc_en:"protects its intellectual property", colloc_it:"tutela la proprietà intellettuale" },
  { id:75,  it:"Il consulente individua le aree di miglioramento nel flusso di lavoro.", en:"The consultant identifies areas for improvement in the workflow.",         cat:"Work & Business", lv:"B2" , colloc_en:"identifies areas for improvement", colloc_it:"individua le aree di miglioramento" },
  { id:76,  it:"Il responsabile fa rapporto direttamente all'amministratore delegato.", en:"The manager reports directly to the CEO.",                                 cat:"Work & Business", lv:"B2" , colloc_en:"reports directly to the CEO", colloc_it:"fa rapporto direttamente all'AD" },
  { id:77,  it:"Il controller tiene traccia di tutte le spese operative del mese.",     en:"The controller keeps track of all operational expenses for the month.",    cat:"Work & Business", lv:"B1" , colloc_en:"keeps track of all operational expenses", colloc_it:"tiene traccia delle spese" },
  { id:78,  it:"Il team supera le aspettative degli azionisti con risultati record.",   en:"The team exceeds shareholder expectations with record-breaking results.",   cat:"Work & Business", lv:"C1" , colloc_en:"exceeds shareholder expectations", colloc_it:"supera le aspettative degli azionisti" },
  { id:79,  it:"Il legale negozia le condizioni contrattuali prima della firma finale.", en:"The lawyer negotiates the contractual terms before the final signing.",    cat:"Work & Business", lv:"B2" , colloc_en:"negotiates the contractual terms", colloc_it:"negozia le condizioni contrattuali" },
  { id:80,  it:"Il team lavora sotto pressione rispettando tutte le scadenze concordate.", en:"The team works under pressure while meeting all agreed deadlines.",      cat:"Work & Business", lv:"B2" , colloc_en:"works under pressure", colloc_it:"lavora sotto pressione" },
  { id:81,  it:"Il nuovo responsabile aumenta la quota di mercato del quindici percento.", en:"The new manager increases the market share by fifteen percent.",         cat:"Work & Business", lv:"C1" , colloc_en:"increases the market share", colloc_it:"aumenta la quota di mercato" },
  { id:82,  it:"Il management elabora un piano aziendale solido per i prossimi cinque anni.", en:"Management draws up a solid business plan for the next five years.",  cat:"Work & Business", lv:"C1" , colloc_en:"draws up a solid business plan", colloc_it:"elabora un piano aziendale" },
  { id:83,  it:"La direttrice forma una squadra affiatata e multidisciplinare.",        en:"The director builds a close-knit, multidisciplinary team.",                 cat:"Work & Business", lv:"B2" , colloc_en:"builds a close-knit", colloc_it:"forma una squadra affiatata" },
  { id:84,  it:"Il manager trasforma un feedback negativo in un'opportunità di crescita.", en:"The manager turns negative feedback into an opportunity for growth.",    cat:"Work & Business", lv:"C1" , colloc_en:"turns negative feedback into an opportunity", colloc_it:"trasforma il feedback in opportunità" },
  { id:85,  it:"Il team gestisce le aspettative del cliente per tutta la durata del progetto.", en:"The team manages client expectations throughout the entire project.", cat:"Work & Business", lv:"B2" , colloc_en:"manages client expectations", colloc_it:"gestisce le aspettative del cliente" },
  { id:86,  it:"La direzione prende una decisione difficile in tempi molto stretti.",   en:"Management makes a tough decision within a very tight timeframe.",          cat:"Work & Business", lv:"B2" , colloc_en:"makes a tough decision", colloc_it:"prende una decisione difficile" },
  { id:87,  it:"L'azienda lancia un nuovo prodotto sul mercato internazionale in primavera.", en:"The company launches a new product on the international market in spring.", cat:"Work & Business", lv:"B2" , colloc_en:"launches a new product", colloc_it:"lancia un nuovo prodotto" },
  { id:88,  it:"La startup coglie l'occasione di espandersi in nuovi mercati esteri.",  en:"The startup seizes the chance to expand into new foreign markets.",         cat:"Work & Business", lv:"C1" , colloc_en:"seizes the chance to expand", colloc_it:"coglie l'occasione di espandersi" },
  { id:89,  it:"Il responsabile pianifica con anticipo ogni fase critica del progetto.", en:"The manager plans well ahead for every critical phase of the project.",    cat:"Work & Business", lv:"B2" , colloc_en:"plans well ahead", colloc_it:"pianifica con anticipo" },
  { id:90,  it:"Il team porta avanti una revisione completa dei processi produttivi.",  en:"The team carries out a full review of the production processes.",           cat:"Work & Business", lv:"C1" , colloc_en:"carries out a full review", colloc_it:"porta avanti una revisione completa" },
  { id:91,  it:"Il responsabile stabilisce aspettative realistiche con il cliente prima di iniziare.", en:"The manager sets realistic expectations with the client before starting.", cat:"Work & Business", lv:"B2" , colloc_en:"sets realistic expectations", colloc_it:"stabilisce aspettative realistiche" },
  { id:92,  it:"Il team porta risultati concreti in modo costante nel tempo.",          en:"The team consistently delivers solid results over time.",                   cat:"Work & Business", lv:"B2" , colloc_en:"consistently delivers solid results", colloc_it:"porta risultati con costanza" },
  { id:93,  it:"L'azienda riduce il turnover grazie a benefit e condizioni migliori.",  en:"The company reduces turnover thanks to better benefits and working conditions.", cat:"Work & Business", lv:"C1" , colloc_en:"reduces turnover", colloc_it:"riduce il turnover" },
  { id:94,  it:"Il responsabile risponde ai propri superiori dei risultati ottenuti.",  en:"The manager is accountable to their superiors for the results achieved.",   cat:"Work & Business", lv:"B2" , colloc_en:"is accountable to their superiors", colloc_it:"risponde ai propri superiori" },
  { id:95,  it:"Le due aziende aprono nuove opportunità di business con la collaborazione.", en:"The two companies open up new business opportunities through their collaboration.", cat:"Work & Business", lv:"C1" , colloc_en:"open up new business opportunities", colloc_it:"aprono nuove opportunità" },
  { id:96,  it:"Il team fissa riunioni settimanali per allinearsi sugli obiettivi.",    en:"The team schedules weekly meetings to align on objectives.",                cat:"Work & Business", lv:"B1" , colloc_en:"schedules weekly meetings", colloc_it:"fissa riunioni settimanali" },
  { id:97,  it:"L'azienda massimizza il ritorno sull'investimento pubblicitario.",      en:"The company maximizes the return on its advertising investment.",           cat:"Work & Business", lv:"C1" , colloc_en:"maximizes the return on its advertising investment", colloc_it:"massimizza il ritorno" },
  { id:98,  it:"Il responsabile tiene in considerazione il feedback del cliente prima di agire.", en:"The manager takes the client's feedback into account before acting.", cat:"Work & Business", lv:"B2" , colloc_en:"takes the client's feedback into account", colloc_it:"tiene conto del feedback" },
  { id:99,  it:"Il team di vendita conclude le trattative entro la fine del mese.",     en:"The sales team wraps up negotiations by the end of the month.",             cat:"Work & Business", lv:"B2" , colloc_en:"wraps up negotiations", colloc_it:"conclude le trattative" },
  { id:100, it:"La direzione mette in campo tutte le risorse disponibili per finire il lavoro.", en:"Management deploys all available resources to get the work done.",   cat:"Work & Business", lv:"C1" , colloc_en:"deploys all available resources", colloc_it:"mette in campo le risorse" },
  { id:101, it:"La responsabile commerciale mantiene un contatto costante con i clienti chiave.", en:"The sales manager maintains regular contact with key clients.",       cat:"Work & Business", lv:"B2" , colloc_en:"maintains regular contact", colloc_it:"mantiene un contatto costante" },
  { id:102, it:"Il team di sviluppo risolve un bug critico poche ore prima del lancio.", en:"The development team fixes a critical bug just hours before the launch.",  cat:"Work & Business", lv:"B2" , colloc_en:"fixes a critical bug", colloc_it:"risolve un bug critico" },
  { id:103, it:"Il responsabile marketing studia i dati di mercato prima di prendere decisioni.", en:"The marketing manager studies market data before making decisions.",  cat:"Work & Business", lv:"B2" , colloc_en:"studies market data", colloc_it:"studia i dati di mercato" },
  { id:104, it:"La direttrice finanziaria presenta il bilancio annuale al consiglio.",   en:"The financial director presents the annual balance sheet to the board.",    cat:"Work & Business", lv:"C1" , colloc_en:"presents the annual balance sheet", colloc_it:"presenta il bilancio annuale" },
  { id:105, it:"Il team di assistenza risponde ai clienti entro ventiquattr'ore.",       en:"The support team responds to clients within twenty-four hours.",            cat:"Work & Business", lv:"B1" , colloc_en:"responds to clients within twenty-four hours", colloc_it:"risponde ai clienti entro 24 ore" },
  { id:106, it:"L'azienda investe nell'aggiornamento professionale di tutti i dipendenti.", en:"The company invests in the professional development of all its employees.", cat:"Work & Business", lv:"C1" , colloc_en:"invests in the professional development", colloc_it:"investe nella formazione professionale" },
  { id:107, it:"Il responsabile conduce un'analisi approfondita del mercato di riferimento.", en:"The manager carries out an in-depth analysis of the target market.",   cat:"Work & Business", lv:"C1" , colloc_en:"carries out an in-depth analysis", colloc_it:"conduce un'analisi approfondita" },
  { id:108, it:"Il team crea un prototipo funzionante nel giro di due settimane.",       en:"The team builds a working prototype within two weeks.",                    cat:"Work & Business", lv:"B2" , colloc_en:"builds a working prototype", colloc_it:"crea un prototipo funzionante" },
  { id:109, it:"La manager promuove una cultura aziendale basata sulla fiducia.",        en:"The manager fosters a company culture based on trust.",                    cat:"Work & Business", lv:"C1" , colloc_en:"fosters a company culture", colloc_it:"promuove una cultura aziendale" },
  { id:110, it:"Il responsabile fissa un appuntamento con il cliente per discutere l'offerta.", en:"The manager arranges a meeting with the client to discuss the offer.", cat:"Work & Business", lv:"B1" , colloc_en:"arranges a meeting with the client", colloc_it:"fissa un appuntamento col cliente" },
  { id:111, it:"L'azienda stringe un accordo di distribuzione con un partner europeo.",  en:"The company signs a distribution agreement with a European partner.",      cat:"Work & Business", lv:"C1" , colloc_en:"signs a distribution agreement", colloc_it:"stringe un accordo di distribuzione" },
  { id:112, it:"Il team di progetto tiene una riunione di allineamento ogni mattina.",   en:"The project team holds a daily stand-up meeting every morning.",            cat:"Work & Business", lv:"B1" , colloc_en:"holds a daily stand-up meeting", colloc_it:"tiene una riunione di allineamento" },
  { id:113, it:"La responsabile HR avvia un processo di selezione per cinque posizioni.", en:"The HR manager launches a recruitment process for five positions.",        cat:"Work & Business", lv:"B2" , colloc_en:"launches a recruitment process", colloc_it:"avvia un processo di selezione" },
  { id:114, it:"Il consulente stende un rapporto dettagliato sulle inefficienze rilevate.", en:"The consultant draws up a detailed report on the inefficiencies identified.", cat:"Work & Business", lv:"C1" , colloc_en:"draws up a detailed report", colloc_it:"stende un rapporto dettagliato" },
  { id:115, it:"Il responsabile commerciale apre un nuovo canale di vendita online.",    en:"The sales manager opens a new online sales channel.",                      cat:"Work & Business", lv:"B2" , colloc_en:"opens a new online sales channel", colloc_it:"apre un nuovo canale di vendita" },
  { id:116, it:"L'azienda affronta una fase di ristrutturazione per tornare in utile.",  en:"The company goes through a restructuring phase to return to profit.",       cat:"Work & Business", lv:"C1" , colloc_en:"goes through a restructuring phase", colloc_it:"affronta una ristrutturazione" },
  { id:117, it:"Il team porta a compimento una migrazione complessa dei dati aziendali.", en:"The team successfully completes a complex migration of company data.",     cat:"Work & Business", lv:"C1" , colloc_en:"successfully completes a complex migration", colloc_it:"porta a compimento la migrazione" },
  { id:118, it:"La manager fissa obiettivi misurabili per ogni membro del suo team.",    en:"The manager sets measurable targets for each member of her team.",         cat:"Work & Business", lv:"B2" , colloc_en:"sets measurable targets", colloc_it:"fissa obiettivi misurabili" },
  { id:119, it:"L'azienda firma un contratto di fornitura pluriennale con il partner.",  en:"The company signs a multi-year supply contract with the partner.",          cat:"Work & Business", lv:"C1" , colloc_en:"signs a multi-year supply contract", colloc_it:"firma un contratto pluriennale" },
  { id:120, it:"Il team mantiene alto il livello di qualità anche sotto pressione.",     en:"The team maintains a high standard of quality even under pressure.",        cat:"Work & Business", lv:"B2" , colloc_en:"maintains a high standard of quality", colloc_it:"mantiene alto il livello di qualità" },
  { id:121, it:"Il direttore tiene una riunione plenaria per comunicare i nuovi obiettivi.", en:"The director holds a plenary meeting to communicate the new objectives.", cat:"Work & Business", lv:"B2" , colloc_en:"holds a plenary meeting", colloc_it:"tiene una riunione plenaria" },
  { id:122, it:"L'azienda lancia un programma di fidelizzazione per i clienti storici.", en:"The company launches a loyalty programme for long-standing clients.",      cat:"Work & Business", lv:"B2" , colloc_en:"launches a loyalty programme", colloc_it:"lancia un programma di fidelizzazione" },
  { id:123, it:"Il responsabile IT gestisce un'interruzione del servizio con rapidità.",  en:"The IT manager handles a service outage quickly and efficiently.",          cat:"Work & Business", lv:"B2" , colloc_en:"handles a service outage", colloc_it:"gestisce un'interruzione del servizio" },
  { id:124, it:"La startup raccoglie fondi tramite una serie di incontri con investitori.", en:"The startup raises funds through a series of meetings with investors.",  cat:"Work & Business", lv:"C1" , colloc_en:"raises funds", colloc_it:"raccoglie fondi" },
  { id:125, it:"Il responsabile operativo ottimizza i processi interni per ridurre i tempi.", en:"The operations manager streamlines internal processes to reduce lead times.", cat:"Work & Business", lv:"C1" , colloc_en:"streamlines internal processes", colloc_it:"ottimizza i processi interni" },
  { id:126, it:"Il team sfrutta le tecnologie emergenti per innovare il proprio servizio.", en:"The team leverages emerging technologies to innovate their service.",    cat:"Work & Business", lv:"C1" , colloc_en:"leverages emerging technologies", colloc_it:"sfrutta le tecnologie emergenti" },
  { id:127, it:"L'azienda mette al centro il cliente in ogni decisione strategica.",     en:"The company puts the customer at the heart of every strategic decision.",   cat:"Work & Business", lv:"B2" , colloc_en:"puts the customer at the heart", colloc_it:"mette al centro il cliente" },
  { id:128, it:"Il responsabile tiene sotto controllo i margini di profitto ogni mese.", en:"The manager keeps a close eye on profit margins every month.",              cat:"Work & Business", lv:"B2" , colloc_en:"keeps a close eye on profit margins", colloc_it:"tiene sotto controllo i margini" },
  { id:129, it:"La direttrice avvia un piano di mentoring per i giovani talenti aziendali.", en:"The director launches a mentoring programme for the company's young talent.", cat:"Work & Business", lv:"C1" , colloc_en:"launches a mentoring programme", colloc_it:"avvia un piano di mentoring" },
  { id:130, it:"Il team di vendita raggiunge il cento percento del target trimestrale.", en:"The sales team hits one hundred percent of its quarterly target.",          cat:"Work & Business", lv:"B2" , colloc_en:"hits one hundred percent of its quarterly target", colloc_it:"raggiunge il 100% del target" },
  { id:131, it:"Il responsabile promuove la collaborazione tra i diversi reparti.",      en:"The manager encourages collaboration between the different departments.",   cat:"Work & Business", lv:"B2" , colloc_en:"encourages collaboration", colloc_it:"promuove la collaborazione" },
  { id:132, it:"L'azienda introduce un sistema di feedback continuo per tutti i team.",  en:"The company introduces a continuous feedback system for all teams.",        cat:"Work & Business", lv:"C1" , colloc_en:"introduces a continuous feedback system", colloc_it:"introduce un sistema di feedback" },
  { id:133, it:"Il team gestisce una crisi di comunicazione con trasparenza e rapidità.", en:"The team handles a communication crisis with transparency and speed.",     cat:"Work & Business", lv:"C1" , colloc_en:"handles a communication crisis", colloc_it:"gestisce una crisi di comunicazione" },
  { id:134, it:"La responsabile marketing monitora le campagne pubblicitarie in tempo reale.", en:"The marketing manager monitors advertising campaigns in real time.",   cat:"Work & Business", lv:"B2" , colloc_en:"monitors advertising campaigns in real time", colloc_it:"monitora le campagne in tempo reale" },
  { id:135, it:"Il direttore assegna ruoli chiari per evitare sovrapposizioni di compiti.", en:"The director assigns clear roles to avoid overlapping responsibilities.", cat:"Work & Business", lv:"B2" , colloc_en:"assigns clear roles", colloc_it:"assegna ruoli chiari" },
  { id:136, it:"L'azienda diversifica il portafoglio prodotti per ridurre i rischi.",    en:"The company diversifies its product portfolio to reduce risks.",             cat:"Work & Business", lv:"C1" , colloc_en:"diversifies its product portfolio", colloc_it:"diversifica il portafoglio prodotti" },
  { id:137, it:"Il manager porta avanti le trattative con determinazione e professionalità.", en:"The manager carries out the negotiations with determination and professionalism.", cat:"Work & Business", lv:"C1" , colloc_en:"carries out the negotiations", colloc_it:"porta avanti le trattative" },
  { id:138, it:"Il team di progetto consegna il lavoro finito prima della scadenza.",    en:"The project team delivers the finished work ahead of the deadline.",        cat:"Work & Business", lv:"B2" , colloc_en:"delivers the finished work ahead of the deadline", colloc_it:"consegna il lavoro prima della scadenza" },
  { id:139, it:"La responsabile legale esamina il contratto prima della firma definitiva.", en:"The legal manager reviews the contract before the final signature.",     cat:"Work & Business", lv:"C1" , colloc_en:"reviews the contract", colloc_it:"esamina il contratto" },
  { id:140, it:"L'azienda rafforza la propria presenza online con una nuova strategia.",  en:"The company strengthens its online presence with a new strategy.",         cat:"Work & Business", lv:"B2" , colloc_en:"strengthens its online presence", colloc_it:"rafforza la presenza online" },
  { id:141, it:"Il CEO riunisce i dirigenti per definire la strategia del prossimo anno.", en:"The CEO gathers the executives to define next year's strategy.",          cat:"Work & Business", lv:"C1" , colloc_en:"gathers the executives", colloc_it:"riunisce i dirigenti" },
  { id:142, it:"Il team crea valore aggiunto per il cliente attraverso il proprio servizio.", en:"The team creates added value for the client through its service.",     cat:"Work & Business", lv:"C1" , colloc_en:"creates added value", colloc_it:"crea valore aggiunto" },
  { id:143, it:"La direttrice mette in campo le migliori risorse per vincere l'appalto.", en:"The director deploys the best resources to win the tender.",               cat:"Work & Business", lv:"C1" , colloc_en:"deploys the best resources to win the tender", colloc_it:"mette in campo le risorse per vincere" },
  { id:144, it:"Il responsabile commerciale mantiene le relazioni con i principali fornitori.", en:"The sales manager maintains relationships with key suppliers.",       cat:"Work & Business", lv:"B2" , colloc_en:"maintains relationships with key suppliers", colloc_it:"mantiene le relazioni coi fornitori" },
  { id:145, it:"L'azienda presenta un'offerta competitiva per aggiudicarsi il contratto.", en:"The company submits a competitive offer to secure the contract.",         cat:"Work & Business", lv:"C1" , colloc_en:"submits a competitive offer", colloc_it:"presenta un'offerta competitiva" },
  { id:146, it:"Il team individua i punti critici del processo e propone soluzioni concrete.", en:"The team identifies the bottlenecks in the process and proposes concrete solutions.", cat:"Work & Business", lv:"C1" , colloc_en:"identifies the bottlenecks", colloc_it:"individua i punti critici" },
  { id:147, it:"La responsabile HR organizza sessioni di team building per rafforzare il gruppo.", en:"The HR manager organises team building sessions to strengthen the group.", cat:"Work & Business", lv:"B2" , colloc_en:"organises team building sessions", colloc_it:"organizza sessioni di team building" },
  { id:148, it:"Il manager riesce a mantenere la calma durante una situazione di crisi.", en:"The manager manages to keep calm during a crisis situation.",               cat:"Work & Business", lv:"B2" , colloc_en:"manages to keep calm", colloc_it:"riesce a mantenere la calma" },
  { id:149, it:"L'azienda costruisce una reputazione solida nel settore grazie alla qualità.", en:"The company builds a solid reputation in the industry thanks to its quality.", cat:"Work & Business", lv:"B2" , colloc_en:"builds a solid reputation", colloc_it:"costruisce una reputazione solida" },
  { id:150, it:"Il direttore commerciale porta a casa un contratto da un milione di euro.", en:"The commercial director brings home a contract worth one million euros.",  cat:"Work & Business", lv:"C1" , colloc_en:"brings home a contract", colloc_it:"porta a casa un contratto" },

  // ── DAILY LIFE ────────────────────────────────────────────────────────
  { id:151, it:"Marco fa una passeggiata rigenerante prima di andare in ufficio.",      en:"Marco goes for an invigorating walk before heading to the office.",         cat:"Daily Life", lv:"B1" , colloc_en:"goes for an invigorating walk", colloc_it:"fa una passeggiata rigenerante" },
  { id:152, it:"Giulia perde il conto del tempo mentre legge un romanzo sul divano.",  en:"Giulia loses track of time while reading a novel on the sofa.",              cat:"Daily Life", lv:"B2" , colloc_en:"loses track of time", colloc_it:"perde il conto del tempo" },
  { id:153, it:"La famiglia tiene a mente le priorità importanti della settimana.",    en:"The family bears in mind the important priorities of the week.",             cat:"Daily Life", lv:"B2" , colloc_en:"bears in mind the important priorities", colloc_it:"tiene a mente le priorità" },
  { id:154, it:"Sara fa una colazione abbondante per iniziare bene la giornata.",      en:"Sara has a hearty breakfast to start the day off right.",                    cat:"Daily Life", lv:"A2" , colloc_en:"has a hearty breakfast", colloc_it:"fa una colazione abbondante" },
  { id:155, it:"Luca prende una decisione difficile in poco tempo senza rimpianti.",   en:"Luca makes a tough decision quickly and without regrets.",                   cat:"Daily Life", lv:"B1" , colloc_en:"makes a tough decision", colloc_it:"prende una decisione difficile" },
  { id:156, it:"Il vicino si fa i fatti propri senza interferire nella vita altrui.",  en:"The neighbor minds his own business without interfering in others' lives.",  cat:"Daily Life", lv:"B1" , colloc_en:"minds his own business", colloc_it:"si fa i fatti propri" },
  { id:157, it:"Anna si prende una pausa meritata dopo ore di lavoro intenso.",        en:"Anna takes a well-deserved break after hours of intense work.",              cat:"Daily Life", lv:"A2" , colloc_en:"takes a well-deserved break", colloc_it:"si prende una pausa meritata" },
  { id:158, it:"Pietro dà per scontato quello che ha senza rendersene conto.",         en:"Pietro takes for granted what he has without realizing it.",                 cat:"Daily Life", lv:"B2" , colloc_en:"takes for granted", colloc_it:"dà per scontato" },
  { id:159, it:"La coppia fatica a far quadrare i conti alla fine del mese.",          en:"The couple struggles to make ends meet at the end of the month.",           cat:"Daily Life", lv:"B2" , colloc_en:"make ends meet", colloc_it:"far quadrare i conti" },
  { id:160, it:"Marco corre il rischio di sbagliare di nuovo la stessa cosa.",         en:"Marco runs the risk of making the same mistake again.",                     cat:"Daily Life", lv:"B2" , colloc_en:"runs the risk", colloc_it:"corre il rischio" },
  { id:161, it:"La madre presta attenzione ai segnali di allarme nella salute del figlio.", en:"The mother pays attention to the warning signs in her son's health.",   cat:"Daily Life", lv:"B1" , colloc_en:"pays attention to the warning signs", colloc_it:"presta attenzione ai segnali" },
  { id:162, it:"Giulia si trova a fare una scelta di vita importante a un bivio.",     en:"Giulia finds herself at a crossroads, facing an important life decision.",   cat:"Daily Life", lv:"B1" , colloc_en:"finds herself at a crossroads", colloc_it:"si trova a un bivio" },
  { id:163, it:"Luca esce dalla propria zona di comfort iscrivendosi a un corso di teatro.", en:"Luca steps out of his comfort zone by signing up for a drama class.",  cat:"Daily Life", lv:"B2" , colloc_en:"steps out of his comfort zone", colloc_it:"esce dalla zona di comfort" },
  { id:164, it:"Sara fa buon uso del tempo libero del weekend imparando il giapponese.", en:"Sara makes good use of her free time on the weekend learning Japanese.",  cat:"Daily Life", lv:"B1" , colloc_en:"makes good use of her free time", colloc_it:"fa buon uso del tempo libero" },
  { id:165, it:"I bambini rimettono i giochi al proprio posto dopo averli usati.",     en:"The children put the toys back in their place after using them.",            cat:"Daily Life", lv:"A2" , colloc_en:"put the toys back in their place", colloc_it:"rimettono i giochi al posto" },
  { id:166, it:"Marco perde la calma in una situazione particolarmente stressante.",   en:"Marco loses his temper in a particularly stressful situation.",              cat:"Daily Life", lv:"B1" , colloc_en:"loses his temper", colloc_it:"perde la calma" },
  { id:167, it:"Anna dorme fino a tardi il sabato mattina per recuperare energie.",    en:"Anna sleeps in on Saturday morning to recover her energy.",                  cat:"Daily Life", lv:"A2" , colloc_en:"sleeps in on Saturday morning", colloc_it:"dorme fino a tardi" },
  { id:168, it:"Pietro fa del suo meglio anche nelle situazioni più difficili.",       en:"Pietro does his best even in the most difficult situations.",                cat:"Daily Life", lv:"B1" , colloc_en:"does his best", colloc_it:"fa del suo meglio" },
  { id:169, it:"Sara tiene la situazione sotto controllo nonostante il caos.",         en:"Sara keeps the situation under control despite the chaos.",                  cat:"Daily Life", lv:"B1" , colloc_en:"keeps the situation under control", colloc_it:"tiene la situazione sotto controllo" },
  { id:170, it:"Marco coglie l'opportunità al momento giusto senza esitare.",          en:"Marco seizes the opportunity at the right moment without hesitating.",       cat:"Daily Life", lv:"B2" , colloc_en:"seizes the opportunity", colloc_it:"coglie l'opportunità" },
  { id:171, it:"Giulia fa la lista della spesa prima di andare al supermercato.",      en:"Giulia makes a shopping list before going to the supermarket.",              cat:"Daily Life", lv:"A2" , colloc_en:"makes a shopping list", colloc_it:"fa la lista della spesa" },
  { id:172, it:"Luca perde il conto delle ore quando è completamente preso dal lavoro.", en:"Luca loses track of the hours when he is completely absorbed in his work.", cat:"Daily Life", lv:"B1" , colloc_en:"loses track of the hours", colloc_it:"perde il conto delle ore" },
  { id:173, it:"La madre tiene testa a una situazione complicata con molta calma.",    en:"The mother stands her ground in a complicated situation very calmly.",       cat:"Daily Life", lv:"B2" , colloc_en:"stands her ground", colloc_it:"tiene testa alla situazione" },
  { id:174, it:"Pietro fa il punto della situazione dopo una giornata particolarmente impegnativa.", en:"Pietro takes stock of the situation after a particularly demanding day.", cat:"Daily Life", lv:"B2" , colloc_en:"takes stock of the situation", colloc_it:"fa il punto della situazione" },
  { id:175, it:"Anna rimanda le decisioni importanti troppo a lungo per paura.",       en:"Anna puts off important decisions for too long out of fear.",                cat:"Daily Life", lv:"B2" , colloc_en:"puts off important decisions", colloc_it:"rimanda le decisioni importanti" },
  { id:176, it:"Sara mette da parte un po' di soldi ogni mese per comprare casa.",    en:"Sara puts money aside every month to buy a house.",                         cat:"Daily Life", lv:"B1" , colloc_en:"puts money aside", colloc_it:"mette da parte i soldi" },
  { id:177, it:"Marco prende sul serio i propri problemi di salute e va dal medico.", en:"Marco takes his health issues seriously and goes to the doctor.",            cat:"Daily Life", lv:"B1" , colloc_en:"takes his health issues seriously", colloc_it:"prende sul serio la salute" },
  { id:178, it:"Giulia porta avanti una conversazione difficile con coraggio.",        en:"Giulia carries on a difficult conversation with courage.",                   cat:"Daily Life", lv:"B2" , colloc_en:"carries on a difficult conversation", colloc_it:"porta avanti una conversazione difficile" },
  { id:179, it:"Pietro fa affidamento sui propri amici nei momenti di bisogno.",       en:"Pietro relies on his friends in times of need.",                            cat:"Daily Life", lv:"B2" , colloc_en:"relies on his friends", colloc_it:"fa affidamento sugli amici" },
  { id:180, it:"Anna sta al passo con le ultime notizie leggendo ogni mattina.",       en:"Anna keeps up with the latest news by reading every morning.",              cat:"Daily Life", lv:"B1" , colloc_en:"keeps up with the latest news", colloc_it:"sta al passo con le notizie" },
  { id:181, it:"Luca perde la speranza dopo una lunga serie di insuccessi personali.", en:"Luca loses hope after a long series of personal failures.",                 cat:"Daily Life", lv:"B2" , colloc_en:"loses hope", colloc_it:"perde la speranza" },
  { id:182, it:"Marco prende l'iniziativa senza aspettare che qualcuno lo faccia.",    en:"Marco takes the initiative without waiting for someone else to do it.",     cat:"Daily Life", lv:"B2" , colloc_en:"takes the initiative", colloc_it:"prende l'iniziativa" },
  { id:183, it:"I colleghi si prendono una pausa caffè per ricaricarsi dopo le riunioni.", en:"The colleagues take a coffee break to recharge after the meetings.",    cat:"Daily Life", lv:"A2" , colloc_en:"take a coffee break", colloc_it:"si prendono una pausa caffè" },
  { id:184, it:"Sara si prende cura dei suoi figli con tutta la dedizione possibile.", en:"Sara takes care of her children with all the dedication she can.",          cat:"Daily Life", lv:"A2" , colloc_en:"takes care of her children", colloc_it:"si prende cura dei figli" },
  { id:185, it:"Pietro tiene un diario personale per riflettere sulla propria giornata.", en:"Pietro keeps a personal diary to reflect on his day.",                   cat:"Daily Life", lv:"B1" , colloc_en:"keeps a personal diary", colloc_it:"tiene un diario personale" },
  { id:186, it:"La famiglia fa una gita fuori porta in campagna durante il weekend.",  en:"The family goes on a day trip to the countryside at the weekend.",          cat:"Daily Life", lv:"A2" , colloc_en:"goes on a day trip", colloc_it:"fa una gita fuori porta" },
  { id:187, it:"Giulia corre il rischio di perdere tutto se non agisce subito.",       en:"Giulia runs the risk of losing everything if she doesn't act immediately.", cat:"Daily Life", lv:"B2" , colloc_en:"runs the risk of losing everything", colloc_it:"corre il rischio di perdere tutto" },
  { id:188, it:"Marco ha a che fare con persone difficili praticamente ogni giorno.",  en:"Marco has to deal with difficult people on an almost daily basis.",          cat:"Daily Life", lv:"B2" , colloc_en:"has to deal with difficult people", colloc_it:"ha a che fare con persone difficili" },
  { id:189, it:"Anna prende una boccata d'aria fresca dopo ore chiusa in casa.",       en:"Anna gets some fresh air after spending hours cooped up indoors.",          cat:"Daily Life", lv:"A2" , colloc_en:"gets some fresh air", colloc_it:"prende una boccata d'aria fresca" },
  { id:190, it:"Pietro trova il giusto equilibrio tra impegni lavorativi e tempo libero.", en:"Pietro strikes the right balance between work commitments and free time.", cat:"Daily Life", lv:"B2" , colloc_en:"strikes the right balance", colloc_it:"trova il giusto equilibrio" },
  { id:191, it:"Luca affronta le proprie paure con coraggio ogni giorno un po' di più.", en:"Luca faces his fears with courage, a little more every day.",             cat:"Daily Life", lv:"B2" , colloc_en:"faces his fears with courage", colloc_it:"affronta le proprie paure" },
  { id:192, it:"Sara mette a tacere i pensieri negativi con la meditazione quotidiana.", en:"Sara silences negative thoughts with daily meditation.",                  cat:"Daily Life", lv:"C1" , colloc_en:"silences negative thoughts", colloc_it:"mette a tacere i pensieri negativi" },
  { id:193, it:"Marco esce dalla routine quotidiana e prova qualcosa di completamente nuovo.", en:"Marco breaks out of his daily routine and tries something completely new.", cat:"Daily Life", lv:"B2" , colloc_en:"breaks out of his daily routine", colloc_it:"esce dalla routine quotidiana" },
  { id:194, it:"Giulia tiene a bada lo stress praticando sport tre volte a settimana.", en:"Giulia keeps stress at bay by doing sport three times a week.",            cat:"Daily Life", lv:"B2" , colloc_en:"keeps stress at bay", colloc_it:"tiene a bada lo stress" },
  { id:195, it:"Anna fa tutto il possibile per aiutare la sua amica in difficoltà.",   en:"Anna does everything in her power to help her friend in need.",              cat:"Daily Life", lv:"B2" , colloc_en:"does everything in her power", colloc_it:"fa tutto il possibile" },
  { id:196, it:"Pietro perde un'occasione d'oro per non aver agito in tempo.",         en:"Pietro misses a golden opportunity by not acting in time.",                 cat:"Daily Life", lv:"B2" , colloc_en:"misses a golden opportunity", colloc_it:"perde un'occasione d'oro" },
  { id:197, it:"Luca prende le cose con filosofia e non drammatizza mai.",             en:"Luca takes things in his stride and never overreacts.",                     cat:"Daily Life", lv:"C1" , colloc_en:"takes things in his stride", colloc_it:"prende le cose con filosofia" },
  { id:198, it:"Sara usa il buon senso quando deve prendere decisioni quotidiane.",    en:"Sara uses common sense when making everyday decisions.",                    cat:"Daily Life", lv:"B1" , colloc_en:"uses common sense", colloc_it:"usa il buon senso" },
  { id:199, it:"Marco porta a termine quello che ha iniziato, anche quando è difficile.", en:"Marco follows through on what he starts, even when it is hard.",         cat:"Daily Life", lv:"B2" , colloc_en:"follows through on what he starts", colloc_it:"porta a termine quello che inizia" },
  { id:200, it:"Giulia mette in ordine la casa prima che arrivino gli ospiti.",        en:"Giulia tidies up the house before the guests arrive.",                      cat:"Daily Life", lv:"A2" , colloc_en:"tidies up the house", colloc_it:"mette in ordine la casa" },
  { id:201, it:"Pietro sta alla larga dai problemi e cerca di non mettersi nei guai.", en:"Pietro steers clear of trouble and tries not to get into difficulties.",    cat:"Daily Life", lv:"B2" , colloc_en:"steers clear of trouble", colloc_it:"sta alla larga dai problemi" },
  { id:202, it:"Anna trova conforto nelle piccole cose belle della vita quotidiana.",  en:"Anna finds comfort in the small beautiful things of everyday life.",         cat:"Daily Life", lv:"B1" , colloc_en:"finds comfort in", colloc_it:"trova conforto nelle piccole cose" },
  { id:203, it:"Luca prende atto della situazione e la accetta per quello che è.",    en:"Luca comes to terms with the situation and accepts it for what it is.",     cat:"Daily Life", lv:"B2" , colloc_en:"comes to terms with the situation", colloc_it:"prende atto della situazione" },
  { id:204, it:"Sara tiene d'occhio i genitori anziani ogni giorno con attenzione.",   en:"Sara keeps a watchful eye on her elderly parents every day.",               cat:"Daily Life", lv:"B2" , colloc_en:"keeps a watchful eye", colloc_it:"tiene d'occhio" },
  { id:205, it:"Marco continua a rimandare il dentista, trovando ogni volta una scusa.", en:"Marco keeps putting off the dentist, finding a new excuse every time.",  cat:"Daily Life", lv:"B1" , colloc_en:"keeps putting off the dentist", colloc_it:"continua a rimandare" },
  { id:206, it:"Giulia ha spesso la testa tra le nuvole quando è stanca.",             en:"Giulia often has her head in the clouds when she is tired.",                cat:"Daily Life", lv:"B1" , colloc_en:"has her head in the clouds", colloc_it:"ha la testa tra le nuvole" },
  { id:207, it:"Pietro fa uno sforzo sincero per mantenere vive le amicizie a distanza.", en:"Pietro makes a genuine effort to keep his long-distance friendships alive.", cat:"Daily Life", lv:"B1" , colloc_en:"makes a genuine effort", colloc_it:"fa uno sforzo sincero" },
  { id:208, it:"Anna si prende un giorno di ferie per ricaricarsi e ritrovare energia.", en:"Anna takes a day off to recharge and find her energy again.",             cat:"Daily Life", lv:"B1" , colloc_en:"takes a day off to recharge", colloc_it:"si prende un giorno di ferie" },
  { id:209, it:"Marco porta pazienza in una situazione che sembra fuori controllo.",   en:"Marco exercises patience in a situation that seems out of control.",         cat:"Daily Life", lv:"B2" , colloc_en:"exercises patience", colloc_it:"porta pazienza" },
  { id:210, it:"Giulia tiene d'occhio le spese per non sforare il budget mensile.",    en:"Giulia keeps an eye on her spending so as not to exceed her monthly budget.", cat:"Daily Life", lv:"B1" , colloc_en:"keeps an eye on her spending", colloc_it:"tiene d'occhio le spese" },
  { id:211, it:"Pietro dà una mano ai vicini ogni volta che ne hanno bisogno.",        en:"Pietro gives his neighbours a hand whenever they need one.",                cat:"Daily Life", lv:"A2" , colloc_en:"gives his neighbours a hand", colloc_it:"dà una mano ai vicini" },
  { id:212, it:"Sara fa una scelta ponderata senza farsi travolgere dalle emozioni.",  en:"Sara makes a considered choice without letting herself be overwhelmed by emotions.", cat:"Daily Life", lv:"B2" , colloc_en:"makes a considered choice", colloc_it:"fa una scelta ponderata" },
  { id:213, it:"Luca si prende il tempo necessario per pensare prima di rispondere.",  en:"Luca takes the time he needs to think before replying.",                    cat:"Daily Life", lv:"B2" , colloc_en:"takes the time he needs", colloc_it:"si prende il tempo necessario" },
  { id:214, it:"Marco ha le idee chiare su quello che vuole dalla propria vita.",      en:"Marco has a clear idea of what he wants from his life.",                    cat:"Daily Life", lv:"B2" , colloc_en:"has a clear idea", colloc_it:"ha le idee chiare" },
  { id:215, it:"Anna va a nuotare al mattino per iniziare la giornata in forma.",      en:"Anna goes for a morning swim to start the day feeling fit.",                cat:"Daily Life", lv:"A2" , colloc_en:"goes for a morning swim", colloc_it:"va a nuotare al mattino" },
  { id:216, it:"Pietro mette da parte l'orgoglio e chiede aiuto quando ne ha bisogno.", en:"Pietro sets his pride aside and asks for help when he needs it.",         cat:"Daily Life", lv:"B2" , colloc_en:"sets his pride aside", colloc_it:"mette da parte l'orgoglio" },
  { id:217, it:"Giulia mantiene le promesse anche quando non è per nulla comodo.",     en:"Giulia keeps her promises even when it is far from convenient.",            cat:"Daily Life", lv:"B2" , colloc_en:"keeps her promises", colloc_it:"mantiene le promesse" },
  { id:218, it:"Marco fa una donazione mensile a un'associazione benefica locale.",    en:"Marco makes a monthly donation to a local charitable organisation.",        cat:"Daily Life", lv:"B1" , colloc_en:"makes a monthly donation", colloc_it:"fa una donazione mensile" },
  { id:219, it:"Luca perde la calma alla guida in mezzo al traffico caotico del mattino.", en:"Luca loses his temper driving in the chaotic morning traffic.",         cat:"Daily Life", lv:"B1" , colloc_en:"loses his temper", colloc_it:"perde la calma" },
  { id:220, it:"Sara prende la vita con più leggerezza da quando ha iniziato a meditare.", en:"Sara takes life more lightly since she started meditating.",            cat:"Daily Life", lv:"B2" , colloc_en:"takes life more lightly", colloc_it:"prende la vita con più leggerezza" },
  { id:221, it:"Pietro fa cose spontanee senza pianificare nulla in anticipo.",        en:"Pietro does spontaneous things without planning anything in advance.",       cat:"Daily Life", lv:"A2" , colloc_en:"does spontaneous things", colloc_it:"fa cose spontanee" },
  { id:222, it:"Anna rimane in buona salute seguendo abitudini sane e costanti.",      en:"Anna stays in good health by following healthy and consistent habits.",     cat:"Daily Life", lv:"B1" , colloc_en:"stays in good health", colloc_it:"rimane in buona salute" },
  { id:223, it:"Marco ha sempre un piano B nel caso in cui le cose vadano storte.",    en:"Marco always has a backup plan in case things go wrong.",                   cat:"Daily Life", lv:"B2" , colloc_en:"has a backup plan", colloc_it:"ha un piano B" },
  { id:224, it:"Giulia tiene le emozioni sotto controllo nelle situazioni più difficili.", en:"Giulia keeps her emotions under control in the most difficult situations.", cat:"Daily Life", lv:"B2" , colloc_en:"keeps her emotions under control", colloc_it:"tiene le emozioni sotto controllo" },
  { id:225, it:"Pietro presta attenzione alle truffe online per non cadere in trappola.", en:"Pietro watches out for online scams so as not to get caught out.",       cat:"Daily Life", lv:"B1" , colloc_en:"watches out for online scams", colloc_it:"presta attenzione alle truffe" },
  { id:226, it:"Sara porta rispetto a tutte le persone indipendentemente dalle differenze.", en:"Sara shows respect to all people regardless of their differences.",   cat:"Daily Life", lv:"B1" , colloc_en:"shows respect to all people", colloc_it:"porta rispetto a tutte le persone" },
  { id:227, it:"Marco mette a frutto il suo talento artistico nel tempo libero.",      en:"Marco puts his artistic talent to good use in his spare time.",             cat:"Daily Life", lv:"B2" , colloc_en:"puts his artistic talent to good use", colloc_it:"mette a frutto il talento artistico" },
  { id:228, it:"Anna sta al passo con i tempi e aggiorna continuamente le proprie competenze.", en:"Anna keeps up with the times and continuously updates her skills.", cat:"Daily Life", lv:"B2" , colloc_en:"keeps up with the times", colloc_it:"sta al passo con i tempi" },
  { id:229, it:"Luca dà il buon esempio ai suoi figli con i propri comportamenti.",    en:"Luca sets a good example for his children through his own behaviour.",      cat:"Daily Life", lv:"B1" , colloc_en:"sets a good example", colloc_it:"dà il buon esempio" },
  { id:230, it:"Marco fa a meno del telefono per alcune ore ogni giorno.",              en:"Marco deliberately goes without his phone for a few hours every day.",      cat:"Daily Life", lv:"B1" , colloc_en:"goes without his phone", colloc_it:"fa a meno del telefono" },
  { id:231, it:"Giulia tiene la mente aperta di fronte a idee e prospettive nuove.",   en:"Giulia keeps an open mind when faced with new ideas and perspectives.",     cat:"Daily Life", lv:"B2" , colloc_en:"keeps an open mind", colloc_it:"tiene la mente aperta" },
  { id:232, it:"Pietro fa tesoro di ogni esperienza, anche di quelle negative.",       en:"Pietro treasures every experience, including the negative ones.",           cat:"Daily Life", lv:"B2" , colloc_en:"treasures every experience", colloc_it:"fa tesoro di ogni esperienza" },
  { id:233, it:"Sara sta con i piedi per terra e non perde mai il senso della realtà.", en:"Sara keeps her feet on the ground and never loses touch with reality.",    cat:"Daily Life", lv:"B2" , colloc_en:"keeps her feet on the ground", colloc_it:"sta con i piedi per terra" },
  { id:234, it:"Marco ha il coraggio di ricominciare dopo un grande fallimento.",       en:"Marco has the courage to start over after a major failure.",                cat:"Daily Life", lv:"C1" , colloc_en:"has the courage to start over", colloc_it:"ha il coraggio di ricominciare" },
  { id:235, it:"Anna fa un passo indietro per vedere la situazione con più chiarezza.", en:"Anna takes a step back to see the situation more clearly.",                 cat:"Daily Life", lv:"B2" , colloc_en:"takes a step back", colloc_it:"fa un passo indietro" },
  { id:236, it:"Luca mette il cuore in tutto quello che fa senza mai risparmiarsi.",    en:"Luca puts his heart into everything he does, never holding back.",          cat:"Daily Life", lv:"B2" , colloc_en:"puts his heart into everything", colloc_it:"mette il cuore in tutto" },
  { id:237, it:"Pietro fa i conti con un passato difficile e riesce ad andare avanti.", en:"Pietro comes to terms with a difficult past and manages to move forward.",  cat:"Daily Life", lv:"C1" , colloc_en:"comes to terms with a difficult past", colloc_it:"fa i conti con il passato" },
  { id:238, it:"Sara tiene alto il morale della famiglia nei momenti più bui.",         en:"Sara keeps the family's spirits up during the darkest moments.",            cat:"Daily Life", lv:"C1" , colloc_en:"keeps the family's spirits up", colloc_it:"tiene alto il morale" },
  { id:239, it:"Marco fa buon uso delle risorse a disposizione per realizzare i sogni.", en:"Marco makes the most of the resources at his disposal to pursue his dreams.", cat:"Daily Life", lv:"B2" , colloc_en:"makes the most of the resources", colloc_it:"fa buon uso delle risorse" },
  { id:240, it:"Giulia prende coscienza dei propri errori e impara da ognuno di essi.", en:"Giulia becomes aware of her mistakes and learns from each one of them.",   cat:"Daily Life", lv:"B2" , colloc_en:"becomes aware of her mistakes", colloc_it:"prende coscienza degli errori" },
  { id:241, it:"Pietro porta avanti i propri sogni nonostante le difficoltà incontrate.", en:"Pietro pursues his dreams despite the difficulties he encounters.",       cat:"Daily Life", lv:"B2" , colloc_en:"pursues his dreams", colloc_it:"porta avanti i propri sogni" },
  { id:242, it:"Anna non si lascia mai scoraggiare e affronta ogni sfida con positività.", en:"Anna never lets herself get discouraged and faces every challenge with positivity.", cat:"Daily Life", lv:"B2" , colloc_en:"never lets herself get discouraged", colloc_it:"non si lascia scoraggiare" },
  { id:243, it:"Luca fa una passeggiata serale dopo cena per staccare la mente.",       en:"Luca goes for an evening walk after dinner to take his mind off things.",   cat:"Daily Life", lv:"A2" , colloc_en:"goes for an evening walk", colloc_it:"fa una passeggiata serale" },
  { id:244, it:"Marco fa esperienza di culture diverse viaggiando ogni volta che può.", en:"Marco gains experience of different cultures by travelling whenever he can.", cat:"Daily Life", lv:"B2" , colloc_en:"gains experience of different cultures", colloc_it:"fa esperienza di culture diverse" },
  { id:245, it:"Sara tiene a cuore il benessere di tutta la sua famiglia allargata.",   en:"Sara has the well-being of her entire extended family at heart.",            cat:"Daily Life", lv:"B2" , colloc_en:"has the well-being of her entire extended family at heart", colloc_it:"tiene a cuore il benessere" },
  { id:246, it:"Anna si fa forza e affronta la situazione difficile senza tirarsi indietro.", en:"Anna pulls herself together and faces the difficult situation without backing down.", cat:"Daily Life", lv:"B2" , colloc_en:"pulls herself together", colloc_it:"si fa forza" },
  { id:247, it:"Luca rimane in contatto con gli amici di infanzia attraverso i social.", en:"Luca stays in touch with his childhood friends through social media.",     cat:"Daily Life", lv:"A2" , colloc_en:"stays in touch with his childhood friends", colloc_it:"rimane in contatto con gli amici" },
  { id:248, it:"Marco fa del volontariato il sabato per dare un contributo alla comunità.", en:"Marco does volunteer work on Saturdays to give something back to the community.", cat:"Daily Life", lv:"B2" , colloc_en:"does volunteer work", colloc_it:"fa del volontariato" },
  { id:249, it:"Sara traccia un confine netto tra vita personale e quella professionale.", en:"Sara draws a clear line between her personal and professional life.",     cat:"Daily Life", lv:"B2" , colloc_en:"draws a clear line", colloc_it:"traccia un confine netto" },
  { id:250, it:"Giulia si concede piccoli piaceri quotidiani per mantenere il benessere.", en:"Giulia allows herself small daily pleasures to maintain her well-being.", cat:"Daily Life", lv:"B1" , colloc_en:"allows herself small daily pleasures", colloc_it:"si concede piccoli piaceri" },
  { id:251, it:"Pietro si sveglia presto ogni mattina per avere tempo per sé prima del lavoro.", en:"Pietro wakes up early every morning to have time for himself before work.", cat:"Daily Life", lv:"A2" , colloc_en:"wakes up early every morning", colloc_it:"si sveglia presto ogni mattina" },
  { id:252, it:"Anna fa il tifo per il suo team preferito allo stadio ogni domenica.",  en:"Anna cheers for her favourite team at the stadium every Sunday.",            cat:"Daily Life", lv:"A2" , colloc_en:"cheers for her favourite team", colloc_it:"fa il tifo per il suo team" },
  { id:253, it:"Luca si rimette in forma dopo mesi di sedentarietà con la corsa.",      en:"Luca gets back in shape after months of inactivity by taking up running.",  cat:"Daily Life", lv:"B1" , colloc_en:"gets back in shape", colloc_it:"si rimette in forma" },
  { id:254, it:"Marco fa pace con il suo passato e inizia a guardare avanti.",          en:"Marco makes peace with his past and starts to look ahead.",                  cat:"Daily Life", lv:"B2" , colloc_en:"makes peace with his past", colloc_it:"fa pace con il suo passato" },
  { id:255, it:"Sara riesce a stare al passo con un programma di studio molto intenso.", en:"Sara manages to keep up with a very intensive study programme.",           cat:"Daily Life", lv:"B2" , colloc_en:"manages to keep up with", colloc_it:"riesce a stare al passo con" },
  { id:256, it:"Giulia prende nota di ogni spesa per tenere sotto controllo il budget.", en:"Giulia keeps a note of every expense to keep her budget under control.",   cat:"Daily Life", lv:"B1" , colloc_en:"keeps a note of every expense", colloc_it:"prende nota di ogni spesa" },
  { id:257, it:"Pietro si prende del tempo per sé ogni settimana per ricaricarsi.",     en:"Pietro takes time for himself every week to recharge.",                    cat:"Daily Life", lv:"B1" , colloc_en:"takes time for himself", colloc_it:"si prende del tempo per sé" },
  { id:258, it:"Anna porta a termine gli impegni presi anche quando è sotto pressione.", en:"Anna follows through on her commitments even when she is under pressure.",  cat:"Daily Life", lv:"B2" , colloc_en:"follows through on her commitments", colloc_it:"porta a termine gli impegni" },
  { id:259, it:"Luca impara a chiedere scusa senza sentirsi sminuito.",                 en:"Luca learns to apologize without feeling diminished.",                      cat:"Daily Life", lv:"B2" , colloc_en:"learns to apologize", colloc_it:"impara a chiedere scusa" },
  { id:260, it:"Marco riesce a mantenere un atteggiamento positivo anche nei momenti bui.", en:"Marco manages to keep a positive attitude even in difficult moments.",   cat:"Daily Life", lv:"B2" , colloc_en:"manages to keep a positive attitude", colloc_it:"mantiene un atteggiamento positivo" },
  { id:261, it:"Sara organizza il proprio tempo in modo da bilanciare lavoro e riposo.", en:"Sara organises her time so as to balance work and rest.",                   cat:"Daily Life", lv:"B1" , colloc_en:"organises her time", colloc_it:"organizza il proprio tempo" },
  { id:262, it:"Giulia fa un bagno rilassante la sera per staccare dalla giornata.",    en:"Giulia has a relaxing bath in the evening to unwind from the day.",          cat:"Daily Life", lv:"A2" , colloc_en:"has a relaxing bath", colloc_it:"fa un bagno rilassante" },
  { id:263, it:"Pietro si impegna a rispettare le regole della convivenza condominiale.", en:"Pietro commits to respecting the rules of shared living in the building.", cat:"Daily Life", lv:"B1" , colloc_en:"commits to respecting the rules", colloc_it:"si impegna a rispettare le regole" },
  { id:264, it:"Anna coltiva un orto sul balcone e raccoglie i frutti del suo lavoro.", en:"Anna tends a vegetable garden on her balcony and reaps the fruits of her labour.", cat:"Daily Life", lv:"B1" , colloc_en:"reaps the fruits of her labour", colloc_it:"raccoglie i frutti del suo lavoro" },
  { id:265, it:"Luca mette da parte le preoccupazioni e si gode il momento presente.",  en:"Luca sets his worries aside and enjoys the present moment.",                 cat:"Daily Life", lv:"B2" , colloc_en:"sets his worries aside", colloc_it:"mette da parte le preoccupazioni" },
  { id:266, it:"Marco fa una lista di priorità ogni mattina per essere più produttivo.", en:"Marco draws up a list of priorities every morning to be more productive.", cat:"Daily Life", lv:"B1" , colloc_en:"draws up a list of priorities", colloc_it:"fa una lista di priorità" },
  { id:267, it:"Sara si ritrova a fare i conti con un'abitudine difficile da cambiare.", en:"Sara finds herself having to deal with a habit that is hard to change.",   cat:"Daily Life", lv:"C1" , colloc_en:"finds herself having to deal with", colloc_it:"si ritrova a fare i conti con" },
  { id:268, it:"Giulia prende a cuore i problemi degli altri e cerca sempre di aiutare.", en:"Giulia takes other people's problems to heart and always tries to help.", cat:"Daily Life", lv:"B2" , colloc_en:"takes other people's problems to heart", colloc_it:"prende a cuore i problemi degli altri" },
  { id:269, it:"Pietro fa una promessa seria e si impegna a mantenerla a tutti i costi.", en:"Pietro makes a serious promise and commits to keeping it at all costs.",  cat:"Daily Life", lv:"B2" , colloc_en:"makes a serious promise", colloc_it:"fa una promessa seria" },
  { id:270, it:"Anna si avvicina alla natura facendo passeggiate nel bosco ogni weekend.", en:"Anna gets close to nature by going for walks in the woods every weekend.", cat:"Daily Life", lv:"A2" , colloc_en:"gets close to nature", colloc_it:"si avvicina alla natura" },
  { id:271, it:"Luca tiene a bada l'ansia con esercizi di respirazione profonda.",       en:"Luca keeps anxiety at bay with deep breathing exercises.",                  cat:"Daily Life", lv:"B2" , colloc_en:"keeps anxiety at bay", colloc_it:"tiene a bada l'ansia" },
  { id:272, it:"Marco porta rispetto agli anziani e impara molto dalla loro esperienza.", en:"Marco shows respect to the elderly and learns a great deal from their experience.", cat:"Daily Life", lv:"B1" , colloc_en:"shows respect to the elderly", colloc_it:"porta rispetto agli anziani" },
  { id:273, it:"Sara fa il possibile per tenersi in forma nonostante la vita frenetica.", en:"Sara does her best to stay fit despite her hectic lifestyle.",             cat:"Daily Life", lv:"B1" , colloc_en:"does her best to stay fit", colloc_it:"fa il possibile per tenersi in forma" },
  { id:274, it:"Giulia trova il coraggio di chiedere scusa dopo una discussione accesa.", en:"Giulia finds the courage to apologize after a heated argument.",           cat:"Daily Life", lv:"B2" , colloc_en:"finds the courage to apologize", colloc_it:"trova il coraggio di chiedere scusa" },
  { id:275, it:"Pietro si fida del proprio istinto nelle situazioni complicate.",         en:"Pietro trusts his instincts in complicated situations.",                   cat:"Daily Life", lv:"B2" , colloc_en:"trusts his instincts", colloc_it:"si fida del proprio istinto" },
  { id:276, it:"Anna fa leva sui propri punti di forza per superare i momenti difficili.", en:"Anna draws on her strengths to get through the difficult moments.",       cat:"Daily Life", lv:"B2" , colloc_en:"draws on her strengths", colloc_it:"fa leva sui propri punti di forza" },
  { id:277, it:"Luca tende una mano ai nuovi arrivati in quartiere per integrarli.",      en:"Luca reaches out to newcomers in the neighbourhood to help them settle in.", cat:"Daily Life", lv:"B2" , colloc_en:"reaches out to newcomers", colloc_it:"tende una mano ai nuovi arrivati" },
  { id:278, it:"Marco fa una pausa di riflessione prima di rispondere a un messaggio arrabbiato.", en:"Marco takes a moment to reflect before replying to an angry message.", cat:"Daily Life", lv:"B2" , colloc_en:"takes a moment to reflect", colloc_it:"fa una pausa di riflessione" },
  { id:279, it:"Sara si mette nei panni degli altri per capire meglio le loro azioni.",   en:"Sara puts herself in other people's shoes to better understand their actions.", cat:"Daily Life", lv:"C1" , colloc_en:"puts herself in other people's shoes", colloc_it:"si mette nei panni degli altri" },
  { id:280, it:"Giulia mette in pratica i consigli del suo medico con costanza.",         en:"Giulia consistently puts her doctor's advice into practice.",               cat:"Daily Life", lv:"B1" , colloc_en:"puts her doctor's advice into practice", colloc_it:"mette in pratica i consigli del medico" },
  { id:281, it:"Pietro fa attenzione a non sprecare cibo e cerca di fare acquisti consapevoli.", en:"Pietro pays attention to not wasting food and tries to shop mindfully.", cat:"Daily Life", lv:"B1" , colloc_en:"pays attention to not wasting food", colloc_it:"fa attenzione a non sprecare cibo" },
  { id:282, it:"Anna porta avanti una dieta sana ed equilibrata con molta disciplina.",   en:"Anna follows a healthy and balanced diet with great discipline.",           cat:"Daily Life", lv:"B1" , colloc_en:"follows a healthy and balanced diet", colloc_it:"porta avanti una dieta sana" },
  { id:283, it:"Luca fa un viaggio da solo per conoscere se stesso e scoprire nuove culture.", en:"Luca goes on a solo trip to find himself and discover new cultures.",  cat:"Daily Life", lv:"B2" , colloc_en:"goes on a solo trip", colloc_it:"fa un viaggio da solo" },
  { id:284, it:"Marco si ritrova a rimpiangere le scelte del passato in certi momenti.",  en:"Marco finds himself regretting past decisions at certain moments.",         cat:"Daily Life", lv:"B2" , colloc_en:"finds himself regretting past decisions", colloc_it:"si ritrova a rimpiangere le scelte" },
  { id:285, it:"Sara fa pace con l'idea che non può controllare tutto nella vita.",       en:"Sara makes peace with the idea that she cannot control everything in life.", cat:"Daily Life", lv:"C1" , colloc_en:"makes peace with the idea", colloc_it:"fa pace con l'idea" },
  { id:286, it:"Giulia si impegna a trascorrere più tempo di qualità con i propri figli.", en:"Giulia commits to spending more quality time with her children.",         cat:"Daily Life", lv:"B1" , colloc_en:"commits to spending more quality time", colloc_it:"si impegna a trascorrere più tempo" },
  { id:287, it:"Pietro si rimette a studiare da adulto per cambiare settore lavorativo.", en:"Pietro goes back to studying as an adult to change his career field.",      cat:"Daily Life", lv:"B2" , colloc_en:"goes back to studying", colloc_it:"si rimette a studiare" },
  { id:288, it:"Anna porta un contributo concreto al suo quartiere partecipando alle riunioni.", en:"Anna makes a concrete contribution to her neighbourhood by attending meetings.", cat:"Daily Life", lv:"B2" , colloc_en:"makes a concrete contribution", colloc_it:"porta un contributo concreto" },
  { id:289, it:"Luca riesce a vedere il lato positivo anche nelle situazioni più avverse.", en:"Luca manages to see the bright side even in the most adverse situations.", cat:"Daily Life", lv:"B2" , colloc_en:"manages to see the bright side", colloc_it:"riesce a vedere il lato positivo" },
  { id:290, it:"Marco fa del sarcasmo per alleggerire la tensione in situazioni imbarazzanti.", en:"Marco uses sarcasm to lighten the tension in awkward situations.",    cat:"Daily Life", lv:"C1" , colloc_en:"uses sarcasm to lighten the tension", colloc_it:"fa del sarcasmo per alleggerire" },
  { id:291, it:"Sara si dà degli obiettivi personali chiari all'inizio di ogni anno.",    en:"Sara sets herself clear personal goals at the start of every year.",        cat:"Daily Life", lv:"B1" , colloc_en:"sets herself clear personal goals", colloc_it:"si dà obiettivi personali chiari" },
  { id:292, it:"Giulia tiene un album di ricordi per conservare i momenti più belli.",    en:"Giulia keeps a memory album to preserve the most beautiful moments.",      cat:"Daily Life", lv:"A2" , colloc_en:"keeps a memory album", colloc_it:"tiene un album di ricordi" },
  { id:293, it:"Pietro impara a delegare le faccende domestiche per non sovraccaricarsi.", en:"Pietro learns to share household chores to avoid overloading himself.",   cat:"Daily Life", lv:"B2" , colloc_en:"learns to share household chores", colloc_it:"impara a delegare le faccende" },
  { id:294, it:"Anna tiene viva la propria curiosità leggendo libri di argomenti diversi.", en:"Anna keeps her curiosity alive by reading books on a wide range of topics.", cat:"Daily Life", lv:"B2" , colloc_en:"keeps her curiosity alive", colloc_it:"tiene viva la curiosità" },
  { id:295, it:"Luca fa delle piccole sfide quotidiane per migliorare se stesso un po' alla volta.", en:"Luca sets himself small daily challenges to improve himself little by little.", cat:"Daily Life", lv:"B2" , colloc_en:"sets himself small daily challenges", colloc_it:"fa piccole sfide quotidiane" },
  { id:296, it:"Marco si gode il silenzio della mattina presto prima che la casa si svegli.", en:"Marco enjoys the silence of early morning before the house wakes up.", cat:"Daily Life", lv:"B1" , colloc_en:"enjoys the silence of early morning", colloc_it:"si gode il silenzio della mattina" },
  { id:297, it:"Sara riconosce i propri limiti e sa quando chiedere aiuto senza vergogna.", en:"Sara recognises her own limits and knows when to ask for help without shame.", cat:"Daily Life", lv:"B2" , colloc_en:"recognises her own limits", colloc_it:"riconosce i propri limiti" },
  { id:298, it:"Giulia fa una videochiamata ai genitori ogni domenica sera senza mai mancare.", en:"Giulia video calls her parents every Sunday evening without ever missing a week.", cat:"Daily Life", lv:"A2" , colloc_en:"video calls her parents", colloc_it:"fa una videochiamata ai genitori" },
  { id:299, it:"Pietro porta a spasso il cane ogni sera e approfitta per fare due passi.", en:"Pietro walks the dog every evening and takes the chance to stretch his legs.", cat:"Daily Life", lv:"A2" , colloc_en:"walks the dog every evening", colloc_it:"porta a spasso il cane" },
  { id:300, it:"Anna si fa carico dei bisogni degli altri con generosità e senza aspettarsi nulla in cambio.", en:"Anna takes care of others' needs generously and without expecting anything in return.", cat:"Daily Life", lv:"C1" , colloc_en:"takes care of others' needs", colloc_it:"si fa carico dei bisogni degli altri" },
];

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 2 — PREPOSITIONS DATABASE (200 entries + explanations)
// Agent 3 QA: all explanations verified, translations corrected
// ═══════════════════════════════════════════════════════════════════════
const PREPS = [
  { id:1,  s:"She is very good ___ mathematics.",              a:"at",    opts:["at","in","for","with"],    exp:"Schema: good/bad/skilled/quick/talented AT → abilità specifica. AT punta su un bersaglio preciso. ✗ good IN maths" },
  { id:2,  s:"He is interested ___ learning new languages.",   a:"in",    opts:["in","at","for","about"],   exp:"Schema: interested/involved/experienced IN → dentro un campo o argomento. IN = dentro. ✗ interested ABOUT" },
  { id:3,  s:"I'm really excited ___ the trip to New York.",   a:"about", opts:["about","for","at","with"], exp:"Schema: excited/happy/worried/upset ABOUT → emozione per qualcosa di futuro o passato. ✗ excited FOR" },
  { id:4,  s:"She is afraid ___ flying.",                      a:"of",    opts:["of","from","at","for"],    exp:"Schema: afraid/scared/terrified/proud/ashamed OF → la preposizione OF lega un'emozione al suo oggetto. ✗ afraid FROM" },
  { id:5,  s:"He is proud ___ his achievements.",              a:"of",    opts:["of","about","at","with"],  exp:"Schema: proud/ashamed/scared/tired OF → OF indica l'oggetto dell'emozione. Stessa famiglia di afraid OF." },
  { id:6,  s:"Are you familiar ___ this software?",            a:"with",  opts:["with","to","of","about"],  exp:"Schema: familiar/popular/in love WITH → WITH indica connessione con una persona o cosa. ✗ familiar TO" },
  { id:7,  s:"She is responsible ___ the marketing team.",     a:"for",   opts:["for","of","to","about"],   exp:"Schema: responsible/famous/known/ready FOR → FOR indica lo scopo o il motivo. ✗ responsible OF" },
  { id:8,  s:"He is dependent ___ his parents financially.",   a:"on",    opts:["on","from","to","of"],     exp:"Schema: dependent/reliant/keen ON → ON indica dipendenza o appoggio su qualcosa. ✗ dependent FROM" },
  { id:9,  s:"I'm tired ___ doing the same thing every day.",  a:"of",    opts:["of","from","at","with"],   exp:"Schema: tired/bored/ashamed/scared OF → OF lega l'aggettivo all'oggetto dell'emozione. ✗ tired FROM" },
  { id:10, s:"She arrived ___ the airport two hours early.",   a:"at",    opts:["at","in","to","on"],       exp:"AT = punto preciso nello spazio (airport, station, hotel, office). ✗ arrived IN the airport (IN = città/paese)" },
  { id:11, s:"He applied ___ a job at a tech company.",        a:"for",   opts:["for","to","at","in"],      exp:"Schema: apply/ask/search/wait FOR → FOR indica ciò che si vuole ottenere. ✗ apply TO a job" },
  { id:12, s:"We need to focus ___ the main problem.",         a:"on",    opts:["on","at","in","to"],       exp:"Schema: focus/rely/depend/insist ON → ON indica il punto di appoggio. ✗ focus AT" },
  { id:13, s:"She insisted ___ paying for dinner.",            a:"on",    opts:["on","in","at","for"],      exp:"Schema: insist/rely/depend/count ON → ON per ciò su cui ci si appoggia. ✗ insist IN" },
  { id:14, s:"He is married ___ a doctor.",                    a:"to",    opts:["to","with","for","of"],    exp:"Married TO (non WITH) → TO indica direzione, il partner 'a cui' sei unito. ✗ married WITH" },
  { id:15, s:"I'm looking forward ___ meeting you.",           a:"to",    opts:["to","for","at","about"],   exp:"Look forward TO + -ing → TO è qui preposizione, non parte dell'infinito! ✗ look forward FOR meeting" },
  { id:16, s:"She succeeded ___ passing the exam.",            a:"in",    opts:["in","at","for","with"],    exp:"Schema: succeed/involve/result IN → IN indica l'ambito in cui si ottiene qualcosa. ✗ succeed AT" },
  { id:17, s:"He apologised ___ being late.",                  a:"for",   opts:["for","about","at","of"],   exp:"Schema: apologise/thank/blame someone FOR → FOR indica la causa o il motivo. ✗ apologise ABOUT" },
  { id:18, s:"We agreed ___ the terms of the contract.",       a:"on",    opts:["on","with","to","about"],  exp:"Agree ON (accordo su un punto specifico) vs agree WITH (concordare con qualcuno). ✗ agree ABOUT the terms" },
  { id:19, s:"She is angry ___ him for no reason.",            a:"with",  opts:["with","at","about","for"], exp:"Angry WITH (persona) vs angry ABOUT (situazione/cosa). ✗ angry AT him (informale ma ok) vs angry FOR him ✗" },
  { id:20, s:"I'm worried ___ the results of the test.",       a:"about", opts:["about","for","of","with"], exp:"Schema: worried/happy/upset/excited ABOUT → ABOUT per argomenti e situazioni. ✗ worried FOR the test" },
  { id:21, s:"He is very kind ___ everyone he meets.",         a:"to",    opts:["to","with","for","of"],    exp:"Schema: kind/polite/rude/mean TO → TO indica verso chi è diretta l'azione. ✗ kind WITH" },
  { id:22, s:"She spent all her money ___ clothes.",           a:"on",    opts:["on","for","at","with"],    exp:"Spend [tempo/denaro] ON → ON indica su cosa si spende. ✗ spend ON vs spend FOR clothes" },
  { id:23, s:"I congratulated her ___ passing her driving test.", a:"on", opts:["on","for","at","about"],   exp:"Congratulate/compliment ON → ON indica il risultato celebrato. ✗ congratulate FOR" },
  { id:24, s:"He is jealous ___ his colleague's success.",     a:"of",    opts:["of","about","from","with"], exp:"Schema: jealous/afraid/proud/guilty OF → OF lega aggettivo all'oggetto. ✗ jealous ABOUT" },
  { id:25, s:"She is in charge ___ the whole project.",        a:"of",    opts:["of","for","at","with"],    exp:"In charge OF → OF indica ciò di cui si è responsabili. ✗ in charge FOR" },
  { id:26, s:"He blamed his sister ___ breaking the vase.",    a:"for",   opts:["for","of","about","at"],   exp:"Blame someone FOR (something) → FOR = causa. ✗ blame FOR vs accuse OF (accuse OF = diverso!)" },
  { id:27, s:"We rely ___ public transport every day.",        a:"on",    opts:["on","in","at","for"],      exp:"Schema: rely/depend/count/insist ON → ON = appoggio. ✗ rely IN" },
  { id:28, s:"She is very skilled ___ negotiating deals.",     a:"at",    opts:["at","in","for","with"],    exp:"Schema: skilled/good/bad/brilliant AT → AT per abilità. ✗ skilled IN negotiating" },
  { id:29, s:"I disagree ___ your conclusion about the data.", a:"with",  opts:["with","about","to","from"], exp:"Disagree WITH (persona/idea) → WITH indica il partner del disaccordo. ✗ disagree ABOUT (ok per argomenti)" },
  { id:30, s:"He is addicted ___ social media.",               a:"to",    opts:["to","on","for","with"],    exp:"Schema: addicted/used/married/committed TO → TO indica la direzione dell'attaccamento. ✗ addicted ON" },
  { id:31, s:"She is aware ___ the risks involved.",           a:"of",    opts:["of","about","with","for"], exp:"Schema: aware/scared/proud/ashamed OF → OF lega l'emozione al suo oggetto. ✗ aware ABOUT" },
  { id:32, s:"They objected ___ the new proposal.",            a:"to",    opts:["to","against","about","with"], exp:"Object TO → TO indica ciò a cui ci si oppone. ✗ object AGAINST" },
  { id:33, s:"He is very sensitive ___ criticism.",            a:"to",    opts:["to","about","with","of"],  exp:"Schema: sensitive/allergic/immune/used TO → TO indica verso cosa si reagisce. ✗ sensitive ABOUT (diverso!)" },
  { id:34, s:"She suffers ___ migraines when she's stressed.", a:"from",  opts:["from","of","with","at"],   exp:"Suffer FROM (malattia/condizione) → FROM indica l'origine del problema. ✗ suffer WITH" },
  { id:35, s:"I believe ___ the power of education.",          a:"in",    opts:["in","at","of","about"],    exp:"Believe IN → IN = credere nell'esistenza o nel valore. Believe someone (senza prep) = credere a qualcuno." },
  { id:36, s:"He is committed ___ finishing the project.",     a:"to",    opts:["to","for","in","about"],   exp:"Schema: committed/dedicated/addicted/used TO → TO indica l'oggetto dell'impegno. ✗ committed FOR" },
  { id:37, s:"She is very cautious ___ making promises.",      a:"about", opts:["about","of","with","in"],  exp:"Schema: cautious/worried/happy/excited ABOUT → ABOUT per argomenti e situazioni future. ✗ cautious OF" },
  { id:38, s:"We were shocked ___ hearing the news.",          a:"at",    opts:["at","by","of","about"],    exp:"Shocked AT (reazione immediata) vs shocked BY (causa più formale). Es: shocked AT the price / shocked BY the news." },
  { id:39, s:"He is qualified ___ the position of manager.",   a:"for",   opts:["for","to","at","in"],      exp:"Schema: qualified/ready/famous/responsible FOR → FOR indica lo scopo. ✗ qualified TO the position" },
  { id:40, s:"I'm satisfied ___ the results we achieved.",     a:"with",  opts:["with","about","of","at"],  exp:"Satisfied WITH → WITH indica la cosa concreta con cui si è soddisfatti. ✗ satisfied ABOUT" },
  { id:41, s:"She is suspicious ___ his motives.",             a:"of",    opts:["of","about","with","at"],  exp:"Schema: suspicious/afraid/proud OF → OF lega l'emozione all'oggetto. ✗ suspicious ABOUT" },
  { id:42, s:"He is very loyal ___ his friends.",              a:"to",    opts:["to","with","for","of"],    exp:"Schema: loyal/kind/polite/married TO → TO indica verso chi è diretta la qualità. ✗ loyal WITH" },
  { id:43, s:"I'm amazed ___ how quickly she learned.",        a:"at",    opts:["at","by","of","about"],    exp:"Amazed AT (stupore per una cosa specifica) vs amazed BY (la causa dello stupore). Entrambi corretti!" },
  { id:44, s:"She is capable ___ managing the whole team.",    a:"of",    opts:["of","at","for","with"],    exp:"Schema: capable/guilty/ashamed/proud OF → OF + gerundio. ✗ capable AT" },
  { id:45, s:"He is very keen ___ learning new skills.",       a:"on",    opts:["on","for","about","in"],   exp:"Schema: keen/dependent/insist ON → ON indica ciò su cui si è entusiasti o si insiste. ✗ keen ABOUT" },
  { id:46, s:"We are satisfied ___ the outcome of the meeting.", a:"with", opts:["with","about","by","of"], exp:"Satisfied WITH → WITH per risultati concreti. Differenza: happy ABOUT (situazione) / satisfied WITH (risultato)." },
  { id:47, s:"She contributed ___ the success of the project.", a:"to",   opts:["to","for","in","at"],      exp:"Contribute TO → TO indica la direzione del contributo. ✗ contribute IN" },
  { id:48, s:"He is very generous ___ his time and money.",    a:"with",  opts:["with","in","of","at"],     exp:"Generous WITH (risorse: tempo, denaro) vs generous TO (persona). ✗ generous IN" },
  { id:49, s:"I am fed up ___ waiting all the time.",          a:"with",  opts:["with","of","at","about"],  exp:"Fed up WITH → WITH indica la causa della noia/stanchezza. ✗ fed up OF" },
  { id:50, s:"She is fond ___ classical music.",               a:"of",    opts:["of","about","with","for"], exp:"Fond OF → OF indica l'oggetto dell'affetto. ✗ fond ABOUT" },
  { id:51, s:"He is allergic ___ dust and pollen.",            a:"to",    opts:["to","of","from","with"],   exp:"Schema: allergic/used/married/sensitive TO → TO indica verso cosa si reagisce. ✗ allergic FROM" },
  { id:52, s:"I was disappointed ___ the quality of the product.", a:"with", opts:["with","about","by","of"], exp:"Disappointed WITH (risultato/cosa) vs disappointed IN (persona). Es: disappointed WITH the result / IN him." },
  { id:53, s:"She is involved ___ several community projects.", a:"in",   opts:["in","with","at","for"],    exp:"Involved IN → IN = dentro un'attività o progetto. ✗ involved WITH (implica coinvolgimento personale diverso)" },
  { id:54, s:"He is obsessed ___ getting everything perfect.", a:"with",  opts:["with","about","by","on"],  exp:"Obsessed WITH → WITH indica la cosa/persona con cui si è ossessionati. ✗ obsessed BY (ok ma meno comune)" },
  { id:55, s:"I'm curious ___ how the story ends.",            a:"about", opts:["about","of","for","at"],   exp:"Schema: curious/excited/worried/upset ABOUT → ABOUT per argomenti e situazioni. ✗ curious OF" },
  { id:56, s:"She is not used ___ waking up so early.",        a:"to",    opts:["to","at","for","with"],    exp:"Used TO + -ing (abitudine presente) → TO è preposizione! ✗ used TO wake up. Diverso da 'used to' passato." },
  { id:57, s:"He is very good ___ explaining complex topics.", a:"at",    opts:["at","in","for","with"],    exp:"Schema: good/bad/skilled/talented/quick AT → AT per abilità specifiche. ✗ good IN" },
  { id:58, s:"I was impressed ___ her presentation.",          a:"by",    opts:["by","with","at","of"],     exp:"Impressed BY (la causa dell'impressione) vs impressed WITH (più colloquiale). ✗ impressed FROM" },
  { id:59, s:"She is dedicated ___ her work.",                 a:"to",    opts:["to","for","in","about"],   exp:"Schema: dedicated/committed/addicted/used TO → TO indica l'oggetto della dedizione. ✗ dedicated FOR" },
  { id:60, s:"He was brought up ___ a strict family.",         a:"in",    opts:["in","by","with","at"],     exp:"Brought up IN (ambiente culturale/geografico) → IN per spazi e contesti. ✗ brought up BY a family ✗" },
  { id:61, s:"I am very pleased ___ your progress.",           a:"with",  opts:["with","about","at","of"],  exp:"Pleased WITH → WITH indica la cosa concreta. Sinonimo di satisfied WITH. ✗ pleased ABOUT (più per situazioni)" },
  { id:62, s:"She is fluent ___ three languages.",             a:"in",    opts:["in","at","with","for"],    exp:"Fluent IN [lingua] → IN indica il campo di padronanza. ✗ fluent AT Spanish" },
  { id:63, s:"He is terrified ___ spiders.",                   a:"of",    opts:["of","from","at","about"],  exp:"Schema: terrified/afraid/proud/ashamed OF → OF lega l'emozione all'oggetto. ✗ terrified FROM" },
  { id:64, s:"I was confused ___ the instructions.",           a:"by",    opts:["by","with","about","of"],  exp:"Confused BY (la causa della confusione) vs confused ABOUT (argomento su cui si è confusi). Entrambi ok!" },
  { id:65, s:"She is very punctual ___ her appointments.",     a:"with",  opts:["with","at","about","in"],  exp:"Punctual WITH (pagamenti, scadenze) vs punctual FOR (appuntamenti). ✗ punctual AT" },
  { id:66, s:"He is not aware ___ the problem.",               a:"of",    opts:["of","about","with","at"],  exp:"Schema: aware/scared/proud/ashamed OF → OF indica l'oggetto della consapevolezza. ✗ aware ABOUT" },
  { id:67, s:"I'm very happy ___ the result of the experiment.", a:"with", opts:["with","about","at","of"], exp:"Happy WITH (risultato concreto) vs happy ABOUT (situazione). Es: happy WITH the answer / happy ABOUT the news." },
  { id:68, s:"She is experienced ___ project management.",     a:"in",    opts:["in","at","with","for"],    exp:"Experienced IN [campo] → IN indica il settore di esperienza. ✗ experienced AT" },
  { id:69, s:"He cares deeply ___ his community.",             a:"about", opts:["about","for","of","with"], exp:"Care ABOUT (tenerci a qualcosa) vs care FOR (prendersi cura di / gradire). Significati diversi!" },
  { id:70, s:"I was astonished ___ his rudeness.",             a:"at",    opts:["at","by","of","about"],    exp:"Astonished AT (stupore per cosa specifica) vs astonished BY (causa più formale). Entrambi corretti!" },
  { id:71, s:"She is very ambitious ___ her career.",          a:"about", opts:["about","for","with","in"], exp:"Schema: ambitious/excited/worried ABOUT → ABOUT per progetti futuri. ✗ ambitious FOR" },
  { id:72, s:"He is brilliant ___ solving complex puzzles.",   a:"at",    opts:["at","in","for","with"],    exp:"Schema: good/skilled/brilliant/quick AT → AT per abilità. ✗ brilliant IN" },
  { id:73, s:"I'm concerned ___ the rising unemployment rate.", a:"about", opts:["about","with","of","for"], exp:"Schema: concerned/worried/happy/excited ABOUT → ABOUT per situazioni. ✗ concerned FOR" },
  { id:74, s:"She is very adaptable ___ change.",              a:"to",    opts:["to","with","for","of"],    exp:"Schema: adaptable/sensitive/immune/used TO → TO indica verso cosa ci si adatta. ✗ adaptable WITH" },
  { id:75, s:"He is not accustomed ___ living alone.",         a:"to",    opts:["to","with","for","at"],    exp:"Schema: accustomed/used/addicted/married TO + -ing → TO è preposizione. ✗ accustomed WITH" },
  { id:76, s:"I feel sorry ___ the inconvenience caused.",     a:"for",   opts:["for","about","of","with"], exp:"Sorry FOR (dispiacere per azione) vs sorry ABOUT (situazione). Es: sorry FOR the delay / sorry ABOUT that." },
  { id:77, s:"She is very passionate ___ social justice.",     a:"about", opts:["about","for","in","of"],   exp:"Schema: passionate/excited/worried ABOUT → ABOUT per argomenti e cause. ✗ passionate FOR" },
  { id:78, s:"He is hopeful ___ a positive outcome.",          a:"about", opts:["about","for","of","with"], exp:"Schema: hopeful/worried/excited/happy ABOUT → ABOUT per situazioni future. ✗ hopeful FOR" },
  { id:79, s:"I'm very upset ___ what happened yesterday.",    a:"about", opts:["about","with","at","of"],  exp:"Schema: upset/worried/excited ABOUT → ABOUT per situazioni e eventi. ✗ upset WITH (indica persona)" },
  { id:80, s:"She is in need ___ urgent medical attention.",   a:"of",    opts:["of","for","at","with"],    exp:"In need OF → OF indica ciò di cui si ha bisogno. ✗ in need FOR" },
  { id:81, s:"He is very enthusiastic ___ the new proposal.",  a:"about", opts:["about","for","at","with"], exp:"Schema: enthusiastic/excited/worried/happy ABOUT → ABOUT per situazioni e proposte. ✗ enthusiastic FOR" },
  { id:82, s:"I can rely ___ you to get it done.",             a:"on",    opts:["on","in","at","with"],     exp:"Schema: rely/depend/count/insist ON → ON = punto di appoggio. ✗ rely IN" },
  { id:83, s:"She is very confident ___ her abilities.",       a:"in",    opts:["in","about","of","with"],  exp:"Confident IN (proprie capacità) vs confident ABOUT (situazione specifica). Sfumatura importante!" },
  { id:84, s:"He is bored ___ doing the same routine.",        a:"with",  opts:["with","of","at","about"],  exp:"Bored WITH (noia duratura) vs bored BY (la causa specifica). ✗ bored OF (accettabile ma informale)" },
  { id:85, s:"I'm not familiar ___ this part of the city.",    a:"with",  opts:["with","to","about","of"],  exp:"Schema: familiar/popular/in love/bored WITH → WITH indica connessione. ✗ familiar TO" },
  { id:86, s:"She is very polite ___ everyone she speaks to.", a:"to",    opts:["to","with","at","for"],    exp:"Polite TO (verso persone) → TO indica verso chi è diretta la cortesia. ✗ polite WITH strangers" },
  { id:87, s:"He is late ___ work again today.",               a:"for",   opts:["for","to","at","in"],      exp:"Late FOR [appuntamento/evento] → FOR indica ciò per cui si è in ritardo. ✗ late TO work" },
  { id:88, s:"I am opposed ___ any form of discrimination.",   a:"to",    opts:["to","against","about","with"], exp:"Opposed TO → TO indica ciò a cui ci si oppone. Simile a object TO. ✗ opposed AGAINST" },
  { id:89, s:"She is very grateful ___ all the support.",      a:"for",   opts:["for","of","about","with"], exp:"Schema: grateful/famous/responsible FOR → FOR indica la causa o il motivo. ✗ grateful ABOUT" },
  { id:90, s:"He is terrified ___ making mistakes in public.", a:"of",    opts:["of","about","from","at"],  exp:"Schema: terrified/afraid/ashamed/proud OF → OF lega l'emozione all'oggetto. ✗ terrified ABOUT" },
  { id:91, s:"I am very attached ___ my hometown.",            a:"to",    opts:["to","with","for","of"],    exp:"Schema: attached/committed/dedicated/married/used TO → TO indica l'oggetto dell'attaccamento. ✗ attached WITH" },
  { id:92, s:"She is very strict ___ punctuality.",            a:"about", opts:["about","with","on","in"],  exp:"Strict ABOUT (su regole/principi) vs strict WITH (con persone). Es: strict ABOUT rules / strict WITH children." },
  { id:93, s:"He is incapable ___ lying to people.",           a:"of",    opts:["of","from","at","with"],   exp:"Schema: incapable/ashamed/guilty/proud OF + -ing → OF + gerundio. ✗ incapable AT" },
  { id:94, s:"I was astonished ___ his unexpected kindness.",  a:"by",    opts:["by","at","of","with"],     exp:"Astonished BY (causa formale) vs astonished AT (reazione immediata). Entrambi corretti, BY è più formale." },
  { id:95, s:"She is very talented ___ playing the piano.",    a:"at",    opts:["at","in","for","with"],    exp:"Schema: talented/skilled/brilliant/quick AT → AT per abilità. ✗ talented IN" },
  { id:96, s:"He complained ___ the noise coming from next door.", a:"about", opts:["about","of","at","for"], exp:"Complain ABOUT [cosa] → ABOUT per argomenti e situazioni. Complain TO [persona]. ✗ complain OF (formale/raro)" },
  { id:97, s:"I'm very keen ___ trying new restaurants.",      a:"on",    opts:["on","for","about","in"],   exp:"Schema: keen/dependent/rely/insist ON → ON indica entusiasmo o dipendenza. ✗ keen ABOUT (ok per entusiasmo)" },
  { id:98, s:"She is very active ___ her local community.",    a:"in",    opts:["in","at","with","for"],    exp:"Active IN [comunità/campo] → IN indica partecipazione in un contesto. ✗ active AT" },
  { id:99, s:"He is very selective ___ who he spends time with.", a:"about", opts:["about","with","of","in"], exp:"Selective ABOUT → ABOUT per scelte e preferenze. ✗ selective WITH" },
  { id:100,s:"I am looking forward ___ the holidays.",         a:"to",    opts:["to","for","about","at"],   exp:"Look forward TO + -ing → TO è preposizione (non infinito!). ✗ look forward FOR the holidays" },
  { id:101,s:"She is very enthusiastic ___ her new role.",     a:"about", opts:["about","for","in","with"], exp:"Schema: enthusiastic/excited/worried ABOUT → ABOUT per situazioni e proposte. ✗ enthusiastic IN" },
  { id:102,s:"He is afraid ___ commitment in relationships.",  a:"of",    opts:["of","from","about","with"], exp:"Schema: afraid/scared/terrified OF → OF lega l'emozione all'oggetto. ✗ afraid FROM" },
  { id:103,s:"I'm not happy ___ the way this was handled.",    a:"about", opts:["about","with","of","at"],  exp:"Happy ABOUT (situazione) vs happy WITH (risultato concreto). Es: not happy ABOUT the process / WITH the outcome." },
  { id:104,s:"She is qualified ___ the senior manager role.",  a:"for",   opts:["for","to","in","at"],      exp:"Schema: qualified/ready/responsible/famous FOR → FOR indica lo scopo. ✗ qualified TO" },
  { id:105,s:"He is very bad ___ managing his time.",          a:"at",    opts:["at","in","with","for"],    exp:"Bad AT = opposto di good AT → AT per abilità. Lo schema è always adj. + AT per abilità. ✗ bad IN" },
  { id:106,s:"The company is known ___ its excellent service.", a:"for",  opts:["for","by","of","as"],      exp:"Known FOR [qualità/prodotto] → FOR indica il motivo della fama. ✗ known BY" },
  { id:107,s:"She dreams ___ becoming a professional singer.",  a:"of",   opts:["of","about","for","at"],   exp:"Dream OF + -ing (sogno come desiderio) → OF + gerundio. Dream ABOUT + -ing (sogno nel sonno). Significati diversi!" },
  { id:108,s:"He succeeded ___ getting the job he wanted.",    a:"in",    opts:["in","at","with","for"],    exp:"Succeed IN + -ing → IN + gerundio. ✗ succeed AT (accettabile ma meno comune)" },
  { id:109,s:"I'm thinking ___ changing my career.",           a:"of",    opts:["of","about","for","on"],   exp:"Think OF (idea immediata) vs think ABOUT (riflessione prolungata). Entrambi ok, sfumatura sottile." },
  { id:110,s:"She is determined ___ making a difference.",     a:"to",    opts:["to","in","on","about"],    exp:"Determined TO + infinito → TO non è preposizione qui! Indica intenzione. ✗ determined IN" },
  { id:111,s:"He is not cut out ___ this kind of work.",       a:"for",   opts:["for","to","in","at"],      exp:"Cut out FOR → FOR indica per cosa si è adatti. ✗ cut out TO" },
  { id:112,s:"I am responsible ___ my own decisions.",         a:"for",   opts:["for","of","to","about"],   exp:"Responsible FOR → FOR indica l'ambito di responsabilità. ✗ responsible OF" },
  { id:113,s:"She is dedicated ___ improving her English.",    a:"to",    opts:["to","in","for","on"],      exp:"Schema: dedicated/committed/addicted TO + -ing → TO è preposizione. ✗ dedicated FOR" },
  { id:114,s:"He is very proud ___ what his children achieved.", a:"of",  opts:["of","about","for","with"], exp:"Schema: proud/ashamed/scared OF → OF lega l'emozione all'oggetto. ✗ proud ABOUT" },
  { id:115,s:"I apologise ___ any inconvenience caused.",      a:"for",   opts:["for","about","of","to"],   exp:"Apologise FOR [causa] → FOR indica il motivo delle scuse. ✗ apologise ABOUT" },
  { id:116,s:"She is eligible ___ a promotion this year.",     a:"for",   opts:["for","to","of","in"],      exp:"Eligible FOR → FOR indica ciò per cui si ha diritto. ✗ eligible TO" },
  { id:117,s:"He is very critical ___ the new regulations.",   a:"of",    opts:["of","about","with","at"],  exp:"Critical OF → OF indica l'oggetto della critica. ✗ critical ABOUT" },
  { id:118,s:"I'm very disappointed ___ his attitude.",        a:"with",  opts:["with","about","by","of"],  exp:"Disappointed WITH (risultato) vs disappointed IN (persona). Scegli in base all'oggetto!" },
  { id:119,s:"She was angry ___ herself for making that mistake.", a:"with", opts:["with","at","about","of"], exp:"Angry WITH [persona] → WITH per persone. Angry ABOUT [situazione]. ✗ angry AT himself (ok in inglese americano)" },
  { id:120,s:"He is very enthusiastic ___ outdoor sports.",    a:"about", opts:["about","for","in","with"], exp:"Schema: enthusiastic/excited/worried ABOUT → ABOUT per situazioni. ✗ enthusiastic FOR" },
  { id:121,s:"I'm bored ___ watching TV every evening.",       a:"with",  opts:["with","of","at","by"],     exp:"Bored WITH (noia persistente) vs bored BY (causa della noia). ✗ bored OF (informale)" },
  { id:122,s:"She is very popular ___ her colleagues.",        a:"with",  opts:["with","among","to","for"], exp:"Popular WITH [gruppo di persone] → WITH per gruppi. ✗ popular AMONG (ok ma più formale)" },
  { id:123,s:"He is very patient ___ his children.",           a:"with",  opts:["with","to","for","about"], exp:"Patient WITH [persona] → WITH indica verso chi si ha pazienza. ✗ patient FOR" },
  { id:124,s:"I'm not sure ___ the answer to this question.",  a:"about", opts:["about","of","with","on"],  exp:"Sure ABOUT (certezza su situazione, colloquiale) vs sure OF (certezza su fatto). Entrambi ok!" },
  { id:125,s:"She is very skeptical ___ his intentions.",      a:"about", opts:["about","of","with","at"],  exp:"Skeptical ABOUT/OF → entrambi corretti. ABOUT = più colloquiale; OF = più formale." },
  { id:126,s:"He is always late ___ paying his bills.",        a:"in",    opts:["in","for","with","at"],    exp:"Late IN + -ing (ritardo nel fare qualcosa) → IN + gerundio. ✗ late IN vs late FOR (appuntamento)" },
  { id:127,s:"I'm very interested ___ ancient history.",       a:"in",    opts:["in","about","on","for"],   exp:"Schema: interested/involved/experienced IN → IN per argomenti e campi. ✗ interested ABOUT" },
  { id:128,s:"She is not very comfortable ___ public speaking.", a:"with", opts:["with","in","about","at"], exp:"Comfortable WITH (agio con qualcosa) vs comfortable ABOUT (situazione). ✗ comfortable IN" },
  { id:129,s:"He was astonished ___ the amount of work needed.", a:"at",  opts:["at","by","with","of"],     exp:"Astonished AT (cosa specifica) vs astonished BY (causa). Regola: stessa logica di shocked/amazed." },
  { id:130,s:"I was very impressed ___ the quality of the food.", a:"by", opts:["by","with","at","of"],     exp:"Impressed BY (causa, più comune) vs impressed WITH (colloquiale). ✗ impressed FROM" },
  { id:131,s:"She is very good ___ remembering names.",        a:"at",    opts:["at","in","for","with"],    exp:"Schema: good/bad/skilled/brilliant/quick AT → AT per tutte le abilità. ✗ good IN" },
  { id:132,s:"He is very sensitive ___ other people's feelings.", a:"to", opts:["to","about","with","of"],  exp:"Schema: sensitive/allergic/immune/used TO → TO indica verso cosa si reagisce. ✗ sensitive ABOUT feelings (diverso!)" },
  { id:133,s:"I'm very much in favour ___ the new policy.",    a:"of",    opts:["of","for","with","about"], exp:"In favour OF → OF indica ciò che si supporta. ✗ in favour FOR" },
  { id:134,s:"She is not very good ___ dealing with stress.",  a:"at",    opts:["at","in","with","for"],    exp:"Schema: good/bad/skilled AT → AT per abilità. Regola universale per capacità. ✗ good IN" },
  { id:135,s:"He is very frank ___ his opinions.",             a:"about", opts:["about","with","on","in"],  exp:"Frank ABOUT [argomento] → ABOUT per argomenti. Frank WITH [persona] → WITH per persone." },
  { id:136,s:"I'm very worried ___ her health lately.",        a:"about", opts:["about","for","of","with"], exp:"Schema: worried/excited/happy ABOUT → ABOUT per situazioni. ✗ worried FOR" },
  { id:137,s:"She is not very confident ___ her driving.",     a:"about", opts:["about","in","with","of"],  exp:"Confident ABOUT (situazione specifica) vs confident IN (proprie capacità). Sfumatura importante!" },
  { id:138,s:"He is very good ___ keeping secrets.",           a:"at",    opts:["at","in","with","for"],    exp:"Schema: good/bad/skilled AT → AT per abilità. ✗ good IN keeping secrets" },
  { id:139,s:"I'm really excited ___ starting my new job.",   a:"about", opts:["about","for","at","with"],  exp:"Schema: excited/happy/worried ABOUT → ABOUT per eventi futuri. ✗ excited FOR" },
  { id:140,s:"She is not very happy ___ working weekends.",    a:"about", opts:["about","with","at","of"],  exp:"Happy ABOUT [situazione] → ABOUT per situazioni. ✗ happy WITH working weekends (lì = risultato)" },
  { id:141,s:"He is very different ___ his brother.",          a:"from",  opts:["from","to","than","with"], exp:"Different FROM (standard in tutti i contesti). Different TO (ok in britannico). ✗ different THAN (americano, informale)" },
  { id:142,s:"I'm very keen ___ the idea of living abroad.",   a:"on",    opts:["on","about","for","in"],   exp:"Schema: keen/dependent/rely ON → ON per entusiasmo/dipendenza. ✗ keen ABOUT (ok per entusiasmo generico)" },
  { id:143,s:"She is very committed ___ her studies.",         a:"to",    opts:["to","for","in","about"],   exp:"Schema: committed/dedicated/addicted TO + -ing → TO è preposizione. ✗ committed FOR" },
  { id:144,s:"He is not prepared ___ such a difficult exam.",  a:"for",   opts:["for","to","on","about"],   exp:"Prepared FOR → FOR indica ciò per cui ci si è preparati. ✗ prepared TO (TO introduce l'infinito, non preposizione)" },
  { id:145,s:"I was very touched ___ her kind words.",         a:"by",    opts:["by","with","at","of"],     exp:"Touched BY (commosso dalla causa) → BY per la causa di un'emozione passiva. ✗ touched WITH" },
  { id:146,s:"She is very popular ___ her students.",          a:"with",  opts:["with","among","to","for"], exp:"Popular WITH [persone/gruppo] → WITH per gruppi. ✗ popular AMONG (formale)" },
  { id:147,s:"He is very passionate ___ his work.",            a:"about", opts:["about","for","in","with"], exp:"Schema: passionate/excited/worried ABOUT → ABOUT per argomenti/cause. ✗ passionate FOR" },
  { id:148,s:"I'm very worried ___ the impact on the environment.", a:"about", opts:["about","for","of","with"], exp:"Schema: worried/excited/happy ABOUT → ABOUT per situazioni. ✗ worried FOR" },
  { id:149,s:"She is not very impressed ___ his excuse.",      a:"by",    opts:["by","with","at","of"],     exp:"Impressed BY (più comune, formale) vs impressed WITH (colloquiale). ✗ impressed FROM" },
  { id:150,s:"He is very dedicated ___ his craft.",            a:"to",    opts:["to","in","for","about"],   exp:"Schema: dedicated/committed TO → TO indica l'oggetto della dedizione. ✗ dedicated FOR" },
  { id:151,s:"I'm not very good ___ saying no to people.",     a:"at",    opts:["at","in","with","for"],    exp:"Schema: good/bad/skilled AT → AT per abilità. ✗ good IN" },
  { id:152,s:"She is very serious ___ achieving her goals.",   a:"about", opts:["about","in","with","for"], exp:"Serious ABOUT [obiettivo] → ABOUT per argomenti e intenzioni. ✗ serious FOR" },
  { id:153,s:"He is very anxious ___ the test results.",       a:"about", opts:["about","for","of","with"], exp:"Schema: anxious/worried/excited ABOUT → ABOUT per eventi imminenti. ✗ anxious FOR" },
  { id:154,s:"I'm very grateful ___ your support and advice.", a:"for",   opts:["for","of","about","with"], exp:"Schema: grateful/responsible/famous FOR → FOR indica il motivo. ✗ grateful ABOUT" },
  { id:155,s:"She is not very familiar ___ modern technology.", a:"with",  opts:["with","to","about","in"], exp:"Schema: familiar/popular/in love WITH → WITH per connessione. ✗ familiar TO (solo in alcuni dialetti)" },
  { id:156,s:"He is very interested ___ renewable energy.",    a:"in",    opts:["in","about","on","for"],   exp:"Schema: interested/involved/experienced IN → IN per campi e argomenti. ✗ interested ABOUT" },
  { id:157,s:"I'm very excited ___ the prospect of travelling.", a:"about", opts:["about","for","at","with"], exp:"Schema: excited/happy/worried ABOUT → ABOUT per situazioni future. ✗ excited FOR" },
  { id:158,s:"She is very skilled ___ managing difficult situations.", a:"at", opts:["at","in","with","for"], exp:"Schema: skilled/good/bad/quick AT → AT per abilità. ✗ skilled IN" },
  { id:159,s:"He is not very comfortable ___ accepting criticism.", a:"with", opts:["with","about","at","in"], exp:"Comfortable WITH [situazione/cosa] → WITH indica connessione. ✗ comfortable ABOUT (ok ma per situazione più astratta)" },
  { id:160,s:"I'm looking forward ___ the weekend.",           a:"to",    opts:["to","for","about","at"],   exp:"Look forward TO + -ing → TO è preposizione! ✗ look forward FOR" },
  { id:161,s:"She is very conscious ___ her appearance.",      a:"of",    opts:["of","about","with","at"],  exp:"Conscious OF → OF indica ciò di cui si è consapevoli. ✗ conscious ABOUT (ok colloquialmente)" },
  { id:162,s:"He is very fond ___ spicy food.",                a:"of",    opts:["of","about","with","for"], exp:"Fond OF → OF indica l'oggetto dell'affetto. ✗ fond ABOUT" },
  { id:163,s:"I'm not very happy ___ the outcome of the vote.", a:"with",  opts:["with","about","at","of"], exp:"Happy WITH [risultato concreto] vs happy ABOUT [situazione]. ✗ happy OF" },
  { id:164,s:"She is very suspicious ___ his sudden generosity.", a:"of",  opts:["of","about","with","at"], exp:"Schema: suspicious/afraid/proud/ashamed OF → OF lega l'emozione all'oggetto. ✗ suspicious ABOUT" },
  { id:165,s:"He is very proud ___ his country's heritage.",   a:"of",    opts:["of","about","for","with"], exp:"Schema: proud/ashamed/scared OF → OF lega l'emozione all'oggetto. ✗ proud ABOUT" },
  { id:166,s:"I'm very worried ___ the rise in living costs.", a:"about", opts:["about","for","of","with"], exp:"Schema: worried/excited/happy ABOUT → ABOUT per situazioni. ✗ worried FOR" },
  { id:167,s:"She is totally absorbed ___ her new book.",      a:"in",    opts:["in","by","with","at"],     exp:"Absorbed IN [attività] → IN indica immersione totale in qualcosa. ✗ absorbed BY (ok ma meno comune)" },
  { id:168,s:"He is very quick ___ picking up new languages.", a:"at",    opts:["at","in","with","for"],    exp:"Schema: good/bad/skilled/quick AT → AT per abilità e velocità. ✗ quick IN" },
  { id:169,s:"I was very surprised ___ her sudden decision.",  a:"by",    opts:["by","at","with","of"],     exp:"Surprised BY (la causa) vs surprised AT (reazione immediata). Entrambi ok! ✗ surprised FROM" },
  { id:170,s:"She is very optimistic ___ her career prospects.", a:"about", opts:["about","for","of","with"], exp:"Schema: optimistic/worried/excited ABOUT → ABOUT per situazioni future. ✗ optimistic FOR" },
  { id:171,s:"He is very knowledgeable ___ European history.", a:"about", opts:["about","in","on","with"],  exp:"Knowledgeable ABOUT [argomento] → ABOUT per conoscenza di argomenti. ✗ knowledgeable IN (ok per campi formali)" },
  { id:172,s:"I'm very concerned ___ the lack of transparency.", a:"about", opts:["about","with","of","for"], exp:"Schema: concerned/worried/happy ABOUT → ABOUT per situazioni. ✗ concerned FOR" },
  { id:173,s:"She has always been interested ___ astronomy.",  a:"in",    opts:["in","about","on","for"],   exp:"Schema: interested/involved/experienced IN → IN per argomenti e campi. ✗ interested ABOUT" },
  { id:174,s:"He is very talented ___ writing short stories.", a:"at",    opts:["at","in","for","with"],    exp:"Schema: talented/skilled/good/quick AT → AT per abilità. ✗ talented IN" },
  { id:175,s:"I'm not very keen ___ watching horror films.",   a:"on",    opts:["on","about","for","in"],   exp:"Schema: keen/dependent ON → ON per entusiasmo o dipendenza. ✗ keen ABOUT (ok per entusiasmo generico)" },
  { id:176,s:"She is very independent ___ her family.",        a:"of",    opts:["of","from","with","about"], exp:"Independent OF → OF indica rispetto a chi/cosa si è indipendenti. ✗ independent FROM (ok in alcuni contesti)" },
  { id:177,s:"He is very good ___ thinking outside the box.",  a:"at",    opts:["at","in","for","with"],    exp:"Schema: good/bad/skilled AT → AT per abilità. ✗ good IN" },
  { id:178,s:"I'm very enthusiastic ___ the new initiative.",  a:"about", opts:["about","for","in","with"], exp:"Schema: enthusiastic/excited/worried ABOUT → ABOUT per situazioni e proposte. ✗ enthusiastic FOR" },
  { id:179,s:"She is very aware ___ the environmental impact.", a:"of",   opts:["of","about","with","at"],  exp:"Schema: aware/scared/proud OF → OF lega l'aggettivo all'oggetto. ✗ aware ABOUT" },
  { id:180,s:"He is very reliant ___ others for motivation.",  a:"on",    opts:["on","upon","in","from"],   exp:"Reliant ON → ON indica dipendenza. Simile a: dependent/rely ON. ✗ reliant FROM" },
  { id:181,s:"I'm very hopeful ___ a quick recovery.",         a:"about", opts:["about","for","of","in"],   exp:"Schema: hopeful/worried/excited ABOUT → ABOUT per situazioni future. ✗ hopeful FOR" },
  { id:182,s:"She is very confident ___ making the right call.", a:"about", opts:["about","in","of","with"], exp:"Confident ABOUT [decisione/situazione] vs confident IN [capacità]. Scegli in base all'oggetto!" },
  { id:183,s:"He is very anxious ___ meeting new people.",     a:"about", opts:["about","of","with","at"],  exp:"Schema: anxious/worried/excited ABOUT → ABOUT per eventi imminenti. ✗ anxious OF" },
  { id:184,s:"I'm very suspicious ___ his sudden change of heart.", a:"of", opts:["of","about","with","at"], exp:"Schema: suspicious/afraid/ashamed OF → OF lega l'emozione all'oggetto. ✗ suspicious ABOUT" },
  { id:185,s:"She is very confident ___ herself and her choices.", a:"in", opts:["in","about","of","with"],  exp:"Confident IN [proprie capacità/squadra] vs confident ABOUT [situazione]. Scegli in base all'oggetto!" },
  { id:186,s:"He is very passionate ___ environmental issues.", a:"about", opts:["about","for","in","with"], exp:"Schema: passionate/excited/worried ABOUT → ABOUT per argomenti e cause. ✗ passionate FOR" },
  { id:187,s:"I'm very satisfied ___ the progress I've made.", a:"with",  opts:["with","about","of","at"],  exp:"Satisfied WITH [risultato concreto] → WITH per risultati. ✗ satisfied ABOUT" },
  { id:188,s:"She is very reluctant ___ accept any help.",     a:"to",    opts:["to","about","in","of"],    exp:"Reluctant TO + infinito → TO introduce l'infinito (non è preposizione). ✗ reluctant ABOUT accepting" },
  { id:189,s:"He is very open ___ new ideas and suggestions.", a:"to",    opts:["to","about","for","with"],  exp:"Open TO [idee/suggerimenti] → TO indica verso cosa ci si apre. ✗ open FOR" },
  { id:190,s:"I'm very curious ___ what she said to him.",     a:"about", opts:["about","of","for","at"],   exp:"Schema: curious/worried/excited ABOUT → ABOUT per argomenti e situazioni. ✗ curious OF" },
  { id:191,s:"She is not very proud ___ what she did.",        a:"of",    opts:["of","about","for","with"], exp:"Schema: proud/ashamed/scared OF → OF lega l'emozione all'oggetto. Funziona anche in negativo. ✗ proud ABOUT" },
  { id:192,s:"He is very uncomfortable ___ discussing money.", a:"with",  opts:["with","about","at","in"],  exp:"Uncomfortable WITH [cosa/situazione] → WITH indica connessione. ✗ uncomfortable ABOUT (ok ma più vago)" },
  { id:193,s:"I'm completely absorbed ___ this documentary.",  a:"in",    opts:["in","by","with","at"],     exp:"Absorbed IN [attività] → IN indica immersione completa. ✗ absorbed BY" },
  { id:194,s:"She is very experienced ___ handling complaints.", a:"in",  opts:["in","at","with","for"],    exp:"Experienced IN [campo] → IN per aree professionali. ✗ experienced AT" },
  { id:195,s:"He is very much in love ___ her.",               a:"with",  opts:["with","of","for","about"], exp:"In love WITH → WITH è obbligatorio. ✗ in love OF / ✗ in love FOR" },
  { id:196,s:"I'm very concerned ___ the quality of the work.", a:"about", opts:["about","with","of","for"], exp:"Schema: concerned/worried/happy ABOUT → ABOUT per situazioni. ✗ concerned FOR" },
  { id:197,s:"She is very realistic ___ her expectations.",    a:"about", opts:["about","with","of","in"],  exp:"Realistic ABOUT [aspettative] → ABOUT per argomenti e situazioni. ✗ realistic WITH" },
  { id:198,s:"He is completely devoted ___ his family.",       a:"to",    opts:["to","for","in","about"],   exp:"Schema: devoted/committed/dedicated/addicted TO → TO indica l'oggetto della dedizione. ✗ devoted FOR" },
  { id:199,s:"I'm very upset ___ being excluded from the meeting.", a:"about", opts:["about","with","at","of"], exp:"Schema: upset/worried/excited ABOUT → ABOUT per situazioni e decisioni. ✗ upset WITH (indica persona)" },
  { id:200,s:"She is very excited ___ her upcoming wedding.",  a:"about", opts:["about","for","at","with"], exp:"Schema: excited/happy/worried ABOUT → ABOUT per eventi futuri o imminenti. ✗ excited FOR" },
];


// ═══════════════════════════════════════════════════════════════════════
// PHRASAL VERBS DATABASE — 100 entries
// 50 Work & Business · 50 Daily Life
// Fill-in-the-blank format: same engine as collocations
// ═══════════════════════════════════════════════════════════════════════
const PV = [
  // ── WORK & BUSINESS ─────────────────────────────────────────────────
  { id:1,  it:"Il team si fa carico di un nuovo cliente importante.",                    en:"The team takes on a new important client.",                                  cat:"Work & Business", lv:"B1", colloc_en:"takes on",             colloc_it:"si fa carico di" },
  { id:2,  it:"Sara consegna il rapporto prima della scadenza.",                         en:"Sara hands in her report before the deadline.",                             cat:"Work & Business", lv:"B1", colloc_en:"hands in",             colloc_it:"consegna/presenta" },
  { id:3,  it:"Il team porta avanti un'analisi approfondita del mercato.",               en:"The team carries out a thorough market analysis.",                          cat:"Work & Business", lv:"B2", colloc_en:"carries out",           colloc_it:"porta avanti/esegue" },
  { id:4,  it:"I soci fondano una startup innovativa nel settore tech.",                 en:"The partners set up an innovative tech startup.",                           cat:"Work & Business", lv:"B1", colloc_en:"set up",               colloc_it:"fondano/avviano" },
  { id:5,  it:"La manager propone un nuovo piano di sviluppo al consiglio.",             en:"The manager puts forward a new development plan to the board.",             cat:"Work & Business", lv:"B2", colloc_en:"puts forward",          colloc_it:"propone/presenta" },
  { id:6,  it:"La riunione viene annullata a causa di un imprevisto.",                  en:"The meeting is called off due to an unexpected issue.",                     cat:"Work & Business", lv:"B1", colloc_en:"called off",            colloc_it:"annullata" },
  { id:7,  it:"Il responsabile solleva una questione importante durante la riunione.",   en:"The manager brings up an important issue during the meeting.",              cat:"Work & Business", lv:"B2", colloc_en:"brings up",             colloc_it:"solleva/introduce" },
  { id:8,  it:"Il team esamina i dati finanziari prima della presentazione.",            en:"The team goes over the financial data before the presentation.",            cat:"Work & Business", lv:"B2", colloc_en:"goes over",             colloc_it:"esamina/rivede" },
  { id:9,  it:"La responsabile dà seguito al reclamo del cliente entro 24 ore.",        en:"The manager follows up on the client's complaint within 24 hours.",         cat:"Work & Business", lv:"B2", colloc_en:"follows up on",          colloc_it:"dà seguito a" },
  { id:10, it:"Il team elabora un'idea originale per il lancio del prodotto.",          en:"The team comes up with an original idea for the product launch.",           cat:"Work & Business", lv:"B2", colloc_en:"comes up with",          colloc_it:"elabora/trova" },
  { id:11, it:"Il responsabile gestisce le richieste difficili con professionalità.",    en:"The manager deals with difficult requests professionally.",                  cat:"Work & Business", lv:"B1", colloc_en:"deals with",            colloc_it:"gestisce/si occupa di" },
  { id:12, it:"L'azienda esaurisce il budget prima della fine dell'anno.",              en:"The company runs out of budget before the end of the year.",                cat:"Work & Business", lv:"B1", colloc_en:"runs out of",            colloc_it:"esaurisce" },
  { id:13, it:"L'assistente compila il modulo per conto del dirigente.",                en:"The assistant fills in the form on behalf of the manager.",                 cat:"Work & Business", lv:"A2", colloc_en:"fills in",              colloc_it:"compila" },
  { id:14, it:"Il responsabile risolve il problema tecnico in poco tempo.",              en:"The manager sorts out the technical problem quickly.",                      cat:"Work & Business", lv:"B1", colloc_en:"sorts out",             colloc_it:"risolve/sistema" },
  { id:15, it:"La responsabile IT mette per iscritto tutte le specifiche del progetto.", en:"The IT manager writes up all the project specifications.",                 cat:"Work & Business", lv:"B2", colloc_en:"writes up",             colloc_it:"mette per iscritto/redige" },
  { id:16, it:"Il chairman si dimette dopo lo scandalo finanziario.",                   en:"The chairman steps down after the financial scandal.",                      cat:"Work & Business", lv:"C1", colloc_en:"steps down",            colloc_it:"si dimette" },
  { id:17, it:"Una multinazionale rileva la startup dopo tre anni di attività.",        en:"A multinational takes over the startup after three years.",                 cat:"Work & Business", lv:"C1", colloc_en:"takes over",            colloc_it:"rileva/subentra a" },
  { id:18, it:"Il governo introduce nuovi incentivi per le imprese innovative.",         en:"The government brings in new incentives for innovative businesses.",        cat:"Work & Business", lv:"C1", colloc_en:"brings in",             colloc_it:"introduce/porta" },
  { id:19, it:"L'azienda lancia il nuovo servizio su tutti i mercati europei.",         en:"The company rolls out the new service across all European markets.",        cat:"Work & Business", lv:"C1", colloc_en:"rolls out",             colloc_it:"lancia/implementa" },
  { id:20, it:"Il direttore posticipa la riunione alla settimana successiva.",          en:"The director puts off the meeting until the following week.",               cat:"Work & Business", lv:"B1", colloc_en:"puts off",              colloc_it:"posticipa/rimanda" },
  { id:21, it:"Il CFO riduce le spese di marketing del trenta percento.",              en:"The CFO cuts back on marketing expenses by thirty percent.",                cat:"Work & Business", lv:"B2", colloc_en:"cuts back on",           colloc_it:"riduce/taglia" },
  { id:22, it:"Il consulente esamina il problema prima di proporre una soluzione.",      en:"The consultant looks into the problem before proposing a solution.",        cat:"Work & Business", lv:"B2", colloc_en:"looks into",            colloc_it:"esamina/indaga" },
  { id:23, it:"L'analista analizza i dati in dettaglio per trovare le cause.",          en:"The analyst breaks down the data in detail to find the causes.",            cat:"Work & Business", lv:"B2", colloc_en:"breaks down",           colloc_it:"analizza/scompone" },
  { id:24, it:"Il team costruisce una solida base di clienti nel tempo.",               en:"The team builds up a solid client base over time.",                         cat:"Work & Business", lv:"B2", colloc_en:"builds up",             colloc_it:"costruisce/accumula" },
  { id:25, it:"Il candidato rifiuta la proposta di lavoro per motivi personali.",       en:"The candidate turns down the job offer for personal reasons.",              cat:"Work & Business", lv:"B1", colloc_en:"turns down",            colloc_it:"rifiuta" },
  { id:26, it:"Il responsabile contatta i clienti inattivi per riattivare i rapporti.", en:"The manager reaches out to inactive clients to reactivate the relationship.", cat:"Work & Business", lv:"B2", colloc_en:"reaches out to",        colloc_it:"contatta/si rivolge a" },
  { id:27, it:"L'azienda si espande nel settore dell'energia rinnovabile.",             en:"The company branches out into the renewable energy sector.",               cat:"Work & Business", lv:"C1", colloc_en:"branches out into",      colloc_it:"si espande in" },
  { id:28, it:"Il manager si esaurisce lavorando settanta ore a settimana.",            en:"The manager burns out working seventy hours a week.",                      cat:"Work & Business", lv:"B2", colloc_en:"burns out",             colloc_it:"si esaurisce/crolla" },
  { id:29, it:"Giulia si distingue dalla concorrenza grazie alla sua creatività.",      en:"Giulia stands out from the competition thanks to her creativity.",          cat:"Work & Business", lv:"B2", colloc_en:"stands out",            colloc_it:"si distingue/spicca" },
  { id:30, it:"Il direttore approva il progetto prima dell'invio al cliente.",          en:"The director signs off on the project before sending it to the client.",    cat:"Work & Business", lv:"C1", colloc_en:"signs off on",          colloc_it:"approva/da il via libera" },
  { id:31, it:"Il team recupera il ritardo accumulato durante le vacanze.",            en:"The team catches up on the backlog that built up during the holidays.",     cat:"Work & Business", lv:"B2", colloc_en:"catches up on",          colloc_it:"recupera/colma" },
  { id:32, it:"L'azienda elimina gradualmente i vecchi modelli dal catalogo.",          en:"The company phases out the old models from its catalogue.",                 cat:"Work & Business", lv:"C1", colloc_en:"phases out",            colloc_it:"elimina gradualmente" },
  { id:33, it:"Il team di vendita accede al CRM ogni mattina per aggiornare i dati.",  en:"The sales team logs into the CRM every morning to update the data.",       cat:"Work & Business", lv:"A2", colloc_en:"logs into",             colloc_it:"accede a/entra in" },
  { id:34, it:"Il responsabile fa un aggiornamento veloce con il team ogni mattina.",  en:"The manager checks in with the team every morning for a quick update.",    cat:"Work & Business", lv:"B1", colloc_en:"checks in with",         colloc_it:"fa un aggiornamento con" },
  { id:35, it:"Il team stenta a stare al passo con i rapidi cambiamenti del settore.", en:"The team struggles to keep up with the rapid changes in the industry.",    cat:"Work & Business", lv:"B2", colloc_en:"keep up with",           colloc_it:"stare al passo con" },
  { id:36, it:"L'azienda resta indietro rispetto ai principali concorrenti.",           en:"The company falls behind its main competitors.",                            cat:"Work & Business", lv:"B2", colloc_en:"falls behind",           colloc_it:"resta indietro rispetto a" },
  { id:37, it:"Il progetto occupa gran parte delle risorse del team da mesi.",         en:"The project takes up most of the team's resources for months.",            cat:"Work & Business", lv:"B2", colloc_en:"takes up",              colloc_it:"occupa/assorbe" },
  { id:38, it:"Il direttore passa le responsabilità al suo vice durante la trasferta.", en:"The director passes on responsibilities to his deputy during the trip.",   cat:"Work & Business", lv:"B2", colloc_en:"passes on",             colloc_it:"passa/trasferisce" },
  { id:39, it:"Il team riesce a completare il progetto impossibile contro ogni aspettativa.", en:"The team pulls off the impossible project against all expectations.", cat:"Work & Business", lv:"C1", colloc_en:"pulls off",             colloc_it:"riesce a fare/porta a termine" },
  { id:40, it:"La nuova direttrice guida il dipartimento con grande determinazione.",   en:"The new director heads up the department with great determination.",        cat:"Work & Business", lv:"B2", colloc_en:"heads up",              colloc_it:"guida/dirige" },
  { id:41, it:"I negoziatori appianano le differenze e raggiungono un accordo.",       en:"The negotiators iron out their differences and reach an agreement.",        cat:"Work & Business", lv:"C1", colloc_en:"iron out",              colloc_it:"appianano/risolvono" },
  { id:42, it:"Il responsabile restringe le opzioni a sole tre candidate.",             en:"The manager narrows down the options to just three candidates.",            cat:"Work & Business", lv:"B2", colloc_en:"narrows down",           colloc_it:"restringe/riduce" },
  { id:43, it:"Il comitato valuta i pro e i contro di ogni soluzione proposta.",       en:"The committee weighs up the pros and cons of each proposed solution.",     cat:"Work & Business", lv:"C1", colloc_en:"weighs up",             colloc_it:"valuta/soppesa" },
  { id:44, it:"La responsabile delinea una strategia dettagliata per i prossimi mesi.", en:"The manager maps out a detailed strategy for the next few months.",        cat:"Work & Business", lv:"C1", colloc_en:"maps out",              colloc_it:"delinea/pianifica" },
  { id:45, it:"Il team finalmente conclude le trattative dopo settimane difficili.",    en:"The team finally wraps up the negotiations after several tough weeks.",     cat:"Work & Business", lv:"B2", colloc_en:"wraps up",              colloc_it:"conclude/chiude" },
  { id:46, it:"Il responsabile supporta la proposta con dati concreti e convincenti.", en:"The manager backs up the proposal with concrete, convincing data.",         cat:"Work & Business", lv:"B2", colloc_en:"backs up",              colloc_it:"supporta/rafforza" },
  { id:47, it:"Il dirigente perde le opportunità di mercato rimandando le decisioni.",  en:"The executive misses out on market opportunities by putting off decisions.", cat:"Work & Business", lv:"C1", colloc_en:"misses out on",         colloc_it:"perde/si lascia sfuggire" },
  { id:48, it:"Il project manager si fa avanti per guidare il progetto più difficile.", en:"The project manager steps up to lead the most challenging project.",       cat:"Work & Business", lv:"B2", colloc_en:"steps up",              colloc_it:"si fa avanti/si impegna di più" },
  { id:49, it:"L'analista supporta le sue conclusioni con tre diversi dataset.",       en:"The analyst backs up her conclusions with three different datasets.",       cat:"Work & Business", lv:"B2", colloc_en:"backs up",              colloc_it:"supporta con prove" },
  { id:50, it:"Il team fa brainstorming e trova una soluzione innovativa al problema.", en:"The team brainstorms and comes up with an innovative solution to the problem.", cat:"Work & Business", lv:"B2", colloc_en:"comes up with",      colloc_it:"trova/elabora" },

  // ── DAILY LIFE ────────────────────────────────────────────────────────
  { id:51, it:"Marco rinuncia al progetto dopo settimane di difficoltà.",               en:"Marco gives up on the project after weeks of difficulty.",                  cat:"Daily Life", lv:"B1", colloc_en:"gives up on",           colloc_it:"rinuncia a" },
  { id:52, it:"Anna si prende cura della nonna anziana ogni fine settimana.",           en:"Anna looks after her elderly grandmother every weekend.",                   cat:"Daily Life", lv:"A2", colloc_en:"looks after",            colloc_it:"si prende cura di" },
  { id:53, it:"La coppia si lascia dopo tre anni di relazione.",                        en:"The couple breaks up after three years together.",                          cat:"Daily Life", lv:"B1", colloc_en:"breaks up",             colloc_it:"si lascia" },
  { id:54, it:"I due amici si riconciliano dopo una discussione accesa.",               en:"The two friends make up after a heated argument.",                          cat:"Daily Life", lv:"B1", colloc_en:"make up",               colloc_it:"si riconciliano" },
  { id:55, it:"Pietro va a prendere i bambini a scuola ogni pomeriggio.",              en:"Pietro picks up the children from school every afternoon.",                 cat:"Daily Life", lv:"A2", colloc_en:"picks up",              colloc_it:"va a prendere" },
  { id:56, it:"Giulia porta i bambini a scuola e poi va a lavorare.",                  en:"Giulia drops the children off at school and then goes to work.",            cat:"Daily Life", lv:"A2", colloc_en:"drops the children off", colloc_it:"porta/lascia" },
  { id:57, it:"Marco trascorre il sabato con gli amici al parco.",                     en:"Marco hangs out with his friends in the park on Saturday.",                 cat:"Daily Life", lv:"A2", colloc_en:"hangs out with",          colloc_it:"trascorre tempo con" },
  { id:58, it:"Sara si aggiorna con la sua amica dopo mesi di lontananza.",            en:"Sara catches up with her friend after months apart.",                       cat:"Daily Life", lv:"B1", colloc_en:"catches up with",        colloc_it:"si aggiorna con" },
  { id:59, it:"La famiglia mangia fuori per festeggiare il compleanno di Anna.",       en:"The family eats out to celebrate Anna's birthday.",                         cat:"Daily Life", lv:"A2", colloc_en:"eats out",              colloc_it:"mangia fuori" },
  { id:60, it:"Luca si allena in palestra tre volte a settimana.",                     en:"Luca works out at the gym three times a week.",                             cat:"Daily Life", lv:"A2", colloc_en:"works out",             colloc_it:"si allena" },
  { id:61, it:"Pietro rimane sveglio fino alle due per finire il libro.",              en:"Pietro stays up until two in the morning to finish the book.",              cat:"Daily Life", lv:"B1", colloc_en:"stays up",              colloc_it:"rimane sveglio" },
  { id:62, it:"Anna continua nonostante le difficoltà e alla fine riesce.",            en:"Anna carries on despite the difficulties and eventually succeeds.",          cat:"Daily Life", lv:"B1", colloc_en:"carries on",            colloc_it:"continua/persevera" },
  { id:63, it:"Giulia si calma e riesce a ragionare con più lucidità.",               en:"Giulia calms down and manages to think more clearly.",                      cat:"Daily Life", lv:"B1", colloc_en:"calms down",            colloc_it:"si calma" },
  { id:64, it:"Marco delude il suo migliore amico non presentandosi all'appuntamento.", en:"Marco lets his best friend down by not showing up to their meeting.",      cat:"Daily Life", lv:"B2", colloc_en:"lets his best friend down", colloc_it:"delude" },
  { id:65, it:"L'amica si presenta all'improvviso senza avvisare prima.",              en:"The friend shows up unexpectedly without calling ahead.",                   cat:"Daily Life", lv:"B1", colloc_en:"shows up",              colloc_it:"si presenta/arriva" },
  { id:66, it:"Pietro cresce in una piccola città di provincia nel Sud Italia.",       en:"Pietro grows up in a small town in southern Italy.",                        cat:"Daily Life", lv:"A2", colloc_en:"grows up",              colloc_it:"cresce" },
  { id:67, it:"Sara ripulisce la casa prima dell'arrivo degli ospiti importanti.",     en:"Sara cleans up the house before the important guests arrive.",              cat:"Daily Life", lv:"A2", colloc_en:"cleans up",             colloc_it:"ripulisce/riordina" },
  { id:68, it:"Marco cerca una parola nuova sul dizionario online ogni giorno.",       en:"Marco looks up a new word in the online dictionary every day.",             cat:"Daily Life", lv:"A2", colloc_en:"looks up",              colloc_it:"cerca/consulta" },
  { id:69, it:"Giulia si ritrova a vivere in un paese straniero per caso.",            en:"Giulia ends up living in a foreign country by chance.",                     cat:"Daily Life", lv:"B1", colloc_en:"ends up",               colloc_it:"si ritrova/finisce per" },
  { id:70, it:"Anna esaurisce la pazienza dopo ore di attesa al telefono.",            en:"Anna runs out of patience after hours of waiting on hold.",                 cat:"Daily Life", lv:"B1", colloc_en:"runs out of",            colloc_it:"esaurisce" },
  { id:71, it:"Pietro si libera di molti oggetti inutili durante il trasloco.",        en:"Pietro gets rid of many useless objects during the move.",                  cat:"Daily Life", lv:"B1", colloc_en:"gets rid of",            colloc_it:"si libera di/elimina" },
  { id:72, it:"La famiglia si imbatte nel vecchio amico di scuola per strada.",        en:"The family runs into their old school friend on the street.",               cat:"Daily Life", lv:"B1", colloc_en:"runs into",             colloc_it:"si imbatte in/incontra per caso" },
  { id:73, it:"Marco torna i libri presi in prestito alla biblioteca.",                en:"Marco gives back the books he borrowed to the library.",                    cat:"Daily Life", lv:"A2", colloc_en:"gives back",            colloc_it:"restituisce/riporta" },
  { id:74, it:"Giulia affronta un periodo difficile con grande forza d'animo.",        en:"Giulia goes through a difficult period with great strength of mind.",        cat:"Daily Life", lv:"B2", colloc_en:"goes through",           colloc_it:"affronta/attraversa" },
  { id:75, it:"Anna supera il dolore della perdita con l'aiuto della famiglia.",       en:"Anna gets over the pain of loss with the help of her family.",              cat:"Daily Life", lv:"B2", colloc_en:"gets over",             colloc_it:"supera/si riprende da" },
  { id:76, it:"Pietro fa il pieno del serbatoio prima di partire per il viaggio.",    en:"Pietro fills up the tank before setting off on the trip.",                  cat:"Daily Life", lv:"A2", colloc_en:"fills up",              colloc_it:"fa il pieno/riempie" },
  { id:77, it:"Marco va avanti con la sua vita dopo la fine della relazione.",         en:"Marco moves on with his life after the relationship ends.",                 cat:"Daily Life", lv:"B2", colloc_en:"moves on",              colloc_it:"va avanti/supera" },
  { id:78, it:"Giulia si apre con la sua migliore amica e racconta tutto.",            en:"Giulia opens up to her best friend and tells her everything.",              cat:"Daily Life", lv:"B2", colloc_en:"opens up to",            colloc_it:"si apre con/si confida con" },
  { id:79, it:"Anna ricomincia da capo dopo il fallimento dell'attività.",             en:"Anna starts over after the failure of her business.",                       cat:"Daily Life", lv:"B2", colloc_en:"starts over",            colloc_it:"ricomincia da capo" },
  { id:80, it:"Pietro crolla emotivamente sotto il peso dello stress accumulato.",     en:"Pietro breaks down under the weight of accumulated stress.",                cat:"Daily Life", lv:"B2", colloc_en:"breaks down",           colloc_it:"crolla/cede emotivamente" },
  { id:81, it:"Marco riesce a superare la situazione difficile con l'aiuto di tutti.", en:"Marco gets through the difficult situation with everyone's help.",          cat:"Daily Life", lv:"B2", colloc_en:"gets through",           colloc_it:"riesce a superare/sopravvive a" },
  { id:82, it:"Giulia fa attenzione agli ostacoli mentre corre nel parco.",            en:"Giulia looks out for obstacles while running in the park.",                 cat:"Daily Life", lv:"B1", colloc_en:"looks out for",          colloc_it:"fa attenzione a/sta in guardia" },
  { id:83, it:"Anna dedica il sabato mattina al giardinaggio come hobby.",             en:"Anna takes up gardening as a hobby on Saturday mornings.",                  cat:"Daily Life", lv:"B1", colloc_en:"takes up",              colloc_it:"inizia/si dedica a" },
  { id:84, it:"Pietro sopporta il comportamento scortese del vicino per anni.",        en:"Pietro puts up with his rude neighbour's behaviour for years.",             cat:"Daily Life", lv:"B2", colloc_en:"puts up with",           colloc_it:"sopporta/tollera" },
  { id:85, it:"Marco riduce il consumo di zucchero per migliorare la salute.",        en:"Marco cuts down on his sugar intake to improve his health.",                cat:"Daily Life", lv:"B1", colloc_en:"cuts down on",           colloc_it:"riduce/diminuisce" },
  { id:86, it:"Giulia aspetta pazientemente che arrivi il suo turno.",                 en:"Giulia holds on patiently until it is her turn.",                           cat:"Daily Life", lv:"A2", colloc_en:"holds on",              colloc_it:"aspetta/tiene duro" },
  { id:87, it:"Anna evoca i ricordi della sua infanzia con nostalgia.",               en:"Anna brings back memories of her childhood with nostalgia.",                cat:"Daily Life", lv:"B2", colloc_en:"brings back",            colloc_it:"riporta/evoca" },
  { id:88, it:"Pietro rallenta il passo quando inizia a sentire il fiato corto.",     en:"Pietro slows down when he starts feeling short of breath.",                 cat:"Daily Life", lv:"B1", colloc_en:"slows down",            colloc_it:"rallenta" },
  { id:89, it:"Marco si tira su di morale con una passeggiata e un caffè.",           en:"Marco cheers himself up with a walk and a coffee.",                         cat:"Daily Life", lv:"B1", colloc_en:"cheers himself up",      colloc_it:"si tira su di morale" },
  { id:90, it:"Giulia parte di prima mattina per evitare il traffico.",                en:"Giulia sets off early in the morning to avoid the traffic.",                 cat:"Daily Life", lv:"B1", colloc_en:"sets off",              colloc_it:"parte/si mette in viaggio" },
  { id:91, it:"Anna va d'accordo con tutti i colleghi del suo ufficio.",              en:"Anna gets along with all of her office colleagues.",                        cat:"Daily Life", lv:"B1", colloc_en:"gets along with",        colloc_it:"va d'accordo con" },
  { id:92, it:"Pietro litiga con il suo migliore amico per una questione di soldi.",  en:"Pietro falls out with his best friend over a money issue.",                 cat:"Daily Life", lv:"B2", colloc_en:"falls out with",         colloc_it:"litiga con/si scontra con" },
  { id:93, it:"Marco si riprende velocemente dall'influenza grazie al riposo.",        en:"Marco gets over the flu quickly thanks to plenty of rest.",                 cat:"Daily Life", lv:"B1", colloc_en:"gets over",             colloc_it:"si riprende da/supera" },
  { id:94, it:"Giulia rimanda la visita dal dentista da settimane per paura.",         en:"Giulia puts off her dentist appointment for weeks out of fear.",            cat:"Daily Life", lv:"B1", colloc_en:"puts off",              colloc_it:"rimanda/posticipa" },
  { id:95, it:"Pietro trascorre la serata con vecchi amici del liceo.",               en:"Pietro hangs out with old friends from secondary school in the evening.",   cat:"Daily Life", lv:"A2", colloc_en:"hangs out with",          colloc_it:"trascorre tempo con" },
  { id:96, it:"Anna si libera di tutti i vestiti che non indossa più da anni.",       en:"Anna gets rid of all the clothes she no longer wears.",                     cat:"Daily Life", lv:"B1", colloc_en:"gets rid of",            colloc_it:"si libera di/butta via" },
  { id:97, it:"Marco si imbatte in un documentario interessante per caso.",            en:"Marco comes across an interesting documentary by chance.",                  cat:"Daily Life", lv:"B1", colloc_en:"comes across",           colloc_it:"si imbatte in/trova per caso" },
  { id:98, it:"Pietro torna su una decisione presa in fretta e la cambia.",           en:"Pietro goes back on a decision he made in haste and changes it.",           cat:"Daily Life", lv:"B2", colloc_en:"goes back on",           colloc_it:"torna su/cambia" },
  { id:99, it:"Giulia si aggiorna sulle ultime notizie prima di andare a dormire.",   en:"Giulia catches up on the latest news before going to bed.",                 cat:"Daily Life", lv:"B1", colloc_en:"catches up on",          colloc_it:"si aggiorna su" },
  { id:100,it:"Anna regge emotivamente anche nella situazione più difficile della sua vita.", en:"Anna holds up emotionally even in the most difficult situation of her life.", cat:"Daily Life", lv:"C1", colloc_en:"holds up",       colloc_it:"regge/resiste" },
];

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 1 — CONSTANTS & UTILITY
// ═══════════════════════════════════════════════════════════════════════
const CATS   = ["All", "Work & Business", "Daily Life"];
const LEVELS = ["All", "A2", "B1", "B2", "C1"];
const ROUND  = 5;
const SK_SESSIONS = "phraseup_sessions_v3";
const SK_WRONG    = "phraseup_wrong_v3";
const SK_THEME    = "phraseup_theme_v1";

function norm(s) {
  return s.toLowerCase().trim()
    .replace(/[''""]/g,"'")
    .replace(/[^a-z0-9\s']/g,"")
    .replace(/\s+/g," ");
}
function matchScore(inp, ans) {
  const ni = norm(inp), na = norm(ans);
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
function loadSessions(){ try{ return JSON.parse(localStorage.getItem(SK_SESSIONS))||[]; }catch{ return []; } }
function saveSessions(a){ try{ localStorage.setItem(SK_SESSIONS,JSON.stringify(a.slice(-20))); }catch{} }
function loadWrong(){ try{ return JSON.parse(localStorage.getItem(SK_WRONG))||[]; }catch{ return []; } }
function saveWrong(a){ try{ localStorage.setItem(SK_WRONG,JSON.stringify(a.slice(-300))); }catch{} }
function loadTheme(){ try{ return localStorage.getItem(SK_THEME)||"dark"; }catch{ return "dark"; } }

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 1 — CSS (refined spacing, larger fonts, prep focus fix)
// ═══════════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

[data-theme="dark"]{
  --bg:#04090f;--bg2:#080f1a;--bg3:#0c1626;
  --card:rgba(10,22,42,0.88);--card2:rgba(12,26,50,0.95);
  --border:rgba(55,140,210,0.13);--border2:rgba(55,190,250,0.22);
  --blue:#2563eb;--blue2:#3b82f6;--blue3:#93c5fd;--indigo:#6366f1;
  --green:#10b981;--orange:#f59e0b;--red:#ef4444;
  --text:#ddeeff;--text2:#8eadc8;--text3:#4a6a82;
  --sh:0 8px 40px rgba(0,0,0,0.5);--nav-bg:rgba(4,9,15,0.96);
  --input-bg:rgba(255,255,255,0.03);
  --green-bg:rgba(16,185,129,0.08);--orange-bg:rgba(245,158,11,0.08);
  --red-bg:rgba(239,68,68,0.07);--correct:#34d399;--wrong-c:#f87171;
}
[data-theme="light"]{
  --bg:#f0f5ff;--bg2:#e4eeff;--bg3:#d8e5ff;
  --card:rgba(255,255,255,0.9);--card2:rgba(255,255,255,0.98);
  --border:rgba(37,99,235,0.16);--border2:rgba(37,99,235,0.3);
  --blue:#1d4ed8;--blue2:#2563eb;--blue3:#3b82f6;--indigo:#4f46e5;
  --green:#059669;--orange:#d97706;--red:#dc2626;
  --text:#0f172a;--text2:#334155;--text3:#64748b;
  --sh:0 4px 20px rgba(30,60,120,0.1);--nav-bg:rgba(240,245,255,0.97);
  --input-bg:rgba(37,99,235,0.04);
  --green-bg:rgba(5,150,105,0.07);--orange-bg:rgba(217,119,6,0.07);
  --red-bg:rgba(220,38,38,0.06);--correct:#059669;--wrong-c:#dc2626;
}

html,body{
  background:var(--bg);color:var(--text);
  font-family:'Outfit',sans-serif;min-height:100vh;
  transition:background .3s,color .3s;font-size:16px;
}
[data-theme="dark"] body{
  background-image:
    radial-gradient(ellipse 110% 50% at 50% -5%,rgba(37,99,235,.08) 0%,transparent 70%),
    radial-gradient(ellipse 50% 30% at 85% 85%,rgba(99,102,241,.05) 0%,transparent 60%);
  background-attachment:fixed;
}
[data-theme="light"] body{
  background-image:radial-gradient(ellipse 110% 50% at 50% -5%,rgba(59,130,246,.1) 0%,transparent 70%);
  background-attachment:fixed;
}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--bg3);border-radius:4px;}

.app{max-width:680px;margin:0 auto;padding:0 .85rem 5rem;}

/* ── NAVBAR ── */
.navbar{
  display:flex;flex-direction:column;
  padding:.7rem 0 0;border-bottom:1px solid var(--border);
  margin-bottom:1.4rem;position:sticky;top:0;z-index:50;
  background:var(--nav-bg);backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
}
.navbar-top{display:flex;align-items:center;justify-content:space-between;padding-bottom:.6rem;}
.navbar-links{display:flex;gap:0;border-top:1px solid var(--border);margin:0 -.85rem;}
.nav-link-btn{
  flex:1;padding:.45rem .2rem;border:none;background:none;font-family:inherit;
  font-size:.72rem;font-weight:700;color:var(--text3);cursor:pointer;transition:all .15s;
  border-bottom:2px solid transparent;display:flex;flex-direction:column;align-items:center;gap:1px;
}
.nav-link-btn:hover{color:var(--blue2);}
.nav-link-btn.active{color:var(--blue2);border-bottom-color:var(--blue2);}
.nav-link-icon{font-size:.9rem;}
.logo{display:flex;align-items:center;gap:0.55rem;cursor:pointer;user-select:none;}
.logo-icon{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(145deg,#1e3a8a,#1d4ed8,#2563eb);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 16px rgba(37,99,235,.45);flex-shrink:0;
}
[data-theme="light"] .logo-icon{box-shadow:0 0 10px rgba(37,99,235,.25);}
.logo-icon svg{width:20px;height:20px;}
.logo-text{line-height:1;}
.logo-name{
  font-weight:900;font-size:1.1rem;letter-spacing:-.04em;
  background:linear-gradient(90deg,var(--blue2),var(--blue3));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
[data-theme="light"] .logo-name{
  background:linear-gradient(90deg,#1d4ed8,#3b82f6);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.logo-tag{font-size:.56rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text3);}
.nav-right{display:flex;align-items:center;gap:.4rem;}
.nav-btn{
  padding:.28rem .75rem;border-radius:50px;
  border:1px solid var(--border2);background:none;
  font-family:inherit;font-size:.75rem;font-weight:700;color:var(--blue2);
  cursor:pointer;transition:all .15s;white-space:nowrap;
}
.nav-btn:hover{background:rgba(37,99,235,.1);}
.nav-btn.active{background:rgba(37,99,235,.12);}
.nav-btn.danger{color:var(--red);border-color:rgba(220,38,38,.3);}
.nav-btn.danger:hover{background:rgba(220,38,38,.08);}
.theme-btn{
  width:32px;height:32px;border-radius:50%;
  border:1px solid var(--border);background:var(--card);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all .2s;font-size:.85rem;
}
.theme-btn:hover{border-color:var(--blue2);transform:rotate(15deg);}

/* ── SCREENS ── */
.screen{animation:fadeUp .28s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* ── SECTION LABEL ── */
.sl{font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text3);margin-bottom:.6rem;}

/* ── HOME MODE TABS ── */
.mode-grid{display:flex;gap:.5rem;margin-bottom:1.1rem;}
.mode-card{
  flex:1;background:var(--card2);border:1.5px solid var(--border);
  border-radius:14px;padding:.7rem .3rem;cursor:pointer;
  transition:all .18s;text-align:center;font-family:inherit;
  display:flex;flex-direction:column;align-items:center;gap:.25rem;
}
.mode-card:hover{border-color:var(--blue2);transform:translateY(-1px);}
.mode-card.active{border-color:var(--blue2);background:rgba(37,99,235,.09);}
.mc-icon{font-size:1.4rem;line-height:1;}
.mc-title{font-size:.68rem;font-weight:800;color:var(--text);white-space:nowrap;}
.mc-sub{display:none;}
.mode-desc{
  font-size:.8rem;color:var(--text2);line-height:1.5;
  margin-bottom:.9rem;padding:.5rem .75rem;
  background:rgba(37,99,235,.05);border-radius:10px;
  border-left:3px solid rgba(37,99,235,.25);
}

/* ── CHIPS ── */
.chips{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:1.1rem;}
.chip{
  padding:.32rem .9rem;border-radius:50px;
  border:1px solid var(--border);background:var(--card);
  font-family:inherit;font-size:.8rem;font-weight:600;color:var(--text2);
  cursor:pointer;transition:all .15s;
}
.chip:hover{border-color:var(--blue2);color:var(--blue2);}
.chip.on{background:rgba(37,99,235,.12);border-color:rgba(37,99,235,.45);color:var(--blue2);}

/* ── START CARD ── */
.start-card{
  background:var(--card2);border:1.5px solid var(--border2);
  border-radius:14px;padding:1.4rem 1.5rem;margin-bottom:1rem;
  display:flex;align-items:center;justify-content:space-between;gap:1rem;
}
.start-info{font-size:.88rem;color:var(--text2);line-height:1.6;}
.start-info strong{color:var(--text);display:block;font-size:1.05rem;margin-bottom:.15rem;font-weight:800;}
.start-btn{
  flex-shrink:0;padding:.8rem 1.7rem;border-radius:12px;border:none;
  background:linear-gradient(135deg,#1e40af,#2563eb);
  font-family:inherit;font-size:.95rem;font-weight:800;color:white;
  cursor:pointer;transition:all .2s;white-space:nowrap;
  box-shadow:0 0 22px rgba(37,99,235,.38);letter-spacing:-.01em;
}
.start-btn:hover{transform:translateY(-2px);box-shadow:0 0 30px rgba(37,99,235,.55);}
.start-btn:active{transform:translateY(0);}
.start-btn:disabled{background:var(--bg3);color:var(--text3);box-shadow:none;cursor:default;transform:none;}

/* ── QUIZ HEADER ── */
.quiz-header{display:flex;align-items:center;gap:.75rem;margin-bottom:1.2rem;}
.prog-track{flex:1;height:5px;border-radius:3px;background:var(--border);overflow:hidden;}
.prog-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--blue),var(--indigo));transition:width .4s ease;}
.q-counter{font-size:.8rem;font-weight:700;color:var(--text3);white-space:nowrap;}

/* ── QUESTION CARD ── */
.qcard{
  background:var(--card2);border:1.5px solid var(--border2);
  border-radius:18px;padding:1.7rem;margin-bottom:1rem;
  position:relative;overflow:hidden;box-shadow:var(--sh);
}
.qcard::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:var(--cat-color,var(--blue2));
  box-shadow:0 0 12px var(--cat-color,var(--blue2));
}
.qcard-meta{display:flex;align-items:center;gap:.45rem;margin-bottom:1rem;flex-wrap:wrap;}
.cat-pill{
  padding:.18rem .6rem;border-radius:50px;
  font-size:.67rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  border:1px solid currentColor;
}
.lv-pill{
  padding:.18rem .5rem;border-radius:4px;font-size:.67rem;font-weight:700;
  background:rgba(255,255,255,.05);color:var(--text3);
}
[data-theme="light"] .lv-pill{background:rgba(0,0,0,.05);}
.q-label{font-size:.66rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--text3);margin-bottom:.5rem;}
.q-text{font-size:clamp(1.05rem,2.5vw,1.3rem);font-weight:800;color:var(--text);line-height:1.5;letter-spacing:-.02em;}

/* ── COLLOC FILL-IN-BLANK ── */
.q-it-context{
  font-size:.84rem;color:var(--text3);font-style:italic;
  margin-bottom:.85rem;line-height:1.55;
  padding:.55rem .8rem;border-radius:8px;
  background:rgba(255,255,255,.03);border-left:3px solid var(--border2);
}
[data-theme="light"] .q-it-context{background:rgba(0,0,0,.03);}
.sentence-en{
  font-size:clamp(1rem,2.3vw,1.15rem);font-weight:700;
  color:var(--text);line-height:1.8;letter-spacing:-.01em;
  margin-bottom:.9rem;
}
.colloc-blank{
  display:inline;padding:.08rem .5rem;border-radius:5px;
  background:rgba(37,99,235,.12);
  border-bottom:2.5px solid var(--blue2);
  color:var(--blue2);font-style:italic;letter-spacing:.03em;
  transition:all .25s;white-space:nowrap;
}
.colloc-blank.exact{background:rgba(16,185,129,.12);border-color:var(--correct);color:var(--correct);font-style:normal;font-weight:800;}
.colloc-blank.close,.colloc-blank.partial{background:rgba(245,158,11,.1);border-color:var(--orange);color:var(--orange);font-style:normal;font-weight:800;}
.colloc-blank.wrong{background:rgba(220,38,38,.09);border-color:var(--wrong-c);color:var(--wrong-c);font-style:normal;}
.hint-box{
  display:flex;align-items:center;gap:.6rem;
  background:rgba(37,99,235,.06);
  border:1px solid rgba(37,99,235,.18);border-radius:10px;
  padding:.6rem .9rem;margin-bottom:.9rem;
}
.hint-label{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue2);white-space:nowrap;}
.hint-text{font-size:.9rem;color:var(--text2);font-style:italic;}

/* ── ANSWER INPUT ── */
.ans-wrap{margin-bottom:.8rem;}
.ans-input{
  width:100%;padding:.95rem 1.1rem;border-radius:11px;
  border:1.5px solid var(--border);background:var(--input-bg);
  font-family:'Outfit',sans-serif;font-size:1rem;font-weight:500;color:var(--text);
  outline:none;transition:all .2s;
}
.ans-input::placeholder{color:var(--text3);}
.ans-input:focus{border-color:rgba(37,99,235,.5);background:rgba(37,99,235,.04);box-shadow:0 0 0 3px rgba(37,99,235,.08);}
.ans-input.exact{border-color:rgba(16,185,129,.6);background:rgba(16,185,129,.07);color:var(--correct);}
.ans-input.close{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.07);color:var(--orange);}
.ans-input.partial{border-color:rgba(245,158,11,.4);background:rgba(245,158,11,.06);color:var(--orange);}
.ans-input.wrong{border-color:rgba(220,38,38,.5);background:rgba(220,38,38,.07);color:var(--wrong-c);}
.ans-input:disabled{opacity:.85;}

/* ── ACTION BUTTONS ── */
.action-btn{
  width:100%;padding:.92rem;border-radius:11px;border:none;
  font-family:inherit;font-size:.98rem;font-weight:800;
  cursor:pointer;transition:all .2s;letter-spacing:-.01em;
}
.action-btn.check{background:linear-gradient(135deg,#1e40af,#2563eb);color:white;box-shadow:0 0 20px rgba(37,99,235,.28);}
.action-btn.check:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 28px rgba(37,99,235,.42);}
.action-btn.check:disabled{background:var(--bg3);color:var(--text3);box-shadow:none;cursor:default;}
.action-btn.next-q{background:linear-gradient(135deg,#059669,#0ea5e9);color:white;box-shadow:0 0 18px rgba(5,150,105,.2);}
.action-btn.next-q:hover{transform:translateY(-1px);box-shadow:0 0 26px rgba(5,150,105,.35);}

/* ── FEEDBACK ── */
.feedback{
  border-radius:11px;padding:.95rem 1.1rem;margin-bottom:.8rem;
  display:flex;align-items:flex-start;gap:.75rem;
  animation:popIn .3s cubic-bezier(.34,1.56,.64,1);border:1px solid;
}
@keyframes popIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
.feedback.exact{background:var(--green-bg);border-color:rgba(16,185,129,.25);}
.feedback.close,.feedback.partial{background:var(--orange-bg);border-color:rgba(245,158,11,.22);}
.feedback.wrong{background:var(--red-bg);border-color:rgba(220,38,38,.2);}
.fb-icon{font-size:1.3rem;flex-shrink:0;}
.fb-content{flex:1;min-width:0;}
.fb-title{font-weight:700;font-size:.88rem;margin-bottom:.2rem;}
.feedback.exact .fb-title{color:var(--correct);}
.feedback.close .fb-title,.feedback.partial .fb-title{color:var(--orange);}
.feedback.wrong .fb-title{color:var(--wrong-c);}
.fb-ans{font-size:.85rem;color:var(--text2);line-height:1.5;}
.fb-ans strong{color:var(--text);font-weight:700;}

/* ── PREPOSITIONS QUIZ ── */
.prep-q-text{
  font-size:clamp(1rem,2.3vw,1.2rem);font-weight:700;
  color:var(--text);line-height:1.7;margin-bottom:1.3rem;
}
.prep-blank{
  display:inline-block;min-width:64px;text-align:center;
  border-bottom:2.5px solid var(--blue2);
  padding:0 .3rem;color:var(--blue2);font-weight:800;
  border-radius:4px 4px 0 0;transition:all .25s;
}
.prep-blank.correct{border-color:var(--correct);color:var(--correct);background:var(--green-bg);}
.prep-blank.wrong{border-color:var(--wrong-c);color:var(--wrong-c);background:var(--red-bg);}
.prep-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:.6rem;margin-bottom:.9rem;}
.prep-opt{
  padding:.82rem;border-radius:11px;border:1.5px solid var(--border);
  background:var(--card);font-family:inherit;font-size:.97rem;font-weight:700;
  color:var(--text);cursor:pointer;transition:all .18s;
  outline:none;
}
.prep-opt:hover:not(:disabled){border-color:var(--blue2);background:rgba(37,99,235,.08);color:var(--blue2);}
.prep-opt.correct{border-color:var(--correct);background:var(--green-bg);color:var(--correct);}
.prep-opt.wrong-sel{border-color:var(--wrong-c);background:var(--red-bg);color:var(--wrong-c);}
.prep-opt:disabled{cursor:default;}
.prep-opt:focus{outline:none;}

/* ── PREP EXPLANATION ── */
.prep-exp{
  border-radius:11px;padding:.9rem 1.1rem;margin-bottom:.8rem;
  background:rgba(37,99,235,.07);border:1px solid rgba(37,99,235,.2);
  animation:popIn .3s cubic-bezier(.34,1.56,.64,1);
}
.prep-exp-label{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue2);margin-bottom:.3rem;}
.prep-exp-text{font-size:.85rem;color:var(--text2);line-height:1.6;}

/* ── RESULTS ── */
.result-banner{border-radius:18px;overflow:hidden;margin-bottom:1.3rem;background:var(--card2);border:1.5px solid var(--border2);box-shadow:var(--sh);}
.result-top{padding:2.2rem;text-align:center;background:linear-gradient(160deg,var(--bg2),var(--bg));}
.result-emoji{font-size:3.2rem;margin-bottom:.65rem;animation:bounce .5s .15s cubic-bezier(.34,1.56,.64,1) both;}
@keyframes bounce{from{transform:scale(0)}to{transform:scale(1)}}
.result-title{font-size:1.6rem;font-weight:900;letter-spacing:-.03em;}
.result-sub{color:var(--text2);font-size:.87rem;margin-top:.35rem;}
.result-bar{height:3px;background:linear-gradient(90deg,#1d4ed8,#6366f1,#ec4899);}
.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;padding:1.2rem;}
.stat-box{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:11px;padding:1rem;text-align:center;}
[data-theme="light"] .stat-box{background:rgba(0,0,0,.02);}
.stat-val{font-size:1.6rem;font-weight:900;letter-spacing:-.04em;line-height:1;}
.stat-lbl{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);margin-top:.2rem;}
.review-list{padding:1.1rem 1.3rem .3rem;}
.review-head{font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--text3);margin-bottom:.8rem;}
.ri{display:flex;gap:.6rem;align-items:flex-start;padding:.65rem 0;border-bottom:1px solid rgba(55,140,210,.06);}
.ri:last-child{border-bottom:none;}
.ri-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.ri-it{font-size:.8rem;color:var(--text2);margin-bottom:.06rem;}
.ri-en{font-size:.85rem;font-weight:700;color:var(--text);}
.ri-given{font-size:.76rem;color:var(--text3);font-style:italic;}
.btn-row{display:flex;gap:.5rem;padding:.9rem 1.3rem 1.2rem;}
.btn-sec{flex:1;padding:.7rem .4rem;border:1.5px solid var(--border2);border-radius:11px;background:none;font-family:inherit;font-size:.82rem;font-weight:700;color:var(--blue2);cursor:pointer;transition:all .15s;white-space:nowrap;}
.btn-sec:hover{background:rgba(37,99,235,.08);}
.btn-pri{flex:1;padding:.7rem .4rem;border:none;border-radius:11px;background:linear-gradient(135deg,#1e40af,#2563eb);font-family:inherit;font-size:.82rem;font-weight:800;color:white;cursor:pointer;box-shadow:0 0 16px rgba(37,99,235,.28);transition:all .15s;white-space:nowrap;}
.btn-pri:hover{transform:translateY(-1px);box-shadow:0 0 24px rgba(37,99,235,.45);}

/* ── RIPASSO ── */
.ripasso-empty{text-align:center;padding:3rem 1rem;color:var(--text3);font-size:.92rem;line-height:1.8;}
.ripasso-empty .big{font-size:2.8rem;margin-bottom:.6rem;}
.ripasso-item{background:var(--card2);border:1px solid var(--border);border-radius:13px;padding:1.1rem 1.3rem;margin-bottom:.7rem;}
.ri-type-badge{display:inline-block;font-size:.64rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.14rem .55rem;border-radius:4px;margin-bottom:.55rem;background:rgba(37,99,235,.1);color:var(--blue2);border:1px solid rgba(37,99,235,.2);}
.ripasso-q{font-size:.92rem;font-weight:700;color:var(--text);margin-bottom:.38rem;line-height:1.45;}
.ripasso-a{font-size:.85rem;color:var(--text2);}
.ripasso-a span{color:var(--correct);font-weight:700;}

/* ── STATS ── */
.stats-banner{border-radius:18px;overflow:hidden;margin-bottom:1.3rem;background:var(--card2);border:1.5px solid var(--border2);}
.stats-top{padding:1.4rem 1.5rem 1rem;border-bottom:1px solid var(--border);}
.stats-top h2{font-size:1.25rem;font-weight:900;letter-spacing:-.03em;margin-bottom:.15rem;}
.stats-top p{font-size:.83rem;color:var(--text2);}
.big-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);}
.bstat{background:var(--card2);padding:1rem;text-align:center;}
.bstat-v{font-size:1.6rem;font-weight:900;letter-spacing:-.04em;line-height:1;background:linear-gradient(135deg,var(--blue2),var(--indigo));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.bstat-l{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);margin-top:.2rem;}
.chart-card{background:var(--card2);border:1px solid var(--border);border-radius:14px;padding:1.2rem;margin-bottom:1rem;}
.chart-title{font-size:.85rem;font-weight:700;color:var(--text2);margin-bottom:.15rem;}
.chart-sub{font-size:.73rem;color:var(--text3);margin-bottom:1.1rem;}
.sess-list{background:var(--card2);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:1rem;}
.sess-head{padding:.75rem 1.1rem;border-bottom:1px solid var(--border);font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);}
.sess-row{display:flex;align-items:center;gap:.8rem;padding:.75rem 1.1rem;border-bottom:1px solid rgba(55,140,210,.05);}
.sess-row:last-child{border-bottom:none;}
.sess-n{font-size:.75rem;font-weight:700;color:var(--text3);width:22px;}
.sess-d{flex:1;font-size:.83rem;color:var(--text2);}
.sess-m{font-size:.75rem;color:var(--text3);}
.sess-acc{font-weight:800;font-size:.9rem;color:var(--blue2);}
.sess-badge{padding:.13rem .45rem;border-radius:4px;font-size:.68rem;font-weight:700;}
.sess-badge.good{background:rgba(16,185,129,.12);color:var(--correct);}
.sess-badge.mid{background:rgba(245,158,11,.12);color:var(--orange);}
.sess-badge.low{background:rgba(220,38,38,.1);color:var(--wrong-c);}
.no-data{padding:2.5rem;text-align:center;color:var(--text3);font-size:.92rem;line-height:1.8;}
.ctt{background:var(--bg2);border:1px solid var(--border2);border-radius:8px;padding:.6rem .9rem;}
.ctt-l{font-size:.72rem;color:var(--text3);margin-bottom:.15rem;}
.ctt-v{font-weight:700;color:var(--blue2);font-family:'JetBrains Mono',monospace;}

/* ── INFO ── */
.info-card{background:var(--card2);border:1px solid var(--border);border-radius:14px;padding:1.4rem 1.5rem;margin-bottom:.9rem;}
.info-card h3{font-size:1rem;font-weight:800;margin-bottom:.65rem;color:var(--text);}
.info-card p{font-size:.88rem;color:var(--text2);line-height:1.75;margin-bottom:.4rem;}
.disc{border-left:3px solid var(--orange);padding-left:1rem;}
.disc p{color:var(--text3);}
.version{font-size:.73rem;color:var(--text3);text-align:center;padding:.4rem 0;}

/* ── PAGE TITLE ── */
.page-title{font-size:1.4rem;font-weight:900;letter-spacing:-.03em;margin-bottom:.25rem;color:var(--text);}
.page-sub{font-size:.87rem;color:var(--text2);margin-bottom:1.5rem;line-height:1.6;}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.55);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeUp .2s ease;}
.modal{background:var(--bg2);border:1.5px solid var(--border2);border-radius:18px;padding:2.2rem;max-width:340px;width:100%;box-shadow:0 0 60px rgba(0,0,0,.4);animation:popIn .3s cubic-bezier(.34,1.56,.64,1);}
.modal h3{font-size:1.1rem;font-weight:800;margin-bottom:.5rem;}
.modal p{font-size:.9rem;color:var(--text2);line-height:1.6;margin-bottom:1.5rem;}
.modal-btns{display:flex;gap:.7rem;}
.m-cancel{flex:1;padding:.7rem;border:1.5px solid var(--border2);border-radius:11px;background:none;font-family:inherit;font-size:.92rem;font-weight:600;color:var(--text2);cursor:pointer;transition:all .15s;}
.m-cancel:hover{background:rgba(255,255,255,.04);}
[data-theme="light"] .m-cancel:hover{background:rgba(0,0,0,.04);}
.m-quit{flex:1;padding:.7rem;border:1.5px solid rgba(220,38,38,.3);border-radius:11px;background:rgba(220,38,38,.08);font-family:inherit;font-size:.92rem;font-weight:700;color:var(--wrong-c);cursor:pointer;transition:all .15s;}
.m-quit:hover{background:rgba(220,38,38,.18);}

/* ── RESPONSIVE ── */
@media(max-width:520px){
  .big-stats{grid-template-columns:repeat(2,1fr);}
  .stat-grid{grid-template-columns:repeat(3,1fr);}
}
@media(max-width:360px){
  .mode-grid{grid-template-columns:1fr;}
}

/* ── PWA INSTALL BANNER ── */
.install-banner{
  position:fixed;bottom:0;left:0;right:0;z-index:200;
  background:var(--card2);border-top:1px solid var(--border2);
  padding:.85rem 1rem .85rem 1rem;
  display:flex;align-items:center;gap:.75rem;
  box-shadow:0 -6px 28px rgba(0,0,0,.22);
  animation:slideUp .38s cubic-bezier(.34,1.4,.64,1) both;
}
@keyframes slideUp{from{transform:translateY(110%);opacity:0}to{transform:translateY(0);opacity:1}}
.ib-icon{
  width:42px;height:42px;border-radius:11px;flex-shrink:0;
  background:linear-gradient(145deg,#1e3a8a,#2563eb);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 14px rgba(37,99,235,.4);
}
.ib-icon svg{width:24px;height:24px;}
.ib-text{flex:1;min-width:0;}
.ib-title{font-size:.9rem;font-weight:800;color:var(--text);line-height:1.25;}
.ib-sub{font-size:.72rem;color:var(--text3);margin-top:.1rem;}
.ib-btns{display:flex;gap:.4rem;flex-shrink:0;}
.ib-yes{
  padding:.46rem .95rem;border-radius:9px;border:none;
  font-family:inherit;font-size:.82rem;font-weight:800;color:white;
  background:linear-gradient(135deg,#1e40af,#2563eb);
  box-shadow:0 0 12px rgba(37,99,235,.35);cursor:pointer;
  transition:all .15s;white-space:nowrap;
}
.ib-yes:hover{transform:translateY(-1px);box-shadow:0 0 20px rgba(37,99,235,.5);}
.ib-no{
  padding:.46rem .7rem;border-radius:9px;background:none;
  border:1px solid var(--border);font-family:inherit;
  font-size:.82rem;font-weight:700;color:var(--text3);
  cursor:pointer;transition:all .15s;white-space:nowrap;
}
.ib-no:hover{color:var(--text2);border-color:var(--border2);}
`;

// ═══════════════════════════════════════════════════════════════════════
// 🤖 AGENT 2 — LOGO SVG (speech bubble, no flag)
// ═══════════════════════════════════════════════════════════════════════
const LogoSVG = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7C5 5.34 6.34 4 8 4H28C29.66 4 31 5.34 31 7V21C31 22.66 29.66 24 28 24H14L8 30V24H8C6.34 24 5 22.66 5 21V7Z" fill="white" opacity="0.95"/>
    <rect x="10" y="10" width="16" height="2.5" rx="1.25" fill="#1e40af" opacity="0.55"/>
    <rect x="10" y="15" width="12" height="2.5" rx="1.25" fill="#1e40af" opacity="0.5"/>
    <rect x="10" y="20" width="14" height="2.5" rx="1.25" fill="#1e40af" opacity="0.38"/>
  </svg>
);

function catColor(cat){ return cat === "Work & Business" ? "#3b82f6" : "#0ea5e9"; }

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [theme, setTheme] = useState(() => loadTheme());
  const [screen, setScreen] = useState("home");
  const [gameMode, setGameMode] = useState("collocations");
  const [showQuit, setShowQuit] = useState(false);
  const [catF, setCatF] = useState("All");
  const [lvF, setLvF] = useState("All");

  // Colloc state
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const inputRef = useRef();

  // Prep state
  const [prepDeck, setPrepDeck] = useState([]);
  const [prepIdx, setPrepIdx] = useState(0);
  const [prepSelected, setPrepSelected] = useState(null);
  const [prepHistory, setPrepHistory] = useState([]);
  // Agent 1 fix: separate "showNext" so we can display explanation before auto-advancing
  const [showPrepNext, setShowPrepNext] = useState(false);

  // Phrasal Verbs state (reuses same fill-in-blank engine as collocations)
  const [pvDeck, setPvDeck] = useState([]);
  const [pvIdx, setPvIdx] = useState(0);
  const [pvInput, setPvInput] = useState("");
  const [pvResult, setPvResult] = useState(null);
  const [pvHistory, setPvHistory] = useState([]);
  const pvInputRef = useRef();

  // Saved decks for "replay same session"
  const lastCollocDeckRef = useRef([]);
  const lastPvDeckRef     = useRef([]);
  const lastPrepDeckRef   = useRef([]);

  // PWA install banner
  const [showInstall, setShowInstall] = useState(false);
  useEffect(() => {
    // Already waiting (set before React mounted)
    if (window.__pwaPrompt) setShowInstall(true);
    const handler = () => setShowInstall(true);
    window.addEventListener('pwaPromptReady', handler);
    return () => window.removeEventListener('pwaPromptReady', handler);
  }, []);

  async function triggerInstall() {
    const prompt = window.__pwaPrompt;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    // Whether they accept or dismiss, hide our banner
    setShowInstall(false);
    window.__pwaPrompt = null;
  }

  // Persistence
  const [sessions, setSessions] = useState(() => loadSessions());
  const [wrongItems, setWrongItems] = useState(() => loadWrong());
  const sessionIdRef = useRef(Date.now());

  // Theme sync
  const applyTheme = (t) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(SK_THEME, t); } catch {}
  };
  // Init theme
  useState(() => {
    document.documentElement.setAttribute("data-theme", theme);
  });

  const filtered = DB.filter(c =>
    (catF === "All" || c.cat === catF) &&
    (lvF  === "All" || c.lv  === lvF)
  );

  const recentSessionIds = sessions.slice(-3).map(s => s.id);
  const recentWrong = wrongItems.filter(w => recentSessionIds.includes(w.sessionId));

  // Start colloc
  function startColloc() {
    if (!filtered.length) return;
    sessionIdRef.current = Date.now();
    const pool = shuffle(filtered).slice(0, Math.min(ROUND, filtered.length));
    lastCollocDeckRef.current = pool;
    setDeck(pool); setIdx(0); setInput(""); setResult(null); setHistory([]);
    setScreen("quiz");
    setTimeout(() => inputRef.current?.focus(), 120);
  }
  function replayColloc() {
    if (!lastCollocDeckRef.current.length) return;
    sessionIdRef.current = Date.now();
    setDeck(lastCollocDeckRef.current); setIdx(0); setInput(""); setResult(null); setHistory([]);
    setScreen("quiz");
    setTimeout(() => inputRef.current?.focus(), 120);
  }

  // Start preps
  function startPreps() {
    sessionIdRef.current = Date.now();
    const pool = shuffle(PREPS).slice(0, 5).map(q => ({ ...q, opts: shuffle(q.opts) }));
    lastPrepDeckRef.current = pool;
    setPrepDeck(pool); setPrepIdx(0); setPrepSelected(null); setPrepHistory([]); setShowPrepNext(false);
    setScreen("preps");
  }
  function replayPreps() {
    if (!lastPrepDeckRef.current.length) return;
    sessionIdRef.current = Date.now();
    setPrepDeck(lastPrepDeckRef.current); setPrepIdx(0); setPrepSelected(null); setPrepHistory([]); setShowPrepNext(false);
    setScreen("preps");
  }

  // Start phrasal verbs (same engine as collocations, filtered by cat/lv)
  function startPv() {
    const pvFiltered = PV.filter(c =>
      (catF === "All" || c.cat === catF) &&
      (lvF  === "All" || c.lv  === lvF)
    );
    if (!pvFiltered.length) return;
    sessionIdRef.current = Date.now();
    const pool = shuffle(pvFiltered).slice(0, Math.min(ROUND, pvFiltered.length));
    lastPvDeckRef.current = pool;
    setPvDeck(pool); setPvIdx(0); setPvInput(""); setPvResult(null); setPvHistory([]);
    setScreen("pvQuiz");
    setTimeout(() => pvInputRef.current?.focus(), 120);
  }
  function replayPv() {
    if (!lastPvDeckRef.current.length) return;
    sessionIdRef.current = Date.now();
    setPvDeck(lastPvDeckRef.current); setPvIdx(0); setPvInput(""); setPvResult(null); setPvHistory([]);
    setScreen("pvQuiz");
    setTimeout(() => pvInputRef.current?.focus(), 120);
  }

  function handlePvSubmit() {
    if (pvResult) { advancePv(); return; }
    if (!pvInput.trim()) return;
    const card = pvDeck[pvIdx];
    const status = matchScore(pvInput, card.colloc_en);
    setPvResult({ status });
    const newEntry = { card, status, given: pvInput };
    const newHistory = [...pvHistory, newEntry];
    setPvHistory(newHistory);
    if (status === "wrong") {
      const w = { id: card.id + 20000, type: "pv", it: card.colloc_it, en: card.colloc_en, given: pvInput, sessionId: sessionIdRef.current, ts: Date.now() };
      const upd = [...wrongItems, w];
      setWrongItems(upd); saveWrong(upd);
    }
  }

  function advancePv() {
    const ni = pvIdx + 1;
    if (ni >= pvDeck.length) {
      finishPv([...pvHistory]);
    } else {
      setPvIdx(ni); setPvInput(""); setPvResult(null);
      setTimeout(() => pvInputRef.current?.focus(), 80);
    }
  }

  function finishPv(finalHistory) {
    const correct = finalHistory.filter(h => h.status === "exact").length;
    const acc = Math.round((correct / Math.max(finalHistory.length, 1)) * 100);
    const newSess = { id: sessionIdRef.current, date: new Date().toLocaleDateString("it-IT"), mode: "Phrasal Verbs", total: finalHistory.length, correct, acc };
    const upd = [...sessions, newSess].slice(-20);
    setSessions(upd); saveSessions(upd);
    setScreen("pvResults");
  }

  // Colloc submit
  function handleSubmit() {
    if (result) { advance(); return; }
    if (!input.trim()) return;
    const card = deck[idx];
    const status = matchScore(input, card.colloc_en);
    setResult({ status });
    const newEntry = { card, status, given: input };
    setHistory(h => [...h, newEntry]);
    if (status === "wrong") {
      const w = { id: card.id, type: "colloc", it: card.colloc_it, en: card.colloc_en, given: input, sessionId: sessionIdRef.current, ts: Date.now() };
      const upd = [...wrongItems, w];
      setWrongItems(upd); saveWrong(upd);
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
    const newSess = { id: sessionIdRef.current, date: new Date().toLocaleDateString("it-IT"), mode: "Collocations", total: finalHistory.length, correct, acc };
    const upd = [...sessions, newSess].slice(-20);
    setSessions(upd); saveSessions(upd);
    setScreen("results");
  }

  // Prep answer — Agent 1 fix: NO auto-advance; show explanation + Next button
  function handlePrepAnswer(opt) {
    if (prepSelected) return;
    const q = prepDeck[prepIdx];
    const correct = opt === q.a;
    setPrepSelected(opt);
    setShowPrepNext(true);
    const entry = { q, selected: opt, correct };
    const newHistory = [...prepHistory, entry];
    setPrepHistory(newHistory);
    if (!correct) {
      const w = { id: q.id + 10000, type: "prep", it: q.s, en: q.a, given: opt, sessionId: sessionIdRef.current, ts: Date.now() };
      const upd = [...wrongItems, w];
      setWrongItems(upd); saveWrong(upd);
    }
  }

  // Agent 1 fix: manual advance for preps
  function advancePrep() {
    const ni = prepIdx + 1;
    if (ni >= prepDeck.length) {
      const correct2 = prepHistory.filter(h => h.correct).length;
      const acc2 = Math.round((correct2 / Math.max(prepHistory.length, 1)) * 100);
      const newSess = { id: sessionIdRef.current, date: new Date().toLocaleDateString("it-IT"), mode: "Preposizioni", total: prepHistory.length, correct: correct2, acc: acc2 };
      const upd = [...sessions, newSess].slice(-20);
      setSessions(upd); saveSessions(upd);
      setScreen("prepResults");
    } else {
      setPrepIdx(ni);
      setPrepSelected(null);
      setShowPrepNext(false);
    }
  }

  function quitGame() { setShowQuit(false); setScreen("home"); }

  const card = deck[idx];
  const catC = catColor(card?.cat || "Work & Business");
  const progress = deck.length ? (idx / deck.length) * 100 : 0;
  const prepCard = prepDeck[prepIdx];
  const prepProg = prepDeck.length ? (prepIdx / prepDeck.length) * 100 : 0;

  const avgAcc = sessions.length ? Math.round(sessions.reduce((a,b) => a+b.acc, 0) / sessions.length) : 0;
  const bestAcc = sessions.length ? Math.max(...sessions.map(s => s.acc)) : 0;
  const chartData = sessions.map((s, i) => ({ name: `S${i+1}`, acc: s.acc }));

  const rm = (() => {
    const pct = history.length ? history.filter(h => h.status !== "wrong").length / history.length : 0;
    if (pct >= 0.9) return { emoji:"🏆", title:"Eccezionale!", sub:"Padronanza quasi assoluta." };
    if (pct >= 0.7) return { emoji:"🎯", title:"Ottimo lavoro!", sub:"Sei sulla strada giusta!" };
    if (pct >= 0.5) return { emoji:"💪", title:"Buon tentativo!", sub:"Riprova per migliorare." };
    return { emoji:"📚", title:"Continua a studiare!", sub:"La pratica fa la differenza." };
  })();

  const prepCorrect = prepHistory.filter(h => h.correct).length;
  const prepAcc = Math.round((prepCorrect / Math.max(prepHistory.length, 1)) * 100);
  const prm = prepAcc >= 80 ? {emoji:"🏆",title:"Ottimo!"} : prepAcc >= 60 ? {emoji:"🎯",title:"Bene!"} : {emoji:"📚",title:"Continua a esercitarti!"};

  const CT = ({active, payload, label}) => !active || !payload?.length ? null : (
    <div className="ctt"><div className="ctt-l">Sessione {label}</div><div className="ctt-v">{payload[0].value}%</div></div>
  );

  const inGame = screen === "quiz" || screen === "preps" || screen === "pvQuiz";

  return (
    <>
      <style>{CSS}</style>

      {showQuit && (
        <div className="overlay" onClick={() => setShowQuit(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>⚠️ Abbandonare la sessione?</h3>
            <p>Se esci ora, il progresso della sessione corrente non verrà salvato nelle statistiche.</p>
            <div className="modal-btns">
              <button className="m-cancel" onClick={() => setShowQuit(false)}>Continua</button>
              <button className="m-quit" onClick={quitGame}>Esci</button>
            </div>
          </div>
        </div>
      )}

      <div className="app" data-theme={theme}>

        {/* NAVBAR */}
        <nav className="navbar">
          {/* Row 1: logo + theme */}
          <div className="navbar-top">
            <div className="logo" onClick={() => inGame ? setShowQuit(true) : setScreen("home")}>
              <div className="logo-icon"><LogoSVG /></div>
              <div className="logo-text">
                <div className="logo-name">PhraseUp!</div>
                <div className="logo-tag">English Trainer</div>
              </div>
            </div>
            <div className="nav-right">
              {inGame && (
                <button className="nav-btn danger" onClick={() => setShowQuit(true)}>✕ Esci</button>
              )}
              <button className="theme-btn" onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
          {/* Row 2: nav links (home only) */}
          {!inGame && (
            <div className="navbar-links">
              <button className={`nav-link-btn${screen==="home"?" active":""}`} onClick={() => setScreen("home")}>
                <span className="nav-link-icon">🏠</span>Home
              </button>
              <button className={`nav-link-btn${screen==="ripasso"?" active":""}`} onClick={() => setScreen("ripasso")}>
                <span className="nav-link-icon">📋</span>
                Ripasso{recentWrong.length > 0 ? ` (${recentWrong.length})` : ""}
              </button>
              <button className={`nav-link-btn${screen==="stats"?" active":""}`} onClick={() => setScreen("stats")}>
                <span className="nav-link-icon">📊</span>Stats
              </button>
              <button className={`nav-link-btn${screen==="info"?" active":""}`} onClick={() => setScreen("info")}>
                <span className="nav-link-icon">ℹ️</span>Info
              </button>
            </div>
          )}
        </nav>

        {/* ══ HOME ══ */}
        {screen === "home" && (
          <div className="screen">
            <div className="mode-grid mode-grid-3">
              <button className={`mode-card${gameMode==="collocations"?" active":""}`} onClick={() => setGameMode("collocations")}>
                <div className="mc-icon">📝</div>
                <div className="mc-title">Collocations</div>
              </button>
              <button className={`mode-card${gameMode==="pv"?" active":""}`} onClick={() => setGameMode("pv")}>
                <div className="mc-icon">🚀</div>
                <div className="mc-title">Phrasal Verbs</div>
              </button>
              <button className={`mode-card${gameMode==="preps"?" active":""}`} onClick={() => setGameMode("preps")}>
                <div className="mc-icon">🔗</div>
                <div className="mc-title">Preposizioni</div>
              </button>
            </div>
            <div className="mode-desc">
              {gameMode==="collocations" && "Completa la frase con la combinazione di parole giusta usata dai madrelingua."}
              {gameMode==="pv" && "Completa la frase con il phrasal verb corretto nel contesto dato."}
              {gameMode==="preps" && "Scegli la preposizione corretta e memorizza lo schema grammaticale."}
            </div>

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

            {gameMode === "pv" && (
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
                    <strong>{PV.filter(c=>(catF==="All"||c.cat===catF)&&(lvF==="All"||c.lv===lvF)).length} frasi disponibili</strong>
                    {Math.min(ROUND, PV.filter(c=>(catF==="All"||c.cat===catF)&&(lvF==="All"||c.lv===lvF)).length)} domande per sessione
                  </div>
                  <button className="start-btn"
                    onClick={startPv}
                    disabled={!PV.filter(c=>(catF==="All"||c.cat===catF)&&(lvF==="All"||c.lv===lvF)).length}
                  >Inizia ▶</button>
                </div>
              </>
            )}

            {gameMode === "preps" && (
              <div className="start-card">
                <div className="start-info">
                  <strong>{PREPS.length} esercizi disponibili</strong>
                  5 domande per sessione
                </div>
                <button className="start-btn" onClick={startPreps}>Inizia ▶</button>
              </div>
            )}
          </div>
        )}

        {/* ══ COLLOC QUIZ — fill-in-the-blank ══ */}
        {screen === "quiz" && card && (() => {
          // Build the sentence with blank / filled answer
          const lower = card.en.toLowerCase();
          const lc    = card.colloc_en.toLowerCase();
          const pos   = lower.indexOf(lc);
          const before = pos >= 0 ? card.en.slice(0, pos) : card.en;
          const after  = pos >= 0 ? card.en.slice(pos + card.colloc_en.length) : "";
          const blankText = result
            ? (result.status === "wrong" ? card.colloc_en : (input || card.colloc_en))
            : "___________";
          return (
            <div className="screen">
              <div className="quiz-header">
                <div className="prog-track"><div className="prog-fill" style={{width:`${progress}%`}}/></div>
                <div className="q-counter">{idx+1} / {deck.length}</div>
              </div>
              <div className="qcard" style={{"--cat-color": catC}}>
                <div className="qcard-meta">
                  <span className="cat-pill" style={{color:catC,borderColor:catC+"66"}}>{card.cat}</span>
                  <span className="lv-pill">{card.lv}</span>
                </div>
                {/* Italian context (greyed out, for reference) */}
                <div className="q-it-context">🇮🇹 {card.it}</div>
                {/* English sentence with blank */}
                <div className="q-label">Completa la frase in inglese</div>
                <div className="sentence-en">
                  {pos >= 0 ? (
                    <>
                      {before}
                      <span className={`colloc-blank${result ? " "+result.status : ""}`}>{blankText}</span>
                      {after}
                    </>
                  ) : card.en}
                </div>
                {/* Italian hint for the collocation */}
                {!result && (
                  <div className="hint-box">
                    <span className="hint-label">💡 Suggerimento</span>
                    <span className="hint-text">{card.colloc_it}</span>
                  </div>
                )}
              </div>
              <div className="ans-wrap">
                <input
                  ref={inputRef}
                  className={`ans-input${result?" "+result.status:""}`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && handleSubmit()}
                  placeholder={`Traduci: "${card.colloc_it}"…`}
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
                    {result.status !== "exact" && (
                      <div className="fb-ans">Risposta corretta: <strong>{card.colloc_en}</strong></div>
                    )}
                  </div>
                </div>
              )}
              <button
                className={`action-btn ${result?"next-q":"check"}`}
                onClick={handleSubmit}
                disabled={!result && !input.trim()}
              >
                {result ? (idx+1 >= deck.length ? "Vedi risultati →" : "Prossima →") : "Controlla"}
              </button>
            </div>
          );
        })()}


        {/* ══ PHRASAL VERBS QUIZ — fill-in-the-blank (same engine as collocations) ══ */}
        {screen === "pvQuiz" && pvDeck[pvIdx] && (() => {
          const pvCard = pvDeck[pvIdx];
          const pvCatC = catColor(pvCard.cat);
          const pvProg = pvDeck.length ? (pvIdx / pvDeck.length) * 100 : 0;
          const lower  = pvCard.en.toLowerCase();
          const lc     = pvCard.colloc_en.toLowerCase();
          const pos    = lower.indexOf(lc);
          const before = pos >= 0 ? pvCard.en.slice(0, pos) : pvCard.en;
          const after  = pos >= 0 ? pvCard.en.slice(pos + pvCard.colloc_en.length) : "";
          const blankText = pvResult
            ? (pvResult.status === "wrong" ? pvCard.colloc_en : (pvInput || pvCard.colloc_en))
            : "___________";
          return (
            <div className="screen">
              <div className="quiz-header">
                <div className="prog-track"><div className="prog-fill" style={{width:`${pvProg}%`}}/></div>
                <div className="q-counter">{pvIdx+1} / {pvDeck.length}</div>
              </div>
              <div className="qcard" style={{"--cat-color": pvCatC}}>
                <div className="qcard-meta">
                  <span className="cat-pill" style={{color:pvCatC,borderColor:pvCatC+"66"}}>{pvCard.cat}</span>
                  <span className="lv-pill">{pvCard.lv}</span>
                  <span className="lv-pill" style={{color:"#a78bfa",background:"rgba(167,139,250,.1)"}}>Phrasal Verb</span>
                </div>
                <div className="q-it-context">🇮🇹 {pvCard.it}</div>
                <div className="q-label">Completa con il phrasal verb</div>
                <div className="sentence-en">
                  {pos >= 0 ? (
                    <>
                      {before}
                      <span className={`colloc-blank${pvResult ? " "+pvResult.status : ""}`}>{blankText}</span>
                      {after}
                    </>
                  ) : pvCard.en}
                </div>
                {!pvResult && (
                  <div className="hint-box">
                    <span className="hint-label">💡 Suggerimento</span>
                    <span className="hint-text">{pvCard.colloc_it}</span>
                  </div>
                )}
              </div>
              <div className="ans-wrap">
                <input
                  ref={pvInputRef}
                  className={`ans-input${pvResult?" "+pvResult.status:""}`}
                  value={pvInput}
                  onChange={e => setPvInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && handlePvSubmit()}
                  placeholder={`Traduci: "${pvCard.colloc_it}"…`}
                  disabled={!!pvResult}
                  autoComplete="off" autoCorrect="off" spellCheck="false"
                />
              </div>
              {pvResult && (
                <div className={`feedback ${pvResult.status}`}>
                  <div className="fb-icon">{pvResult.status==="exact"?"✅":pvResult.status==="close"?"🟡":pvResult.status==="partial"?"🟠":"❌"}</div>
                  <div className="fb-content">
                    <div className="fb-title">
                      {pvResult.status==="exact"?"Perfetto!":pvResult.status==="close"?"Quasi perfetto!":pvResult.status==="partial"?"Parzialmente corretto":"Non corretto"}
                    </div>
                    {pvResult.status !== "exact" && (
                      <div className="fb-ans">Risposta corretta: <strong>{pvCard.colloc_en}</strong></div>
                    )}
                  </div>
                </div>
              )}
              <button
                className={`action-btn ${pvResult?"next-q":"check"}`}
                onClick={handlePvSubmit}
                disabled={!pvResult && !pvInput.trim()}
              >
                {pvResult ? (pvIdx+1 >= pvDeck.length ? "Vedi risultati →" : "Prossima →") : "Controlla"}
              </button>
            </div>
          );
        })()}

        {/* ══ PREPS QUIZ ══ */}
        {screen === "preps" && prepCard && (
          <div className="screen">
            <div className="quiz-header">
              <div className="prog-track"><div className="prog-fill" style={{width:`${prepProg}%`}}/></div>
              <div className="q-counter">{prepIdx+1} / {prepDeck.length}</div>
            </div>
            <div className="qcard">
              <div className="q-label">Scegli la preposizione corretta</div>
              <div className="prep-q-text">
                {prepCard.s.split("___").map((part, i) => (
                  <span key={i}>
                    {part}
                    {i === 0 && (
                      <span className={`prep-blank${prepSelected ? (prepSelected===prepCard.a?" correct":" wrong") : ""}`}>
                        {prepSelected ? prepSelected : "___"}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              {/* Agent 1 fix: key includes prepIdx to force DOM re-creation between questions → no persistent focus/highlight */}
              <div className="prep-opts">
                {prepCard.opts.map(opt => {
                  let cls = "";
                  if (prepSelected) {
                    if (opt === prepCard.a) cls = "correct";
                    else if (opt === prepSelected) cls = "wrong-sel";
                  }
                  return (
                    <button
                      key={`${prepIdx}-${opt}`}
                      className={`prep-opt${cls?" "+cls:""}`}
                      onClick={() => handlePrepAnswer(opt)}
                      disabled={!!prepSelected}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {/* Agent 1: show explanation after answer */}
              {prepSelected && (
                <div className="prep-exp">
                  <div className="prep-exp-label">💡 Perché questa preposizione?</div>
                  <div className="prep-exp-text">{prepCard.exp}</div>
                </div>
              )}
            </div>
            {showPrepNext && (
              <button className="action-btn next-q" onClick={advancePrep}>
                {prepIdx+1 >= prepDeck.length ? "Vedi risultati →" : "Prossima →"}
              </button>
            )}
          </div>
        )}

        {/* ══ COLLOC RESULTS ══ */}
        {screen === "results" && (
          <div className="screen">
            <div className="result-banner">
              <div className="result-top">
                <div className="result-emoji">{rm.emoji}</div>
                <div className="result-title">{rm.title}</div>
                <div className="result-sub">{rm.sub}</div>
              </div>
              <div className="result-bar"/>
              <div className="stat-grid">
                {[
                  [history.filter(h=>h.status==="exact").length+"/"+history.length,"Corrette"],
                  [Math.round(history.filter(h=>h.status!=="wrong").length/Math.max(history.length,1)*100)+"%","Precisione"],
                  [history.filter(h=>h.status==="wrong").length,"Errori"],
                ].map(([v,l],i) => (
                  <div key={i} className="stat-box">
                    <div className="stat-val" style={{color:["var(--blue2)","var(--green)","var(--wrong-c)"][i]}}>{v}</div>
                    <div className="stat-lbl">{l}</div>
                  </div>
                ))}
              </div>
              <div className="review-list">
                <div className="review-head">Riepilogo risposte</div>
                {history.map((h,i) => (
                  <div key={i} className="ri">
                    <div className="ri-dot" style={{background:h.status==="exact"?"var(--correct)":h.status==="wrong"?"var(--wrong-c)":"var(--orange)"}}/>
                    <div>
                      <div className="ri-it">{h.card.it}</div>
                      <div className="ri-en">{h.card.colloc_en}</div>
                      {h.status!=="exact" && <div className="ri-given">Hai scritto: {h.given}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="btn-row">
                <button className="btn-sec" onClick={() => setScreen("home")}>← Home</button>
                <button className="btn-sec" onClick={startColloc}>🔀 Nuova</button>
                <button className="btn-pri" onClick={replayColloc}>🔄 Rigioca</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ PREP RESULTS ══ */}
        {screen === "prepResults" && (
          <div className="screen">
            <div className="result-banner">
              <div className="result-top">
                <div className="result-emoji">{prm.emoji}</div>
                <div className="result-title">{prm.title}</div>
                <div className="result-sub">Corrette: {prepCorrect}/{prepHistory.length} · Precisione: {prepAcc}%</div>
              </div>
              <div className="result-bar"/>
              <div className="review-list">
                <div className="review-head">Riepilogo</div>
                {prepHistory.map((h,i) => (
                  <div key={i} className="ri">
                    <div className="ri-dot" style={{background:h.correct?"var(--correct)":"var(--wrong-c)"}}/>
                    <div>
                      <div className="ri-it">{h.q.s.replace("___",`[${h.q.a}]`)}</div>
                      {!h.correct && <div className="ri-given">Hai risposto: {h.selected} · Corretto: {h.q.a}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="btn-row">
                <button className="btn-sec" onClick={() => setScreen("home")}>← Home</button>
                <button className="btn-sec" onClick={startPreps}>🔀 Nuova</button>
                <button className="btn-pri" onClick={replayPreps}>🔄 Rigioca</button>
              </div>
            </div>
          </div>
        )}


        {/* ══ PV RESULTS ══ */}
        {screen === "pvResults" && (() => {
          const pvCorrect = pvHistory.filter(h => h.status === "exact").length;
          const pvAcc = Math.round((pvCorrect / Math.max(pvHistory.length, 1)) * 100);
          const pvrm = pvAcc >= 80 ? {emoji:"🏆",title:"Ottimo!",sub:"Padronanza eccellente dei phrasal verbs!"} :
                       pvAcc >= 60 ? {emoji:"🎯",title:"Bene!",sub:"Stai migliorando, continua così!"} :
                                     {emoji:"📚",title:"Continua a studiare!",sub:"I phrasal verbs richiedono pratica costante."};
          return (
            <div className="screen">
              <div className="result-banner">
                <div className="result-top">
                  <div className="result-emoji">{pvrm.emoji}</div>
                  <div className="result-title">{pvrm.title}</div>
                  <div className="result-sub">{pvrm.sub}</div>
                </div>
                <div className="result-bar"/>
                <div className="stat-grid">
                  {[
                    [pvCorrect+"/"+pvHistory.length,"Corrette"],
                    [pvAcc+"%","Precisione"],
                    [pvHistory.filter(h=>h.status==="wrong").length,"Errori"],
                  ].map(([v,l],i) => (
                    <div key={i} className="stat-box">
                      <div className="stat-val" style={{color:["var(--blue2)","var(--green)","var(--wrong-c)"][i]}}>{v}</div>
                      <div className="stat-lbl">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="review-list">
                  <div className="review-head">Riepilogo phrasal verbs</div>
                  {pvHistory.map((h,i) => (
                    <div key={i} className="ri">
                      <div className="ri-dot" style={{background:h.status==="exact"?"var(--correct)":h.status==="wrong"?"var(--wrong-c)":"var(--orange)"}}/>
                      <div>
                        <div className="ri-it">{h.card.it}</div>
                        <div className="ri-en">{h.card.colloc_en}</div>
                        {h.status!=="exact" && <div className="ri-given">Hai scritto: {h.given}</div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="btn-row">
                  <button className="btn-sec" onClick={() => setScreen("home")}>← Home</button>
                  <button className="btn-sec" onClick={startPv}>🔀 Nuova</button>
                  <button className="btn-pri" onClick={replayPv}>🔄 Rigioca</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ══ RIPASSO ══ */}
        {screen === "ripasso" && (
          <div className="screen">
            <h1 className="page-title">📋 Ripasso errori</h1>
            <p className="page-sub">Elementi sbagliati nelle ultime 3 sessioni.</p>
            {recentWrong.length === 0 ? (
              <div className="ripasso-empty">
                <div className="big">✨</div>
                Nessun errore nelle ultime sessioni.<br/>Complimenti, continua così!
              </div>
            ) : (
              <>
                {recentWrong.filter(w=>w.type==="colloc").length>0 && (
                  <>
                    <p className="sl">Collocations</p>
                    {recentWrong.filter(w=>w.type==="colloc").map((w,i) => (
                      <div key={i} className="ripasso-item">
                        <div className="ri-type-badge">Collocation</div>
                        <div className="ripasso-q">{w.it}</div>
                        <div className="ripasso-a">Risposta: <span>{w.en}</span></div>
                        {w.given && <div className="ri-given" style={{fontSize:".78rem",color:"var(--text3)",marginTop:".3rem"}}>Hai scritto: "{w.given}"</div>}
                      </div>
                    ))}
                  </>
                )}
                {recentWrong.filter(w=>w.type==="pv").length>0 && (
                  <>
                    <p className="sl" style={{marginTop:"1.1rem"}}>Phrasal Verbs</p>
                    {recentWrong.filter(w=>w.type==="pv").map((w,i) => (
                      <div key={i} className="ripasso-item">
                        <div className="ri-type-badge" style={{color:"#a78bfa",borderColor:"rgba(167,139,250,.3)",background:"rgba(167,139,250,.08)"}}>Phrasal Verb</div>
                        <div className="ripasso-q">{w.it}</div>
                        <div className="ripasso-a">Risposta: <span>{w.en}</span></div>
                        {w.given && <div className="ri-given" style={{fontSize:".78rem",color:"var(--text3)",marginTop:".3rem"}}>Hai scritto: "{w.given}"</div>}
                      </div>
                    ))}
                  </>
                )}
                {recentWrong.filter(w=>w.type==="prep").length>0 && (
                  <>
                    <p className="sl" style={{marginTop:"1.1rem"}}>Preposizioni</p>
                    {recentWrong.filter(w=>w.type==="prep").map((w,i) => (
                      <div key={i} className="ripasso-item">
                        <div className="ri-type-badge">Preposizione</div>
                        <div className="ripasso-q">{w.it}</div>
                        <div className="ripasso-a">Risposta corretta: <span>{w.en}</span></div>
                        {w.given && <div className="ri-given" style={{fontSize:".78rem",color:"var(--text3)",marginTop:".3rem"}}>Hai risposto: "{w.given}"</div>}
                      </div>
                    ))}
                  </>
                )}
                <div style={{marginTop:"1.2rem",display:"flex",justifyContent:"center"}}>
                  <button className="nav-btn" style={{color:"var(--wrong-c)",borderColor:"rgba(220,38,38,.3)"}}
                    onClick={() => { saveWrong([]); setWrongItems([]); }}>
                    🗑 Cancella storico errori
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ STATS ══ */}
        {screen === "stats" && (
          <div className="screen">
            <div className="stats-banner">
              <div className="stats-top">
                <h2>📊 Statistiche</h2>
                <p>Riepilogo delle tue sessioni di allenamento</p>
              </div>
              <div className="big-stats">
                {[
                  [sessions.length,"Sessioni"],
                  [avgAcc+"%","Media"],
                  [bestAcc+"%","Record"],
                  [sessions.filter(s=>s.mode==="Collocations"||s.mode==="Phrasal Verbs").length,"Fill-in"],
                ].map(([v,l],i) => (
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
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,140,210,0.08)"/>
                      <XAxis dataKey="name" tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis domain={[0,100]} tick={{fill:"var(--text3)",fontSize:11}} axisLine={false} tickLine={false}/>
                      <Tooltip content={<CT/>}/>
                      <Area type="monotone" dataKey="acc" stroke="#2563eb" strokeWidth={2.5} fill="url(#gAcc)" dot={{fill:"#2563eb",r:3,strokeWidth:0}}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="sess-list">
                  <div className="sess-head">Storico sessioni</div>
                  {[...sessions].reverse().map((s,i) => (
                    <div key={i} className="sess-row">
                      <div className="sess-n">{sessions.length-i}</div>
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
            <div style={{display:"flex",justifyContent:"center",marginTop:".5rem"}}>
              <button className="nav-btn" onClick={() => setScreen("home")}>← Home</button>
            </div>
          </div>
        )}

        {/* ══ INFO ══ */}
        {screen === "info" && (
          <div className="screen">
            <h1 className="page-title">Info & Disclaimer</h1>
            <div className="info-card">
              <h3>Cos'è PhraseUp!?</h3>
              <p>PhraseUp! ti aiuta a migliorare l'inglese attraverso le <strong>collocations</strong>, i <strong>phrasal verbs</strong> e le <strong>preposizioni</strong> — combinazioni e strutture usate dai madrelingua nei contesti reali.</p>
              <p>Ogni sessione è breve: <strong>5 domande</strong>. Al termine puoi ripassare gli errori e scegliere di <strong>rigiocare le stesse domande</strong> (🔄 Rigioca) oppure avviarne una nuova (🔀 Nuova). La sezione <strong>Ripasso</strong> raccoglie gli errori delle ultime 3 sessioni.</p>
            </div>
            <div className="info-card">
              <h3>Valutazione collocations e phrasal verbs</h3>
              <p>Il sistema accetta risposte parzialmente corrette: <strong>esatta</strong> (parola per parola), <strong>vicina</strong> (≥80% delle parole giuste), <strong>parziale</strong> (≥60%). Solo le risposte molto distanti vengono considerate errate.</p>
            </div>
            <div className="info-card disc">
              <h3>⚖️ Disclaimer</h3>
              <p>App educativa a scopo didattico. Non costituisce un corso certificato — per certificazioni ufficiali (IELTS, TOEFL, Cambridge) affidati a enti accreditati.</p>
              <p>I dati (sessioni, errori) sono salvati solo sul tuo dispositivo e non vengono trasmessi ad alcun server.</p>
            </div>
            <div className="info-card" style={{textAlign:"center"}}>
              <div className="version">PhraseUp! v5.0 · {DB.length} collocations · {PV.length} phrasal verbs · {PREPS.length} preposizioni</div>
            </div>
            <div style={{display:"flex",justifyContent:"center",marginTop:".5rem",marginBottom:"1rem"}}>
              <button className="nav-btn" onClick={() => setScreen("home")}>← Home</button>
            </div>
          </div>
        )}

        {/* ══ PWA INSTALL BANNER ══ */}
        {showInstall && (
          <div className="install-banner">
            <div className="ib-icon"><LogoSVG /></div>
            <div className="ib-text">
              <div className="ib-title">Installa PhraseUp!</div>
              <div className="ib-sub">Accesso rapido dalla home, funziona offline</div>
            </div>
            <div className="ib-btns">
              <button className="ib-no" onClick={() => setShowInstall(false)}>Ora no</button>
              <button className="ib-yes" onClick={triggerInstall}>Installa ↓</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
