import { test, expect } from '@playwright/test';

test.describe('Zetzu App E2E Tests', () => {
  test('should load login page and display form elements', async ({ page }) => {
    await page.goto('/login');
    
    // Check page title
    await expect(page).toHaveTitle(/zetzu/i);
    
    // Check login form elements
    await expect(page.locator('h2:has-text("Login to Zetzu")')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });

  test('should switch between login and signup forms', async ({ page }) => {
    await page.goto('/login');
    
    // Initially should show login form
    await expect(page.locator('h2:has-text("Login to Zetzu")')).toBeVisible();
    
    // Click sign up link
    await page.click('text=Sign Up');
    
    // Should show signup form
    await expect(page.locator('h2:has-text("Create Account")')).toBeVisible();
    await expect(page.locator('input[placeholder="Your Name"]')).toBeVisible();
  });

  test('should handle form input', async ({ page }) => {
    await page.goto('/login');
    
    // Test email input
    await page.fill('input[type="email"]', 'test@example.com');
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    
    // Test password input
    await page.fill('input[type="password"]', 'testpassword');
    await expect(page.locator('input[type="password"]')).toHaveValue('testpassword');
  });

  test('should load admin login page', async ({ page }) => {
    await page.goto('/admin');
    
    // Check admin login form
    await expect(page.locator('h2:has-text("Zetzu Admin Login")')).toBeVisible();
    await expect(page.locator('input[placeholder="Admin Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Log In")')).toBeVisible();
  });

  test('should redirect to login when accessing protected routes', async ({ page }) => {
    // Try to access home page without authentication
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h2:has-text("Login to Zetzu")')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    
    // Check if page is still functional on mobile
    await expect(page.locator('h2:has-text("Login to Zetzu")')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/login');
    
    // Check if page is still functional on desktop
    await expect(page.locator('h2:has-text("Login to Zetzu")')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should handle navigation between pages', async ({ page }) => {
    const routes = ['/login', '/admin'];
    
    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should display proper page titles', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/zetzu/i);
    
    await page.goto('/admin');
    await expect(page).toHaveTitle(/zetzu/i);
  });
});
