.PHONY: help up down build restart logs logs-backend logs-frontend clean test test-backend test-frontend lint shell-backend shell-frontend

# Default target when running just `make`
help:
	@echo "=================================================================="
	@echo "KindLink: Autonomous Generosity Grid - Development Commands"
	@echo "=================================================================="
	@echo "make up             - Build & start all containers in background"
	@echo "make down           - Stop and tear down running containers"
	@echo "make build          - Force rebuild images without starting"
	@echo "make restart        - Restart all containers"
	@echo "make logs           - Stream combined logs from all services"
	@echo "make logs-backend   - Follow logs from backend container"
	@echo "make logs-frontend  - Follow logs from frontend container"
	@echo "make shell-backend  - Open interactive bash/sh inside backend"
	@echo "make shell-frontend - Open interactive sh inside frontend"
	@echo "make test           - Run backend and frontend test suites"
	@echo "make clean          - Remove unused containers, volumes & dangling images"
	@echo "=================================================================="

# Docker Orchestration
up:
	docker compose up --build -d

down:
	docker compose down

build:
	docker compose build --no-cache

restart:
	docker compose restart

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

# Interactive Shells
shell-backend:
	docker compose exec backend /bin/bash

shell-frontend:
	docker compose exec frontend /bin/sh

# Testing & Quality Assurance
test: test-backend test-frontend

test-backend:
	docker compose exec backend pytest -v

test-frontend:
	docker compose exec frontend npm run lint

# Maintenance & Cleanup
clean:
	docker compose down -v --remove-orphans
	docker system prune -f