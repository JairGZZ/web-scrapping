import puppeteer from "puppeteer";

function openBrowser() {
  return puppeteer.launch();
}
openBrowser().then((browser) => {
    console.log("Browser opened");
    browser.close();
    });