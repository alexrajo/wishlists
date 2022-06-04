docker stop wishlist-node
docker stop wishlist-db-postgres-new

docker container rm wishlist-node
docker container rm wishlist-db-postgres-new

docker image rm wishlist-postgres-db
docker image rm wishlist-app-node-backend

docker volume rm wishlist-psql-data