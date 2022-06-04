docker stop wishlist-node
docker stop wishlist-db-postgres-new

docker container rm wishlist-node
docker container rm wishlist-db-postgres-new

cd ./database/
docker build --rm --no-cache -t wishlist-postgres-db ./
docker run -d --name wishlist-db-postgres-new -p 5432:5432 -v wishlist-psql-data:/var/lib/postgresql/data --network wishlist-net wishlist-postgres-db

cd ../server/
docker build --rm --no-cache -t wishlist-app-node-backend ./
docker run -d --name wishlist-node -p 3001:3001 --network wishlist-net wishlist-app-node-backend

set /p DUMMY=Stop containers by pressing enter...
docker stop wishlist-node
docker stop wishlist-db-postgres-new