-- AlterTable
ALTER TABLE "logged_sets" ALTER COLUMN "reps" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';
