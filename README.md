# Syntecxhub Notes App — Project 3

A notes application built with React. Add, edit, and delete notes, with data
persisted in `localStorage` so it survives page refreshes.

## Requirements covered
- `useState` manages the list of notes
- `useRef` focuses the title input on load and when editing a note
- `useEffect` syncs notes to `localStorage` on every change
- Add / edit / delete notes
- Clean, responsive card-based UI

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

Output goes to the `dist/` folder — deploy it to GitHub Pages, Vercel, Netlify,
or any static host.
