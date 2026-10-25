#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"

audit_binary="${GITLEAKS_BIN:-}"
if [[ -z "$audit_binary" ]] && command -v gitleaks >/dev/null 2>&1; then
  audit_binary="$(command -v gitleaks)"
fi
if [[ -z "$audit_binary" ]]; then
  if [[ "$(uname -s)" != Linux || "$(uname -m)" != x86_64 ]]; then
    echo 'Install Gitleaks or set GITLEAKS_BIN to its path.' >&2
    exit 1
  fi
  audit_tmp="$(mktemp -d)"
  trap 'rm -rf "$audit_tmp"' EXIT
  curl --fail --silent --show-error --location --output "$audit_tmp/gitleaks.tar.gz" \
    'https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz'
  tar -xzf "$audit_tmp/gitleaks.tar.gz" -C "$audit_tmp" gitleaks
  # Binary from the official release, whose archive checksum was verified during review.
  printf '%s  %s\n' '88f91962aa2f93ac6ab281d553b9e125f5197bbbce38f9f2437f7299c32e5509' "$audit_tmp/gitleaks" | sha256sum --check --status
  audit_binary="$audit_tmp/gitleaks"
fi

"$audit_binary" git --redact=100 --no-banner --ignore-gitleaks-allow \
  --log-opts='--all --full-history' --max-decode-depth=5 --max-archive-depth=3 .
"$audit_binary" git --redact=100 --no-banner --ignore-gitleaks-allow \
  --pre-commit --staged --max-decode-depth=5 --max-archive-depth=3 .
if [[ -d dist ]]; then
  "$audit_binary" dir --redact=100 --no-banner --ignore-gitleaks-allow \
    --max-decode-depth=5 --max-archive-depth=3 dist
fi
