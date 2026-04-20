import { test, expect } from '@playwright/test';

test.describe('Office Equipment Inventory System', () => {
  
  test('should create a new equipment and show in inventory', async ({ page }) => {
    await page.goto('/inventory/new');
    
    const sku = `TEST-${Math.floor(Math.random() * 10000)}`;
    await page.fill('input[name="sku"]', sku);
    await page.fill('input[name="name"]', 'Test Equipment');
    
    // Select a category - wait for options to load
    await expect(page.locator('select[name="categoryId"] option')).toHaveCount(4); // 3 seeded + 1 default
    await page.selectOption('select[name="categoryId"]', { index: 1 }); 
    
    await page.fill('input[name="quantity"]', '10');
    await page.fill('input[name="minQuantity"]', '5');
    await page.fill('textarea[name="description"]', 'Description for testing');
    
    // Click submit and wait for navigation
    await Promise.all([
      page.waitForURL('/inventory'),
      page.click('button:text("Add Equipment")')
    ]);
    
    await expect(page.locator('table')).toContainText(sku);
    await expect(page.locator('table')).toContainText('Test Equipment');
  });

  test('should adjust stock levels', async ({ page }) => {
    await page.goto('/inventory');
    // Click the first "Edit" link
    await page.locator('text=Edit').first().click();
    
    await expect(page).toHaveURL(/\/inventory\/.+/);
    
    // Use a more specific locator for the quantity
    const qtyLocator = page.locator('p:near(p:text("Available Stock"))').first();
    const initialQtyText = await qtyLocator.textContent();
    const initialQty = parseInt(initialQtyText || "0");
    
    // Stock IN
    await page.click('button:text("Stock IN (+)")');
    await page.fill('input[name="amount"]', '5');
    await page.click('button:text("Confirm Stock IN")');
    
    // Verify updated quantity
    await expect(qtyLocator).toHaveText((initialQty + 5).toString());
  });

  test('should show correct statistics on dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Overview');
    
    // Updated labels for Slate design
    await expect(page.locator('h3:text("Total Assets")')).toBeVisible();
    await expect(page.locator('h3:text("Active Loans")')).toBeVisible();
    await expect(page.locator('h3:text("Operations")')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    const html = page.locator('html');
    const toggle = page.locator('button[aria-label="Toggle Theme"]');
    
    // Initial state (Light mode)
    await expect(html).not.toHaveClass(/dark/);
    
    // Switch to Dark mode
    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    
    // Refresh page and check persistence
    await page.reload();
    await expect(html).toHaveClass(/dark/);
    
    // Switch back to Light mode
    await toggle.click();
    await expect(html).not.toHaveClass(/dark/);
  });
});
