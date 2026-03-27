import { ensureSuccess, runCommand } from "./shell.mjs";

function parseJson(stdout, context) {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${context}: ${error.message}`);
  }
}

export async function showReminders({ filter, list }) {
  const args = ["show"];
  if (filter) args.push(filter);
  if (list) args.push("--list", list);
  args.push("--json", "--no-input");

  const result = ensureSuccess(runCommand("remindctl", args), "remindctl show failed");
  return parseJson(result.stdout, "Invalid remindctl show JSON");
}

export async function listReminderLists({ name }) {
  const args = ["list"];
  if (name) args.push(name);
  args.push("--json", "--no-input");

  const result = ensureSuccess(runCommand("remindctl", args), "remindctl list failed");
  return parseJson(result.stdout, "Invalid remindctl list JSON");
}

export async function addReminder(input) {
  const args = ["add"];
  if (input.title) args.push("--title", input.title);
  if (input.list) args.push("--list", input.list);
  if (input.due) args.push("--due", input.due);
  if (input.notes) args.push("--notes", input.notes);
  if (input.priority) args.push("--priority", input.priority);
  args.push("--json", "--no-input");

  const result = ensureSuccess(runCommand("remindctl", args), "remindctl add failed");
  return parseJson(result.stdout, "Invalid remindctl add JSON");
}

export async function editReminder(input) {
  const args = ["edit", input.id];
  if (input.title) args.push("--title", input.title);
  if (input.list) args.push("--list", input.list);
  if (input.due) args.push("--due", input.due);
  if (input.notes) args.push("--notes", input.notes);
  if (input.priority) args.push("--priority", input.priority);
  if (input.clearDue) args.push("--clear-due");
  if (input.complete) args.push("--complete");
  if (input.incomplete) args.push("--incomplete");
  args.push("--json", "--no-input");

  const result = ensureSuccess(runCommand("remindctl", args), "remindctl edit failed");
  return parseJson(result.stdout, "Invalid remindctl edit JSON");
}

export async function completeReminder(id) {
  const result = ensureSuccess(
    runCommand("remindctl", ["complete", id, "--json", "--no-input"]),
    "remindctl complete failed",
  );
  return parseJson(result.stdout, "Invalid remindctl complete JSON");
}

export async function deleteReminder({ ids }) {
  const args = ["delete", ...ids, "--force", "--json", "--no-input"];
  const result = ensureSuccess(runCommand("remindctl", args), "remindctl delete failed");
  return parseJson(result.stdout, "Invalid remindctl delete JSON");
}

export async function authorizeReminders() {
  const result = runCommand("remindctl", ["authorize", "--json", "--no-input"]);
  if (result.status !== 0) {
    return {
      ok: false,
      output: (result.stderr || result.stdout).trim(),
    };
  }

  return {
    ok: true,
    data: parseJson(result.stdout, "Invalid remindctl authorize JSON"),
  };
}
