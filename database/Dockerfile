FROM postgres
WORKDIR /db
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB wishlist-db
COPY setup.sql /docker-entrypoint-initdb.d/
EXPOSE 5432