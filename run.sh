#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

case "${1:-run}" in
  install-ai)
    python -m pip install -r ai/requirements.txt
    ;;
  install-frontend)
    cd frontend && npm install
    ;;
  run-ai)
    python -c "import uvicorn" 2>/dev/null || python -m pip install -r ai/requirements.txt
    python -m uvicorn ai.main:app --reload --host 0.0.0.0 --port 8000
    ;;
  run-frontend)
    [ -d frontend/node_modules ] || (cd frontend && npm install)
    cd frontend && npx next dev
    ;;
  install)
    python -m pip install -r ai/requirements.txt
    cd frontend && npm install
    ;;
  run)
    python -c "import uvicorn" 2>/dev/null || python -m pip install -r ai/requirements.txt
    [ -d frontend/node_modules ] || (cd frontend && npm install)
    python -m uvicorn ai.main:app --reload --host 0.0.0.0 --port 8000 &
    cd frontend && npx next dev
    ;;
  *)
    echo "Usage: ./run.sh {run|install|install-ai|install-frontend|run-ai|run-frontend}"
    exit 1
    ;;
esac
