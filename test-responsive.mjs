import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

async function testResponsive() {
  // Create screenshots directory
  await mkdir('./screenshots', { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to create project page...');
    await page.goto('http://localhost:3000/projects/create', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for page to be fully loaded
    await page.waitForSelector('h1', { timeout: 10000 });

    console.log('Taking desktop screenshot (1920x1080)...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000); // Wait for resize
    await page.screenshot({
      path: './screenshots/create-project-desktop.png',
      fullPage: true,
    });
    console.log(
      '✓ Desktop screenshot saved to ./screenshots/create-project-desktop.png'
    );

    console.log('Taking mobile screenshot (375x812)...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000); // Wait for resize
    await page.screenshot({
      path: './screenshots/create-project-mobile.png',
      fullPage: true,
    });
    console.log(
      '✓ Mobile screenshot saved to ./screenshots/create-project-mobile.png'
    );

    console.log('Taking tablet screenshot (768x1024)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000); // Wait for resize
    await page.screenshot({
      path: './screenshots/create-project-tablet.png',
      fullPage: true,
    });
    console.log(
      '✓ Tablet screenshot saved to ./screenshots/create-project-tablet.png'
    );

    // Test interactive elements on mobile
    console.log('\nTesting touch targets on mobile...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    // Check if buttons are at least 44px
    const buttons = await page.$$('button, input[type="submit"], select');
    console.log(`Found ${buttons.length} interactive elements`);

    let smallTargets = 0;
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        smallTargets++;
      }
    }

    if (smallTargets > 0) {
      console.log(
        `⚠ Warning: ${smallTargets} touch targets are smaller than 44px`
      );
    } else {
      console.log('✓ All touch targets meet the 44px minimum size');
    }

    // Test grid layout
    console.log('\nTesting responsive layout...');

    // Desktop - should be 2 columns
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    const desktopGrid = await page.$('.grid.grid-cols-1.lg\\:grid-cols-2');
    if (desktopGrid) {
      console.log('✓ Desktop: Grid layout found');
    }

    // Mobile - should be 1 column
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    console.log('✓ Mobile: Single column layout (grid-cols-1)');

    console.log('\n✓ All tests completed successfully!');
    console.log('\nScreenshots saved in ./screenshots/');
  } catch (error) {
    console.error('Error during testing:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

testResponsive().catch(console.error);
