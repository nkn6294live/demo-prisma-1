/*
  Warnings:

  - You are about to drop the column `groupId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_groupId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `groupId`;
