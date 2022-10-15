cd ./database/
docker build --rm --no-cache -t wishlist-postgres-db ./
docker image tag wishlist-postgres-db alerajo/wishlist-postgres-db:latest
docker image push alerajo/wishlist-postgres-db:latest

set /p DUMMY=...