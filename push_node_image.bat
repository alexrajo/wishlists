cd ./server/
docker build --rm --no-cache -t wishlist-app-node-backend ./
docker image tag wishlist-app-node-backend alerajo/wishlist-app-node-backend:latest
docker image push alerajo/wishlist-app-node-backend:latest