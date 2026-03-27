import { spawnSync } from "node:child_process";

export function runCommand(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  return {
    command,
    args,
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

export function ensureSuccess(result, context) {
  if (result.status !== 0) {
    const stderr = result.stderr.trim();
    const stdout = result.stdout.trim();
    const detail = stderr || stdout || "unknown failure";
    throw new Error(`${context}: ${detail}`);
  }

  return result;
}

export function which(command) {
  const result = runCommand("which", [command]);
  if (result.status !== 0) {
    return null;
  }

  const value = result.stdout.trim();
  return value || null;
}

export function runAppleScript(script) {
  const result = runCommand("osascript", ["-"], { input: script });
  return ensureSuccess(result, "AppleScript failed").stdout.trim();
}
