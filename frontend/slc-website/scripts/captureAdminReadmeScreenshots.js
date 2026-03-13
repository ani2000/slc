const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const adminBaseUrl = process.env.ADMIN_SCREENSHOT_BASE_URL || 'http://localhost:8010';
const adminApiBaseUrl = process.env.ADMIN_API_BASE_URL || 'http://localhost:5010/api';
const browserChannel = process.env.PLAYWRIGHT_BROWSER_CHANNEL || 'msedge';
const outputDir = path.resolve(__dirname, '..', '..', '..', 'images', 'readme images');

const screenshotTargets = [
  { name: 'admin-site-login', type: 'login' },
  { name: 'admin-site-books', type: 'section', label: 'Books' },
  { name: 'admin-site-authors', type: 'section', label: 'Authors' },
  { name: 'admin-site-quotes', type: 'section', label: 'Quotes' },
  { name: 'admin-site-timeline', type: 'section', label: 'Timeline' },
  { name: 'admin-site-auliyas', type: 'section', label: 'Auliyas' },
  { name: 'admin-site-gallery', type: 'section', label: 'Gallery' },
  { name: 'admin-site-requests', type: 'section', label: 'Research Requests' },
  { name: 'admin-site-settings', type: 'section', label: 'Settings' },
  { name: 'admin-site-videos', type: 'section', label: 'Videos' }
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function mockAdminApi(page) {
  await page.route('http://localhost:5000/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;

    if (pathname.endsWith('/auth/login') && request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'screenshot-admin-token' })
      });
      return;
    }

    if (pathname.includes('/admin/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({})
    });
  });

  await page.route('http://localhost:5010/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;

    if (pathname.endsWith('/auth/login') && request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'screenshot-admin-token' })
      });
      return;
    }

    if (pathname.includes('/admin/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({})
    });
  });
}

async function capture(page, fileName) {
  await page.screenshot({
    path: path.join(outputDir, `${fileName}.png`),
    fullPage: true
  });
}

async function login(page) {
  await page.goto(adminBaseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => {
    localStorage.setItem('slc_auth_token', 'screenshot-admin-token');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => /books/i.test(document.querySelector('.content-header h1')?.textContent || ''),
    null,
    { timeout: 60000 }
  );
  await wait(1500);
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    channel: browserChannel
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  await mockAdminApi(page);

  await page.goto(adminBaseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(1200);
  await capture(page, 'admin-site-login');

  await login(page);

  for (const target of screenshotTargets.filter((entry) => entry.type === 'section')) {
    console.log(`Capturing ${target.name}`);
    await page.getByRole('button', { name: new RegExp(target.label, 'i') }).click();
    await page.waitForFunction(
      (label) => {
        const heading = document.querySelector('.content-header h1')?.textContent || '';
        return heading.toLowerCase().includes(String(label).toLowerCase());
      },
      target.label,
      { timeout: 60000 }
    );
    await wait(1200);
    await capture(page, target.name);
  }

  await browser.close();
  console.log(`Saved admin screenshots to: ${outputDir}`);
}

main().catch((error) => {
  console.error('Failed to capture admin screenshots:', error);
  process.exit(1);
});