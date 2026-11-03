#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r backend/requirements.txt -r backend/requirements-seismic.txt pytest httpx
printf '%s\n' 'STRATAX source workspace prepared. No cloud services or scientific jobs started.'
