.DEFAULT_GOAL := run

.PHONY: docker-compose

docker-compose:
	docker-compose up -d
	
run:
	yarn run start:dev