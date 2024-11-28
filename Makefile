start:
	npm start

# build-old:
# 	docker build -t product-listing-frontend .

build:
	docker build --build-arg $$(grep -v '^#' .env | xargs) -t product-listing-frontend .

run:
	docker run --env-file .env -p 3001:80 product-listing-frontend

buildrun: build run

git:
	git remote add origin https://github.com/khancon/product-listing-frontend.git
	git branch -M main
	git push -u origin main
