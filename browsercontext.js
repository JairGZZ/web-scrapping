import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless : false});

  // Contexto incógnito
  const incognitoContext = await browser.createBrowserContext({ incognito: true });
  const incognitoPage = await incognitoContext.newPage();
  await incognitoPage.goto('https://www.mercadolibre.com.pe/#from=homecom');
  await incognitoPage.evaluate(() => document.cookie = "test=incognito");
  
  // Cookies del contexto incógnito (activo)
  const cookiesIncognito = await incognitoContext.cookies(); // Usar el contexto, no la página
  console.log("Cookies en contexto incógnito:", cookiesIncognito);

  await incognitoContext.close();
  // Contexto normal
  const normalContext = await browser.createBrowserContext();
  const normalPage = await normalContext.newPage();
  await normalPage.goto('https://www.mercadolibre.com.pe/#from=homecom');
  
  // Cookies del contexto normal
  const cookiesNormal = await normalContext.cookies(); // Usar el contexto, no la página
  console.log("Cookies en contexto normal:", cookiesNormal); // []
  
  await normalContext.close();
  await browser.close();
})();