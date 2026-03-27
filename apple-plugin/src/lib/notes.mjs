import { runAppleScript } from "./shell.mjs";

function escapeAppleScriptString(value = "") {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function wrapHtmlBody(body = "") {
  const escaped = body
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\n", "<br>");
  return `<div>${escaped}</div>`;
}

function parseLines(output) {
  if (!output) return [];
  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [id, name, folder, preview] = line.split("\t");
      return { id, name, folder, preview };
    });
}

function listScript() {
  return `
tell application "Notes"
  set outputLines to {}
  repeat with eachNote in notes
    set noteId to id of eachNote as text
    set noteName to name of eachNote as text
    set folderName to name of container of eachNote as text
    set noteBody to plaintext of eachNote as text
    if (length of noteBody) > 160 then
      set notePreview to text 1 thru 160 of noteBody
    else
      set notePreview to noteBody
    end if
    set end of outputLines to noteId & tab & noteName & tab & folderName & tab & notePreview
  end repeat
  return outputLines as string
end tell`;
}

function resolveUniqueNote(notes, name, folder) {
  const matches = notes.filter((note) => {
    if (folder && note.folder !== folder) return false;
    return note.name === name;
  });

  if (matches.length === 0) {
    throw new Error(`No note matched "${name}"${folder ? ` in folder "${folder}"` : ""}.`);
  }

  if (matches.length > 1) {
    throw new Error(
      `Multiple notes matched "${name}"${folder ? ` in folder "${folder}"` : ""}. Refine the target before writing.`,
    );
  }

  return matches[0];
}

export async function listNotes({ folder }) {
  const notes = parseLines(runAppleScript(listScript()));
  if (!folder) {
    return notes;
  }
  return notes.filter((note) => note.folder === folder);
}

export async function searchNotes({ query, folder, limit = 25 }) {
  const lowered = query.toLowerCase();
  const notes = await listNotes({ folder });
  return notes
    .filter((note) => {
      const haystack = `${note.name}\n${note.preview}`.toLowerCase();
      return haystack.includes(lowered);
    })
    .slice(0, limit);
}

export async function createNote({ title, body, folder }) {
  const folderClause = folder
    ? `set targetFolder to first folder whose name is "${escapeAppleScriptString(folder)}"\n  set newNote to make new note at targetFolder with properties {name:"${escapeAppleScriptString(title)}", body:"${escapeAppleScriptString(wrapHtmlBody(body))}"}`
    : `set newNote to make new note with properties {name:"${escapeAppleScriptString(title)}", body:"${escapeAppleScriptString(wrapHtmlBody(body))}"}`;

  const output = runAppleScript(`
tell application "Notes"
  ${folderClause}
  return (id of newNote as text) & tab & (name of container of newNote as text)
end tell`);

  const [id, resolvedFolder] = output.split("\t");
  return { id, title, folder: resolvedFolder };
}

export async function updateNote({ note, folder, newTitle, body }) {
  const notes = await listNotes({ folder });
  const match = resolveUniqueNote(notes, note, folder);
  const renameClause = newTitle
    ? `set name of targetNote to "${escapeAppleScriptString(newTitle)}"`
    : "";
  const bodyClause = body
    ? `set body of targetNote to "${escapeAppleScriptString(wrapHtmlBody(body))}"`
    : "";

  runAppleScript(`
tell application "Notes"
  set targetNote to first note whose id is "${escapeAppleScriptString(match.id)}"
  ${renameClause}
  ${bodyClause}
  return id of targetNote as text
end tell`);

  return {
    id: match.id,
    title: newTitle || match.name,
    folder: match.folder,
  };
}

export async function deleteNote({ note, folder }) {
  const notes = await listNotes({ folder });
  const match = resolveUniqueNote(notes, note, folder);

  runAppleScript(`
tell application "Notes"
  delete (first note whose id is "${escapeAppleScriptString(match.id)}")
end tell`);

  return { ok: true, id: match.id, title: match.name, folder: match.folder };
}
