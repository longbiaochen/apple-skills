import { runCommand, which } from "./shell.mjs";
import { mailActionScript, mailDraftScript } from "./paths.mjs";

const CHECKS = [
  { name: "memo", kind: "cli" },
  { name: "remindctl", kind: "cli" },
  { name: "fruitmail", kind: "cli" },
  { name: "osascript", kind: "system" },
  { name: "sqlite3", kind: "system" },
  { name: "shortcuts", kind: "system" },
];

function checkTool(name, kind) {
  const path = which(name);
  return {
    name,
    kind,
    installed: Boolean(path),
    path,
  };
}

function checkMailScripts() {
  const draft = runCommand("bash", ["-n", mailDraftScript]);
  const action = runCommand("bash", ["-n", mailActionScript]);

  return {
    draftScriptOk: draft.status === 0,
    actionScriptOk: action.status === 0,
    draftScriptStatus: draft.status,
    actionScriptStatus: action.status,
    draftScriptError: draft.stderr.trim() || null,
    actionScriptError: action.stderr.trim() || null,
  };
}

function checkRemindersStatus() {
  const result = runCommand("remindctl", ["status"]);
  return {
    ok: result.status === 0,
    output: (result.stdout || result.stderr).trim(),
  };
}

function checkMailVersion() {
  const result = runCommand("osascript", ["-e", 'tell application "Mail" to get version']);
  return {
    ok: result.status === 0,
    output: (result.stdout || result.stderr).trim(),
  };
}

function checkNotesStatus() {
  const folderProbe = runCommand("osascript", ["-e", 'tell application "Notes" to get name of first folder']);
  const noteProbe = runCommand(
    "osascript",
    ["-e", 'tell application "Notes" to get name of first note of first folder'],
    { timeout: 4000 },
  );

  return {
    folderProbeOk: folderProbe.status === 0,
    folderProbe: (folderProbe.stdout || folderProbe.stderr).trim(),
    noteProbeOk: noteProbe.status === 0 && !noteProbe.error,
    noteProbe: noteProbe.error?.code === "ETIMEDOUT"
      ? "Timed out while reading note content or note metadata."
      : (noteProbe.stdout || noteProbe.stderr).trim(),
  };
}

export async function runDoctor() {
  return {
    generatedAt: new Date().toISOString(),
    tools: CHECKS.map((tool) => checkTool(tool.name, tool.kind)),
    reminders: checkRemindersStatus(),
    notes: checkNotesStatus(),
    mail: {
      version: checkMailVersion(),
      scripts: checkMailScripts(),
    },
  };
}
