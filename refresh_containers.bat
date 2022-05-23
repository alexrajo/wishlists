docker stop wishlist-node
docker stop wishlist-db-postgres-new

docker container rm wishlist-node
docker container rm wishlist-db-postgres-new

cd ./server/
docker build -t wishlist-node ./
cd ../database/
docker build -t wishlist-db-postgres-new

cd ..
docker run -d --name wishlist-db-postgres-new -p 5432:5432 --net wishlist-net wishlist-postgres-db
docker run -d --name wishlist-node -p 3001:3001 --net wishlist-net alerajo/wishlist-app-node-backend