-- CreateTable
CREATE TABLE "Wishlist" (
    "id" BIGSERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "list" JSONB NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);
