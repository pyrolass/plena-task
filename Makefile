.DEFAULT_GOAL := run

.PHONY: test docker-compose

docker-compose:
	docker-compose up -d

test:
	yarn test
	
run:
	yarn run start:dev