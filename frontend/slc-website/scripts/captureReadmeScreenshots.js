const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const baseUrl = process.env.SCREENSHOT_BASE_URL || 'http://localhost:3010';
const browserChannel = process.env.PLAYWRIGHT_BROWSER_CHANNEL || 'msedge';
const outputDir = path.resolve(__dirname, '..', '..', '..', 'images', 'readme images');

const pages = [
  { name: 'home', route: '#/' },
  { name: 'about', route: '#/about' },
  { name: 'timeline', route: '#/timeline' },
  { name: 'teachings', route: '#/teachings' },
  { name: 'companions', route: '#/companions' },
  { name: 'locations', route: '#/locations' },
  { name: 'book-list', route: '#/book-list' },
  { name: 'library', route: '#/library' },
  { name: 'developers', route: '#/developers' }
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function captureQuranShots(page) {
  await page.goto(`${baseUrl}/#/teachings`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(2500);

  const exploreButton = page.getByRole('button', { name: /explore quran sharif/i });
  if (await exploreButton.count()) {
    await exploreButton.click();
    await page.waitForFunction(
      () => /quran sharif - 114 surahs/i.test(document.body.innerText),
      null,
      { timeout: 60000 }
    );
    await page.waitForFunction(
      () => document.querySelectorAll('.quran-surah-card a').length >= 10,
      null,
      { timeout: 60000 }
    );
    await wait(2000);
  }

  const quranLinks = page.locator('.quran-surah-card a, a[href*="#/quran/"]');
  const quranLinkCount = await quranLinks.count();
  if (!quranLinkCount) {
    return;
  }

  await quranLinks.first().click();
  await page.waitForURL(/#\/quran\//, { timeout: 60000 });
  await wait(2500);
  await page.screenshot({
    path: path.join(outputDir, 'user-site-quran-random-surah.png'),
    fullPage: true
  });

  await page.goto(`${baseUrl}/#/teachings`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await wait(2500);
  if (await exploreButton.count()) {
    await exploreButton.click();
    await page.waitForFunction(
      () => /quran sharif - 114 surahs/i.test(document.body.innerText),
      null,
      { timeout: 60000 }
    );
    await wait(2000);
  }
  await page.screenshot({
    path: path.join(outputDir, 'user-site-quran-all-surahs.png'),
    fullPage: true
  });
}

async function waitForPageReady(page, pageName) {
  if (pageName === 'locations') {
    await page.waitForFunction(() => document.querySelectorAll('.leaflet-container').length >= 1, null, { timeout: 60000 });
    await wait(3000);
    return;
  }

  if (pageName === 'timeline') {
    await page.waitForFunction(() => document.querySelectorAll('.timeline-item').length >= 20, null, { timeout: 60000 });
    await wait(1500);
    return;
  }

  if (pageName === 'book-list') {
    await page.waitForFunction(() => document.querySelectorAll('[class*="grid"] > div img').length >= 8, null, { timeout: 60000 });
    await wait(1500);
    return;
  }

  await wait(2500);
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

  for (const entry of pages) {
    const targetUrl = `${baseUrl}/${entry.route}`;
    console.log(`Capturing ${entry.name}: ${targetUrl}`);

    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitForPageReady(page, entry.name);

    const filePath = path.join(outputDir, `user-site-${entry.name}.png`);
    await page.screenshot({
      path: filePath,
      fullPage: true
    });
  }

  await captureQuranShots(page);

  await browser.close();
  console.log(`Saved screenshots to: ${outputDir}`);
}

main().catch((error) => {
  console.error('Failed to capture screenshots:', error);
  process.exit(1);
});