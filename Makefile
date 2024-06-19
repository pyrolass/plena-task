.DEFAULT_GOAL := run


docker-compose:
	docker-compose up -d
	
run:
	yarn run start:dev