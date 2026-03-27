import { ensureSuccess, runCommand } from "./shell.mjs";
import { mailActionScript, mailDraftScript } from "./paths.mjs";

function parseJson(stdout, fallbackContext) {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${fallbackContext}: ${error.message}`);
  }
}

function normalizeSearchArgs(input) {
  const args = ["search"];

  if (input.subject) args.push("--subject", input.subject);
  if (input.sender) args.push("--sender", input.sender);
  if (input.fromName) args.push("--from-name", input.fromName);
  if (input.to) args.push("--to", input.to);
  if (input.unread) args.push("--unread");
  if (input.read) args.push("--read");
  if (input.days) args.push("--days", String(input.days));
  if (input.hasAttachment) args.push("--has-attachment");
  if (input.attachmentType) args.push("--attachment-type", input.attachmentType);
  args.push("--json");

  return args;
}

export async function searchMail(input) {
  const result = ensureSuccess(
    runCommand("fruitmail", normalizeSearchArgs(input)),
    "fruitmail search failed",
  );
  return parseJson(result.stdout, "Invalid fruitmail search JSON");
}

export async function unreadMail() {
  const result = ensureSuccess(
    runCommand("fruitmail", ["unread", "--json"]),
    "fruitmail unread failed",
  );
  return parseJson(result.stdout, "Invalid fruitmail unread JSON");
}

export async function recentMail(days = 7) {
  const result = ensureSuccess(
    runCommand("fruitmail", ["recent", String(days), "--json"]),
    "fruitmail recent failed",
  );
  return parseJson(result.stdout, "Invalid fruitmail recent JSON");
}

export async function mailBody(id) {
  const result = ensureSuccess(
    runCommand("fruitmail", ["body", String(id), "--json"]),
    "fruitmail body failed",
  );
  return parseJson(result.stdout, "Invalid fruitmail body JSON");
}

export async function openMail(id) {
  ensureSuccess(runCommand("fruitmail", ["open", String(id)]), "fruitmail open failed");
  return { ok: true, id: String(id) };
}

export async function draftMail(input) {
  const args = [mailDraftScript];

  args.push("--to", input.to.join(","));
  if (input.cc?.length) args.push("--cc", input.cc.join(","));
  if (input.bcc?.length) args.push("--bcc", input.bcc.join(","));
  args.push("--subject", input.subject);
  args.push("--body", input.body);
  if (input.sendNow) args.push("--send");

  const result = ensureSuccess(runCommand("bash", args), "mail_draft.sh failed");
  return {
    ok: true,
    mode: input.sendNow ? "sent" : "drafted",
    output: result.stdout.trim() || result.stderr.trim() || "Mail compose flow completed.",
  };
}

export async function mailAction(input) {
  const args = [
    mailActionScript,
    "--id",
    String(input.id),
    "--action",
    input.action,
  ];

  if (input.targetMailbox) {
    args.push("--target-mailbox", input.targetMailbox);
  }

  const result = ensureSuccess(runCommand("bash", args), "mail_action.sh failed");
  return parseJson(result.stdout, "Invalid mail_action JSON");
}
