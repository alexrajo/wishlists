cd ./server/
docker build --rm --no-cache -t wishlist-app-node-backend ./
docker image tag wishlist-app-node-backend wishlistregistry.azurecr.io/wishlist-app-node-backend:latest
docker image push wishlistregistry.azurecr.io/wishlist-app-node-backend:latest