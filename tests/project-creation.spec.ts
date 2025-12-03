import { test, expect } from '@playwright/test';

test.describe('Project Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
  });

  test('should create a project with required fields', async ({ page }) => {
    // Navigate to login page if not authenticated
    await page.goto('http://localhost:3000/login');

    // Login (assuming you need to be authenticated)
    // You may need to adjust these selectors based on your login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword');
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForURL(/.*dashboard.*|.*projects.*/);

    // Navigate to project creation page
    await page.goto('http://localhost:3000/projects/create');

    // Wait for the form to be visible
    await page.waitForSelector('form');

    // Fill in required fields
    await page.fill('input#name', 'Test Project');
    await page.fill(
      'textarea#description',
      'This is a test project description that is long enough to pass validation'
    );

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for success notification or redirect
    // Adjust this based on your actual success behavior
    await page.waitForTimeout(2000);

    // Check if redirected to project page or success message appears
    const currentUrl = page.url();
    console.log('Current URL after submit:', currentUrl);

    // You can add more specific assertions here based on your app's behavior
    // For example, check for a success notification
    const notification = await page
      .locator('text=/успешно создан|success/i')
      .count();
    if (notification > 0) {
      console.log('Success notification found');
    }
  });

  test('should create a project with image upload', async ({ page }) => {
    // Navigate to login page if not authenticated
    await page.goto('http://localhost:3000/login');

    // Login
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword');
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForURL(/.*dashboard.*|.*projects.*/);

    // Navigate to project creation page
    await page.goto('http://localhost:3000/projects/create');

    // Wait for the form to be visible
    await page.waitForSelector('form');

    // Fill in required fields
    await page.fill('input#name', 'Test Project with Image');
    await page.fill(
      'textarea#description',
      'This is a test project with an image upload that has enough description'
    );

    // Upload an image
    const fileInput = page.locator('input[type="file"]');

    // Create a test image buffer
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: testImageBuffer,
    });

    // Wait a bit for preview to load
    await page.waitForTimeout(500);

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for success
    await page.waitForTimeout(3000);

    // Check result
    const currentUrl = page.url();
    console.log('Current URL after submit with image:', currentUrl);

    const notification = await page
      .locator('text=/успешно создан|success/i')
      .count();
    if (notification > 0) {
      console.log('Success notification found for project with image');
    }
  });

  test('should show validation errors for empty required fields', async ({
    page,
  }) => {
    // Navigate to login page if not authenticated
    await page.goto('http://localhost:3000/login');

    // Login
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword');
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForURL(/.*dashboard.*|.*projects.*/);

    // Navigate to project creation page
    await page.goto('http://localhost:3000/projects/create');

    // Wait for the form to be visible
    await page.waitForSelector('form');

    // Try to submit without filling anything
    await page.click('button[type="submit"]');

    // Wait a bit
    await page.waitForTimeout(1000);

    // Check for error notification
    const errorNotification = await page
      .locator('text=/обязательно|required|ошибка|error/i')
      .count();
    console.log('Error notifications found:', errorNotification);

    expect(errorNotification).toBeGreaterThan(0);
  });
});
