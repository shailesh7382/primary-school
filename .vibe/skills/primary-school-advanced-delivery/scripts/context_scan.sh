#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

modules=("container" "maths-science" "exam" "student-records")

echo "== Module Presence =="
for m in "${modules[@]}"; do
  if [ -d "${ROOT}/${m}" ]; then
    echo "[ok] ${m}"
  else
    echo "[missing] ${m}"
  fi
done

echo
echo "== Source File Snapshot =="
for m in "${modules[@]}"; do
  if [ -d "${ROOT}/${m}/src" ]; then
    echo "-- ${m}/src"
    rg --files "${ROOT}/${m}/src" | sed "s#^${ROOT}/##" | sed -n '1,80p'
  fi
done

echo
echo "== Federation Config Scan =="
rg -n "ModuleFederationPlugin|remotes|exposes|remoteEntry\\.js" \
  "${ROOT}"/{container,maths-science,exam,student-records}/webpack.config.js \
  2>/dev/null || true

echo
echo "== Cross-Cutting Signal Scan =="
rg -n "login|auth|session|token|router|navigate|fetch\\(|axios" \
  "${ROOT}"/{container,maths-science,exam,student-records}/src \
  2>/dev/null | sed -n '1,200p' || true

echo
echo "== NPM Script Summary =="
for m in "." "${modules[@]}"; do
  if [ -f "${ROOT}/${m}/package.json" ]; then
    echo "-- ${m}/package.json"
    rg -n "\"scripts\"|\"start\"|\"build\"|\"serve\"|\"check-status\"|\"start:all\"|\"build:all\"" \
      "${ROOT}/${m}/package.json" || true
  fi
done
