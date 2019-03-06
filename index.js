const selenium = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const download = require('image-downloader');
const colors = require('colors');

let driver, until, By;

let siteUrl = 'https://discordemoji.com/category/13/pepe';
let folderPath = './media/pepes';

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

async function findAllEmojis(selector) {
    let elements = await driver.wait(until.elementsLocated(selector), 10000);
    let sauce;
    let x = 0;
    await elements.forEach(async function(element) {
        x++;
        sauce = await element.getAttribute('src');
        downloadImg(sauce);
    });
    await console.log(colors.yellow('Found ' + x + ' images to download'));        
}

async function findAndClick(selector) {
    let el1 = await driver.wait(until.elementLocated(selector), 10000);
    let el1Text = await el1.getText();
    let el = await driver.findElement(selector);
    await driver.wait(until.elementIsVisible(el), 10000)
        .then(async () => {
            await driver.sleep(100); //don't know how to wait for element to be ready to recieve click, so I just sleep :ree:
            await el1.click().then(async () => {
                await console.log(colors.green('clicked ' + el1Text));
            })
        })    
}

async function findAndReturnSrc(selector) {
    let element = await driver.wait(until.elementLocated(selector), 20000);
    let elementUrl = await element.getAttribute('src');
    return elementUrl;    
}

function downloadImg(src) {
    let options = {
        url: src,
        dest: folderPath
    }
    download.image(options)
        .then(({filename, image}) => {
            console.log(colors.rainbow('File saved to ' + filename));
        })
        .catch((err) => {
            console.error(err);
        })
}

let x = 0;
function slowLoop(func, iterations, interval) {    
    if (x < iterations) {        
        func;                
        console.log(colors.yellow('Done with ' + x + ' slowloops of ' + iterations));
        x++;
        setTimeout(function(){
            driver.executeScript('window.scrollTo(0,10000);');
            slowLoop(findAndClick(loadMoreSelector), 3, 5000);
        }, interval);
    } else {
        console.log(colors.yellow('Done with slowlooping ' + iterations + ' times'));
    }
}

init();
openSite(siteUrl);
driver.executeScript('window.scrollTo(0,10000);');
let closeModalButtonSelector = By.css('#joinModal > div > div > div.modal-header > button');
findAndClick(closeModalButtonSelector);
let loadMoreSelector = By.css('#emoji-rows .btn.btn-secondary.btn-lg.btn-block.btn-load');

setTimeout(function() {
    slowLoop(findAndClick(loadMoreSelector), 3, 5000);
}, 10000);
setTimeout(function() {
    let emojiSelector = By.css('.img.lazy');
    findAllEmojis(emojiSelector);
}, 30000); //:ree: