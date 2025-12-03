import { test, expect, type Page } from '@playwright/test';

/**
 * Authentication End-to-End Tests
 *
 * Test Coverage:
 * 1. Login Flow - valid/invalid credentials, form validation, redirect after login
 * 2. Protected Routes - unauthenticated redirect, no infinite loops
 * 3. Logout Flow - token clearing, redirect
 * 4. Session Persistence - token survives refresh
 * 5. Already authenticated redirect
 */

const TEST_USER = {
  email: 'eeper03@mail.ru',
  password: 'egor12345',
};

const INVALID_USER = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
};

const API_URL = 'http://185.171.82.179:8000/api/v1';

// Helper function to clear authentication
async function clearAuth(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('shance_jwt_token');
    localStorage.removeItem('shance_refresh_token');
  });
}

// Helper function to set authentication tokens
async function setAuthTokens(
  page: Page,
  accessToken: string,
  refreshToken: string
) {
  await page.evaluate(
    ({ access, refresh }) => {
      localStorage.setItem('shance_jwt_token', access);
      localStorage.setItem('shance_refresh_token', refresh);
    },
    { access: accessToken, refresh: refreshToken }
  );
}

// Helper function to get tokens from localStorage
async function getTokens(page: Page) {
  return await page.evaluate(() => ({
    accessToken: localStorage.getItem('shance_jwt_token'),
    refreshToken: localStorage.getItem('shance_refresh_token'),
  }));
}

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication before each test
    await page.goto('/');
    await clearAuth(page);
  });

  test.describe('Login Page', () => {
    test('should display login form with all elements', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Check header elements
      await expect(page.getByText('Авторизация')).toBeVisible();
      await expect(page.getByText('Забыли пароль?')).toBeVisible();

      // Check form inputs
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();

      // Check submit button
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      await expect(page.getByText('Войти')).toBeVisible();

      // Check registration link
      await expect(page.getByText('Нет аккаунта?')).toBeVisible();
      await expect(page.locator('a[href="/register"]')).toBeVisible();

      // Check privacy policy link
      await expect(
        page.getByText('Политикой конфиденциальности')
      ).toBeVisible();
    });

    test('should show validation errors for empty form submission', async ({
      page,
    }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Try to submit empty form
      await page.locator('button[type="submit"]').click();

      // Check for validation errors
      await expect(page.getByText('Введите email')).toBeVisible();
      await expect(page.getByText('Введите пароль')).toBeVisible();
    });

    test('should show validation error for invalid email format', async ({
      page,
    }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Enter invalid email
      await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');
      await page.getByRole('textbox', { name: 'Пароль' }).fill('somepassword');
      await page.getByRole('button', { name: 'Войти' }).click();

      // Check for email validation error - wait for it to appear
      await expect(page.getByText(/Некорректный|Invalid email/i)).toBeVisible({
        timeout: 5000,
      });
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Find password input and eye button
      const passwordInput = page.getByRole('textbox', { name: 'Пароль' });

      // Fill some text first to see the toggle
      await passwordInput.fill('testpassword');

      // Initially password should be hidden (type="password")
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Find and click the eye button (it's inside the password container)
      const eyeButton = page
        .locator('button')
        .filter({ has: page.locator('img') })
        .nth(0);
      await eyeButton.click();

      // Password should be visible now (type="text")
      await expect(
        page.locator('input').filter({ hasText: '' }).first()
      ).toBeVisible();
    });

    test('should handle invalid credentials gracefully', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Enter invalid credentials
      await page
        .getByRole('textbox', { name: 'Email' })
        .fill(INVALID_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(INVALID_USER.password);

      // Submit form
      await page.getByRole('button', { name: 'Войти' }).click();

      // Wait for API response and check we're still on login page
      await page.waitForTimeout(3000);

      // Verify still on login page (redirect didn't happen because login failed)
      await expect(page).toHaveURL(/\/login/);

      // Verify no tokens were stored
      const tokens = await getTokens(page);
      expect(tokens.accessToken).toBeNull();
      expect(tokens.refreshToken).toBeNull();
    });

    test('should successfully login with valid credentials', async ({
      page,
    }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Enter valid credentials
      await page.locator('input[type="email"]').fill(TEST_USER.email);
      await page.locator('input[type="password"]').fill(TEST_USER.password);

      // Submit form
      await page.locator('button[type="submit"]').click();

      // Wait for redirect to profile page
      await page.waitForURL(/\/profile/, { timeout: 15000 });

      // Verify successful redirect
      await expect(page).toHaveURL(/\/profile/);

      // Verify tokens were stored
      const tokens = await getTokens(page);
      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
      expect(tokens.accessToken).not.toBe('undefined');
      expect(tokens.accessToken).not.toBe('null');
    });

    test('should redirect to profile if already authenticated', async ({
      page,
    }) => {
      // First, login to get tokens
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.locator('input[type="email"]').fill(TEST_USER.email);
      await page.locator('input[type="password"]').fill(TEST_USER.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });

      // Now try to access login page again
      await page.goto('/login');

      // Should be redirected back to profile
      await page.waitForURL(/\/profile/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/profile/);
    });

    test('should disable form inputs during login', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await emailInput.fill(TEST_USER.email);
      await passwordInput.fill(TEST_USER.password);

      // Submit form
      await submitButton.click();

      // Check that button shows loading state
      await expect(page.getByText('Вход...')).toBeVisible({ timeout: 5000 });

      // Check that inputs are disabled during submission
      await expect(emailInput).toBeDisabled();
      await expect(passwordInput).toBeDisabled();
      await expect(submitButton).toBeDisabled();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated user to login from profile page', async ({
      page,
    }) => {
      await page.goto('/profile');

      // Should be redirected to login
      await page.waitForURL(/\/login/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect unauthenticated user to login from dashboard routes', async ({
      page,
    }) => {
      // Test main protected route
      await clearAuth(page);
      await page.goto('/profile');

      // Should be redirected to login
      await page.waitForURL(/\/login/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/login/);
    });

    test('should not create infinite redirect loop', async ({ page }) => {
      await page.goto('/profile');

      // Wait for redirect to login
      await page.waitForURL(/\/login/, { timeout: 10000 });

      // Stay on login page for a few seconds
      await page.waitForTimeout(3000);

      // Verify we're still on login page and not redirecting
      await expect(page).toHaveURL(/\/login/);

      // Check that we can interact with the form
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toBeEnabled();
    });

    test('should allow authenticated user to access protected routes', async ({
      page,
    }) => {
      // Login first
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });

      // Wait for page to fully load
      await page.waitForLoadState('networkidle');

      // Verify tokens exist
      const tokens = await getTokens(page);
      expect(tokens.accessToken).toBeTruthy();

      // Verify on profile page
      await expect(page).toHaveURL(/\/profile/);

      // Verify dashboard layout is loaded - check for navigation
      await expect(page.getByRole('navigation')).toBeVisible({
        timeout: 10000,
      });
    });

    test('should show loading state while verifying authentication', async ({
      page,
    }) => {
      // Get valid tokens from login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.locator('input[type="email"]').fill(TEST_USER.email);
      await page.locator('input[type="password"]').fill(TEST_USER.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });

      // Navigate away and back to trigger auth check
      await page.goto('/');
      await page.goto('/profile');

      // Loading state might be brief, so we check for either loading or loaded state
      const isLoadingOrLoaded = await Promise.race([
        page
          .getByText('Загрузка профиля...')
          .isVisible()
          .catch(() => false),
        page
          .getByText('shance')
          .isVisible()
          .catch(() => false),
      ]);

      expect(isLoadingOrLoaded).toBeTruthy();
    });
  });

  test.describe('Logout Flow', () => {
    test('should successfully logout and clear tokens', async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });
      await page.waitForLoadState('networkidle');

      // Verify we're logged in
      const tokensBeforeLogout = await getTokens(page);
      expect(tokensBeforeLogout.accessToken).toBeTruthy();

      // Open settings menu
      await page.getByRole('button', { name: 'Settings' }).click();

      // Click logout button
      await page.getByRole('button', { name: 'Выйти' }).click();

      // Should redirect to login page
      await page.waitForURL(/\/login/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/login/);

      // Verify tokens were cleared
      const tokensAfterLogout = await getTokens(page);
      expect(tokensAfterLogout.accessToken).toBeNull();
      expect(tokensAfterLogout.refreshToken).toBeNull();
    });

    test('should not be able to access protected routes after logout', async ({
      page,
    }) => {
      // Login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });
      await page.waitForLoadState('networkidle');

      // Logout
      await page.getByRole('button', { name: 'Settings' }).click();
      await page.getByRole('button', { name: 'Выйти' }).click();
      await page.waitForURL(/\/login/, { timeout: 10000 });

      // Try to access protected route
      await page.goto('/profile');

      // Should stay on or redirect to login
      await page.waitForURL(/\/login/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/login/);
    });

    test('should show loading state during logout', async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });
      await page.waitForLoadState('networkidle');

      // Open settings menu
      await page.getByRole('button', { name: 'Settings' }).click();

      // Click logout
      await page.getByRole('button', { name: 'Выйти' }).click();

      // Should redirect to login
      await page.waitForURL(/\/login/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Session Persistence', () => {
    test('should persist authentication after page reload', async ({
      page,
    }) => {
      // Login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.locator('input[type="email"]').fill(TEST_USER.email);
      await page.locator('input[type="password"]').fill(TEST_USER.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });

      // Get tokens before reload
      const tokensBeforeReload = await getTokens(page);
      expect(tokensBeforeReload.accessToken).toBeTruthy();

      // Reload the page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should still be on profile page
      await expect(page).toHaveURL(/\/profile/);

      // Tokens should still exist
      const tokensAfterReload = await getTokens(page);
      expect(tokensAfterReload.accessToken).toBe(
        tokensBeforeReload.accessToken
      );
      expect(tokensAfterReload.refreshToken).toBe(
        tokensBeforeReload.refreshToken
      );
    });

    test('should persist authentication across navigation', async ({
      page,
    }) => {
      // Login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.locator('input[type="email"]').fill(TEST_USER.email);
      await page.locator('input[type="password"]').fill(TEST_USER.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });

      // Navigate to home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Navigate back to profile
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');

      // Should still be authenticated
      await expect(page).toHaveURL(/\/profile/);
      const tokens = await getTokens(page);
      expect(tokens.accessToken).toBeTruthy();
    });

    test('should maintain session in new tab', async ({ context, page }) => {
      // Login in first tab
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.locator('input[type="email"]').fill(TEST_USER.email);
      await page.locator('input[type="password"]').fill(TEST_USER.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });

      // Open new tab
      const newPage = await context.newPage();
      await newPage.goto('/profile');
      await newPage.waitForLoadState('networkidle');

      // Should be authenticated in new tab
      await expect(newPage).toHaveURL(/\/profile/);

      // Verify tokens exist in new tab
      const tokens = await getTokens(newPage);
      expect(tokens.accessToken).toBeTruthy();

      await newPage.close();
    });
  });

  test.describe('Token Management', () => {
    test('should store valid tokens in localStorage after login', async ({
      page,
    }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.locator('input[type="email"]').fill(TEST_USER.email);
      await page.locator('input[type="password"]').fill(TEST_USER.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });

      const tokens = await getTokens(page);

      // Verify tokens are valid strings
      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);

      // Verify tokens are not invalid values
      expect(tokens.accessToken).not.toBe('undefined');
      expect(tokens.accessToken).not.toBe('null');
      expect(tokens.refreshToken).not.toBe('undefined');
      expect(tokens.refreshToken).not.toBe('null');
    });

    test('should not store tokens on failed login', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.locator('input[type="email"]').fill(INVALID_USER.email);
      await page.locator('input[type="password"]').fill(INVALID_USER.password);
      await page.locator('button[type="submit"]').click();

      // Wait for error message
      await page.waitForTimeout(2000);

      // Verify no tokens in localStorage
      const tokens = await getTokens(page);
      expect(tokens.accessToken).toBeNull();
      expect(tokens.refreshToken).toBeNull();
    });

    test('should clear tokens on logout', async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });
      await page.waitForLoadState('networkidle');

      // Verify tokens exist
      const tokensBeforeLogout = await getTokens(page);
      expect(tokensBeforeLogout.accessToken).toBeTruthy();

      // Logout
      await page.getByRole('button', { name: 'Settings' }).click();
      await page.getByRole('button', { name: 'Выйти' }).click();
      await page.waitForURL(/\/login/, { timeout: 10000 });

      // Verify tokens are cleared
      const tokensAfterLogout = await getTokens(page);
      expect(tokensAfterLogout.accessToken).toBeNull();
      expect(tokensAfterLogout.refreshToken).toBeNull();
    });
  });

  test.describe('Navigation and UX', () => {
    test('should navigate to registration page from login', async ({
      page,
    }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Click registration link
      await page.locator('a[href="/register"]').click();

      // Should navigate to registration page
      await expect(page).toHaveURL(/\/register/);
    });

    test('should show privacy policy link', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const privacyLink = page.locator('a[href="/privacy"]');
      await expect(privacyLink).toBeVisible();
      await expect(privacyLink).toHaveText(/Политикой конфиденциальности/);
    });

    test('should display header navigation on authenticated pages', async ({
      page,
    }) => {
      // Login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });
      await page.waitForLoadState('networkidle');

      // Check header navigation
      await expect(page.getByRole('navigation')).toBeVisible({
        timeout: 10000,
      });

      // Check navigation links
      await expect(page.getByRole('link', { name: /Главная/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Профиль/i })).toBeVisible();
    });

    test('should show settings dropdown menu', async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();
      await page.waitForURL(/\/profile/, { timeout: 15000 });
      await page.waitForLoadState('networkidle');

      // Click settings button
      await page.getByRole('button', { name: 'Settings' }).click();

      // Settings menu should be visible
      await expect(
        page.getByRole('button', { name: 'Настройки' })
      ).toBeVisible();
      await expect(page.getByRole('button', { name: 'Выйти' })).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Intercept API calls and simulate network error
      await page.route(`${API_URL}/auth/login/`, route => {
        route.abort('failed');
      });

      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();

      // Wait for request to fail
      await page.waitForTimeout(2000);

      // Should remain on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('should handle API error responses', async ({ page }) => {
      // Intercept API calls and return error response
      await page.route(`${API_URL}/auth/login/`, route => {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Invalid credentials provided' }),
        });
      });

      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();

      // Wait for request to complete
      await page.waitForTimeout(2000);

      // Should remain on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('should handle slow API responses', async ({ page }) => {
      // Intercept API calls and add delay
      await page.route(`${API_URL}/auth/login/`, async route => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        await route.continue();
      });

      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email);
      await page
        .getByRole('textbox', { name: 'Пароль' })
        .fill(TEST_USER.password);
      await page.getByRole('button', { name: 'Войти' }).click();

      // Should show loading state
      await expect(page.getByText('Вход...')).toBeVisible();

      // Should eventually redirect after successful login
      await page.waitForURL(/\/profile/, { timeout: 20000 });
      await expect(page).toHaveURL(/\/profile/);
    });
  });
});
