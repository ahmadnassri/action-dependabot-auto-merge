#!/usr/bin/make

# ---------------------------------------------------- #
# Note: this file originates in template-action-docker #
# ---------------------------------------------------- #

SHELL := /bin/bash

pull: ## pull latest containers
	@docker compose pull

lint: clean ## run mega-linter
	@docker compose run --rm lint

readme: clean ## run readme action
	@docker compose run --rm readme

start: ## start the project in foreground
	@docker compose run $(shell env | grep DOCKER | sed -E 's/DOCKER_(.*?)=(.*)/-e \1="\2"/gm;t;d') app

build: clean ## start the project in background
	@docker compose build --no-cache app

shell: ## start the container shell
	@docker compose run --rm --entrypoint /bin/sh app

stop: ## stop all running containers
	@docker compose down --remove-orphans --rmi local

clean: stop ## remove running containers, volumes, node_modules & anything else
	@docker compose rm --stop --volumes --force

# Utility methods
## Help: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html

help: ## display this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help
.PHONY: help all clean test
