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

  test('should borrow and return items', async ({ page }) => {
    await page.goto('/inventory');
    await page.locator('text=Edit').first().click();
    
    const qtyLocator = page.locator('p:near(p:text("Available Stock"))').first();
    const initialQtyText = await qtyLocator.textContent();
    const initialQty = parseInt(initialQtyText || "0");

    // Borrow
    await page.fill('input[name="borrowerName"]', 'Test User');
    await page.fill('div:has-text("Borrow Item") input[name="quantity"]', '1');
    await page.click('button:text("Confirm Borrow")');
    
    // Verify stock decreased
    await expect(qtyLocator).toHaveText((initialQty - 1).toString());

    // Go to Borrows page
    await page.goto('/borrows');
    const outTable = page.locator('section:has-text("Currently Out") table');
    await expect(outTable).toContainText('Test User');
    
    // Return
    page.on('dialog', dialog => dialog.accept());
    await outTable.locator('button:text("Mark Returned")').first().click();
    
    // Verify it moved to history
    await expect(page.locator('section:has-text("Return History")')).toContainText('Test User');
  });

  test('should show correct statistics on dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Dashboard');
    
    // Use more specific selectors for stats headers
    await expect(page.locator('h3:text("Items")')).toBeVisible();
    await expect(page.locator('h3:text("Borrowed")')).toBeVisible();
    await expect(page.locator('h3:text("Activity")')).toBeVisible();
  });
});
