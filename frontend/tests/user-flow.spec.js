import { test, expect } from "@playwright/test";

const randomId = Math.floor(Math.random() * 10000);
const testUser = {
	firstName: "E2E",
	lastName: "Tester",
	email: `e2e.test.${randomId}@example.com`,
	password: "Test2115!",
};

test.describe("Full user process (Live)", () => {
	test.setTimeout(60000);

	test("User creates account, generate new plan and save a workout", async ({ page }) => {
		await page.goto("http://localhost:5173/auth/signup");

		await page.getByPlaceholder("First name").fill(testUser.firstName);
		await page.getByPlaceholder("Last name").fill(testUser.lastName);
		await page.getByPlaceholder("mail@site.com").fill(testUser.email);
		await page.getByPlaceholder("Password").fill(testUser.password);

		await page.locator('input[name="tos"]').check();

		await page.getByRole("button", { name: "Create account" }).click();

		await expect(page).toHaveURL("http://localhost:5173/home");
		await expect(page.getByText(`Welcome back, ${testUser.firstName}!`)).toBeVisible();

		await page.getByRole("link", { name: "Generate new workout" }).first().click();

		await expect(page).toHaveURL(/.*generate-workout/);
		await expect(page.getByText("What is your primary fitness goal?")).toBeVisible();

		await page.getByText("Muscle Gain", { exact: true }).click();
		await page.getByRole("button", { name: "Next Step" }).click();

		await page.getByText("Man", { exact: true }).click();
		await page.getByRole("button", { name: "Next Step" }).click();

		await page.getByText("Intermediate").click();
		await page.getByRole("button", { name: "Next Step" }).click();

		await page.getByText("Bodyweight Only").click();
		await page.getByRole("button", { name: "Next Step" }).click();

		await expect(page.getByText("How many days per week can you train?")).toBeVisible();
		await page.getByText("2-3 Days").click();

		await page.getByRole("button", { name: "Summary" }).click();

		await page.getByRole("button", { name: "Generate Workout" }).click();

		await expect(page.getByText("Day 1:")).toBeVisible({ timeout: 30000 });

		await page.getByRole("button", { name: "Start Workout" }).first().click();

		await expect(page.locator("h1")).toBeVisible();

		const weightInput = page.locator('input[placeholder="kg"]').first();
		const repsInput = page.locator('input[placeholder="reps"]').first();

		await weightInput.fill("70");
		await repsInput.fill("10");

		await page.getByRole("button", { name: "Finish" }).click();

		await expect(page.getByText("Duration:")).toBeVisible();
		await expect(page.getByText("70kg")).toBeVisible();
	});
});
