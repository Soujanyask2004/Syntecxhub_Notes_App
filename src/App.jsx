import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "syntecxhub_notes";

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);
  const titleRef = useRef(null);

  // Persist to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Autofocus the title field on load and whenever we enter edit mode
  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, [editingId]);

  function resetComposer() {
    setTitle("");
    setBody("");
    setEditingId(null);
  }

  function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      titleRef.current.focus();
      return;
    }

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? { ...n, title: trimmedTitle, body: body.trim(), updatedAt: Date.now() }
            : n
        )
      );
    } else {
      const newNote = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        title: trimmedTitle,
        body: body.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    resetComposer();
  }

  function handleEdit(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingId === id) resetComposer();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && e.metaKey) handleSave();
    if (e.key === "Escape") resetComposer();
  }

  return (
    <div className="wrap">
      <header>
        <div className="eyebrow">Syntecxhub · Project 3</div>
        <h1>Notes</h1>
        <p>Add, edit, and delete notes. Everything is saved to your browser automatically.</p>
      </header>

      <div className="composer" onKeyDown={handleKeyDown}>
        <input
          ref={titleRef}
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write something…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="composer-footer">
          {editingId && (
            <button className="btn-ghost" onClick={resetComposer}>
              Cancel
            </button>
          )}
          <button className="btn-primary" disabled={!title.trim()} onClick={handleSave}>
            {editingId ? "Save changes" : "Add note"}
          </button>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="count">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </div>
      )}

      {notes.length === 0 ? (
        <div className="empty">
          <div className="glyph">📝</div>
          <div>No notes yet — write your first one above.</div>
        </div>
      ) : (
        <div className="grid">
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-title">{note.title}</div>
              {note.body && <div className="note-body">{note.body}</div>}
              <div className="note-meta">
                <span className="note-date">{formatDate(note.updatedAt)}</span>
                <div className="note-actions">
                  <button className="icon-btn" onClick={() => handleEdit(note)}>
                    Edit
                  </button>
                  <button className="icon-btn danger" onClick={() => handleDelete(note.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
