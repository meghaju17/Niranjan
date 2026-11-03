# For You ❤️ — an apology website

A gentle, interactive love-letter website. Pure HTML, CSS and JavaScript — no installs, no build step.

## Project structure

```
for-you/
├── index.html        ← page structure (you rarely need to touch this)
├── README.md
├── css/
│   └── style.css     ← colours, fonts, animations, responsive layout
└── js/
    ├── config.js     ← ✏️ ALL the words live here — edit this one!
    ├── music.js      ← soft built-in music (no audio file needed)
    └── script.js     ← typing, flip cards, carousel, hearts, hug explosion
```

## Run it

**Easiest:** double-click `index.html`. It opens in your browser and works.

**Or with a tiny local server** (optional):

```bash
cd for-you
python3 -m http.server 8000
# then open http://localhost:8000
```

## Make it yours (js/config.js)

- `boyfriendName` – his name (shown as "For ___" on the first screen, and anywhere you write `{name}`)
- `signature` – how the letter ends ("Your girl", or your name)
- `yourName` – optional, shown in the footer
- Every message, card, letter paragraph and "reason I love you" can be reworded or extended
- **Our memories:** add items to `memories.items` and a new "Moments I Treasure" section appears automatically; leave it empty to hide it
- `typingSpeed` – make the typing slower or faster
- **Your own song:** put an mp3 in the folder (for example `audio/our-song.mp3`) and set `music.file: "audio/our-song.mp3"`

## Sharing it with him

The folder is a complete website, so you can:

1. Zip the folder and send it (he opens `index.html`), or
2. Upload the folder to a free host such as Netlify Drop, GitHub Pages or Vercel and send him the link.

## Notes

- Music only starts after he taps **Open My Heart**, and the speaker button (top right) mutes or unmutes it.
- The Google Fonts need internet to load; offline, the site falls back to similar system fonts and still looks fine.
- If someone has "reduce motion" turned on in their device settings, the animations are toned down automatically.
