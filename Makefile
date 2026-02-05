.PHONY: install-ai install-frontend run-ai run-frontend

install-ai:
	cd ai && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

run-ai:
	python -m uvicorn ai.main:app --reload --host 0.0.0.0 --port 8000

run-frontend:
	cd frontend && npm run dev
