#!/usr/bin/env bash
set -euo pipefail

plugin_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target_dir="${HOME}/.codex/plugins/local/apple-plugin"

mkdir -p "${HOME}/.codex/plugins/local"

if [[ -e "${target_dir}" && ! -L "${target_dir}" ]]; then
  echo "Refusing to overwrite existing non-symlink plugin at ${target_dir}" >&2
  exit 1
fi

ln -sfn "${plugin_dir}" "${target_dir}"

cat <<EOF
Installed apple-plugin at:
  ${target_dir}

Codex should discover the plugin from ~/.codex/plugins/local.
If you also want a direct MCP config snippet, run:
  node "${plugin_dir}/scripts/print-codex-config.mjs"
EOF
