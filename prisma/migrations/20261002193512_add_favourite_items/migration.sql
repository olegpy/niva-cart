-- CreateTable
CREATE TABLE "FavouriteItem" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavouriteItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavouriteItem_sessionId_idx" ON "FavouriteItem"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteItem_sessionId_productId_key" ON "FavouriteItem"("sessionId", "productId");
