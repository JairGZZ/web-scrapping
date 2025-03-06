import puppeteer from 'puppeteer'; // Importar la librería de Puppeteer
import 'dotenv/config'; // Importar las variables de entorno desde el archivo .env
import fs from 'fs/promises';

const COOKIES_FILE = 'cookies.jsonc';

async function login(page) {
  await page.goto('https://accounts.google.com/signin');
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', process.env.GOOGLE_EMAIL);
  await page.click('#identifierNext');
  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', process.env.GOOGLE_PASSWORD);
  await page.click('#passwordNext');
  await page.waitForNavigation();
}

(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 20 });
  const page = await browser.newPage();

  try {
    // Cargar cookies y verificar sesión en YouTube
    const cookies = JSON.parse(await fs.readFile(COOKIES_FILE));
    await browser.setCookie(...cookies);
    await page.goto('https://www.youtube.com');
    await page.waitForSelector('#avatar-btn', { timeout: 5000 });
  } catch (error) {
    console.log('Sesión no encontrada. Haciendo login...');
    await login(page);
    
    // Navegar a YouTube y guardar cookies correctas
    await page.goto('https://www.youtube.com');
    await page.waitForSelector('#avatar-btn', { timeout: 10000 });
    const newCookies = await browser.cookies();
    await fs.writeFile(COOKIES_FILE, JSON.stringify(newCookies, null, 2));
  }


  await page.goto('https://www.youtube.com/watch?v=LO40bnShvGo');

         // Hace clic en el botón de play

await new Promise(resolve => setTimeout(resolve, 5000));
// Scroll y espera
await page.evaluate(async () => {
  const commentsSection = document.querySelector("#comments"); // Selector actual de YouTube
  
  if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
  } else {
      // Si no se encuentra, hacer scroll manual al 80% de la página
      window.scrollTo(0, document.body.scrollHeight * 0.8);
  }
});

await page.waitForSelector('#placeholder-area', { visible: true });
// Interactuar con comentarios
await page.click('#placeholder-area');
await page.waitForSelector('[aria-label="Agrega un comentario…"]', { visible: true });
await page.type('[aria-label="Agrega un comentario…"]', 'Temazo 10000/10 y GOD', { delay: 100 });

await page.click('#submit-button');
await new Promise(resolve => setTimeout(resolve, 5000));
  await browser.close();
})();