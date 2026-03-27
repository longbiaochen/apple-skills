import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const pluginRoot = path.resolve(here, "../..");
export const repoRoot = path.resolve(pluginRoot, "..");
export const mailDraftScript = path.join(repoRoot, "apple-mail/scripts/mail_draft.sh");
export const mailActionScript = path.join(repoRoot, "apple-mail/scripts/mail_action.sh");
