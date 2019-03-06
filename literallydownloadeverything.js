const selenium = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const download = require('image-downloader');
const colors = require('colors');

let driver, until, By;

let siteUrl = 'https://discordemoji.com/assets/emoji/';
let folderPath = './media/everything';

function init() {
    driver = new selenium.Builder()
        .forBrowser('chrome')
        //.setChromeOptions(new chrome.Options().addArguments('--headless'))
        .build();
    until = selenium.until;
    By = selenium.By;
}

async function openSite(site) {
    await driver.get(site);
}

async function findAllImgs(selector) {
    let elements = await driver.wait(until.elementsLocated(selector), 10000);
    let sauce;
    let x = 0;
    await elements.forEach(async function(element) {
        x++;
        sauce = await element.getAttribute('href');
        downloadImg(sauce);
    });
    await console.log(colors.yellow('Found ' + x + ' images to download'));        
}

function downloadImg(src) {
    let options = {
        url: src,
        dest: folderPath,
        timeout: 120000
    }
    download.image(options)
        .then(({filename, image}) => {
            console.log(colors.rainbow('File saved to ' + filename));
        })
        .catch((err, filename) => {
            console.log(colors.red('Download for ' + filename + ' failed, trying one more time!'));
            let options = {
                url: src,
                dest: folderPath,
                timeout: 120000
            }
            download.image(options)           
                .then(({filename, image}) => {
                    console.log(colors.rainbow('File saved to ' + filename));
                })
                .catch((err) => {
                    console.error(err);
                })
        })
}

init();
openSite(siteUrl);
let imgSelector = By.css('a');
findAllImgs(imgSelector);