start:
	npm start

# build-old:
# 	docker build -t product-listing-frontend .

build:
	docker build --build-arg $$(grep -v '^#' .env | xargs) -t product-listing-frontend .

run:
	docker run --env-file .env -p 3001:80 product-listing-frontend

stop:
	@if [ -n "$$(docker ps -q --filter "ancestor=product-listing-frontend")" ]; then \
		docker stop $$(docker ps -q --filter "ancestor=product-listing-frontend"); \
	else \
		echo "No running containers with filter 'product-listing-frontend' to stop."; \
	fi

restart: stop build run