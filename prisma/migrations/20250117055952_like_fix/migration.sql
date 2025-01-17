-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_owner_fkey";

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
