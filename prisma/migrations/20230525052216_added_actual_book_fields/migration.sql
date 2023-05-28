/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Book` table. All the data in the column will be lost.
  - Added the required column `author` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicationYear` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Book_name_key` ON `Book`;

-- AlterTable
ALTER TABLE `Book` DROP PRIMARY KEY,
    DROP COLUMN `name`,
    ADD COLUMN `author` VARCHAR(191) NOT NULL,
    ADD COLUMN `publicationYear` INTEGER NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
