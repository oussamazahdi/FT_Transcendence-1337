CWD             := .
BACKEND			:= $(CWD)/backend
FRONTEND		:= $(CWD)/frontend
DOTENV_PATH     := $(CWD)/.env

DOCKER_COMPOSE	:= docker compose -f $(CWD)/docker-compose.yml
RMDIR           := sudo rm -fr
MKDIR           := mkdir -p

setup:
	@if [ ! -f $(DOTENV_PATH) ]; then \
	    cp $(CWD)/.env.sample $(DOTENV_PATH) && \
	    echo ".env file not found. Created .env from sample."; \
	fi

up: setup
	@$(DOCKER_COMPOSE) up --build -d

down:
	@$(DOCKER_COMPOSE) down

status:
	@$(DOCKER_COMPOSE) ps

logs:
	@$(DOCKER_COMPOSE) logs


clean:
	@$(DOCKER_COMPOSE) down -v
	@$(RMDIR) $(WP_VOLUME) $(DB_VOLUME) $(PT_VOLUME)

prune: clean
	@docker system prune -af --volumes

.PHONY: prune clean logs status down up setup