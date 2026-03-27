import { fileURLToPath } from "node:url";
import path from "node:path";

const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverPath = path.join(cwd, "src/server.mjs");

process.stdout.write(
  `[mcp_servers.apple_plugin]\ncommand = "node"\nargs = ["${serverPath}"]\ncwd = "${cwd}"\n`,
);
