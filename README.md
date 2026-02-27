# PhraseUp! — Guida al Deploy

## Struttura del progetto

```
phraseup/
├── index.html          ← entry point HTML
├── package.json        ← dipendenze Node
├── vite.config.js      ← configurazione Vite
├── src/
│   ├── main.jsx        ← entry React
│   └── App.jsx         ← app completa (DB + UI + logica)
└── public/
    ├── manifest.json   ← PWA manifest
    ├── icon.svg        ← favicon browser
    ├── icon-192.svg    ← icona app mobile
    ├── icon-512.svg    ← icona app mobile grande
    ├── sw.js           ← service worker (offline)
    └── _redirects      ← SPA routing Cloudflare/Netlify
```

---

## Perché JSX e non HTML?

Il file `.jsx` (JavaScript XML) è il formato usato da **React**, la libreria con cui è costruita l'app.
Il browser non lo legge direttamente — va prima **compilato** da Vite in JavaScript puro.
Il risultato della compilazione è una cartella `dist/` con file `.html`, `.js` e `.css` puri,
che qualsiasi hosting può servire normalmente.

**Il tuo errore su Cloudflare** era probabilmente perché hai caricato il file `.jsx` direttamente,
invece di configurare il build automatico. Segui i passi qui sotto e non avrai più questo problema.

---

## Deploy su Cloudflare Pages ✅ (consigliato)

### Prerequisiti
- Account GitHub: https://github.com
- Account Cloudflare: https://pages.cloudflare.com (gratuito)

### Passo 1 — Crea il repository su GitHub

1. Vai su https://github.com/new
2. Nome repo: `phraseup` (o quello che vuoi)
3. Visibilità: Private va bene
4. Clicca **Create repository**

### Passo 2 — Carica i file su GitHub

**Opzione A (drag & drop, nessuna competenza tecnica)**
1. Nella pagina del repo appena creato, clicca "uploading an existing file"
2. Trascina TUTTA la cartella `phraseup/` nell'area di upload
3. Scrivi un messaggio tipo "Initial commit" e clicca **Commit changes**

**Opzione B (terminale)**
```bash
cd phraseup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TUO-USERNAME/phraseup.git
git push -u origin main
```

### Passo 3 — Collega a Cloudflare Pages

1. Vai su https://pages.cloudflare.com
2. Clicca **Create a project** → **Connect to Git**
3. Seleziona il tuo repo `phraseup`
4. Nella schermata di configurazione:

| Campo | Valore |
|-------|--------|
| **Framework preset** | Vite |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | (lascia vuoto) |

5. Clicca **Save and Deploy**

Cloudflare installerà automaticamente le dipendenze, compilerà l'app e la pubblicherà.
Ad ogni push su GitHub, il deploy si aggiorna automaticamente.

---

## Deploy su Vercel ✅ (alternativa)

1. Vai su https://vercel.com → **New Project**
2. Importa il repo GitHub `phraseup`
3. Vercel rileva Vite automaticamente:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output: `dist`
4. Clicca **Deploy**

---

## Test locale (sviluppo)

```bash
cd phraseup
npm install       # installa React, Vite, recharts
npm run dev       # avvia server locale su http://localhost:5173
npm run build     # compila per produzione nella cartella dist/
npm run preview   # anteprima della versione compilata
```

---

## Note PWA (installazione su telefono)

L'app è configurata come **PWA (Progressive Web App)**.
Dopo il deploy, gli utenti possono installarla direttamente dal browser:
- **Android/Chrome**: banner "Aggiungi alla schermata Home" appare automaticamente
- **iOS/Safari**: tocca il pulsante Condividi → "Aggiungi a Home"

L'icona che apparirà è la speech bubble blu (`icon-192.svg`).

---

## Spazio su Cloudflare vs Netlify

Cloudflare Pages è **completamente gratuito** e senza limiti di banda.
Non avrai i problemi di spazio che hai avuto su Netlify.
