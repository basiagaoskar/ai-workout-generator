-- DropForeignKey
ALTER TABLE "public"."logged_sets" DROP CONSTRAINT "logged_sets_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."workout_sessions" DROP CONSTRAINT "workout_sessions_workoutDayId_fkey";

-- AlterTable
ALTER TABLE "logged_sets" ADD COLUMN     "workoutExerciseRefId" INTEGER;

-- AlterTable
ALTER TABLE "workout_sessions" ALTER COLUMN "workoutDayId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_workoutDayId_fkey" FOREIGN KEY ("workoutDayId") REFERENCES "workout_days"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logged_sets" ADD CONSTRAINT "logged_sets_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logged_sets" ADD CONSTRAINT "logged_sets_workoutExerciseRefId_fkey" FOREIGN KEY ("workoutExerciseRefId") REFERENCES "workout_exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
