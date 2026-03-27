import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { runDoctor } from "./lib/doctor.mjs";
import {
  draftMail,
  mailAction,
  mailBody,
  openMail,
  recentMail,
  searchMail,
  unreadMail,
} from "./lib/mail.mjs";
import {
  createNote,
  deleteNote,
  listNotes,
  searchNotes,
  updateNote,
} from "./lib/notes.mjs";
import {
  addReminder,
  authorizeReminders,
  completeReminder,
  deleteReminder,
  editReminder,
  listReminderLists,
  showReminders,
} from "./lib/reminders.mjs";

function toContent(value) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

function withDeleteConfirmation(confirm, label) {
  if (!confirm) {
    throw new Error(`${label} requires explicit confirm=true.`);
  }
}

const server = new McpServer({
  name: "apple-plugin",
  version: "0.1.0",
});

server.tool("apple_doctor", "Check local Apple CLI dependencies and permissions.", async () =>
  toContent(await runDoctor()),
);

server.tool(
  "apple_notes_list",
  "List Apple Notes, optionally filtered by folder.",
  {
    folder: z.string().optional(),
    limit: z.number().int().min(1).max(200).default(50),
    includePreview: z.boolean().default(false),
  },
  async (input) => toContent(await listNotes(input)),
);

server.tool(
  "apple_notes_search",
  "Search Apple Notes by title or preview text.",
  {
    query: z.string(),
    folder: z.string().optional(),
    limit: z.number().int().min(1).max(100).optional(),
  },
  async (input) => toContent(await searchNotes(input)),
);

server.tool(
  "apple_notes_create",
  "Create a new Apple Note.",
  {
    title: z.string(),
    body: z.string().default(""),
    folder: z.string().optional(),
  },
  async (input) => toContent(await createNote(input)),
);

server.tool(
  "apple_notes_update",
  "Rename or replace the body of an Apple Note.",
  {
    note: z.string(),
    folder: z.string().optional(),
    newTitle: z.string().optional(),
    body: z.string().optional(),
  },
  async (input) => toContent(await updateNote(input)),
);

server.tool(
  "apple_notes_delete",
  "Delete an Apple Note by exact title, optionally scoped to a folder.",
  {
    note: z.string(),
    folder: z.string().optional(),
    confirm: z.boolean().default(false),
  },
  async (input) => {
    withDeleteConfirmation(input.confirm, "apple_notes_delete");
    return toContent(await deleteNote(input));
  },
);

server.tool(
  "apple_reminders_authorize",
  "Trigger the macOS Reminders permission prompt when available.",
  async () => toContent(await authorizeReminders()),
);

server.tool(
  "apple_reminders_show",
  "Show reminders by filter and optional list.",
  {
    filter: z.string().optional(),
    list: z.string().optional(),
  },
  async (input) => toContent(await showReminders(input)),
);

server.tool(
  "apple_reminders_lists",
  "List reminder lists or show one list.",
  {
    name: z.string().optional(),
  },
  async (input) => toContent(await listReminderLists(input)),
);

server.tool(
  "apple_reminders_add",
  "Add an Apple Reminder.",
  {
    title: z.string(),
    list: z.string().optional(),
    due: z.string().optional(),
    notes: z.string().optional(),
    priority: z.enum(["none", "low", "medium", "high"]).optional(),
  },
  async (input) => toContent(await addReminder(input)),
);

server.tool(
  "apple_reminders_edit",
  "Edit an Apple Reminder by index or ID prefix.",
  {
    id: z.string(),
    title: z.string().optional(),
    list: z.string().optional(),
    due: z.string().optional(),
    notes: z.string().optional(),
    priority: z.enum(["none", "low", "medium", "high"]).optional(),
    clearDue: z.boolean().optional(),
    complete: z.boolean().optional(),
    incomplete: z.boolean().optional(),
  },
  async (input) => toContent(await editReminder(input)),
);

server.tool(
  "apple_reminders_complete",
  "Complete an Apple Reminder by index or ID prefix.",
  {
    id: z.string(),
  },
  async (input) => toContent(await completeReminder(input.id)),
);

server.tool(
  "apple_reminders_delete",
  "Delete one or more Apple Reminders.",
  {
    ids: z.array(z.string()).min(1),
    confirm: z.boolean().default(false),
  },
  async (input) => {
    withDeleteConfirmation(input.confirm, "apple_reminders_delete");
    return toContent(await deleteReminder(input));
  },
);

server.tool(
  "apple_mail_search",
  "Search Apple Mail through fruitmail.",
  {
    subject: z.string().optional(),
    sender: z.string().optional(),
    fromName: z.string().optional(),
    to: z.string().optional(),
    unread: z.boolean().optional(),
    read: z.boolean().optional(),
    days: z.number().int().min(1).max(365).optional(),
    hasAttachment: z.boolean().optional(),
    attachmentType: z.string().optional(),
  },
  async (input) => toContent(await searchMail(input)),
);

server.tool("apple_mail_unread", "List unread Apple Mail messages.", async () =>
  toContent(await unreadMail()),
);

server.tool(
  "apple_mail_recent",
  "List recent Apple Mail messages.",
  {
    days: z.number().int().min(1).max(365).default(7),
  },
  async (input) => toContent(await recentMail(input.days)),
);

server.tool(
  "apple_mail_body",
  "Get a message body by local Mail id.",
  {
    id: z.union([z.string(), z.number()]),
  },
  async (input) => toContent(await mailBody(input.id)),
);

server.tool(
  "apple_mail_open",
  "Open a message in Apple Mail by local Mail id.",
  {
    id: z.union([z.string(), z.number()]),
  },
  async (input) => toContent(await openMail(input.id)),
);

server.tool(
  "apple_mail_compose",
  "Draft or send a new Apple Mail message.",
  {
    to: z.array(z.string().email()).min(1),
    cc: z.array(z.string().email()).optional(),
    bcc: z.array(z.string().email()).optional(),
    subject: z.string(),
    body: z.string(),
    sendNow: z.boolean().default(false),
    confirmSend: z.boolean().default(false),
  },
  async (input) => {
    if (input.sendNow && !input.confirmSend) {
      throw new Error("Sending mail requires confirmSend=true.");
    }
    return toContent(await draftMail(input));
  },
);

server.tool(
  "apple_mail_action",
  "Perform an exact-message Mail action by local Mail id.",
  {
    id: z.union([z.string(), z.number()]),
    action: z.enum([
      "flag",
      "unflag",
      "read",
      "unread",
      "archive",
      "junk",
      "trash",
      "move",
      "info",
    ]),
    targetMailbox: z.string().optional(),
    confirm: z.boolean().default(false),
  },
  async (input) => {
    const risky = new Set(["archive", "junk", "trash", "move"]);
    if (risky.has(input.action) && !input.confirm) {
      throw new Error(`Mail action "${input.action}" requires confirm=true.`);
    }
    return toContent(await mailAction(input));
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
