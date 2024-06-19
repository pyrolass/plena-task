.DEFAULT_GOAL := run

.PHONY: docker-compose

docker:
	docker-compose up -d
	
run:
	yarn run start:dev